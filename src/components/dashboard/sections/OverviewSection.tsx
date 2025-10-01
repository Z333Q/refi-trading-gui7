import React, { useState } from 'react'
import { useAccount } from 'wagmi'
import { useTradingSimulation } from '@/hooks/useTradingSimulation'
import { LivePortfolioMetrics } from '../../trading/LivePortfolioMetrics'
import { LiveMarketData } from '../../trading/LiveMarketData'
import { EnhancedLiveTradesFeed } from '../../trading/EnhancedLiveTradesFeed'
import { LivePositions } from '../../trading/LivePositions'
import { DualProofGateComponent } from '../../trading/DualProofGate'
import { GamificationPanel } from '../../gamification/GamificationPanel'
import { EducationalTradeGenerator } from '../../education/EducationalTradeGenerator'
import { InteractiveEducationOverlay } from '../../education/InteractiveEducationOverlay'
import { ZkVarOnboardingFlow } from '../../onboarding/zkvar'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import { TrendingUp, TrendingDown, Activity, Shield, Wallet, Trophy } from 'lucide-react'
import { Lock } from '../../icons'
import type { DualProofGate, SafeModeStatus, GamificationProfile, UserBadge, UserQuest, XPEvent } from '@/types/trading'
import MockApiService from '@/services/mockApiService'

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

const mockSafeModeStatus: SafeModeStatus = {
  active: false
}

export function OverviewSection() {
  const { address, isConnected } = useAccount()
  const [showZkVarOnboarding, setShowZkVarOnboarding] = useState(false)
  const [totalXPEarned, setTotalXPEarned] = useState(0)
  const [showEducationOverlay, setShowEducationOverlay] = useState(false)
  const [educationType, setEducationType] = useState<'dual-proof' | 'risk-management' | 'strategy-basics' | 'gamification'>('dual-proof')
  const [gamificationProfile, setGamificationProfile] = useState<GamificationProfile | null>(null)
  const [recentXP, setRecentXP] = useState<XPEvent[]>([])
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  
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

  // Load gamification data on component mount
  useEffect(() => {
    const loadGamificationData = async () => {
      try {
        const [profile, xpEvents] = await Promise.all([
          MockApiService.getGamificationProfile(),
          MockApiService.getRecentXPEvents(5)
        ])
        setGamificationProfile(profile)
        setRecentXP(xpEvents)
      } catch (error) {
        console.error('Failed to load gamification data:', error)
      } finally {
        setIsLoadingProfile(false)
      }
    }

    loadGamificationData()
  }, [])

  const handleZkVarOnboardingComplete = (config: any) => {
    console.log('zk-VaR configuration completed:', config)
    setShowZkVarOnboarding(false)
  }

  const handleXPEarned = async (xp: number) => {
    setTotalXPEarned(prev => prev + xp)
    
    try {
      // Update XP through mock API
      const { profile, event } = await MockApiService.addXPEvent({
        userId: '1',
        source: 'quiz_pass',
        deltaXp: xp,
        meta: { source: 'educational_content' }
      })
      
      setGamificationProfile(profile)
      setRecentXP(prev => [event, ...prev.slice(0, 4)])
      console.log(`Earned ${xp} XP from educational content`)
    } catch (error) {
      console.error('Failed to update XP:', error)
    }
  }

  const handleShowEducation = (type: 'dual-proof' | 'risk-management' | 'strategy-basics' | 'gamification') => {
    setEducationType(type)
    setShowEducationOverlay(true)
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
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2 border-emerald-600 text-emerald-400 hover:bg-emerald-950/20"
                  onClick={() => handleShowEducation('strategy-basics')}
                >
                  Learn Security Basics
                </Button>
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
                  onClick={() => handleShowEducation('dual-proof')}
                >
                  Learn Dual-Proof
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
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2 border-purple-600 text-purple-400 hover:bg-purple-950/20"
                  onClick={() => handleShowEducation('gamification')}
                >
                  Learn XP System
                </Button>
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
            <div className="space-y-4">
              <EnhancedLiveTradesFeed trades={trades} onXPEarned={handleXPEarned} />
              <EducationalTradeGenerator onXPEarned={handleXPEarned} />
            </div>
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
          
          {/* XP Tracker */}
          {totalXPEarned > 0 && (
            <Card className="bg-gradient-to-r from-yellow-950/30 to-orange-950/30 border-yellow-800">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="font-bold text-yellow-400">Session XP</span>
                </div>
                <div className="text-2xl font-bold text-yellow-400">
                  +{totalXPEarned}
                </div>
                <p className="text-xs text-gray-400">
                  Earned from educational content
                </p>
              </CardContent>
            </Card>
          )}
          
          <div className="lg:block xl:hidden">
            {gamificationProfile && !isLoadingProfile && (
              <GamificationPanel
                profile={gamificationProfile}
                badges={[]}
                activeQuests={[]}
                recentXP={recentXP}
                onStartQuest={(questId) => console.log('Start quest:', questId)}
                onViewEducation={() => console.log('View education')}
              />
            )}
          </div>
        </div>
      </div>

      {/* Interactive Education Overlay */}
      <InteractiveEducationOverlay
        isVisible={showEducationOverlay}
        onClose={() => setShowEducationOverlay(false)}
        onXPEarned={handleXPEarned}
        educationType={educationType}
      />
    </div>
  )
}