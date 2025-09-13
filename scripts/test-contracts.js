const { ethers } = require("hardhat")

async function main() {
  console.log("Testing AvaBridge contracts...")

  // Get signers
  const [deployer, user1, user2] = await ethers.getSigners()
  console.log("Testing with accounts:")
  console.log("  Deployer:", deployer.address)
  console.log("  User1:", user1.address)
  console.log("  User2:", user2.address)

  try {
    // Load deployment addresses
    const fs = require("fs")
    const path = require("path")
    const network = await ethers.provider.getNetwork()
    const deploymentFile = path.join(__dirname, "..", "deployments", `deployment-${network.chainId}.json`)

    if (!fs.existsSync(deploymentFile)) {
      throw new Error("Deployment file not found. Please run deployment first.")
    }

    const deploymentInfo = JSON.parse(fs.readFileSync(deploymentFile, "utf8"))
    console.log("Loaded deployment info for network:", network.chainId)

    // Get contract instances
    const MockLendingPool = await ethers.getContractFactory("MockLendingPool")
    const Receiver = await ethers.getContractFactory("Receiver")
    const Sender = await ethers.getContractFactory("Sender")

    const mockLendingPool = MockLendingPool.attach(deploymentInfo.contracts.MockLendingPool)
    const receiver = Receiver.attach(deploymentInfo.contracts.Receiver)
    const sender = Sender.attach(deploymentInfo.contracts.Sender)

    console.log("\n1. Testing MockLendingPool...")

    // Test lending pool deposit
    const depositAmount = ethers.parseEther("1.0")
    console.log("Depositing", ethers.formatEther(depositAmount), "AVAX to lending pool...")

    const tx1 = await mockLendingPool.connect(user1).deposit({ value: depositAmount })
    await tx1.wait()

    const userDeposit = await mockLendingPool.getUserDeposit(user1.address)
    const userYield = await mockLendingPool.getUserYieldEarned(user1.address)

    console.log("User1 deposit:", ethers.formatEther(userDeposit), "AVAX")
    console.log("User1 yield earned:", ethers.formatEther(userYield), "AVAX")

    console.log("\n2. Testing Sender contract...")

    // Test sender deposit
    const senderDepositAmount = ethers.parseEther("0.5")
    console.log("User2 depositing", ethers.formatEther(senderDepositAmount), "AVAX to sender...")

    const initialBalance = await sender.getUserBalance(user2.address)
    console.log("User2 initial balance:", ethers.formatEther(initialBalance), "AVAX")

    const tx2 = await sender.connect(user2).deposit({ value: senderDepositAmount })
    const receipt = await tx2.wait()

    // Get the deposit event
    const depositEvent = receipt.logs.find((log) => {
      try {
        const parsed = sender.interface.parseLog(log)
        return parsed.name === "DepositInitiated"
      } catch {
        return false
      }
    })

    if (depositEvent) {
      const parsed = sender.interface.parseLog(depositEvent)
      console.log("Deposit initiated with message ID:", parsed.args.messageId)
    }

    // Wait a moment for the simulated yield to be processed
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const finalBalance = await sender.getUserBalance(user2.address)
    const totalDeposited = await sender.getUserTotalDeposited(user2.address)
    const totalYield = await sender.getUserTotalYield(user2.address)

    console.log("User2 final balance:", ethers.formatEther(finalBalance), "AVAX")
    console.log("User2 total deposited:", ethers.formatEther(totalDeposited), "AVAX")
    console.log("User2 total yield:", ethers.formatEther(totalYield), "AVAX")

    console.log("\n3. Testing withdrawal...")

    // Test withdrawal
    const withdrawAmount = ethers.parseEther("0.1")
    console.log("User2 withdrawing", ethers.formatEther(withdrawAmount), "AVAX...")

    const balanceBeforeWithdraw = await ethers.provider.getBalance(user2.address)
    const tx3 = await sender.connect(user2).withdraw(withdrawAmount)
    const receipt3 = await tx3.wait()
    const balanceAfterWithdraw = await ethers.provider.getBalance(user2.address)

    // Calculate gas cost
    const gasUsed = receipt3.gasUsed * receipt3.gasPrice
    const netReceived = balanceAfterWithdraw - balanceBeforeWithdraw + gasUsed

    console.log("Net AVAX received:", ethers.formatEther(netReceived), "AVAX")
    console.log("Gas cost:", ethers.formatEther(gasUsed), "AVAX")

    const balanceAfterWithdrawal = await sender.getUserBalance(user2.address)
    console.log("User2 balance after withdrawal:", ethers.formatEther(balanceAfterWithdrawal), "AVAX")

    console.log("\n4. Contract Statistics:")
    console.log("=".repeat(40))

    // MockLendingPool stats
    const poolStats = await mockLendingPool.getPoolStats()
    console.log("MockLendingPool:")
    console.log("  - Total Deposits:", ethers.formatEther(poolStats[0]), "AVAX")
    console.log("  - Total Yield Paid:", ethers.formatEther(poolStats[1]), "AVAX")
    console.log("  - Yield Rate:", poolStats[2].toString(), "basis points")
    console.log("  - Contract Balance:", ethers.formatEther(poolStats[3]), "AVAX")

    // Sender contract balance
    const senderBalance = await ethers.provider.getBalance(deploymentInfo.contracts.Sender)
    console.log("Sender Contract Balance:", ethers.formatEther(senderBalance), "AVAX")

    // Receiver contract balance
    const receiverBalance = await ethers.provider.getBalance(deploymentInfo.contracts.Receiver)
    console.log("Receiver Contract Balance:", ethers.formatEther(receiverBalance), "AVAX")

    console.log("=".repeat(40))
    console.log("✅ All tests completed successfully!")
  } catch (error) {
    console.error("Testing failed:", error)
    process.exit(1)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
