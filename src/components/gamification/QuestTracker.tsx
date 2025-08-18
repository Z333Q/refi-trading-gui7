import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Progress } from '../ui/progress'
import { 
  Target, 
  CheckCircle, 
  Clock, 
  Award,
  ArrowRight,
  Trophy,
  Star
} from 'lucide-react'
import type { UserQuest, Quest, QuestStep } from '@/types/gamification'

interface QuestTrackerProps {
  activeQuests: UserQuest[]
  availableQuests: Quest[]
  onStartQuest: (questId: string) => void
  onContinueQuest: (questId: string) => void
}

export function QuestTracker({ 
  activeQuests, 
  availableQuests, 
  onStartQuest, 
  onContinueQuest 
}: QuestTrackerProps) {
  const getQuestProgress = (userQuest: UserQuest): number => {
    const completedSteps = Object.values(userQuest.progress).filter(Boolean).length
    const totalSteps = userQuest.quest.steps.length
    return totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0
  }

  const getStepIcon = (stepType: string, completed: boolean) => {
    if (completed) return <CheckCircle className="h-4 w-4 text-green-500" />
    
    switch (stepType) {
      case 'connect_broker':
        return <div className="h-4 w-4 rounded-full border-2 border-blue-500" />
      case 'complete_preview':
        return <div className="h-4 w-4 rounded-full border-2 border-purple-500" />
      case 'pass_quiz':
        return <div className="h-4 w-4 rounded-full border-2 border-green-500" />
      case 'tour_complete':
        return <div className="h-4 w-4 rounded-full border-2 border-orange-500" />
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Active Quests */}
      {activeQuests.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <Target className="h-5 w-5 text-blue-500" />
            <span>Active Quests</span>
          </h3>
          
          {activeQuests.map((userQuest) => {
            const progress = getQuestProgress(userQuest)
            
            return (
              <Card key={userQuest.questId} className="border-blue-800 bg-blue-950/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{userQuest.quest.name}</CardTitle>
                      <p className="text-sm text-gray-400 mt-1">
                        {userQuest.quest.description}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="flex items-center space-x-1">
                        <Star className="h-3 w-3" />
                        <span>{userQuest.quest.rewardXp} XP</span>
                      </Badge>
                      {userQuest.quest.rewardBadgeId && (
                        <Badge variant="success" className="flex items-center space-x-1">
                          <Award className="h-3 w-3" />
                          <span>Badge</span>
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  
                  {/* Quest Steps */}
                  <div className="space-y-3">
                    {userQuest.quest.steps.map((step, index) => {
                      const isCompleted = userQuest.progress[step.id] === true
                      
                      return (
                        <div
                          key={step.id}
                          className={`flex items-center space-x-3 p-3 rounded-lg ${
                            isCompleted 
                              ? 'bg-green-950/20 border border-green-800' 
                              : 'bg-gray-800 border border-gray-700'
                          }`}
                        >
                          {getStepIcon(step.stepType, isCompleted)}
                          <div className="flex-1">
                            <div className="font-medium capitalize">
                              {step.stepType.replace('_', ' ')}
                            </div>
                            {step.targetCount > 1 && (
                              <div className="text-xs text-gray-500">
                                Target: {step.targetCount}
                              </div>
                            )}
                          </div>
                          {isCompleted && (
                            <Badge variant="success" className="text-xs">
                              Complete
                            </Badge>
                          )}
                        </div>
                      )
                    })}
                  </div>
                  
                  <Button
                    onClick={() => onContinueQuest(userQuest.questId)}
                    className="w-full"
                    disabled={progress === 100}
                  >
                    {progress === 100 ? (
                      <>
                        <Trophy className="h-4 w-4 mr-2" />
                        Quest Complete!
                      </>
                    ) : (
                      <>
                        Continue Quest
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Available Quests */}
      {availableQuests.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <Clock className="h-5 w-5 text-gray-500" />
            <span>Available Quests</span>
          </h3>
          
          <div className="grid gap-4 md:grid-cols-2">
            {availableQuests.map((quest) => (
              <Card key={quest.id} className="hover:border-blue-700 transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{quest.name}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="flex items-center space-x-1 text-xs">
                        <Star className="h-3 w-3" />
                        <span>{quest.rewardXp}</span>
                      </Badge>
                      {quest.segment && (
                        <Badge variant="outline" className="text-xs capitalize">
                          {quest.segment.replace('_', ' ')}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-400">{quest.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      {quest.steps.length} steps
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onStartQuest(quest.id)}
                    >
                      Start Quest
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {activeQuests.length === 0 && availableQuests.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Target className="h-12 w-12 mx-auto mb-4 text-gray-500 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Quests Available</h3>
            <p className="text-gray-500">
              Complete your onboarding to unlock exciting quests and earn rewards!
            </p>
            <Button 
              className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
              onClick={() => console.log('Browse available quests')}
            >
              <Target className="h-4 w-4 mr-2" />
              Browse Available Quests
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}