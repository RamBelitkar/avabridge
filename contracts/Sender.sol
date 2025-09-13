// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./interfaces/IICMSender.sol";

/**
 * @title Sender
 * @dev Smart contract for initiating cross-chain liquidity transfers from subnet to C-Chain
 * This contract handles user deposits and initiates ICM calls to the C-Chain receiver
 */
contract Sender {
    // Events
    event DepositInitiated(
        address indexed user,
        uint256 amount,
        bytes32 indexed messageId,
        address indexed destinationChain
    );
    
    event MessageSent(
        bytes32 indexed messageId,
        address indexed destinationChain,
        bytes message
    );
    
    event YieldReceived(
        address indexed user,
        uint256 originalAmount,
        uint256 yieldAmount,
        uint256 totalAmount
    );

    // State variables
    address public owner;
    address public icmSender;
    address public receiverContract;
    bytes32 public destinationChainId;
    
    mapping(address => uint256) public userBalances;
    mapping(bytes32 => PendingTransfer) public pendingTransfers;
    mapping(address => uint256) public totalDeposited;
    mapping(address => uint256) public totalYieldEarned;
    
    struct PendingTransfer {
        address user;
        uint256 amount;
        uint256 timestamp;
        bool completed;
    }
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyICMSender() {
        require(msg.sender == icmSender, "Only ICM sender can call this function");
        _;
    }
    
    constructor(
        address _icmSender,
        address _receiverContract,
        bytes32 _destinationChainId
    ) {
        owner = msg.sender;
        icmSender = _icmSender;
        receiverContract = _receiverContract;
        destinationChainId = _destinationChainId;
    }
    
    /**
     * @dev Deposit native tokens and initiate cross-chain transfer
     */
    function deposit() external payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");
        require(msg.value >= 0.01 ether, "Minimum deposit is 0.01 AVAX");
        
        // Generate unique message ID
        bytes32 messageId = keccak256(
            abi.encodePacked(
                msg.sender,
                msg.value,
                block.timestamp,
                block.number
            )
        );
        
        // Store pending transfer
        pendingTransfers[messageId] = PendingTransfer({
            user: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp,
            completed: false
        });
        
        // Update user balance
        userBalances[msg.sender] += msg.value;
        totalDeposited[msg.sender] += msg.value;
        
        // Prepare message for ICM
        bytes memory message = abi.encode(
            msg.sender,
            msg.value,
            messageId,
            block.timestamp
        );
        
        // Send ICM message (simulated for demo)
        _sendICMMessage(messageId, message);
        
        emit DepositInitiated(msg.sender, msg.value, messageId, receiverContract);
    }
    
    /**
     * @dev Internal function to send ICM message
     */
    function _sendICMMessage(bytes32 messageId, bytes memory message) internal {
        // In a real implementation, this would use the actual ICM protocol
        // For demo purposes, we'll simulate the message sending
        emit MessageSent(messageId, receiverContract, message);
        
        // Simulate successful message delivery and yield generation
        // In production, this would be handled by the ICM protocol
        _simulateYieldReturn(messageId);
    }
    
    /**
     * @dev Simulate yield return for demo purposes
     * In production, this would be called by the ICM protocol when receiving a response
     */
    function _simulateYieldReturn(bytes32 messageId) internal {
        PendingTransfer storage transfer = pendingTransfers[messageId];
        require(!transfer.completed, "Transfer already completed");
        
        // Simulate 5% yield (in production, this comes from actual DeFi protocols)
        uint256 yieldAmount = (transfer.amount * 5) / 100;
        uint256 totalAmount = transfer.amount + yieldAmount;
        
        // Update balances
        userBalances[transfer.user] = userBalances[transfer.user] - transfer.amount + totalAmount;
        totalYieldEarned[transfer.user] += yieldAmount;
        
        // Mark as completed
        transfer.completed = true;
        
        emit YieldReceived(transfer.user, transfer.amount, yieldAmount, totalAmount);
    }
    
    /**
     * @dev Withdraw funds back to user
     */
    function withdraw(uint256 amount) external {
        require(userBalances[msg.sender] >= amount, "Insufficient balance");
        require(amount > 0, "Withdrawal amount must be greater than 0");
        
        userBalances[msg.sender] -= amount;
        
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Withdrawal failed");
    }
    
    /**
     * @dev Get user's current balance
     */
    function getUserBalance(address user) external view returns (uint256) {
        return userBalances[user];
    }
    
    /**
     * @dev Get user's total deposited amount
     */
    function getUserTotalDeposited(address user) external view returns (uint256) {
        return totalDeposited[user];
    }
    
    /**
     * @dev Get user's total yield earned
     */
    function getUserTotalYield(address user) external view returns (uint256) {
        return totalYieldEarned[user];
    }
    
    /**
     * @dev Get pending transfer details
     */
    function getPendingTransfer(bytes32 messageId) external view returns (PendingTransfer memory) {
        return pendingTransfers[messageId];
    }
    
    /**
     * @dev Emergency withdrawal function (owner only)
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner).call{value: balance}("");
        require(success, "Emergency withdrawal failed");
    }
    
    /**
     * @dev Update receiver contract address (owner only)
     */
    function updateReceiverContract(address _receiverContract) external onlyOwner {
        receiverContract = _receiverContract;
    }
    
    /**
     * @dev Update ICM sender address (owner only)
     */
    function updateICMSender(address _icmSender) external onlyOwner {
        icmSender = _icmSender;
    }
    
    // Receive function to accept AVAX
    receive() external payable {
        // Allow contract to receive AVAX
    }
}
