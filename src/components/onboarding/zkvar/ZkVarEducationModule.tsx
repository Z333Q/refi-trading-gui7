import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Button } from '../../ui/button'
import { Badge } from '../../ui/badge'
import { Progress } from '../../ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs'
import { 
  BookOpen, 
  Calculator, 
  Shield, 
  Eye, 
  EyeOff,
  Lock,
  Unlock,
  BarChart3,
  TrendingUp,
  Brain,
  CheckCircle,
  PlayCircle,
  Award,
  Lightbulb,
  HelpCircle,
  ArrowRight,
  Target,
  Zap
} from 'lucide-react'

interface EducationModuleProps {
  onComplete: (score: number) => void
  onSkip: () => void
}

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  category: 'zk-proofs' | 'var' | 'agents'
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 'zk-1',
    question: 'What is the main benefit of zero-knowledge proofs in trading?',
    options: [
      'They make trades execute faster',
      'They prove risk compliance without revealing portfolio details',
      'They guarantee profitable trades',
      'They reduce trading fees'
    ],
    correctAnswer: 1,
    explanation: 'Zero-knowledge proofs allow you to prove your risk is within acceptable limits without revealing your actual positions or trading strategies.',
    category: 'zk-proofs'
  },
  {
    id: 'var-1',
    question: 'What does a 95% VaR of $10,000 over 1 day mean?',
    options: [
      'You will definitely lose $10,000 tomorrow',
      'There is a 5% chance of losing more than $10,000 tomorrow',
      'Your average daily loss is $10,000',
      'You can only trade $10,000 per day'
    ],
    correctAnswer: 1,
    explanation: 'VaR represents the maximum expected loss at a given confidence level. 95% VaR means there\'s only a 5% chance of exceeding that loss amount.',
    category: 'var'
  },
  {
    id: 'agents-1',
    question: 'Which agent type is most suitable for a conservative investor?',
    options: [
      'High-risk agents with 10% VaR',
      'Medium-risk agents with 5% VaR',
      'Low-risk agents with 2% VaR',
      'All agents are equally suitable'
    ],
    correctAnswer: 2,
    explanation: 'Conservative investors should choose low-risk agents that prioritize capital preservation with minimal VaR exposure.',
    category: 'agents'
  },
  {
    id: 'zk-2',
    question: 'In traditional risk assessment, what information is typically exposed?',
    options: [
      'Only the final risk score',
      'Portfolio positions and trading strategies',
      'Just the trader\'s name',
      'Nothing is exposed'
    ],
    correctAnswer: 1,
    explanation: 'Traditional risk assessment requires revealing detailed portfolio positions and strategies to calculate and verify risk metrics.',
    category: 'zk-proofs'
  },
  {
    id: 'var-2',
    question: 'Which VaR confidence level is most conservative?',
    options: [
      '90%',
      '95%',
      '99%',
      'They are all the same'
    ],
    correctAnswer: 2,
    explanation: '99% VaR is most conservative as it accounts for more extreme scenarios, resulting in higher risk estimates and more cautious position sizing.',
    category: 'var'
  }
]

