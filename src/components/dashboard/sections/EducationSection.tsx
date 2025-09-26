import React, { useState } from 'react'
import { EducationModuleComponent } from '../../education/EducationModule'
import { EducationalTradeGenerator } from '../../education/EducationalTradeGenerator'
import { InteractiveEducationOverlay } from '../../education/InteractiveEducationOverlay'
import { TradingConceptTooltip, useTradingConceptTooltip, ConceptLink } from '../../education/TradingConceptTooltip'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Button } from '../../ui/button'
import { Badge } from '../../ui/badge'
import { Progress } from '../../ui/progress'
import { 
  BookOpen, 
  Award, 
  TrendingUp, 
  Users,
  Target,
  CheckCircle,
  Clock,
  Brain,
  Lightbulb,
  Star,
  Zap,
  HelpCircle,
  Play
} from 'lucide-react'
import type { EducationModule, QuizAttempt } from '@/types/gamification'

// Mock education modules
const mockEducationModules: EducationModule[] = [
  {
    id: '1',
    code: 'market_basics',
    title: 'Market Basics & Risk Management',
    description: 'Learn fundamental concepts of trading, order types, and VaR basics',
    estimatedMinutes: 45,
    orderWeight: 1,
    passingScore: 70,
    lessons: [
      {
        id: '1',
        moduleId: '1',
        title: 'Introduction to Trading',
        mediaUrl: 'https://example.com/video1',
        ordinal: 1
      },
      {
        id: '2',
        moduleId: '1',
        title: 'Order Types & Time in Force',
        contentMd: '# Order Types\n\nMarket orders execute immediately...',
        ordinal: 2
      },
      {
        id: '3',
        moduleId: '1',
        title: 'Understanding VaR (Value at Risk)',
        ordinal: 3
      }
    ],
    quizzes: [
      {
        id: '1',
        moduleId: '1',
        timeLimitSec: 600,
        attemptsAllowed: 3,
        questions: [
          {
            id: '1',
            quizId: '1',
            kind: 'mcq',
            stemMd: 'What does VaR measure?',
            choices: {
              a: 'Potential loss over a time period',
              b: 'Expected return',
              c: 'Trading volume',
              d: 'Market volatility'
            },
            answerKey: { correct: 'a' },
            explanationMd: 'VaR measures the potential loss...'
          }
        ]
      }
    ]
  },
  {
    id: '2',
    code: 'proofs_and_policy',
    title: 'zk-Proofs & ACE Policy',
    description: 'Understanding dual-proof gates, Base L2 anchors, and compliance guardrails',
    estimatedMinutes: 30,
    orderWeight: 2,
    passingScore: 80,
    lessons: [
      {
        id: '4',
        moduleId: '2',
        title: 'Zero-Knowledge Proofs in Trading',
        ordinal: 1
      },
      {
        id: '5',
        moduleId: '2',
        title: 'ACE Policy Framework',
        ordinal: 2
      },
      {
        id: '6',
        moduleId: '2',
        title: 'Base L2 Anchoring',
        ordinal: 3
      }
    ],
    quizzes: [
      {
        id: '2',
        moduleId: '2',
        timeLimitSec: 900,
        questions: []
      }
    ]
  },
  {
    id: '3',
    code: 'strategy_ops',
    title: 'Strategy Operations & Safe Mode',
    description: 'Learn about RL agents, uncertainty thresholds, and risk reduction playbooks',
    estimatedMinutes: 60,
    orderWeight: 3,
    passingScore: 75,
    lessons: [
      {
        id: '7',
        moduleId: '3',
        title: 'Reinforcement Learning Agents',
        ordinal: 1
      },
      {
        id: '8',
        moduleId: '3',
        title: 'Safe Mode & Risk Reduction',
        ordinal: 2
      }
    ],
    quizzes: [
      {
        id: '3',
        moduleId: '3',
        questions: []
      }
    ]
  }
]

// Mock user progress
const mockUserProgress = {
  '1': {
    lessonsCompleted: 2,
    quizAttempts: [
      {
        id: '1',
        quizId: '1',
        userId: '1',
        scorePct: 85,
        passed: true,
        answers: {},
        attemptedAt: new Date().toISOString()
      }
    ],
    certificateEarned: false
  },
  '2': {
    lessonsCompleted: 0,
    quizAttempts: [],
    certificateEarned: false
  }
}

