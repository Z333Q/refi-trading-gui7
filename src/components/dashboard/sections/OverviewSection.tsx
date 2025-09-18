import React, { useState } from 'react'
import { useAccount } from 'wagmi'
import { useTradingSimulation } from '@/hooks/useTradingSimulation'
import { LivePortfolioMetrics } from '../../trading/LivePortfolioMetrics'
import { LiveMarketData } from '../../trading/LiveMarketData'
import { LiveTradesFeed } from '../../trading/LiveTradesFeed'
import { LivePositions } from '../../trading/LivePositions'
import { DualProofGateComponent } from '../../trading/DualProofGate'
import { GamificationPanel } from '../../gamification/GamificationPanel'
import { ZkVarOnboardingFlow } from '../../onboarding/zkvar'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import { TrendingUp, TrendingDown, Activity, Shield, Wallet, Trophy } from 'lucide-react'
import { Lock } from '../../icons'
import type { DualProofGate, SafeModeStatus, GamificationProfile, UserBadge, UserQuest, XPEvent } from '@/types/trading'

const quickStats = [
  {
    title: 'Active Strategies',
    value: '3',
    change: 'PPO, TD3, RVI-Q',
    icon: Activity,
    positive: true
  },
  {
    title: 'Today\'s P&L',
    value: '+$2,856.12',
    change: '+1.87%',
    icon: TrendingUp,
    positive: true
  },
  {
    title: 'Risk Score',
    value: '2.1/10',
    change: 'Low Risk',
    icon: Shield,
    positive: true
  }
]

const recentActivity = [
  {
    id: 1,
    type: 'trade',
    message: 'PPO Momentum executed BUY AAPL 100 @ $178.45',
    time: '2 min ago',
    status: 'success'
  },
  {
    id: 2,
    type: 'risk',
    message: 'zk-VaR proof generated for TSLA position',
    time: '5 min ago',
    status: 'info'
  },
  {
    id: 3,
    type: 'compliance',
    message: 'ACE policy check passed for NVDA order',
    time: '8 min ago',
    status: 'success'
  }
]

// Mock data for gamification
const mockGamificationProfile: GamificationProfile = {
  userId: '1',
  level: 3,
  xpTotal: 2450,
  streakDays: 7,
  lastActiveAt: new Date().toISOString(),
  leaderboardOptIn: true,
  handle: 'ProTrader',
  softCaps: {
    perTrade: 10000,
    perSymbol: 30000
  }
}

const mockRecentXP: XPEvent[] = [
  {
    id: '1',
    userId: '1',
    source: 'preview',
    deltaXp: 5,
    meta: {},
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    userId: '1',
    source: 'risk_ok',
    deltaXp: 3,
    meta: {},
    createdAt: new Date().toISOString()
  }
]

const mockSafeModeStatus: SafeModeStatus = {
  active: false
}

export function OverviewSection() {
  const { address, isConnected } = useAccount()
  const [showZkVarOnboarding, setShowZkVarOnboarding] = useState(false)
  const {
    trades,
    positions,
    marketData,
    portfolioMetrics,
    dualProofGate,
    safeModeStatus,
    isGeneratingProof,
    latencyMetrics,
    generateDualProof,
    connectionStatus,
    polygonError,
    isInitialized
  } = useTradingSimulation()

  const handleZkVarOnboardingComplete = (config: any) => {
    console.log('zk-VaR configuration completed:', config)
    setShowZkVarOnboarding(false)
  }

  if (showZkVarOnboarding) {
    return (
      <ZkVarOnboardingFlow 
        onComplete={handleZkVarOnboardingComplete}
        onBack={() => setShowZkVarOnboarding(false)}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">Trading Overview</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Experience non-custodial reinforcement learning trading with mathematical risk proofs, regulatory compliance, and gamified skill development
          </p>
        </div>
        {isConnected && address && (
          <div className="flex items-center space-x-2 bg-emerald-950/20 border border-emerald-800 rounded-lg px-3 py-2">
            <Wallet className="h-4 w-4 text-emerald-500" />
            <span className="text-sm text-emerald-400 font-mono">
              {address.slice(0, 6)}...{address.slice(-4)}
            </span>
          </div>
        )}
      </div>

      {/* Connection Warning */}
      {!isConnected && (
        <Card className="border-amber-800 bg-amber-950/20">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <Wallet className="h-6 w-6 text-amber-500 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-amber-400">Wallet Not Connected</h3>
                <p className="text-sm text-amber-300/80 mt-1">
                  Connect your wallet to access trading features and view your portfolio
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Information Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-emerald-800 bg-emerald-950/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Lock className="h-8 w-8 text-emerald-500" />
              <div>
                <h3 className="font-semibold text-emerald-400">Non-Custodial Trading</h3>
                <p className="text-sm text-gray-300">
                  Your private keys remain secure. We never hold your funds - trade with complete ownership and control.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-800 bg-blue-950/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-500" />
              <div>
                <h3 className="font-semibold text-blue-400">Dual-Proof Gate</h3>
                <p className="text-sm text-gray-300">
                  Every trade verified by zk-VaR proofs and ACE policy compliance before execution.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2 border-blue-600 text-blue-400 hover:bg-blue-950/20"
                  onClick={() => setShowZkVarOnboarding(true)}
                >
                  Configure zk-VaR
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-800 bg-purple-950/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Trophy className="h-8 w-8 text-purple-500" />
              <div>
                <h3 className="font-semibold text-purple-400">Gamified Learning</h3>
                <p className="text-sm text-gray-300">
                  Earn XP, unlock badges, complete quests, and level up your trading expertise.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 xl:grid-cols-4">
        <div className="xl:col-span-3 space-y-6">
          {/* Live Portfolio Metrics */}
          <LivePortfolioMetrics metrics={portfolioMetrics} latencyMetrics={latencyMetrics} />

          {/* Dual-Proof Gate */}
          <DualProofGateComponent
            proofGate={dualProofGate}
            safeModeStatus={safeModeStatus}
            isGenerating={isGeneratingProof}
            onGenerateProof={generateDualProof}
          />

          {/* Trading Data Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            <LiveTradesFeed trades={trades} />
            <LivePositions positions={positions} />
          </div>
        </div>

        {/* Gamification Sidebar */}
        <div className="xl:col-span-1 space-y-6">
          <LiveMarketData 
            marketData={marketData} 
            connectionStatus={connectionStatus}
            error={polygonError}
          />
          <div className="lg:block xl:hidden">
            <GamificationPanel
              profile={mockGamificationProfile}
              badges={[]}
              activeQuests={[]}
              recentXP={mockRecentXP}
              onStartQuest={(questId) => console.log('Start quest:', questId)}
              onViewEducation={() => console.log('View education')}
            />
          </div>
        </div>
      </div>
    </div>
  )
}