// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7 < 0.9.0;

/**
 * @title DestContract
 * @dev Smart contract on Binance side
 */
contract Bridge {

    struct Message {
        uint256 messageId;
        address sender;
        string message;
        bytes32 hash;
    }

    // sending message
    uint256 merkleTreeSize = 3;
    uint256 messageSentCounter;
    mapping(uint256 => Message) public messageSent;
    event MessageSent(uint256 indexed messageId, address sender, string message, bytes32 hash);
    mapping(uint256 => bytes32) public merkle_root;
    event MerkleRoot(uint256 indexed messageId, uint256 merkleTreeSize, bytes32 rootHash);

    // receiving message
    uint256 messageReceivedCounter;
    mapping(uint256 => Message) public messageReceived;
    event MessageReceived(uint256 indexed messageId, address sender, string message);

    constructor() {}

    /**
     * @dev Send a message from source chain.
     * @param _message the message to send
     */
    function sendMessage(string memory _message) public {
        messageSentCounter += 1;
        bytes32 messageHash = keccak256(abi.encodePacked(messageSentCounter, msg.sender, _message));
        messageSent[messageSentCounter] = Message({
            messageId: messageSentCounter,
            sender: msg.sender,
            message: _message,
            hash: messageHash
        });
        emit MessageSent(messageSentCounter, msg.sender, _message, messageHash);
        if (messageSentCounter % (merkleTreeSize - 1) == 0) {
            bytes32 root = keccak256(abi.encodePacked(messageSent[messageSentCounter - 1].hash, messageHash));
            merkle_root[messageSentCounter] = root;
            emit MerkleRoot(messageSentCounter, merkleTreeSize, root);
        }
    }

    /**
     * @dev Receive a message on the target chain.
     * @param merkleNeighbours the neighbours message in the merkle tree in order to recompute merkle root
     * @param merkleRoot the root fo merkle tree that given message belongs to
     * @param messageId the position of given message in the merkle tree
     * @param messageId the messageId of given message
     * @param sender the sender of given message
     * @param message the message to receive
     */
    function recieveMessage(bytes32[] memory merkleNeighbours, bytes32 merkleRoot, uint256 messageIndex, uint256 messageId, address sender, string memory message) public {
        // re-compute the merkle root to validate message
        bytes32 messageHash = keccak256(abi.encodePacked(messageId, sender, message));
        bytes32 hash;
        if (messageIndex % 2 == 0) {
            hash = keccak256(abi.encodePacked(messageHash, merkleNeighbours[1]));
        } else {
            hash = keccak256(abi.encodePacked(merkleNeighbours[0], messageHash));
        }
        require(hash == merkleRoot, "message is not a valid transaction in the source blockchain");
        // recorded the message on chain
        messageReceived[messageId] = Message({
            messageId: messageId,
            sender: sender,
            message: message,
            hash: messageHash
        });
        emit MessageReceived(messageId, sender, message);
    }
}