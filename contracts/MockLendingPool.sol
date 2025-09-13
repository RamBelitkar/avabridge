// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title MockLendingPool
 * @dev Mock DeFi lending protocol that simulates yield generation
 * In production, this would be replaced with actual DeFi protocol integrations
 */
contract MockLendingPool {
    // Events
    event Deposit(address indexed user, uint256 amount, uint256 yieldGenerated);
    event Withdrawal(address indexed user, uint256 amount);
    event YieldRateUpdated(uint256 newRate);
    
    // State variables
    address public owner;
    uint256 public yieldRate; // Basis points (e.g., 500 = 5%)
    uint256 public totalDeposits;
    uint256 public totalYieldPaid;
    
    mapping(address => uint256) public userDeposits;
    mapping(address => uint256) public userYieldEarned;
    
    // Constants
    uint256 public constant MAX_YIELD_RATE = 2000; // 20% max
    uint256 public constant BASIS_POINTS = 10000;
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    constructor(uint256 _yieldRate) {
        require(_yieldRate <= MAX_YIELD_RATE, "Yield rate too high");
        owner = msg.sender;
        yieldRate = _yieldRate; // Default 5% (500 basis points)
    }
    
    /**
     * @dev Deposit AVAX and generate yield
     * @return totalAmount The original amount plus generated yield
     */
    function deposit() external payable returns (uint256) {
        require(msg.value > 0, "Deposit amount must be greater than 0");
        
        uint256 amount = msg.value;
        uint256 yieldAmount = (amount * yieldRate) / BASIS_POINTS;
        uint256 totalAmount = amount + yieldAmount;
        
        // Update state
        userDeposits[msg.sender] += amount;
        userYieldEarned[msg.sender] += yieldAmount;
        totalDeposits += amount;
        totalYieldPaid += yieldAmount;
        
        emit Deposit(msg.sender, amount, yieldAmount);
        
        return totalAmount;
    }
    
    /**
     * @dev Withdraw deposited funds plus yield
     */
    function withdraw(uint256 amount) external {
        require(userDeposits[msg.sender] >= amount, "Insufficient deposit balance");
        require(address(this).balance >= amount, "Insufficient contract balance");
        
        userDeposits[msg.sender] -= amount;
        totalDeposits -= amount;
        
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Withdrawal failed");
        
        emit Withdrawal(msg.sender, amount);
    }
    
    /**
     * @dev Get user's deposit balance
     */
    function getUserDeposit(address user) external view returns (uint256) {
        return userDeposits[user];
    }
    
    /**
     * @dev Get user's total yield earned
     */
    function getUserYieldEarned(address user) external view returns (uint256) {
        return userYieldEarned[user];
    }
    
    /**
     * @dev Calculate potential yield for an amount
     */
    function calculateYield(uint256 amount) external view returns (uint256) {
        return (amount * yieldRate) / BASIS_POINTS;
    }
    
    /**
     * @dev Update yield rate (owner only)
     */
    function updateYieldRate(uint256 _yieldRate) external onlyOwner {
        require(_yieldRate <= MAX_YIELD_RATE, "Yield rate too high");
        yieldRate = _yieldRate;
        emit YieldRateUpdated(_yieldRate);
    }
    
    /**
     * @dev Get pool statistics
     */
    function getPoolStats() external view returns (
        uint256 _totalDeposits,
        uint256 _totalYieldPaid,
        uint256 _currentYieldRate,
        uint256 _contractBalance
    ) {
        return (
            totalDeposits,
            totalYieldPaid,
            yieldRate,
            address(this).balance
        );
    }
    
    /**
     * @dev Add liquidity to the pool (owner only)
     * This simulates the pool having funds to pay yield
     */
    function addLiquidity() external payable onlyOwner {
        require(msg.value > 0, "Must send AVAX to add liquidity");
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
        // Allow contract to receive AVAX for liquidity
    }
}
