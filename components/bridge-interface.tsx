"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Info, Loader2 } from "lucide-react"
import { useBridge } from "@/hooks/use-bridge"

export function BridgeInterface() {
  const { isConnected } = useAccount()
  const [amount, setAmount] = useState("")
  const [selectedSubnet, setSelectedSubnet] = useState("")
  const { deposit, withdraw, isLoading, userBalance, estimatedYield } = useBridge()
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [isWithdrawing, setIsWithdrawing] = useState(false)

  const handleBridge = async () => {
    if (!amount || !selectedSubnet) return
    await deposit(amount)
  }

  const handleWithdraw = async () => {
    if (!withdrawAmount) return
    setIsWithdrawing(true)
    await withdraw(withdrawAmount)
    setIsWithdrawing(false)
    setWithdrawAmount("")
  }

  const subnets = [
    { id: "gaming-subnet", name: "Gaming Subnet", apy: "12.5%" },
    { id: "defi-subnet", name: "DeFi Subnet", apy: "8.7%" },
    { id: "enterprise-subnet", name: "Enterprise Subnet", apy: "6.2%" },
  ]

  return (
    <section id="bridge" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Bridge Your Liquidity</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Connect your subnet assets to C-Chain DeFi protocols and start earning yield with a single transaction.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Liquidity Bridge</CardTitle>
              <CardDescription>Bridge your subnet tokens to access C-Chain yield opportunities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Subnet Selection */}
              <div className="space-y-2">
                <Label htmlFor="subnet">Source Subnet</Label>
                <Select value={selectedSubnet} onValueChange={setSelectedSubnet}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your subnet" />
                  </SelectTrigger>
                  <SelectContent>
                    {subnets.map((subnet) => (
                      <SelectItem key={subnet.id} value={subnet.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{subnet.name}</span>
                          <Badge variant="secondary" className="ml-2">
                            {subnet.apy} APY
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Amount Input */}
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (AVAX)</Label>
                <div className="relative">
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pr-16"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-sm text-muted-foreground">AVAX</span>
                  </div>
                </div>
                {isConnected && <p className="text-xs text-muted-foreground">Balance: {userBalance} AVAX</p>}
              </div>

              {/* Yield Estimation */}
              {amount && selectedSubnet && (
                <div className="rounded-lg border border-border bg-muted/50 p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Info className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Estimated Returns</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Deposit Amount:</span>
                      <span>{amount} AVAX</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estimated Yield (5%):</span>
                      <span className="text-accent font-medium">+{estimatedYield} AVAX</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Total Return:</span>
                      <span>
                        {(Number.parseFloat(amount || "0") + Number.parseFloat(estimatedYield || "0")).toFixed(4)} AVAX
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Bridge Button */}
              <Button
                onClick={handleBridge}
                disabled={!isConnected || !amount || !selectedSubnet || isLoading}
                className="w-full flex items-center justify-center space-x-2"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Bridge Liquidity</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>

              {/* Withdraw Section */}
              <div className="pt-8 border-t border-border mt-6">
                <Label htmlFor="withdraw-amount">Withdraw (AVAX)</Label>
                <div className="flex space-x-2 mt-2">
                  <Input
                    id="withdraw-amount"
                    type="number"
                    placeholder="0.00"
                    value={withdrawAmount}
                    min={0}
                    max={userBalance}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="pr-16"
                    disabled={!isConnected || isWithdrawing}
                  />
                  <Button
                    onClick={handleWithdraw}
                    disabled={!isConnected || !withdrawAmount || isWithdrawing || Number(withdrawAmount) <= 0 || Number(withdrawAmount) > Number(userBalance)}
                    className="flex items-center justify-center"
                    size="lg"
                  >
                    {isWithdrawing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Withdrawing...</span>
                      </>
                    ) : (
                      <span>Withdraw</span>
                    )}
                  </Button>
                </div>
                {isConnected && <p className="text-xs text-muted-foreground mt-1">Available: {userBalance} AVAX</p>}
              </div>

              {!isConnected && (
                <p className="text-center text-sm text-muted-foreground">Connect your wallet to start bridging</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
