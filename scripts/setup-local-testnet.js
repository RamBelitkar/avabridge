const { exec } = require("child_process")
const fs = require("fs")
const path = require("path")

async function setupLocalTestnet() {
  console.log("🚀 Setting up AvaBridge local testnet environment...\n")

  try {
    // Check if Hardhat is installed
    console.log("1. Checking Hardhat installation...")
    await execCommand("npx hardhat --version")
    console.log("✅ Hardhat is installed\n")

    // Start local Hardhat network in background
    console.log("2. Starting local Hardhat network...")
    const hardhatProcess = exec("npx hardhat node", (error, stdout, stderr) => {
      if (error) {
        console.error("Hardhat network error:", error)
        return
      }
    })

    // Wait for network to start
    await new Promise((resolve) => setTimeout(resolve, 3000))
    console.log("✅ Local network started on http://127.0.0.1:8545\n")

    // Deploy contracts
    console.log("3. Deploying smart contracts...")
    await execCommand("npx hardhat run scripts/deploy.js --network localhost")
    console.log("✅ Smart contracts deployed\n")

    // Test contracts
    console.log("4. Running contract tests...")
    await execCommand("node scripts/test-contracts.js")
    console.log("✅ Contract tests passed\n")

    // Check deployment files
    const deploymentsDir = path.join(__dirname, "..", "deployments")
    if (fs.existsSync(deploymentsDir)) {
      const files = fs.readdirSync(deploymentsDir)
      console.log("📁 Deployment files created:")
      files.forEach((file) => {
        console.log(`   - ${file}`)
      })
    }

    console.log("\n🎉 Local testnet setup complete!")
    console.log("\nNext steps:")
    console.log("1. Start the frontend: npm run dev")
    console.log("2. Connect MetaMask to http://127.0.0.1:8545")
    console.log("3. Import a test account using one of the private keys shown above")
    console.log("4. Visit http://localhost:3000 to use AvaBridge\n")

    // Keep the process running
    console.log("Press Ctrl+C to stop the local testnet")
    process.stdin.resume()
  } catch (error) {
    console.error("❌ Setup failed:", error.message)
    process.exit(1)
  }
}

function execCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error)
        return
      }
      console.log(stdout)
      if (stderr) {
        console.error(stderr)
      }
      resolve(stdout)
    })
  })
}

// Handle process termination
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down local testnet...")
  process.exit(0)
})

process.on("SIGTERM", () => {
  console.log("\n🛑 Shutting down local testnet...")
  process.exit(0)
})

if (require.main === module) {
  setupLocalTestnet()
}

module.exports = { setupLocalTestnet }
