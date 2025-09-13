const { ethers } = require("hardhat")
const fs = require("fs")
const path = require("path")

async function verifyDeployment() {
  console.log("🔍 Verifying AvaBridge deployment...\n")

  try {
    const network = await ethers.provider.getNetwork()
    const deploymentFile = path.join(__dirname, "..", "deployments", `deployment-${network.chainId}.json`)

    if (!fs.existsSync(deploymentFile)) {
      throw new Error(`Deployment file not found for network ${network.chainId}`)
    }

    const deploymentInfo = JSON.parse(fs.readFileSync(deploymentFile, "utf8"))
    console.log("📋 Deployment Information:")
    console.log(`Network: ${network.name} (Chain ID: ${network.chainId})`)
    console.log(`Deployer: ${deploymentInfo.deployer}`)
    console.log(`Deployment Time: ${deploymentInfo.timestamp}\n`)

    // Get contract instances
    const MockLendingPool = await ethers.getContractFactory("MockLendingPool")
    const Receiver = await ethers.getContractFactory("Receiver")
    const Sender = await ethers.getContractFactory("Sender")

    const mockLendingPool = MockLendingPool.attach(deploymentInfo.contracts.MockLendingPool)
    const receiver = Receiver.attach(deploymentInfo.contracts.Receiver)
    const sender = Sender.attach(deploymentInfo.contracts.Sender)

    console.log("🔗 Contract Verification:")

    // Verify MockLendingPool
    console.log("\n1. MockLendingPool:")
    console.log(`   Address: ${deploymentInfo.contracts.MockLendingPool}`)
    const poolStats = await mockLendingPool.getPoolStats()
    console.log(`   Yield Rate: ${poolStats[2].toString()} basis points (${poolStats[2] / 100}%)`)
    console.log(`   Contract Balance: ${ethers.formatEther(poolStats[3])} AVAX`)
    console.log(`   Total Deposits: ${ethers.formatEther(poolStats[0])} AVAX`)
    console.log(`   Total Yield Paid: ${ethers.formatEther(poolStats[1])} AVAX`)

    // Verify Receiver
    console.log("\n2. Receiver:")
    console.log(`   Address: ${deploymentInfo.contracts.Receiver}`)
    const receiverOwner = await receiver.owner()
    const lendingPoolAddress = await receiver.getLendingPool()
    console.log(`   Owner: ${receiverOwner}`)
    console.log(`   Lending Pool: ${lendingPoolAddress}`)
    console.log(`   Linked Correctly: ${lendingPoolAddress === deploymentInfo.contracts.MockLendingPool ? "✅" : "❌"}`)

    // Verify Sender
    console.log("\n3. Sender:")
    console.log(`   Address: ${deploymentInfo.contracts.Sender}`)
    const senderOwner = await sender.owner()
    const receiverContract = await sender.receiverContract()
    console.log(`   Owner: ${senderOwner}`)
    console.log(`   Receiver Contract: ${receiverContract}`)
    console.log(`   Linked Correctly: ${receiverContract === deploymentInfo.contracts.Receiver ? "✅" : "❌"}`)

    // Check contract balances
    console.log("\n💰 Contract Balances:")
    const senderBalance = await ethers.provider.getBalance(deploymentInfo.contracts.Sender)
    const receiverBalance = await ethers.provider.getBalance(deploymentInfo.contracts.Receiver)
    const poolBalance = await ethers.provider.getBalance(deploymentInfo.contracts.MockLendingPool)

    console.log(`   Sender: ${ethers.formatEther(senderBalance)} AVAX`)
    console.log(`   Receiver: ${ethers.formatEther(receiverBalance)} AVAX`)
    console.log(`   MockLendingPool: ${ethers.formatEther(poolBalance)} AVAX`)

    // Verify contract code
    console.log("\n📝 Contract Code Verification:")
    const senderCode = await ethers.provider.getCode(deploymentInfo.contracts.Sender)
    const receiverCode = await ethers.provider.getCode(deploymentInfo.contracts.Receiver)
    const poolCode = await ethers.provider.getCode(deploymentInfo.contracts.MockLendingPool)

    console.log(`   Sender Code Size: ${senderCode.length} bytes ${senderCode !== "0x" ? "✅" : "❌"}`)
    console.log(`   Receiver Code Size: ${receiverCode.length} bytes ${receiverCode !== "0x" ? "✅" : "❌"}`)
    console.log(`   MockLendingPool Code Size: ${poolCode.length} bytes ${poolCode !== "0x" ? "✅" : "❌"}`)

    // Generate frontend configuration
    const frontendConfig = {
      contracts: {
        sender: {
          address: deploymentInfo.contracts.Sender,
          abi: "SENDER_ABI", // Would be replaced with actual ABI
        },
        receiver: {
          address: deploymentInfo.contracts.Receiver,
          abi: "RECEIVER_ABI",
        },
        mockLendingPool: {
          address: deploymentInfo.contracts.MockLendingPool,
          abi: "MOCK_LENDING_POOL_ABI",
        },
      },
      network: {
        chainId: network.chainId,
        name: network.name,
      },
    }

    const configFile = path.join(__dirname, "..", "config", `contracts-${network.chainId}.json`)
    const configDir = path.dirname(configFile)

    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true })
    }

    fs.writeFileSync(configFile, JSON.stringify(frontendConfig, null, 2))
    console.log(`\n📄 Frontend config saved to: ${configFile}`)

    console.log("\n✅ Deployment verification complete!")
    console.log("\n🚀 Ready for production use:")
    console.log("1. Update frontend contract addresses")
    console.log("2. Configure environment variables")
    console.log("3. Test wallet connections")
    console.log("4. Verify cross-chain messaging")
  } catch (error) {
    console.error("❌ Verification failed:", error.message)
    process.exit(1)
  }
}

if (require.main === module) {
  verifyDeployment()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

module.exports = { verifyDeployment }
