import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains'

// SECURITY CRITICAL: Get WalletConnect Project ID from environment variables
// DO NOT use the demo project ID in production - it allows connections from any origin
// Get your own project ID from https://cloud.walletconnect.com/ and configure origin restrictions
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID

if (!projectId || projectId === 'your_walletconnect_project_id_here') {
  console.error('SECURITY WARNING: WalletConnect Project ID not configured properly')
  console.error('Please set VITE_WALLETCONNECT_PROJECT_ID in your .env file')
  console.error('Get your project ID from: https://cloud.walletconnect.com/')
}

// Fallback for development only - NEVER use in production
const fallbackProjectId = 'c4f79cc821944d9680842e34466bfbd'

export const config = getDefaultConfig({
  appName: 'ReFi.Trading Platform',
  projectId: projectId || fallbackProjectId,
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: false, // If your dApp uses server side rendering (SSR)
  // Add additional configuration to handle connection issues
  enableAnalytics: false, // Disable analytics to avoid allowlist issues
  enableOnramp: false, // Disable onramp features
})