pragma solidity 0.5.11;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/ERC20Burnable.sol";
import "@imtbl/platform/contracts/token/TradeToggleERC20.sol";
import "@imtbl/platform/contracts/escrow/Escrow.sol";
import "../S1Vendor.sol";
import "../pack/IPack.sol";

contract Chest is S1Vendor, TradeToggleERC20, ERC20Burnable {

    struct Purchase {
        uint256 paymentID;
        uint256 count;
    }

    // Cap on sold assets
    uint public cap;
    // Number of assets sold
    uint public sold;
    // Pack contract in which these chests can be opened
    IPack public pack;
    // Temporary variable to hold purchase details before the escrow callback
    Purchase internal tempPurchase;

    constructor(
        string memory _name,
        string memory _symbol,
        IPack _pack,
        uint256 _cap,
        IReferral _referral,
        bytes32 _sku,
        uint256 _price,
        CreditCardEscrow _escrow,
        PurchaseProcessor _pay
    ) public
        S1Vendor(_referral, _sku, _price, _escrow, _pay)
        TradeToggleERC20(_name, _symbol, 0)
    {
        require(
            address(_pack) != address(0),
            "S1Chest: pack must be set on construction"
        );
        cap = _cap;
        pack = _pack;
    }

    /** @dev Purchase chests for a user
     *
     * @param _user the user who will receive the chests
     * @param _quantity the number of chests to purchase
     * @param _payment the details of the method by which payment will be made
     * @param _referrer the address of the user who made this referral
     */
    function purchaseFor(
        address payable _user,
        uint256 _quantity,
        PurchaseProcessor.PaymentParams memory _payment,
        address payable _referrer
    ) public payable returns (PurchaseProcessor.Receipt memory) {

        require(cap == 0 || cap >= sold + _quantity, "IM:CappedVendor: product cap has been exhausted");


        sold += _quantity;
        PurchaseProcessor.Receipt memory receipt = super.purchaseFor(
            _user,
            _quantity,
            _payment,
            _referrer
        );


        if (_payment.currency == PurchaseProcessor.Currency.ETH || _payment.escrowFor == 0) {
            _mintChests(_user, _quantity, receipt.id);
        } else {
            // escrow the chests
            Escrow.Vault memory vault = Escrow.Vault({
                player: _user,
                admin: address(escrow),
                asset: address(this),
                balance: _quantity,
                lowTokenID: 0,
                highTokenID: 0,
                tokenIDs: new uint256[](0)
            });

            tempPurchase = Purchase({
                count: _quantity,
                paymentID: receipt.id
            });

            bytes memory data = abi.encodeWithSignature("mintTokens()");

            escrow.callbackEscrow(vault, address(this), data, receipt.id, _payment.escrowFor);
        }

        return receipt;
    }

    function mintTokens() public {
        address protocol = address(escrow.getProtocol());

        require(
            msg.sender == protocol,
            "S1Chest: minter must be core escrow contract"
        );

        Purchase memory temp = tempPurchase;

        require(
            temp.count > 0,
            "S1Chest: must create some tokens"
        );

        _mintChests(protocol, temp.count, temp.paymentID);
        tempPurchase = Purchase({
            count: 0,
            paymentID: 0
        });
    }

    function _mintChests(address _to, uint256 _count, uint256 _paymentID) internal {
        _mint(_to, _count);
        emit PaymentERC20Minted(_paymentID, address(this), _count);
    }

    /** @dev Open a number of chests
     *
     * @param _count the number of chests to open
     */
    function open(uint _count) public {
        _burn(msg.sender, _count);
        pack.openChests(msg.sender, _count);
    }

    /** @dev Get the number of products still available for sale */
    function available() external view returns (uint256) {
        return cap.sub(sold);
    }

    /** @dev One way switch to enable trading */
    function makeTradable() external onlyOwner {
        require(
            !tradable,
            "S1Chest: must not be already tradable"
        );

        tradable = true;
        emit TradabilityChanged(true);
    }

}