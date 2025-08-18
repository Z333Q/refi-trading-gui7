import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains'

// Get WalletConnect Project ID from environment variables
// Using a public demo project ID that allows all origins
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'c4f79cc821944d9680842e34466bfbd'

export const config = getDefaultConfig({
  appName: 'ReFi.Trading Platform',
  projectId,
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: false, // If your dApp uses server side rendering (SSR)
  // Add additional configuration to handle connection issues
  enableAnalytics: false, // Disable analytics to avoid allowlist issues
  enableOnramp: false, // Disable onramp features
})