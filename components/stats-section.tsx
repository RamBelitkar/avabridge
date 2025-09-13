"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, DollarSign, Users, Zap } from "lucide-react"

interface Stats {
  totalLiquidity: string
  totalYield: string
  activeUsers: string
  transactions: string
}

export function StatsSection() {
  const [stats, setStats] = useState<Stats>({
    totalLiquidity: "0",
    totalYield: "0",
    activeUsers: "0",
    transactions: "0",
  })

  useEffect(() => {
    // Simulate loading real-time stats
    const interval = setInterval(() => {
      setStats({
        totalLiquidity: (Math.random() * 1000000 + 500000).toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }),
        totalYield: (Math.random() * 50000 + 25000).toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }),
        activeUsers: Math.floor(Math.random() * 1000 + 500).toString(),
        transactions: Math.floor(Math.random() * 10000 + 5000).toString(),
      })
    }, 3000)

    // Initial load
    setStats({
      totalLiquidity: "$847,392",
      totalYield: "$42,156",
      activeUsers: "1,247",
      transactions: "8,934",
    })

    return () => clearInterval(interval)
  }, [])

  return (
    <section id="stats" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Real-Time Protocol Statistics</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Live data from the AvaBridge protocol showing liquidity flow, yield generation, and user activity across all
            connected subnets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Liquidity</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.totalLiquidity}</div>
              <p className="text-xs text-muted-foreground">+12.5% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Yield Generated</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.totalYield}</div>
              <p className="text-xs text-muted-foreground">+8.2% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.activeUsers}</div>
              <p className="text-xs text-muted-foreground">+23.1% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.transactions}</div>
              <p className="text-xs text-muted-foreground">+15.7% from last month</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
