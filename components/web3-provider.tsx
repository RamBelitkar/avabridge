"use client"

import type React from "react"

import { createConfig, WagmiProvider } from "wagmi"
import { avalanche, avalancheFuji } from "wagmi/chains"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { http } from "viem"
import { injected } from "wagmi/connectors"

const config = createConfig({
  chains: [avalanche, avalancheFuji],
  connectors: [injected()],
  transports: {
    [avalanche.id]: http(),
    [avalancheFuji.id]: http(),
  },
})

const queryClient = new QueryClient()

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
