import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Switch } from '../ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { 
  Trophy, 
  Crown, 
  Medal, 
  Users,
  TrendingUp,
  Star,
  Eye,
  EyeOff
} from 'lucide-react'

interface LeaderboardEntry {
  rank: number
  handle: string
  xp: number
  level: number
  badges: number
  streak: number
  isCurrentUser?: boolean
}

interface LeaderboardPanelProps {
  globalLeaderboard: LeaderboardEntry[]
  seasonLeaderboard: LeaderboardEntry[]
  userOptedIn: boolean
  userHandle?: string
  onOptInChange: (optedIn: boolean) => void
  onHandleChange: (handle: string) => void
}

export function LeaderboardPanel({
  globalLeaderboard,
  seasonLeaderboard,
  userOptedIn,
  userHandle,
  onOptInChange,
  onHandleChange
}: LeaderboardPanelProps) {
  const [activeTab, setActiveTab] = useState<'global' | 'season'>('global')
  const [editingHandle, setEditingHandle] = useState(false)
  const [newHandle, setNewHandle] = useState(userHandle || '')

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />
      default:
        return <div className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-500">
          {rank}
        </div>
    }
  }

  const handleSaveHandle = () => {
    if (newHandle.trim()) {
      onHandleChange(newHandle.trim())
      setEditingHandle(false)
    }
  }

  const currentLeaderboard = activeTab === 'global' ? globalLeaderboard : seasonLeaderboard

  return (
    <div className="space-y-6">
      {/* Opt-in Controls */}
      <Card className="border-purple-800 bg-purple-950/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-purple-500" />
            <span>Leaderboard Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Public Leaderboard</div>
              <div className="text-sm text-gray-400">
                Show your progress on public leaderboards
              </div>
            </div>
            <Switch
              checked={userOptedIn}
              onCheckedChange={onOptInChange}
            />
          </div>

          {userOptedIn && (
            <div className="space-y-3 pt-3 border-t border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Display Name</div>
                  <div className="text-sm text-gray-400">
                    Your pseudonymous handle for leaderboards
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingHandle(!editingHandle)}
                >
                  {editingHandle ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>

              {editingHandle ? (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newHandle}
                    onChange={(e) => setNewHandle(e.target.value)}
                    placeholder="Enter display name"
                    className="flex-1 px-3 py-2 border border-gray-700 rounded-lg bg-gray-900 text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    maxLength={20}
                  />
                  <Button size="sm" onClick={handleSaveHandle}>
                    Save
                  </Button>
                </div>
              ) : (
                <div className="text-sm font-mono bg-gray-800 px-3 py-2 rounded">
                  {userHandle || 'Anonymous'}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Leaderboard */}
      {userOptedIn ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span>Leaderboard</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'global' | 'season')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="global">All Time</TabsTrigger>
                <TabsTrigger value="season">This Season</TabsTrigger>
              </TabsList>
              
              <TabsContent value="global" className="space-y-3 mt-4">
                {currentLeaderboard.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No leaderboard data available</p>
                  </div>
                ) : (
                  currentLeaderboard.map((entry) => (
                    <div
                      key={entry.rank}
                      className={`flex items-center space-x-4 p-3 rounded-lg ${
                        entry.isCurrentUser
                          ? 'bg-purple-950/30 border border-purple-800'
                          : 'bg-gray-800 hover:bg-gray-750'
                      }`}
                    >
                      <div className="flex items-center justify-center w-8">
                        {getRankIcon(entry.rank)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{entry.handle}</span>
                          {entry.isCurrentUser && (
                            <Badge variant="secondary" className="text-xs">You</Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>Level {entry.level}</span>
                          <span>{entry.badges} badges</span>
                          <span>{entry.streak}d streak</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-bold text-purple-400">
                          {entry.xp.toLocaleString()} XP
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>
              
              <TabsContent value="season" className="space-y-3 mt-4">
                {currentLeaderboard.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Season leaderboard coming soon</p>
                  </div>
                ) : (
                  currentLeaderboard.map((entry) => (
                    <div
                      key={entry.rank}
                      className={`flex items-center space-x-4 p-3 rounded-lg ${
                        entry.isCurrentUser
                          ? 'bg-purple-950/30 border border-purple-800'
                          : 'bg-gray-800 hover:bg-gray-750'
                      }`}
                    >
                      <div className="flex items-center justify-center w-8">
                        {getRankIcon(entry.rank)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{entry.handle}</span>
                          {entry.isCurrentUser && (
                            <Badge variant="secondary" className="text-xs">You</Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>Level {entry.level}</span>
                          <span>{entry.badges} badges</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-bold text-blue-400">
                          {entry.xp.toLocaleString()} XP
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-gray-700">
          <CardContent className="p-8 text-center">
            <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-500 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Join the Leaderboard</h3>
            <p className="text-gray-500 mb-4">
              Opt in to public leaderboards to compete with other traders and showcase your progress
            </p>
            <Button onClick={() => onOptInChange(true)}>
              <TrendingUp className="h-4 w-4 mr-2" />
              Join Leaderboard
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}