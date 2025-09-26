import React, { useState } from 'react'
import { GamificationPanel } from '../../gamification/GamificationPanel'
import { QuestTracker } from '../../gamification/QuestTracker'
import { LeaderboardPanel } from '../../gamification/LeaderboardPanel'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs'
import { 
  Trophy, 
  Target, 
  Users, 
  Award,
  TrendingUp,
  Star,
  Flame,
  BookOpen
} from 'lucide-react'
import type { 
  GamificationProfile, 
  UserBadge, 
  UserQuest, 
  XPEvent,
  Quest
} from '@/types/gamification'

// Mock data - in real implementation, this would come from API
const mockProfile: GamificationProfile = {
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
    meta: { symbol: 'AAPL' },
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    userId: '1',
    source: 'risk_ok',
    deltaXp: 3,
    meta: {},
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    userId: '1',
    source: 'quiz_pass',
    deltaXp: 20,
    meta: { module: 'market_basics' },
    createdAt: new Date().toISOString()
  }
]

const mockBadges: UserBadge[] = [
  {
    userId: '1',
    badgeId: '1',
    awardedAt: new Date().toISOString(),
    badge: {
      id: '1',
      code: 'ONBOARD_COMPLETE',
      name: 'Welcome Aboard',
      description: 'Completed onboarding flow',
      icon: '🎯',
      criteria: {},
      active: true
    }
  }
]

const mockActiveQuests: UserQuest[] = [
  {
    userId: '1',
    questId: '1',
    status: 'active',
    progress: { 'step1': true, 'step2': false },
    startedAt: new Date().toISOString(),
    quest: {
      id: '1',
      code: 'FIRST_15_MIN',
      name: 'First 15 Minutes',
      description: 'Get started with ReFi.Trading',
      rewardXp: 60,
      steps: [
        {
          id: 'step1',
          questId: '1',
          ordinal: 1,
          stepType: 'connect_broker',
          targetCount: 1,
          params: {}
        },
        {
          id: 'step2',
          questId: '1',
          ordinal: 2,
          stepType: 'complete_preview',
          targetCount: 1,
          params: {}
        }
      ]
    }
  }
]

const mockAvailableQuests: Quest[] = [
  {
    id: '2',
    code: 'RISK_MASTER',
    name: 'Risk Management Master',
    description: 'Demonstrate mastery of risk controls',
    segment: 'prosumer',
    rewardXp: 100,
    steps: []
  }
]

const mockLeaderboard = [
  { rank: 1, handle: 'RiskMaster', xp: 5420, level: 4, badges: 8, streak: 15 },
  { rank: 2, handle: 'AlgoTrader', xp: 4890, level: 4, badges: 6, streak: 12 },
  { rank: 3, handle: 'ProTrader', xp: 2450, level: 3, badges: 3, streak: 7, isCurrentUser: true },
  { rank: 4, handle: 'SafeTrader', xp: 2100, level: 3, badges: 4, streak: 5 },
  { rank: 5, handle: 'NewbieWin', xp: 1800, level: 2, badges: 2, streak: 3 }
]

