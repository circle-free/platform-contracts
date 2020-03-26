pragma solidity 0.5.11;
pragma experimental ABIEncoderV2;

import "../IReleasable.sol";
import "../IBatchERC721Escrow.sol";
import "../IListERC721Escrow.sol";
import "../IERC20Escrow.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";

contract CreditCardEscrow is Ownable {

    // Emitted when assets are escrowed
    event Escrowed(address indexed escrow, uint indexed id, address indexed owner, uint64 endBlock);

    // Emitted when the release of the assets in a custodial escrow account is successfully requested
    event ReleaseRequested(address indexed escrow, uint indexed id, uint64 endBlock, address releaseTo);

    // Emitted when the release of the assets in a custodial escrow account is cancelled
    event ReleaseCancelled(address indexed escrow, uint indexed id);

    // Emitted when the assets in any escrow account are released
    event Released(address indexed escrow, uint indexed id);

    // Emitted when the destruction of the assets in an escrow account is successfully requested
    event DestructionRequested(address indexed escrow, uint indexed id, uint64 endBlock);

    // Emitted when the destruction of the assets in an escrow account is cancelled
    event DestructionCancelled(address indexed escrow, uint indexed id);

    // Emitted when the assets in an escrow account are destroyed
    event Destroyed(address indexed escrow, uint indexed id);

    struct Lock {
        // the block after which these assets can be taked from escrow
        uint64 endBlock;
        // the address which will own these assets after the escrow period
        address owner;
        // the block after which these assets can be destroyed
        uint64 destructionBlock;
        // the block after which these assets will be released
        uint64 releaseBlock;
        // the user to whom these assets will be released
        address releaseTo;
    }

    // ERC20 escrow contract
    IERC20Escrow public erc20Escrow;
    // Batch escrow contract
    IBatchERC721Escrow public batchEscrow;
    // Mapping from escrow IDs to details
    mapping(address => mapping(uint => Lock)) public locks;
    // The address which can destroy assets
    address public destroyer;
    // Number of blocks an escrow account must be marked for destruction before it is destroyed
    uint64 public destructionDelay;
    // The address which can withdraw custodial assets
    address public custodian;
    // Number of blocks a custodial escrow asset must be marked for release
    uint64 public releaseDelay;

    constructor(
        IERC20Escrow _erc20Escrow,
        IBatchERC721Escrow _batchEscrow,
        address _destroyer,
        uint64 _destructionDelay,
        address _custodian,
        uint64 _releaseDelay
    ) public {
        erc20Escrow = _erc20Escrow;
        batchEscrow = _batchEscrow;
        destroyer = _destroyer;
        destructionDelay = _destructionDelay;
        custodian = _custodian;
        releaseDelay = _releaseDelay;
    }

    modifier onlyDestroyer {
        require(msg.sender == destroyer, "must be the destroyer");
        _;
    }

    modifier onlyCustodian {
        require(msg.sender == custodian, "must be the custodian");
        _;
    }

    /**
     * @dev Set the standard destruction delay for new escrow accounts
     *
     * @param _delay Number of blocks an escrow account must be marked for destruction before it is destroyed
     */
    function setDestructionDelay(uint64 _delay) public onlyOwner {
        destructionDelay = _delay;
    }

    /**
     * @dev Set the destroyer account
     *
     * @param _destroyer Address of the destroyer account
     */
    function setDestroyer(address _destroyer) public onlyOwner {
        require(_destroyer != destroyer, "must change existing destroyer");
        destroyer = _destroyer;
    }

    /**
     * @dev Set the standard release delay for custodial accounts
     *
     * @param _delay Number of blocks a custodial escrow account must be marked for release
     */
    function setReleaseDelay(uint64 _delay) public onlyOwner {
        releaseDelay = _delay;
    }

    /**
     * @dev Set the custodian account
     *
     * @param _custodian Address of the custodian account
     */
    function setCustodian(address _custodian) public onlyOwner {
        require(_custodian != custodian, "must change existing custodian");
        custodian = _custodian;
    }

    /**
     * @dev Release all assets from an escrow account
     *
     * @param _escrow The address of the escrow contract (ERC20/BatchER721)
     * @param _id The ID of the escrow account to be released
     */
    function release(IReleasable _escrow, uint _id) public {

        Lock memory lock = locks[address(_escrow)][_id];

        require(lock.endBlock != 0, "must have escrow period set");
        require(block.number >= lock.endBlock, "escrow period must have expired");

        if (lock.owner != address(0)) {
            _escrow.release(_id, lock.owner);
        } else {
            require(lock.releaseTo != address(0), "cannot burn assets");
            require(block.number >= lock.releaseBlock, "release period must have expired");
            _escrow.release(_id, lock.releaseTo);
        }

        delete locks[address(_escrow)][_id];

        emit Released(address(_escrow), _id);
    }

    /**
     * @dev Request that a custodial escrow account's assets be marked for release
     *
     * @param _escrow The address of the escrow contract (ERC20/BatchER721)
     * @param _id The ID of the escrow account to be marked
     */
    function requestRelease(address _escrow, uint _id, address _to) public onlyCustodian {

        Lock storage lock = locks[_escrow][_id];

        require(lock.owner == address(0), "escrow account is not custodial, call release directly");
        require(lock.endBlock != 0, "must be in escrow");
        require(lock.destructionBlock == 0, "must not be marked for destruction");
        require(lock.releaseBlock == 0, "must not be marked for release");
        require(block.number + releaseDelay >= lock.endBlock, "release period must end after escrow period");
        require(_to != address(0), "must release to a real user");

        uint64 releaseBlock = uint64(block.number) + releaseDelay;

        lock.releaseBlock = releaseBlock;
        lock.releaseTo = _to;

        emit ReleaseRequested(_escrow, _id, releaseBlock, _to);
    }

    /**
     * @dev Cancel a release request
     *
     * @param _escrow The address of the escrow contract (ERC20/BatchER721)
     * @param _id The ID of the escrow account to be unmarked
     */
    function cancelRelease(address _escrow, uint _id) public onlyCustodian {

        Lock storage lock = locks[_escrow][_id];

        require(lock.owner == address(0), "escrow account is not custodial, call release directly");
        require(lock.releaseBlock != 0, "must be marked for release");
        require(lock.releaseBlock > block.number, "release period must not have expired");

        lock.releaseBlock = 0;
        lock.releaseTo = address(0);

        emit ReleaseCancelled(_escrow, _id);
    }

    /**
     * @dev Request that an escrow account's assets be marked for destruction
     *
     * @param _escrow The address of the escrow contract (ERC20/BatchER721)
     * @param _id The ID of the escrow account to be marked
     */
    function requestDestruction(address _escrow, uint _id) public onlyDestroyer {

        Lock storage lock = locks[_escrow][_id];

        require(lock.endBlock != 0, "must be in escrow");
        require(lock.destructionBlock == 0, "must not be marked for destruction");
        require(lock.endBlock > block.number, "escrow period must not have expired");
        require(lock.owner == address(0), "must be zero address");

        uint64 destructionBlock = uint64(block.number) + destructionDelay;
        lock.destructionBlock = destructionBlock;

        emit DestructionRequested(_escrow, _id, destructionBlock);
    }

    /**
     * @dev Revoke a destruction request
     *
     * @param _escrow The address of the escrow contract (ERC20/BatchER721)
     * @param _id The ID of the escrow account to be unmarked
     */
    function cancelDestruction(address _escrow, uint _id) public onlyDestroyer {

        Lock storage lock = locks[_escrow][_id];

        require(lock.destructionBlock != 0, "must be marked for destruction");
        require(lock.destructionBlock > block.number, "destruction period must not have expired");

        // reset the destruction block
        lock.destructionBlock = 0;

        emit DestructionCancelled(_escrow, _id);
    }

    /**
     * @dev Destroy all assets in an escrow account
     *
     * @param _escrow The address of the escrow contract (ERC20/BatchER721)
     * @param _id The ID of the escrow account to be destroyed
     */
    function destroy(address _escrow, uint _id) public onlyDestroyer {

        Lock memory lock = locks[_escrow][_id];

        require(lock.destructionBlock != 0, "must be marked for destruction");
        require(block.number >= lock.destructionBlock, "destruction period must have expired");

        // burn the assets by releasing to the 0 address
        // IReleasable(_escrow).release(_id, address(0));

        delete locks[_escrow][_id];

        emit Destroyed(_escrow, _id);
    }

    /**
     * @dev Escrow some amount of ERC20 tokens
     *
     * @param vault the details of the escrow vault
     * @param cbTo the address to use for the callback transaction
     * @param cbData the data to pass to the callback transaction
     * @param duration the duration of the escrow
     */
    function escrowERC20(
        IERC20Escrow.Vault memory vault, address cbTo, bytes memory cbData, uint64 duration
    ) public returns (uint) {

        require(duration > 0, "must be locked for a number of blocks");
        require(vault.releaser == address(this), "must be releasable by this");

        // escrow the assets with this contract as the releaser
        uint id = erc20Escrow.callbackEscrow(vault, cbTo, cbData);

        _lock(address(erc20Escrow), id, duration, vault.player);

        return id;
    }

    /**
     * @dev Escrow a batch of ERC721s
     *
     * @param vault the details of the escrow vault
     * @param cbTo the address to use for the callback transaction
     * @param cbData the data to pass to the callback transaction
     * @param duration the duration of the escrow
     */
    function escrowBatch(
        IBatchERC721Escrow.Vault memory vault, address cbTo, bytes memory cbData, uint64 duration
    ) public returns (uint) {

        require(duration > 0, "must be locked for a number of blocks");
        require(vault.releaser == address(this), "must be releasable by this");

        // escrow the assets with this contract as the releaser
        uint id = batchEscrow.callbackEscrow(vault, cbTo, cbData);

        _lock(address(batchEscrow), id, duration, vault.player);

        return id;
    }

    function getERC20Escrow() public view returns (IERC20Escrow) {
        return erc20Escrow;
    }

    function getBatchEscrow() public view returns (IBatchERC721Escrow) {
        return batchEscrow;
    }

    function _lock(address _escrow, uint _id, uint64 _duration, address _owner) internal {

        require(_duration > 0, "must be locked for a number of blocks");

        locks[_escrow][_id] = Lock({
            owner: _owner,
            endBlock: uint64(block.number) + _duration,
            destructionBlock: 0,
            releaseBlock: 0,
            releaseTo: address(0)
        });

        emit Escrowed(_escrow, _id, _owner, _duration);
    }
}