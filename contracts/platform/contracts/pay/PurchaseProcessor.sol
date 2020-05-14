pragma solidity 0.5.11;
pragma experimental ABIEncoderV2;

// solium-disable security/no-block-members

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

import "./IPurchaseProcessor.sol";
import "../oracle/IOracle.sol";

contract PurchaseProcessor is IPurchaseProcessor, Ownable {

    using SafeMath for uint256;

    // Emitted when a seller's approval to sell a particular product is changed
    event SellerApprovalChanged(bytes32 indexed sku, address indexed seller, bool approved);

    // Emitted when a signer's limit is changed
    event SignerLimitChanged(address indexed signer, uint256 usdCentsLimit);

    // Emitted when a payment has been processed
    event PaymentProcessed(
        uint256 indexed id,
        address indexed vendor,
        Order order,
        PaymentParams payment,
        Receipt receipt
    );

    // Emitted when an oracle is set
    event OracleChanged(address indexed oracle);

    // Stores whether a nonce has been used by a particular signer
    mapping(address => mapping(uint256 => bool)) public receiptNonces;

    // Track whether a contract can sell through this processor
    mapping(bytes32 => mapping(address => bool)) public sellerApproved;

    // Track the daily limit of each signing address
    mapping(address => Limit) public signerLimits;

    // The number of payments this contract has processed
    uint256 public count;

    // Address of the oracle to use
    address public priceOracle;

    // Wallet to recieve funds
    address payable public wallet;

    // Mutex for sending funds
    bool internal mutexLocked;

    // Address to send funds
    constructor(address payable _wallet) public {
        wallet = _wallet;
    }

    function setOracle(
        address oracleAddress
    )
        public
        onlyOwner
    {
        priceOracle = oracleAddress;
    }

    function setSignerLimit(
        address signer,
        uint256 usdCentsLimit
    )
        public
        onlyOwner
    {
        signerLimits[signer].total = usdCentsLimit;
        emit SignerLimitChanged(signer, usdCentsLimit);
    }

    function setSellerApproval(
        address seller,
        bytes32[] memory skus,
        bool approved
    )
        public
        onlyOwner
    {
        for (uint i = 0; i < skus.length; i++) {
            bytes32 sku = skus[i];
            sellerApproved[sku][seller] = approved;
            emit SellerApprovalChanged(sku, seller, approved);
        }
    }

    /** @dev Process an order
     *
     * @param order the details of the order, supplied by an authorised seller
     * @param payment the details of the user's proposed payment
     */
    function process(
        Order memory order,
        PaymentParams memory payment
    )
        public
        payable returns (Receipt memory)
    {

        require(
            !mutexLocked,
            "IM:PurchaseProcessor: mutex must be unlocked"
        );

        require(
            order.sku != bytes32(0),
            "IM:PurchaseProcessor: must have a set SKU"
        );

        require(
            order.quantity > 0,
            "IM:PurchaseProcessor: must have a valid quality"
        );

        require(
            sellerApproved[order.sku][msg.sender],
            "IM:PurchaseProcessor: must be approved to sell this product"
        );

        mutexLocked = true;

        uint256 amount;
        if (order.currency == Currency.USDCents) {
            amount = _payUSD(order, payment);
        } else {
            amount = _payETH(order, payment);
        }

        uint id = count++;

        Receipt memory receipt = Receipt({
            id: id,
            currency: payment.currency,
            amount: amount
        });

        emit PaymentProcessed(id, msg.sender, order, payment, receipt);

        mutexLocked = false;

        return receipt;
    }

    function _validateOrderPaymentMatch(
        Order memory order,
        PaymentParams memory payment
    )
        internal
        pure
    {
        require(
            payment.value >= order.totalPrice,
            "IM:PurchaseProcessor: receipt value must be sufficient"
        );

        require(
            order.currency == Currency.USDCents,
            "IM:PurchaseProcessor: receipt currency must match"
        );
    }

    function _updateSignerLimit(address signer, uint256 amount) internal {
        Limit storage limit = signerLimits[signer];
        require(
            limit.total > 0,
            "IM:PurchaseProcessor: invalid signer"
        );

        if (limit.periodEnd < block.timestamp) {
            limit.periodEnd = block.timestamp + 1 days;
            limit.used = 0;
        }
        uint nextUsed = limit.used.add(amount);

        require (
            limit.total >= nextUsed,
            "IM:PurchaseProcessor: exceeds signing limit for this address"
        );

        limit.used = nextUsed;
    }

    function _getSigner(
        Order memory order,
        PaymentParams memory payment
    )
        internal
        view
        returns (address)
    {
        bytes32 sigHash = keccak256(abi.encodePacked(
            address(this),
            msg.sender,
            order.assetRecipient,
            order.sku,
            order.quantity,
            payment.nonce,
            payment.escrowFor,
            payment.value,
            payment.currency
        ));

        bytes32 recoveryHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", sigHash)
        );

        return ecrecover(recoveryHash, payment.v, payment.r, payment.s);
    }

    function _payUSD(
        Order memory _order,
        PaymentParams memory _payment
    )
        internal
        returns (uint256)
    {
        address signer = _getSigner(_order, _payment);

        // update signer limit with total price, not total price - amountPaid
        // they're signing on the whole thing
        // otherwise, could just set price == amountPaid
        _updateSignerLimit(signer, _order.totalPrice);

        require(
            !receiptNonces[signer][_payment.nonce],
            "IM:PurchaseProcessor: nonce must not be used"
        );

        receiptNonces[signer][_payment.nonce] = true;

        _validateOrderPaymentMatch(_order, _payment);

        return _order.totalPrice;
    }

    function _payETH(
        Order memory _order,
        PaymentParams memory _payment
    )
        internal
        returns (uint256)
    {
        require(
            priceOracle != address(0),
            "IM:PurchaseProcessor: oracle must be set"
        );

        // get the balance of this contract (includes msg.value)
        uint256 startBalance = address(this).balance;

        uint256 outstanding = _order.totalPrice.sub(_order.alreadyPaid);

        if (outstanding == 0) {
            return 0;
        }

        uint256 amount = convertUSDToETH(outstanding);

        require(
            msg.value >= amount,
            "IM:PurchaseProcessor: not enough ETH sent"
        );

        uint256 remaining = msg.value.sub(amount);

        // solium-disable-next-line
        wallet.call.value(amount)("");

        if (remaining > 0) {
            // solium-disable-next-line
            _order.changeRecipient.call.value(remaining)("");
        }

        require(
            address(this).balance == startBalance.sub(msg.value),
            "IM:PurchaseProcessor: ETH left over"
        );

        return amount;
    }

    function convertUSDToETH(uint256 usdCents) public view returns (uint256 eth) {
        return IOracle(priceOracle).convert(1, 0, usdCents);
    }

}