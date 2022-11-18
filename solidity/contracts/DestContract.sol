// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/**
 * @title DestContract
 * @dev Smart contract on Binance side
 */
contract DestContract {
    string public message;

    event UpdateMessage(address from, string message);

    /**
     * @dev Sets the message
     * @param _message the message to initialize
     */
    constructor(string memory _message) {
        message = _message;
    }

    /**
     * @dev Set message on destination chain
     * @param _message the message to set
     * param merkle_tree merkle_tree
     */
    function setMessage(string memory _message) public {
        // validate merkle_tree
        message = _message;
        emit UpdateMessage(msg.sender, _message);
    }

    /**
     * @dev Returns the message
     */
    function getMessage() public view returns (string memory) {
        return message;
    }
}