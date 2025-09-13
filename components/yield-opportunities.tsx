import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, Shield, Zap, ExternalLink } from "lucide-react"

export function YieldOpportunities() {
  const opportunities = [
    {
      protocol: "Trader Joe",
      apy: "12.5%",
      tvl: "$2.4M",
      risk: "Low",
      description: "Automated market maker with concentrated liquidity",
      icon: TrendingUp,
      color: "bg-chart-1",
    },
    {
      protocol: "Benqi",
      apy: "8.7%",
      tvl: "$1.8M",
      risk: "Low",
      description: "Lending and borrowing protocol on Avalanche",
      icon: Shield,
      color: "bg-chart-2",
    },
    {
      protocol: "Aave",
      apy: "6.2%",
      tvl: "$3.1M",
      risk: "Very Low",
      description: "Decentralized lending protocol with stable yields",
      icon: Zap,
      color: "bg-chart-3",
    },
  ]

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Very Low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <section id="yield" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Available Yield Opportunities</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Access the best DeFi protocols on Avalanche C-Chain. Your bridged liquidity automatically flows to these
            high-yield opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map((opportunity, index) => {
            const IconComponent = opportunity.icon
            return (
              <Card key={index} className="relative overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${opportunity.color}`}>
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{opportunity.protocol}</CardTitle>
                        <CardDescription className="text-sm">TVL: {opportunity.tvl}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-lg font-bold">
                      {opportunity.apy}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{opportunity.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium">Risk Level:</span>
                    <Badge className={getRiskColor(opportunity.risk)}>{opportunity.risk}</Badge>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center space-x-2 bg-transparent"
                  >
                    <span>Learn More</span>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-2">How It Works</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center mx-auto mb-2 font-bold">
                    1
                  </div>
                  <p className="text-muted-foreground">Bridge your subnet tokens to C-Chain</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center mx-auto mb-2 font-bold">
                    2
                  </div>
                  <p className="text-muted-foreground">Liquidity automatically flows to best yield opportunities</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center mx-auto mb-2 font-bold">
                    3
                  </div>
                  <p className="text-muted-foreground">Earn yield and withdraw anytime</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