export function EducationSection() {
  const { t } = useTranslation()
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [showEducationOverlay, setShowEducationOverlay] = useState(false)
  const [educationType, setEducationType] = useState<'dual-proof' | 'risk-management' | 'strategy-basics' | 'gamification'>('dual-proof')
  const [totalXPEarned, setTotalXPEarned] = useState(0)
  const [activeTab, setActiveTab] = useState<'modules' | 'interactive' | 'concepts'>('modules')
  
  const {
    activeTooltip,
    tooltipPosition,
    showTooltip,
    hideTooltip,
    getConcept,
    tradingConcepts
  } = useTradingConceptTooltip()

  const handleStartLesson = (lessonId: string) => {
    console.log('Starting lesson:', lessonId)
    // In real implementation, this would navigate to lesson content
  }

  const handleStartQuiz = (quizId: string) => {
    console.log('Starting quiz:', quizId)
    // In real implementation, this would open quiz interface
  }

  const handleXPEarned = (xp: number) => {
    setTotalXPEarned(prev => prev + xp)
    console.log(`Earned ${xp} XP from educational content`)
  }

  const handleShowEducation = (type: 'dual-proof' | 'risk-management' | 'strategy-basics' | 'gamification') => {
    setEducationType(type)
    setShowEducationOverlay(true)
  }

  const totalModules = mockEducationModules.length
  const completedModules = Object.values(mockUserProgress).filter(p => p.certificateEarned).length
  const overallProgress = (completedModules / totalModules) * 100

  if (selectedModule) {
    const module = mockEducationModules.find(m => m.id === selectedModule)
    if (module) {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">{module.title}</h2>
              <p className="text-gray-600 dark:text-gray-400">{module.description}</p>
            </div>
            <Button variant="outline" onClick={() => setSelectedModule(null)}>
              ← Back to Modules
            </Button>
          </div>
          
          <EducationModuleComponent
            module={module}
            userProgress={mockUserProgress[module.id]}
            onStartLesson={handleStartLesson}
            onStartQuiz={handleStartQuiz}
          />
        </div>
      )
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">{t('education.title')}</h2>
        <p className="text-gray-600 dark:text-gray-400">
          {t('education.subtitle')}
        </p>
      </div>

      {/* Progress Overview */}
      <Card className="bg-gradient-to-r from-blue-950/20 to-purple-950/20 border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            <span>{t('education.progress')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>{t('education.completion')}</span>
              <span>{completedModules} / {totalModules} modules</span>
            </div>
            <Progress value={overallProgress} className="h-3" />
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-400">{completedModules}</div>
              <div className="text-xs text-gray-500">{t('education.certificates')}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">
                {Object.values(mockUserProgress).reduce((sum, p) => sum + p.lessonsCompleted, 0)}
              </div>
              <div className="text-xs text-gray-500">{t('education.lessons')}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">
                {Object.values(mockUserProgress).reduce((sum, p) => sum + p.quizAttempts.length, 0)}
              </div>
              <div className="text-xs text-gray-500">{t('education.xpPoints')}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Education Modules */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {mockEducationModules.map((module) => {
          const userProgress = mockUserProgress[module.id]
          const completionPercentage = userProgress ? 
            (userProgress.lessonsCompleted / module.lessons.length) * 100 : 0
          const hasCertificate = userProgress?.certificateEarned || false
          const hasPassedQuiz = userProgress?.quizAttempts.some(a => a.passed) || false

          return (
            <Card 
              key={module.id}
              className="cursor-pointer hover:border-blue-700 transition-colors"
              onClick={() => setSelectedModule(module.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="h-6 w-6 text-blue-500" />
                    <div>
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {module.lessons.length} lessons
                        </Badge>
                        {module.estimatedMinutes && (
                          <Badge variant="secondary" className="flex items-center space-x-1 text-xs">
                            <Clock className="h-3 w-3" />
                            <span>{module.estimatedMinutes}m</span>
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  {hasCertificate && (
                    <Award className="h-5 w-5 text-yellow-500" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-400">{module.description}</p>
                
                {userProgress && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{Math.round(completionPercentage)}%</span>
                    </div>
                    <Progress value={completionPercentage} className="h-2" />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {hasPassedQuiz && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    <span className="text-sm text-gray-500">
                      Pass: {module.passingScore}%
                    </span>
                  </div>
                  <Button variant="ghost" size="sm">
                    {completionPercentage === 0 ? 'Start' : 'Continue'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Learning Path */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-emerald-500" />
            <span>Recommended Learning Path</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-emerald-950/20 border border-emerald-800">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-600 text-white text-sm font-bold">
                1
              </div>
              <div>
                <div className="font-medium">Market Basics & Risk Management</div>
                <div className="text-sm text-gray-400">Learn VaR calculations, order types, and position sizing fundamentals</div>
              </div>
              <Badge variant="success" className="ml-auto text-xs">+50 XP</Badge>
            </div>
            
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-blue-950/20 border border-blue-800">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold">
                2
              </div>
              <div>
                <div className="font-medium">Zero-Knowledge Proofs & ACE Policy</div>
                <div className="text-sm text-gray-400">Master cryptographic verification and regulatory compliance</div>
              </div>
              <Badge variant="secondary" className="ml-auto text-xs">+75 XP</Badge>
            </div>
            
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-purple-950/20 border border-purple-800">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white text-sm font-bold">
                3
              </div>
              <div>
                <div className="font-medium">Reinforcement Learning Strategies</div>
                <div className="text-sm text-gray-400">Deploy PPO, TD3, and RVI-Q agents with advanced risk controls</div>
              </div>
              <Badge variant="warning" className="ml-auto text-xs">+100 XP</Badge>
            </div>
          </div>
        </CardContent>

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
      </Card>
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