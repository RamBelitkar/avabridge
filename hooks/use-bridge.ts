"use client"

import { useState, useEffect } from "react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { parseEther } from "viem"

// Contract ABI (simplified for demo)
const SENDER_ABI = [
  {
    inputs: [],
    name: "deposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
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

  const { writeContract, data: hash, isPending } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const isLoading = isPending || isConfirming

  // Calculate estimated yield (5% for demo)
  useEffect(() => {
    // This would normally come from the smart contract
    setEstimatedYield("0.0000")
  }, [])

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

      // Calculate estimated yield (5%)
      const yieldAmount = (Number.parseFloat(amount) * 0.05).toFixed(4)
      setEstimatedYield(yieldAmount)

      // In production, this would call the actual smart contract
      writeContract({
        address: SENDER_CONTRACT_ADDRESS,
        abi: SENDER_ABI,
        functionName: "deposit",
        value,
      })
    } catch (error) {
      console.error("Deposit failed:", error)
    }
  }

  const withdraw = async (amount: string) => {
    if (!isConnected || !amount) return

    try {
      withdraw(amount);
      console.log("Withdrawing:", amount)
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
