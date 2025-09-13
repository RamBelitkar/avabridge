// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title IICMSender
 * @dev Interface for Avalanche Interchain Messaging (ICM) sender functionality
 * This interface defines the methods needed for cross-chain communication
 */
interface IICMSender {
    /**
     * @dev Send a message to another chain
     * @param destinationChainId The ID of the destination chain
     * @param destinationAddress The address on the destination chain
     * @param message The message payload to send
     * @return messageId The unique identifier for this message
     */
    function sendMessage(
        bytes32 destinationChainId,
        address destinationAddress,
        bytes calldata message
    ) external payable returns (bytes32 messageId);
    
    /**
     * @dev Get the fee required to send a message
     * @param destinationChainId The ID of the destination chain
     * @param message The message payload
     * @return fee The fee required in native tokens
     */
    function getFee(
        bytes32 destinationChainId,
        bytes calldata message
    ) external view returns (uint256 fee);
    
    /**
     * @dev Check if a message has been delivered
     * @param messageId The message ID to check
     * @return delivered True if the message has been delivered
     */
    function isMessageDelivered(bytes32 messageId) external view returns (bool delivered);
}
