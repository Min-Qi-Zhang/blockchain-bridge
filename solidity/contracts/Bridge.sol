// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7 < 0.9.0;

/**
 * @title Bridge
 * @dev Arbitrary Message Bridge between EVM based blockchains
 */
contract Bridge {

    struct Message {
        uint256 messageId;
        address sender;
        string message;
        bytes32 hash;
    }

    // sending message
    uint256 messageBatchSize = 4;
    uint256 merkleTreeHeight = 2;
    uint256 messageSentCounter;
    mapping(uint256 => Message) public messageSent;
    event MessageSent(uint256 indexed messageId, address sender, string message, uint256 messageIndex, bytes32[] proof, bytes32 root_hash);
    mapping(uint256 => bytes32) public merkle_root;
    mapping(uint256 => bytes32[]) public merkle_proof;

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

        if (messageSentCounter % messageBatchSize == 0) {
            // take out hash from message struct
            bytes32[] memory hashes = new bytes32[](messageBatchSize*2 - 1);
            uint256 startIndex = messageSentCounter - (messageBatchSize - 1);
            uint256 hashIndex = 0;
            for (uint256 i = startIndex; i <= messageSentCounter; i++) {
                hashes[hashIndex] = messageSent[i].hash;
                hashIndex += 1;
            }

            // compute the rest of the merkle tree
            uint256 n = messageBatchSize;
            uint256 offset = 0;

            while (n > 0) {
                for (uint256 i = 0; i < n - 1; i += 2) {
                    hashes[hashIndex] = keccak256(abi.encodePacked(hashes[offset + i], hashes[offset + i + 1]));
                    hashIndex += 1;
                }
                offset += n;
                n = n / 2;
            }

            // Get proof for each message and emit MerkleRoot event
            for (uint256 i = startIndex; i <= messageSentCounter; i++) {
                bytes32[] memory proof = new bytes32[](merkleTreeHeight);
                uint256 proofIndex = 0;
                uint256 index = i - startIndex;
                uint256 index2 = index;

                n = messageBatchSize;
                offset = 0;

                while (index < hashes.length - 1) {
                    if (index % 2 == 0) {
                        proof[proofIndex] = hashes[index + 1];
                        proofIndex += 1;
                    } else {
                        proof[proofIndex] = hashes[index - 1];
                        proofIndex += 1;
                    }
                    offset += n;
                    index = offset + (index2 / 2);
                    index2 = index2 / 2;
                    n = n / 2;
                }
                merkle_proof[i] = proof;
                merkle_root[i] = hashes[hashes.length - 1];

                emit MessageSent(messageSent[i].messageId, messageSent[i].sender, messageSent[i].message, i - startIndex, proof, merkle_root[i]);
            }
        }
    }

    /**
     * @dev Receive a message on the target chain.
     * @param proof the proof to use to validate if message belongs to merkle tree
     * @param rootHash the root of merkle tree that given message belongs to
     * @param messageIndex the position of given message in the merkle tree
     * @param messageId the messageId of given message
     * @param sender the sender of given message
     * @param message the message to receive
     */
    function receiveMessage(bytes32[] memory proof, bytes32 rootHash, uint256 messageIndex, uint256 messageId, address sender, string memory message) public {
        // re-compute the merkle root to validate message
        bytes32 messageHash = keccak256(abi.encodePacked(messageId, sender, message));
        bytes32 hash = messageHash;

        for (uint256 i = 0; i < proof.length; i++) {
            bytes32 currentProof = proof[i];

            if (messageIndex % 2 == 0) {
                hash = keccak256(abi.encodePacked(hash, currentProof));
            } else {
                hash = keccak256(abi.encodePacked(currentProof, hash));
            }

            messageIndex = messageIndex / 2;
        }
        
        require(hash == rootHash, "message is not a valid transaction in the source blockchain");
        // record the message on chain
        messageReceived[messageId] = Message({
            messageId: messageId,
            sender: sender,
            message: message,
            hash: messageHash
        });
        messageReceivedCounter += 1;
        if (messageId > messageReceivedCounter) {
            messageReceivedCounter = messageId;
        }
        emit MessageReceived(messageId, sender, message);
    }

    /**
     * @dev Return sent messages by filtered by address of sender.
     */
    function getSentMessageBySender() public view returns (Message[] memory) {
        // Get array size
        uint256 count = 0;
        for (uint256 i = 1; i <= messageSentCounter; i++) {
            if (messageSent[i].sender == msg.sender) {
                count += 1;
            }
        }

        Message[] memory filteredMessage = new Message[](count);
        uint256 index = 0;
        for (uint256 i = 1; i <= messageSentCounter; i++) {
            Message memory message = messageSent[i];
            if (message.sender == msg.sender) {
                filteredMessage[index] = messageSent[i];
                index += 1;
            }
        }
        return filteredMessage;
    }

    /**
     * @dev Return received messages by filtered by address of sender.
     */
    function getReceivedMessageBySender() public view returns (Message[] memory) {
        // Get array size
        uint256 count = 0;
        for (uint256 i = 1; i <= messageReceivedCounter; i++) {
            if (messageReceived[i].sender == msg.sender) {
                count += 1;
            }
        }

        Message[] memory filteredMessage = new Message[](count);
        uint256 index = 0;
        for (uint256 i = 1; i <= messageReceivedCounter; i++) {
            Message memory message = messageReceived[i];
            if (message.sender == msg.sender) {
                filteredMessage[index] = messageReceived[i];
                index += 1;
            }
        }
        return filteredMessage;
    }
}