import { Button } from "@/components/ui/button"
import { ArrowRight, Zap, Shield, TrendingUp } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl text-balance">
            Bridge Your Subnet Liquidity to <span className="text-accent">C-Chain DeFi</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground text-pretty max-w-2xl mx-auto">
            AvaBridge connects isolated Avalanche subnets to high-yield DeFi opportunities on the C-Chain. Access
            liquidity and earn returns with a single transaction.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" className="flex items-center space-x-2">
              <span>Start Bridging</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg">
              View Documentation
            </Button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="relative rounded-2xl border border-border bg-card p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
              <Zap className="h-6 w-6 text-accent-foreground" />
            </div>
            <h3 className="mt-6 text-lg font-semibold text-card-foreground">Single Transaction</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Bridge liquidity and access yield opportunities with just one transaction. No complex multi-step
              processes.
            </p>
          </div>

          <div className="relative rounded-2xl border border-border bg-card p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
              <Shield className="h-6 w-6 text-accent-foreground" />
            </div>
            <h3 className="mt-6 text-lg font-semibold text-card-foreground">Secure & Trustless</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Built on Avalanche's Interchain Messaging protocol. Your funds remain secure throughout the bridging
              process.
            </p>
          </div>

          <div className="relative rounded-2xl border border-border bg-card p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
              <TrendingUp className="h-6 w-6 text-accent-foreground" />
            </div>
            <h3 className="mt-6 text-lg font-semibold text-card-foreground">High Yield Opportunities</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Access the best DeFi protocols on C-Chain. Earn competitive yields on your subnet assets.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