export function GamificationSection() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('overview')
  const [profile, setProfile] = useState(mockProfile)

  const handleStartQuest = (questId: string) => {
    console.log('Starting quest:', questId)
    // In real implementation, this would call API to start quest
  }

  const handleContinueQuest = (questId: string) => {
    console.log('Continuing quest:', questId)
    // In real implementation, this would navigate to quest step
  }

  const handleOptInChange = (optedIn: boolean) => {
    setProfile(prev => ({ ...prev, leaderboardOptIn: optedIn }))
    // In real implementation, this would call API to update opt-in status
  }

  const handleHandleChange = (handle: string) => {
    setProfile(prev => ({ ...prev, handle }))
    // In real implementation, this would call API to update handle
  }

  const handleViewEducation = () => {
    console.log('Navigate to education')
    // In real implementation, this would navigate to education section
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">{t('gamification.title')}</h2>
        <p className="text-gray-600 dark:text-gray-400">
          {t('gamification.subtitle')}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <Trophy className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="quests" className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">{t('gamification.quests')}</span>
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">{t('gamification.leaderboard')}</span>
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center space-x-2">
            <Award className="h-4 w-4" />
            <span className="hidden sm:inline">{t('gamification.achievements')}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <GamificationPanel
                profile={profile}
                badges={mockBadges}
                activeQuests={mockActiveQuests}
                recentXP={mockRecentXP}
                onStartQuest={handleStartQuest}
                onViewEducation={handleViewEducation}
              />
            </div>
            <div className="lg:col-span-1">
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                    <span>Your Progress</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-950/20">
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm">Experience Points</span>
                    </div>
                    <span className="font-bold text-emerald-400">
                      {profile.xpTotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-orange-950/20">
                    <div className="flex items-center space-x-2">
                      <Flame className="h-4 w-4 text-orange-500" />
                      <span className="text-sm">Trading Streak</span>
                    </div>
                    <span className="font-bold text-orange-400">
                      {profile.streakDays} days
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-purple-950/20">
                    <div className="flex items-center space-x-2">
                      <Award className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">Achievement Badges</span>
                    </div>
                    <span className="font-bold text-purple-400">
                      {mockBadges.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-blue-950/20">
                    <div className="flex items-center space-x-2">
                      <Target className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Learning Quests</span>
                    </div>
                    <span className="font-bold text-blue-400">
                      {mockActiveQuests.length}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-gray-800">
                    <div className="text-center">
                      <div className="text-lg font-bold text-yellow-400 mb-1">Level {profile.level}</div>
                      <div className="text-xs text-gray-400">Intermediate Trader</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {profile.xpTotal >= 3000 ? 'Ready for Level 4!' : `${3000 - profile.xpTotal} XP to next level`}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Trading Concept Tooltip */}
        {activeTooltip && (
          <TradingConceptTooltip
            concept={getConcept(activeTooltip)!}
            isVisible={true}
            onClose={hideTooltip}
            onLearnMore={(conceptId) => {
              console.log('Learn more about:', conceptId)
              hideTooltip()
            }}
            onClaimXP={handleXPEarned}
            position={tooltipPosition}
          />
        )}

        {/* Interactive Education Overlay */}
        <InteractiveEducationOverlay
          isVisible={showEducationOverlay}
          onClose={() => setShowEducationOverlay(false)}
          onXPEarned={handleXPEarned}
          educationType={educationType}
        />

        <TabsContent value="quests">
          <QuestTracker
            activeQuests={mockActiveQuests}
            availableQuests={mockAvailableQuests}
            onStartQuest={handleStartQuest}
            onContinueQuest={handleContinueQuest}
          />
        </TabsContent>

        <TabsContent value="leaderboard">
          <LeaderboardPanel
            globalLeaderboard={mockLeaderboard}
            seasonLeaderboard={[]}
            userOptedIn={profile.leaderboardOptIn}
            userHandle={profile.handle}
            onOptInChange={handleOptInChange}
            onHandleChange={handleHandleChange}
          />
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          {/* Browse Quest Section for Achievements Tab */}
          <Card className="bg-gradient-to-r from-purple-950/30 to-blue-950/30 border-purple-700 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 animate-pulse"></div>
            <CardContent className="p-6 text-center relative">
              <Target className="h-12 w-12 mx-auto mb-4 text-purple-400" />
              <h3 className="text-lg font-medium mb-2 text-purple-300">Discover New Challenges</h3>
              <p className="text-gray-400 mb-4">
                Unlock exclusive achievements by completing trading challenges, mastering new concepts, and demonstrating your skills
              </p>
              <Button 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 relative overflow-hidden group"
                onClick={() => setActiveTab('quests')}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Target className="h-4 w-4 mr-2 relative z-10" />
                <span className="relative z-10">Start Quest (+25 XP)</span>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"></div>
              </Button>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockBadges.map((userBadge) => (
              <Card key={userBadge.badgeId} className="border-yellow-800 bg-yellow-950/20">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">{userBadge.badge.icon}</div>
                  <h3 className="font-bold text-yellow-400 mb-2">
                    {userBadge.badge.name}
                  </h3>
                  <p className="text-sm text-gray-400 mb-3">
                    {userBadge.badge.description}
                  </p>
                  <Badge variant="success" className="text-xs">
                    Earned {new Date(userBadge.awardedAt).toLocaleDateString()}
                  </Badge>
                </CardContent>
              </Card>
            ))}
            
            {/* Placeholder for locked badges */}
            <Card className="border-gray-700 opacity-60 hover:opacity-80 transition-opacity cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-3 opacity-50 group-hover:scale-110 transition-transform">🔒</div>
                <h3 className="font-bold text-gray-500 mb-2">Risk Guardian</h3>
                <p className="text-sm text-gray-500 mb-3">
                  Successfully execute 10 risk-reducing trades during market volatility
                </p>
                <Badge variant="secondary" className="text-xs">
                  0 / 10 Progress • +50 XP
                </Badge>
              </CardContent>
            </Card>
            
            {/* Additional locked badges for demonstration */}
            <Card className="border-gray-700 opacity-60 hover:opacity-80 transition-opacity cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-3 opacity-50 group-hover:scale-110 transition-transform">🔥</div>
                <h3 className="font-bold text-gray-500 mb-2">Consistency Master</h3>
                <p className="text-sm text-gray-500 mb-3">
                  Maintain active trading for 30 consecutive days
                </p>
                <Badge variant="secondary" className="text-xs">
                  7 / 30 Days • +100 XP
                </Badge>
              </CardContent>
            </Card>
            
            <Card className="border-gray-700 opacity-60 hover:opacity-80 transition-opacity cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-3 opacity-50 group-hover:scale-110 transition-transform">🎓</div>
                <h3 className="font-bold text-gray-500 mb-2">Knowledge Seeker</h3>
                <p className="text-sm text-gray-500 mb-3">
                  Complete all education modules with certification
                </p>
                <Badge variant="secondary" className="text-xs">
                  1 / 3 Modules • +200 XP
                </Badge>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}