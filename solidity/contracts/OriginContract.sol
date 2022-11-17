// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/**
 * @title OriginContract
 * @dev Smart contract on Ethereum side
 */
contract OriginContract {
    string public message;

    event UpdateMessage(address from, address to, string message);

    /**
     * @dev Sets the message
     * @param _message the message to initialize
     */
    constructor(string memory _message) {
        message = _message;
    }

    /**
     * @dev Transfer message to destination chain
     * @param to the destination chain address
     * @param _message the message to send
     */
    function transferMessage(address to, string memory _message) public {
        message = _message;
        emit UpdateMessage(msg.sender, to, _message);
    }
}