import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { StatsSection } from "@/components/stats-section"
import { BridgeInterface } from "@/components/bridge-interface"
import { YieldOpportunities } from "@/components/yield-opportunities"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <StatsSection />
        <BridgeInterface />
        <YieldOpportunities />
      </main>
      <Footer />
    </div>
  )
}
