"use client"

import { useState, useEffect } from "react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { parseEther } from "viem"

// Contract ABI (updated for deposit and withdraw)
const SENDER_ABI = [
  {
    inputs: [],
    name: "deposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ name: "user", type: "address" }],
    name: "getUserBalance",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "user", type: "address" }],
    name: "getUserTotalYield",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const

// Mock contract address (replace with actual deployed address)
const SENDER_CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890"

export function useBridge() {
  const { address, isConnected } = useAccount()
  const [userBalance, setUserBalance] = useState("0.0000")
  const [totalYield, setTotalYield] = useState("0.0000")
  const [estimatedYield, setEstimatedYield] = useState("0.0000")
  const [depositAmount, setDepositAmount] = useState("")

  const { writeContract, data: hash, isPending } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const isLoading = isPending || isConfirming

  // Dynamically calculate estimated yield (5%) when depositAmount changes
  useEffect(() => {
    if (depositAmount && !isNaN(Number(depositAmount))) {
      const yieldAmount = (Number.parseFloat(depositAmount) * 0.05).toFixed(4)
      setEstimatedYield(yieldAmount)
    } else {
      setEstimatedYield("0.0000")
    }
  }, [depositAmount])

  // Mock user balance (in production, this would read from the contract)
  useEffect(() => {
    if (isConnected && address) {
      // Simulate fetching user balance
      setUserBalance("2.5000")
      setTotalYield("0.1250")
    } else {
      setUserBalance("0.0000")
      setTotalYield("0.0000")
    }
  }, [isConnected, address])

  const deposit = async (amount: string) => {
    if (!isConnected || !amount) return

    try {
      const value = parseEther(amount)

      setDepositAmount(amount)

      console.log(`[CHECKPOINT] Initiating deposit:`, {
        user: address,
        amount,
        value,
        timestamp: new Date().toISOString(),
      })

      // In production, this would call the actual smart contract
      writeContract({
        address: SENDER_CONTRACT_ADDRESS,
        abi: SENDER_ABI,
        functionName: "deposit",
        value,
      })
      console.log(`[CHECKPOINT] Deposit transaction sent for user: ${address}, amount: ${amount}`)
    } catch (error) {
      console.error("Deposit failed:", error)
    }
  }

  const withdraw = async (amount: string) => {
    if (!isConnected || !amount) return

    try {
      const parsedAmount = parseEther(amount)
      console.log(`[CHECKPOINT] Initiating withdrawal:`, {
        user: address,
        amount,
        parsedAmount,
        timestamp: new Date().toISOString(),
      })
      // Call the withdraw function on the Sender contract
      await writeContract({
        address: SENDER_CONTRACT_ADDRESS,
        abi: SENDER_ABI,
        functionName: "withdraw",
        args: [parsedAmount],
      })
      console.log(`[CHECKPOINT] Withdraw transaction sent for user: ${address}, amount: ${amount}`)
      // Optionally, update user balance after withdrawal
      // setUserBalance((prev) => (Number(prev) - Number(amount)).toFixed(4))
    } catch (error) {
      console.error("Withdrawal failed:", error)
    }
  }

  return {
    deposit,
    withdraw,
    userBalance,
    totalYield,
    estimatedYield,
    isLoading,
    isSuccess,
  }
}
