pragma solidity >=0.6.8 <0.7.0;

import "./Ownable.sol";
import "./ERC721.sol";
import "./ERC721TokenReceiver.sol";

contract ArtCoinFactory is Ownable, ERC721 {

    string public constant name = "ArtCoin";
    string public constant symbol = "Art";

    event NewArt(uint artId, string name, string artist);

    struct ArtCoin {
        string artName;
        string artist;
    }

    struct ArtRequest {
        uint artPiece;
        address requestor;
    }

    ArtCoin[] public allCoins;
    mapping (uint => bool) artCreateApproved;
    mapping (uint => bool) artCreatePending;
    mapping (uint => address) public artToOwner;
    mapping (address => uint) ownerArtCount;
    mapping (uint => address) artToRequester;
    mapping (uint => address) artTransferApproval;
    mapping (address => mapping (address => bool)) internal ownerToOperators;

    //bytes4(keccak256("onERC721Received(address,address,uint256,bytes)")).
    bytes4 internal constant MAGIC_ON_ERC721_RECEIVED = 0x150b7a02;

    modifier canTransfer (uint256 _tokenId) {
        address tokenOwner = artToOwner[_tokenId];
        require(tokenOwner == msg.sender || artTransferApproval[_tokenId] == msg.sender
        || ownerToOperators[tokenOwner][msg.sender], "Sender not allowed to transfer");
        _;
    }

    modifier validArtCoin( uint256 _tokenId){
        require(artToOwner[_tokenId] != address(0), "Not valid artCoin");
        _;
    }

    function requestCreate(string calldata _artName, string calldata _artist, address _owner) external {
        uint id = _createArtCoin(_artName, _artist, _owner);
        artCreateApproved[id] = false;
        artCreatePending[id] = true;
    }

    function requestApprove(uint256 id) external onlyOwner {
        artCreatePending[id] = false;
        artCreateApproved[id] = true;
    }

    function requestTransfer(uint256 tokenId, address requester) external {
        artToRequester[tokenId] = requester;
    }

    function getArtToRequester(address ownerAddress) external view returns (uint[] memory, address[] memory) {
        uint size = 10;
        if (ownerArtCount[ownerAddress] < size){
            size = ownerArtCount[ownerAddress];
        }
        uint[] memory allCoinsOfOwner = allCoinsOfOwner(ownerAddress);
        uint[] memory resultArtId = new uint[](size);
        address[] memory resultRequestorAddr = new address[](size);
        uint256 counter = 0;
        for (uint i = 0; i < allCoinsOfOwner.length && counter < size; i++) {
            uint currentArtIndex = allCoinsOfOwner[i];
            if (artToRequester[currentArtIndex] != address(0)){
                resultArtId[i] = currentArtIndex;
                resultRequestorAddr[i] = artToRequester[currentArtIndex];
                counter++;
            }
        }
        return (resultArtId, resultRequestorAddr);
    }

/*
    function getPendingArt() external view onlyOwner returns (uint[10] memory){
        uint size = 10;
        if (allCoins.length < size){
            size = allCoins.length;
        }
        uint[10] memory result;
        uint256 counter = 0;
        for (uint i = 0; i < allCoins.length && counter < size; i++) {
            if (artCreateApproved[i] == false) {
                result[i] = uint(i);
                counter++;
            }
        }
        return result;
    }
*/

    function getPendingArt() external view returns (uint[] memory){
        uint size = 100;
        if (allCoins.length < size){
            size = allCoins.length;
        }
        uint[] memory result = new uint[](size);
        uint256 counter = 0;
        for (uint i = 0; i < allCoins.length && counter < size; i++) {
            if (artCreatePending[i] == true) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }

    function getApprovedArt() external view returns (uint[] memory){
        uint size = 100;
        if (allCoins.length < size){
            size = allCoins.length;
        }
        uint[] memory result = new uint[](size);
        uint256 counter = 0;
        for (uint i = 0; i < allCoins.length && counter < size; i++) {
            if (artCreateApproved[i] == true) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }


    function createArtCoin(string calldata _artName, string calldata _artist, address _owner) external onlyOwner {
       uint id = _createArtCoin(_artName, _artist, _owner);
       artCreateApproved[id] = true;
       artCreatePending[id] = false;
    }

    function _createArtCoin(string memory _artName, string memory _artist, address _owner) internal returns (uint) {
        allCoins.push(ArtCoin(_artName, _artist));
        uint id = allCoins.length - 1;
        artToOwner[id] = _owner;
        ownerArtCount[_owner]++;
        emit NewArt(id, _artName, _artist);
        emit Transfer(address(0), _owner, id);
        return id;
    }

    function balanceOf(address _owner) external view override returns (uint256) {
        return ownerArtCount[_owner];
    }

    function ownerOf(uint256 _tokenId) external view override returns (address) {
        return artToOwner[_tokenId];
    }

    function allCoinsOfOwner(address _owner) public view returns(uint[] memory) {
        uint[] memory result = new uint[](ownerArtCount[_owner]);
        uint counter = 0;
        for (uint i = 0; i < allCoins.length; i++) {
            if (artToOwner[i] == _owner) {
                result[counter] = i;
                counter += 1;
            }
        }
        return result;
    }

    function allCoinsLength() external view returns(uint) {
        return allCoins.length;
    }
    
    function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes calldata _data) external payable override {
        _safeTransfer(_from, _to, _tokenId, _data);
    }

    function safeTransferFrom(address _from, address _to, uint256 _tokenId) external payable override {
        _safeTransfer(_from, _to, _tokenId, "");
    }

    function _safeTransfer(address _from, address _to, uint256 _tokenId, bytes memory _data) internal canTransfer(_tokenId) validArtCoin(_tokenId) {
        address tokenOwner = artToOwner[_tokenId];
        require(tokenOwner == _from, "Not Owner");
        require(_to != address(0), "Cannot transfer to Zero Address");
        _transfer(_to, _tokenId);
        if (isContract(_to)){
            bytes4 retval = ERC721TokenReceiver(_to).onERC721Received(msg.sender, _from, _tokenId, _data);
            require(retval == MAGIC_ON_ERC721_RECEIVED, "Contract not able to receive art coin");
        }
    }

    function approveTransferRequest(address _from, address _to, uint256 _tokenId) external {
        _safeTransfer(_from, _to, _tokenId, "");
        artToRequester[_tokenId] = address(0);
    }

    /// @notice Transfer ownership of an NFT -- THE CALLER IS RESPONSIBLE
    ///  TO CONFIRM THAT `_to` IS CAPABLE OF RECEIVING NFTS OR ELSE
    ///  THEY MAY BE PERMANENTLY LOST
    /// @dev Throws unless `msg.sender` is the current owner, an authorized
    ///  operator, or the approved address for this NFT. Throws if `_from` is
    ///  not the current owner. Throws if `_to` is the zero address. Throws if
    ///  `_tokenId` is not a valid NFT.
    /// @param _from The current owner of the NFT
    /// @param _to The new owner
    /// @param _tokenId The NFT to transfer
    function transferFrom(address _from, address _to, uint256 _tokenId) external payable override canTransfer(_tokenId) validArtCoin(_tokenId){
        address tokenOwner = artToOwner[_tokenId];
        require(tokenOwner == _from, "Not Owner");
        require(_to != address(0), "Cannot transfer to Zero Address");
        _transfer(_to, _tokenId);
    }

    function _transfer (address _to, uint256 _tokenId) internal {
        address from = artToOwner[_tokenId];
        artToOwner[_tokenId] = _to;
        delete artTransferApproval[_tokenId];
        ownerArtCount[from]--;
        ownerArtCount[_to]++;
        emit Transfer(from, _to, _tokenId);
    }

    function isContract(address addr) internal returns (bool) {
        uint size;
        assembly {
            size := extcodesize(addr)
        }
        return size > 0;
    }

    /// @notice Change or reaffirm the approved address for an NFT
    /// @dev The zero address indicates there is no approved address.
    ///  Throws unless `msg.sender` is the current NFT owner, or an authorized
    ///  operator of the current owner.
    /// @param _approved The new approved NFT controller
    /// @param _tokenId The NFT to approve
    function approve(address _approved, uint256 _tokenId) external payable override canTransfer(_tokenId) {
        address tokenOwner = artToOwner[_tokenId];
        require(_approved != tokenOwner, "Is already Owner");
        artTransferApproval[_tokenId] = _approved;
        emit Approval(tokenOwner, _approved, _tokenId);
    }

    /// @notice Enable or disable approval for a third party ("operator") to manage
    ///  all of `msg.sender`'s assets
    /// @dev Emits the ApprovalForAll event. The contract MUST allow
    ///  multiple operators per owner.
    /// @param _operator Address to add to the set of authorized operators
    /// @param _approved True if the operator is approved, false to revoke approval
    function setApprovalForAll(address _operator, bool _approved) external override {
        ownerToOperators[msg.sender][_operator] = _approved;
        emit ApprovalForAll(msg.sender, _operator, _approved);
    }

    /// @notice Get the approved address for a single NFT
    /// @dev Throws if `_tokenId` is not a valid NFT.
    /// @param _tokenId The NFT to find the approved address for
    /// @return The approved address for this NFT, or the zero address if there is none
    function getApproved(uint256 _tokenId) external view override returns (address) {
        return artTransferApproval[_tokenId];
    }

    /// @notice Query if an address is an authorized operator for another address
    /// @param _owner The address that owns the NFTs
    /// @param _operator The address that acts on behalf of the owner
    /// @return True if `_operator` is an approved operator for `_owner`, false otherwise
    function isApprovedForAll(address _owner, address _operator) external view override returns (bool) {
        return ownerToOperators[_owner][_operator];
    }
}