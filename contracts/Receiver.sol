// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./MockLendingPool.sol";

/**
 * @title Receiver
 * @dev Smart contract on C-Chain that receives ICM messages and interacts with DeFi protocols
 * This contract handles the actual yield generation and sends confirmation back to sender
 */
contract Receiver {
    // Events
    event MessageReceived(
        bytes32 indexed messageId,
        address indexed user,
        uint256 amount,
        address indexed senderContract
    );
    
    event YieldGenerated(
        bytes32 indexed messageId,
        address indexed user,
        uint256 originalAmount,
        uint256 yieldAmount,
        uint256 totalAmount
    );
    
    event FundsDeposited(
        address indexed protocol,
        uint256 amount,
        uint256 timestamp
    );
    
    event ConfirmationSent(
        bytes32 indexed messageId,
        address indexed destinationContract,
        uint256 totalAmount
    );

    // State variables
    address public owner;
    address public icmReceiver;
    MockLendingPool public lendingPool;
    
    mapping(bytes32 => ProcessedMessage) public processedMessages;
    mapping(address => uint256) public totalProcessed;
    mapping(address => uint256) public totalYieldGenerated;
    
    struct ProcessedMessage {
        address user;
        uint256 originalAmount;
        uint256 yieldAmount;
        uint256 totalAmount;
        uint256 timestamp;
        bool processed;
    }
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyICMReceiver() {
        require(msg.sender == icmReceiver, "Only ICM receiver can call this function");
        _;
    }
    
    constructor(address _icmReceiver, address _lendingPool) {
        owner = msg.sender;
        icmReceiver = _icmReceiver;
        lendingPool = MockLendingPool(_lendingPool);
    }
    
    /**
     * @dev Receive ICM message and process yield generation
     * In production, this would be called by the ICM protocol
     */
    function receiveMessage(
        bytes32 messageId,
        address senderContract,
        bytes calldata message
    ) external payable {
        // Decode the message
        (address user, uint256 amount, bytes32 originalMessageId, uint256 timestamp) = 
            abi.decode(message, (address, uint256, bytes32, uint256));
        
        require(!processedMessages[messageId].processed, "Message already processed");
        require(msg.value >= amount, "Insufficient funds sent");
        
        emit MessageReceived(messageId, user, amount, senderContract);
        
        // Interact with DeFi protocol to generate yield
        uint256 totalAmount = _generateYield(amount);
        uint256 yieldAmount = totalAmount - amount;
        
        // Store processed message
        processedMessages[messageId] = ProcessedMessage({
            user: user,
            originalAmount: amount,
            yieldAmount: yieldAmount,
            totalAmount: totalAmount,
            timestamp: block.timestamp,
            processed: true
        });
        
        // Update statistics
        totalProcessed[user] += amount;
        totalYieldGenerated[user] += yieldAmount;
        
        emit YieldGenerated(messageId, user, amount, yieldAmount, totalAmount);
        
        // Send confirmation back to sender (simulated)
        _sendConfirmation(messageId, senderContract, totalAmount);
    }
    
    /**
     * @dev Generate yield by interacting with mock DeFi protocol
     */
    function _generateYield(uint256 amount) internal returns (uint256) {
        // Deposit into lending pool
        uint256 totalAmount = lendingPool.deposit{value: amount}();
        
        emit FundsDeposited(address(lendingPool), amount, block.timestamp);
        
        return totalAmount;
    }
    
    /**
     * @dev Send confirmation message back to sender
     */
    function _sendConfirmation(
        bytes32 messageId,
        address destinationContract,
        uint256 totalAmount
    ) internal {
        // In production, this would use ICM to send confirmation back
        // For demo, we emit an event
        emit ConfirmationSent(messageId, destinationContract, totalAmount);
    }
    
    /**
     * @dev Get processed message details
     */
    function getProcessedMessage(bytes32 messageId) external view returns (ProcessedMessage memory) {
        return processedMessages[messageId];
    }
    
    /**
     * @dev Get user statistics
     */
    function getUserStats(address user) external view returns (uint256 totalProcessedAmount, uint256 totalYield) {
        return (totalProcessed[user], totalYieldGenerated[user]);
    }
    
    /**
     * @dev Get lending pool address
     */
    function getLendingPool() external view returns (address) {
        return address(lendingPool);
    }
    
    /**
     * @dev Update lending pool (owner only)
     */
    function updateLendingPool(address _lendingPool) external onlyOwner {
        lendingPool = MockLendingPool(_lendingPool);
    }
    
    /**
     * @dev Emergency withdrawal (owner only)
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner).call{value: balance}("");
        require(success, "Emergency withdrawal failed");
    }
    
    // Receive function to accept AVAX
    receive() external payable {
        // Allow contract to receive AVAX
    }
}