export function ZkVarEducationModule({ onComplete, onSkip }: EducationModuleProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({})
  const [showQuizResults, setShowQuizResults] = useState(false)
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set())

  const handleSectionComplete = (sectionId: string) => {
    setCompletedSections(prev => new Set([...prev, sectionId]))
  }

  const handleQuizAnswer = (questionId: string, answerIndex: number) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: answerIndex }))
  }

  const calculateQuizScore = () => {
    const correctAnswers = quizQuestions.filter(q => 
      quizAnswers[q.id] === q.correctAnswer
    ).length
    return Math.round((correctAnswers / quizQuestions.length) * 100)
  }

  const handleQuizComplete = () => {
    setShowQuizResults(true)
    const score = calculateQuizScore()
    setTimeout(() => onComplete(score), 2000)
  }

  const canTakeQuiz = completedSections.size >= 3
  const allQuestionsAnswered = quizQuestions.every(q => quizAnswers[q.id] !== undefined)

  return (
    <div className="space-y-6">
      <div className="text-center">
        <BookOpen className="h-16 w-16 mx-auto mb-4 text-blue-500" />
        <h2 className="text-2xl font-bold mb-2">zk-VaR Education Module</h2>
        <p className="text-gray-400">
          Master the fundamentals before deploying your trading agents
        </p>
      </div>

      {/* Progress Overview */}
      <Card className="bg-blue-950/20 border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium text-blue-400">Learning Progress</span>
            <span className="text-sm text-gray-400">
              {completedSections.size} / 3 sections completed
            </span>
          </div>
          <Progress value={(completedSections.size / 3) * 100} className="mb-2" />
          <div className="flex justify-between text-xs text-gray-400">
            <span>Complete all sections to unlock the quiz</span>
            <span>{Math.round((completedSections.size / 3) * 100)}%</span>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="zk-proofs">zk-Proofs</TabsTrigger>
          <TabsTrigger value="var-basics">VaR Basics</TabsTrigger>
          <TabsTrigger value="quiz" disabled={!canTakeQuiz}>
            Quiz {!canTakeQuiz && '🔒'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-purple-500" />
                <span>Learning Objectives</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                By completing this module, you will understand how zk-VaR combines privacy-preserving 
                cryptography with quantitative risk management to enable secure, compliant trading.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-green-950/20 border border-green-800">
                  <Shield className="h-8 w-8 text-green-500 mb-3" />
                  <h4 className="font-semibold text-green-400 mb-2">Privacy Protection</h4>
                  <p className="text-sm text-gray-400">
                    Learn how zero-knowledge proofs keep your trading strategies completely private
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-blue-950/20 border border-blue-800">
                  <Calculator className="h-8 w-8 text-blue-500 mb-3" />
                  <h4 className="font-semibold text-blue-400 mb-2">Risk Quantification</h4>
                  <p className="text-sm text-gray-400">
                    Understand Value at Risk calculations and their role in position sizing
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-purple-950/20 border border-purple-800">
                  <Brain className="h-8 w-8 text-purple-500 mb-3" />
                  <h4 className="font-semibold text-purple-400 mb-2">Agent Deployment</h4>
                  <p className="text-sm text-gray-400">
                    Choose the right trading agents based on your risk tolerance and goals
                  </p>
                </div>
              </div>

              <div className="flex justify-center">
                <Button 
                  onClick={() => {
                    handleSectionComplete('overview')
                    setActiveTab('zk-proofs')
                  }}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Start Learning
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="zk-proofs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="h-5 w-5 text-green-500" />
                <span>Zero-Knowledge Proofs</span>
                {completedSections.has('zk-proofs') && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <Eye className="h-16 w-16 text-green-500" />
                  <div className="absolute -bottom-2 -right-2">
                    <Lock className="h-8 w-8 text-blue-500 bg-gray-900 rounded-full p-1" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">Prove Without Revealing</h3>
                <p className="text-gray-400">
                  Zero-knowledge proofs let you prove you know something without revealing what you know
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-red-950/20 border-red-800">
                  <CardHeader>
                    <CardTitle className="text-lg text-red-400 flex items-center space-x-2">
                      <EyeOff className="h-5 w-5" />
                      <span>Traditional Approach</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                      <span className="text-sm">Portfolio positions exposed</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                      <span className="text-sm">Trading strategies revealed</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                      <span className="text-sm">Regulatory data sharing required</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                      <span className="text-sm">Competitive disadvantage</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-green-950/20 border-green-800">
                  <CardHeader>
                    <CardTitle className="text-lg text-green-400 flex items-center space-x-2">
                      <Eye className="h-5 w-5" />
                      <span>zk-Proof Approach</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-sm">Portfolio data stays private</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-sm">Strategies remain confidential</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-sm">Compliance without disclosure</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-sm">Maintain competitive edge</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-blue-950/20 border-blue-800">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-400">How zk-VaR Works</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center font-bold">1</div>
                      <div>
                        <h4 className="font-semibold">Local Computation</h4>
                        <p className="text-sm text-gray-400">Your device calculates VaR using your private portfolio data</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center font-bold">2</div>
                      <div>
                        <h4 className="font-semibold">Proof Generation</h4>
                        <p className="text-sm text-gray-400">Creates cryptographic proof that VaR is within acceptable limits</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center font-bold">3</div>
                      <div>
                        <h4 className="font-semibold">Verification</h4>
                        <p className="text-sm text-gray-400">Network verifies proof without seeing your actual positions</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center font-bold">4</div>
                      <div>
                        <h4 className="font-semibold">Trade Execution</h4>
                        <p className="text-sm text-gray-400">Agents execute trades knowing risk compliance is mathematically proven</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-center">
                <Button 
                  onClick={() => {
                    handleSectionComplete('zk-proofs')
                    setActiveTab('var-basics')
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Continue to VaR Basics
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="var-basics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-red-500" />
                <span>Value at Risk (VaR)</span>
                {completedSections.has('var-basics') && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <Calculator className="h-16 w-16 mx-auto mb-4 text-red-500" />
                <h3 className="text-xl font-bold mb-2">Quantifying Risk</h3>
                <p className="text-gray-400">
                  VaR answers: "What's the worst loss I might face with X% confidence?"
                </p>
              </div>

              <Card className="bg-red-950/20 border-red-800">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-red-400 mb-3">VaR Definition</h4>
                  <div className="bg-gray-900 p-4 rounded-lg font-mono text-sm mb-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-red-400 mb-2">
                        95% VaR of $10,000 over 1 day
                      </div>
                      <div className="text-gray-300">
                        "There's only a 5% chance of losing more than $10,000 tomorrow"
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300">
                    This means that on 95 out of 100 days, your losses will be $10,000 or less. 
                    Only on 5 out of 100 days might you lose more than $10,000.
                  </p>
                </CardContent>
              </Card>

              <div>
                <h4 className="font-semibold mb-4">Confidence Levels Comparison</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-green-950/20 border-green-800">
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl font-bold text-green-400 mb-2">90%</div>
                      <div className="text-sm font-medium text-green-300 mb-2">Less Conservative</div>
                      <div className="text-xs text-gray-400">
                        10% chance of exceeding VaR<br/>
                        More frequent breaches<br/>
                        Lower risk estimates
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-blue-950/20 border-blue-800 ring-2 ring-blue-500">
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl font-bold text-blue-400 mb-2">95%</div>
                      <div className="text-sm font-medium text-blue-300 mb-2">Standard</div>
                      <div className="text-xs text-gray-400">
                        5% chance of exceeding VaR<br/>
                        Industry standard<br/>
                        Balanced approach
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-purple-950/20 border-purple-800">
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl font-bold text-purple-400 mb-2">99%</div>
                      <div className="text-sm font-medium text-purple-300 mb-2">More Conservative</div>
                      <div className="text-xs text-gray-400">
                        1% chance of exceeding VaR<br/>
                        Rare breaches<br/>
                        Higher risk estimates
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Card className="bg-blue-950/20 border-blue-800">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-400">VaR Calculation Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 rounded-lg bg-gray-800 border border-gray-700">
                      <h5 className="font-semibold text-blue-400 mb-2">Historical Simulation</h5>
                      <p className="text-xs text-gray-400 mb-2">
                        Uses past price movements to predict future risk
                      </p>
                      <div className="text-xs text-gray-500">
                        ✓ No distribution assumptions<br/>
                        ✗ Past may not predict future
                      </div>
                    </div>
                    
                    <div className="p-3 rounded-lg bg-gray-800 border border-gray-700">
                      <h5 className="font-semibold text-green-400 mb-2">Parametric</h5>
                      <p className="text-xs text-gray-400 mb-2">
                        Assumes normal distribution of returns
                      </p>
                      <div className="text-xs text-gray-500">
                        ✓ Fast computation<br/>
                        ✗ Normal distribution assumption
                      </div>
                    </div>
                    
                    <div className="p-3 rounded-lg bg-gray-800 border border-gray-700">
                      <h5 className="font-semibold text-purple-400 mb-2">Monte Carlo</h5>
                      <p className="text-xs text-gray-400 mb-2">
                        Simulates thousands of possible outcomes
                      </p>
                      <div className="text-xs text-gray-500">
                        ✓ Handles complex portfolios<br/>
                        ✗ Computationally intensive
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-center">
                <Button 
                  onClick={() => {
                    handleSectionComplete('var-basics')
                    setActiveTab('quiz')
                  }}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Take the Quiz
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quiz" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <HelpCircle className="h-5 w-5 text-yellow-500" />
                <span>Knowledge Assessment</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!showQuizResults ? (
                <div className="space-y-6">
                  <div className="flex justify-between text-sm mb-4">
                    <span className="text-gray-400">
                      Question {currentQuizQuestion + 1} of {quizQuestions.length}
                    </span>
                    <span className="text-gray-400">
                      {Object.keys(quizAnswers).length} / {quizQuestions.length} answered
                    </span>
                  </div>
                  
                  <Progress value={((currentQuizQuestion + 1) / quizQuestions.length) * 100} />

                  <Card className="bg-yellow-950/20 border-yellow-800">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-4">
                        {quizQuestions[currentQuizQuestion].question}
                      </h4>
                      <div className="space-y-2">
                        {quizQuestions[currentQuizQuestion].options.map((option, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg border cursor-pointer transition-all ${
                              quizAnswers[quizQuestions[currentQuizQuestion].id] === index
                                ? 'border-yellow-500 bg-yellow-950/40'
                                : 'border-gray-700 hover:border-gray-600'
                            }`}
                            onClick={() => handleQuizAnswer(quizQuestions[currentQuizQuestion].id, index)}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-4 h-4 rounded-full border-2 ${
                                quizAnswers[quizQuestions[currentQuizQuestion].id] === index
                                  ? 'border-yellow-500 bg-yellow-500'
                                  : 'border-gray-500'
                              }`} />
                              <span>{option}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentQuizQuestion(Math.max(0, currentQuizQuestion - 1))}
                      disabled={currentQuizQuestion === 0}
                    >
                      Previous
                    </Button>
                    
                    {currentQuizQuestion < quizQuestions.length - 1 ? (
                      <Button
                        onClick={() => setCurrentQuizQuestion(currentQuizQuestion + 1)}
                        disabled={quizAnswers[quizQuestions[currentQuizQuestion].id] === undefined}
                      >
                        Next Question
                      </Button>
                    ) : (
                      <Button
                        onClick={handleQuizComplete}
                        disabled={!allQuestionsAnswered}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Complete Quiz
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-6">
                  <div className="relative inline-block">
                    <Award className="h-24 w-24 text-yellow-500 animate-bounce" />
                    <div className="absolute -top-2 -right-2">
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Quiz Complete!</h3>
                    <div className="text-4xl font-bold text-yellow-400 mb-2">
                      {calculateQuizScore()}%
                    </div>
                    <p className="text-gray-400">
                      {calculateQuizScore() >= 80 
                        ? 'Excellent! You\'re ready to deploy zk-VaR agents.'
                        : calculateQuizScore() >= 60
                        ? 'Good job! You have a solid understanding of the basics.'
                        : 'Consider reviewing the material before proceeding.'
                      }
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-green-400">
                        {quizQuestions.filter(q => quizAnswers[q.id] === q.correctAnswer).length}
                      </div>
                      <div className="text-sm text-gray-400">Correct</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-red-400">
                        {quizQuestions.filter(q => quizAnswers[q.id] !== q.correctAnswer).length}
                      </div>
                      <div className="text-sm text-gray-400">Incorrect</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-blue-400">
                        {quizQuestions.length}
                      </div>
                      <div className="text-sm text-gray-400">Total</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Skip Option */}
      <div className="text-center">
        <Button variant="outline" onClick={onSkip} className="text-gray-400">
          Skip Education (Not Recommended)
        </Button>
      </div>
    </div>
  )
}