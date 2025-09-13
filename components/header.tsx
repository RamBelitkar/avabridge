"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ConnectWallet } from "@/components/connect-wallet"
import { Menu, X, Zap } from "lucide-react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <Zap className="h-5 w-5 text-accent-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">AvaBridge</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#bridge"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Bridge
            </a>
            <a
              href="#yield"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Yield
            </a>
            <a
              href="#stats"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Statistics
            </a>
            <a
              href="#docs"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Docs
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ConnectWallet />
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <nav className="flex flex-col space-y-4">
              <a
                href="#bridge"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Bridge
              </a>
              <a
                href="#yield"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Yield
              </a>
              <a
                href="#stats"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Statistics
              </a>
              <a
                href="#docs"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Docs
              </a>
              <div className="pt-4 border-t border-border">
                <ConnectWallet />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
