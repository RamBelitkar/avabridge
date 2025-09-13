const { ethers } = require("hardhat")

async function main() {
  console.log("Deploying AvaBridge contracts...")

  // Get the deployer account
  const [deployer] = await ethers.getSigners()
  console.log("Deploying contracts with account:", deployer.address)

  // Get account balance
  const balance = await ethers.provider.getBalance(deployer.address)
  console.log("Account balance:", ethers.formatEther(balance), "AVAX")

  try {
    // Deploy MockLendingPool first
    console.log("\n1. Deploying MockLendingPool...")
    const MockLendingPool = await ethers.getContractFactory("MockLendingPool")
    const yieldRate = 500 // 5% yield rate
    const mockLendingPool = await MockLendingPool.deploy(yieldRate)
    await mockLendingPool.waitForDeployment()
    const mockLendingPoolAddress = await mockLendingPool.getAddress()
    console.log("MockLendingPool deployed to:", mockLendingPoolAddress)

    // Add initial liquidity to the lending pool
    console.log("Adding initial liquidity to lending pool...")
    const liquidityAmount = ethers.parseEther("10.0") // 10 AVAX
    await mockLendingPool.addLiquidity({ value: liquidityAmount })
    console.log("Added", ethers.formatEther(liquidityAmount), "AVAX liquidity")

    // Deploy Receiver contract
    console.log("\n2. Deploying Receiver...")
    const Receiver = await ethers.getContractFactory("Receiver")
    const icmReceiverAddress = deployer.address // Placeholder for ICM receiver
    const receiver = await Receiver.deploy(icmReceiverAddress, mockLendingPoolAddress)
    await receiver.waitForDeployment()
    const receiverAddress = await receiver.getAddress()
    console.log("Receiver deployed to:", receiverAddress)

    // Deploy Sender contract
    console.log("\n3. Deploying Sender...")
    const Sender = await ethers.getContractFactory("Sender")
    const icmSenderAddress = deployer.address // Placeholder for ICM sender
    const destinationChainId = ethers.keccak256(ethers.toUtf8Bytes("fuji-c-chain"))
    const sender = await Sender.deploy(icmSenderAddress, receiverAddress, destinationChainId)
    await sender.waitForDeployment()
    const senderAddress = await sender.getAddress()
    console.log("Sender deployed to:", senderAddress)

    // Verify deployments
    console.log("\n4. Verifying deployments...")

    // Check MockLendingPool
    const poolStats = await mockLendingPool.getPoolStats()
    console.log("MockLendingPool stats:")
    console.log("  - Yield Rate:", poolStats[2].toString(), "basis points")
    console.log("  - Contract Balance:", ethers.formatEther(poolStats[3]), "AVAX")

    // Check Receiver
    const lendingPoolFromReceiver = await receiver.getLendingPool()
    console.log("Receiver configuration:")
    console.log("  - Lending Pool:", lendingPoolFromReceiver)
    console.log("  - Owner:", await receiver.owner())

    // Check Sender
    const receiverFromSender = await sender.receiverContract()
    console.log("Sender configuration:")
    console.log("  - Receiver Contract:", receiverFromSender)
    console.log("  - Owner:", await sender.owner())

    // Save deployment addresses
    const deploymentInfo = {
      network: await ethers.provider.getNetwork(),
      deployer: deployer.address,
      contracts: {
        MockLendingPool: mockLendingPoolAddress,
        Receiver: receiverAddress,
        Sender: senderAddress,
      },
      timestamp: new Date().toISOString(),
    }

    console.log("\n5. Deployment Summary:")
    console.log("=".repeat(50))
    console.log("Network:", deploymentInfo.network.name, "(Chain ID:", deploymentInfo.network.chainId, ")")
    console.log("Deployer:", deploymentInfo.deployer)
    console.log("MockLendingPool:", deploymentInfo.contracts.MockLendingPool)
    console.log("Receiver:", deploymentInfo.contracts.Receiver)
    console.log("Sender:", deploymentInfo.contracts.Sender)
    console.log("Deployment Time:", deploymentInfo.timestamp)
    console.log("=".repeat(50))

    // Save to file for frontend use
    const fs = require("fs")
    const path = require("path")

    // Create deployments directory if it doesn't exist
    const deploymentsDir = path.join(__dirname, "..", "deployments")
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir)
    }

    // Save deployment info
    const deploymentFile = path.join(deploymentsDir, `deployment-${deploymentInfo.network.chainId}.json`)
    fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2))
    console.log("Deployment info saved to:", deploymentFile)

    console.log("\n✅ All contracts deployed successfully!")
  } catch (error) {
    console.error("Deployment failed:", error)
    process.exit(1)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
