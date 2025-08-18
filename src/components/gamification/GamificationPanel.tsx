import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Progress } from '../ui/progress'
import { 
  Trophy, 
  Star, 
  Target, 
  Flame, 
  BookOpen,
  Award,
  TrendingUp,
  Users
} from 'lucide-react'
import type { GamificationProfile, UserBadge, UserQuest, XPEvent } from '@/types/gamification'

interface GamificationPanelProps {
  profile: GamificationProfile
  badges: UserBadge[]
  activeQuests: UserQuest[]
  recentXP: XPEvent[]
  onStartQuest: (questId: string) => void
  onViewEducation: () => void
}

export function GamificationPanel({ 
  profile, 
  badges, 
  activeQuests, 
  recentXP,
  onStartQuest,
  onViewEducation
}: GamificationPanelProps) {
  const getXPForNextLevel = (currentLevel: number) => {
    const levels = [0, 500, 1500, 3000, 6000, 10000]
    return levels[currentLevel] || levels[levels.length - 1]
  }

  const getCurrentLevelXP = (currentLevel: number) => {
    const levels = [0, 500, 1500, 3000, 6000, 10000]
    return levels[currentLevel - 1] || 0
  }

  const nextLevelXP = getXPForNextLevel(profile.level)
  const currentLevelXP = getCurrentLevelXP(profile.level)
  const progressToNext = ((profile.xpTotal - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100

  return (
    <div className="space-y-4">
      {/* Profile Overview */}
      <Card className="bg-gradient-to-r from-emerald-950/20 to-blue-950/20 border-emerald-800">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-emerald-500" />
              <span>Level {profile.level} Trader</span>
            </div>
            <div className="flex items-center space-x-2">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="text-sm">{profile.streakDays} day streak</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>XP Progress</span>
              <span>{profile.xpTotal.toLocaleString()} / {nextLevelXP.toLocaleString()}</span>
            </div>
            <Progress value={progressToNext} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Soft Caps</span>
              <div className="font-mono">
                <div>Trade: ${profile.softCaps.perTrade.toLocaleString()}</div>
                <div>Symbol: ${profile.softCaps.perSymbol.toLocaleString()}</div>
              </div>
            </div>
            <div>
              <span className="text-gray-400">Recent XP</span>
              <div className="space-y-1">
                {recentXP.slice(0, 3).map((xp) => (
                  <div key={xp.id} className="flex justify-between">
                    <span className="capitalize">{xp.source.replace('_', ' ')}</span>
                    <span className="text-emerald-400">+{xp.deltaXp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Browse Quest Section */}
      <Card className="bg-gradient-to-r from-purple-950/30 to-blue-950/30 border-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 animate-pulse"></div>
        <CardHeader className="relative">
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-purple-400" />
            <span>Discover New Quests</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="relative space-y-4">
          <p className="text-sm text-gray-300">
            Unlock new challenges and earn exclusive rewards by exploring available quests
          </p>
          <Button 
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 relative overflow-hidden group"
            onClick={() => console.log('Browse quests clicked')}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Target className="h-4 w-4 mr-2 relative z-10" />
            <span className="relative z-10">Browse Quests</span>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"></div>
          </Button>
        </CardContent>
      </Card>

      {/* Active Quests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-blue-500" />
            <span>Active Quests</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {activeQuests.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No active quests</p>
              <Button variant="outline" size="sm" className="mt-2">
                Browse Quests
              </Button>
            </div>
          ) : (
            activeQuests.map((userQuest) => (
              <div key={userQuest.questId} className="p-3 rounded-lg border border-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{userQuest.quest.name}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {userQuest.quest.rewardXp} XP
                  </Badge>
                </div>
                <p className="text-sm text-gray-400 mb-2">{userQuest.quest.description}</p>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    {userQuest.quest.steps.length} steps
                  </div>
                  <Button variant="ghost" size="sm">
                    Continue
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Recent Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-yellow-500" />
            <span>Recent Badges</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {badges.length === 0 ? (
            <div className="space-y-4">
              {/* Sample badges to show what they would look like */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border border-yellow-700 bg-yellow-950/20 text-center hover:bg-yellow-950/30 transition-colors cursor-pointer group">
                  <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">🎯</div>
                  <div className="font-medium text-xs text-yellow-400">First Preview</div>
                  <div className="text-xs text-gray-500">Just earned!</div>
                </div>
                <div className="p-3 rounded-lg border border-blue-700 bg-blue-950/20 text-center hover:bg-blue-950/30 transition-colors cursor-pointer group">
                  <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">🔐</div>
                  <div className="font-medium text-xs text-blue-400">Proof Master</div>
                  <div className="text-xs text-gray-500">2 days ago</div>
                </div>
                <div className="p-3 rounded-lg border border-green-700 bg-green-950/20 text-center hover:bg-green-950/30 transition-colors cursor-pointer group">
                  <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">🛡️</div>
                  <div className="font-medium text-xs text-green-400">Safe Trader</div>
                  <div className="text-xs text-gray-500">1 week ago</div>
                </div>
                <div className="p-3 rounded-lg border border-purple-700 bg-purple-950/20 text-center hover:bg-purple-950/30 transition-colors cursor-pointer group">
                  <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">📚</div>
                  <div className="font-medium text-xs text-purple-400">Scholar</div>
                  <div className="text-xs text-gray-500">2 weeks ago</div>
                </div>
              </div>
              <div className="text-center">
                <Button variant="ghost" size="sm" className="text-yellow-400 hover:text-yellow-300">
                  <Award className="h-4 w-4 mr-2" />
                  View All Badges
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {badges.slice(0, 4).map((userBadge) => (
                <div key={userBadge.badgeId} className="p-3 rounded-lg border border-gray-800 text-center">
                  <div className="text-2xl mb-1">{userBadge.badge.icon || '🏆'}</div>
                  <div className="font-medium text-sm">{userBadge.badge.name}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(userBadge.awardedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" onClick={onViewEducation} className="flex items-center space-x-2">
          <BookOpen className="h-4 w-4" />
          <span>Education</span>
        </Button>
        <Button variant="outline" className="flex items-center space-x-2">
          <Users className="h-4 w-4" />
          <span>Leaderboard</span>
        </Button>
      </div>
    </div>
  )
}