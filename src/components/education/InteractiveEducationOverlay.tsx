import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { 
  BookOpen, 
  Target, 
  CheckCircle, 
  Star,
  Lightbulb,
  TrendingUp,
  Shield,
  BarChart3,
  X,
  Play,
  Award,
  Brain
} from 'lucide-react'

interface EducationStep {
  id: string
  title: string
  content: React.ReactNode
  xpReward: number
  interactionRequired: boolean
}

interface InteractiveEducationOverlayProps {
  isVisible: boolean
  onClose: () => void
  onXPEarned: (xp: number) => void
  triggerElement?: string // CSS selector for the element that triggered this
  educationType: 'dual-proof' | 'risk-management' | 'strategy-basics' | 'gamification'
}

const educationContent = {
  'dual-proof': {
    title: 'Dual-Proof Gate System',
    description: 'Learn how mathematical proofs and regulatory compliance work together',
    steps: [
      {
        id: 'intro',
        title: 'What is a Dual-Proof Gate?',
        content: (
          <div className="space-y-4">
            <p className="text-gray-300 leading-relaxed">
              The Dual-Proof Gate is ReFi.Trading's revolutionary security system that ensures every trade 
              passes through two independent verification layers before execution.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-purple-950/20 border border-purple-800">
                <Shield className="h-6 w-6 text-purple-500 mb-2" />
                <h4 className="font-semibold text-purple-400">zk-VaR Proof</h4>
                <p className="text-sm text-gray-400">
                  Mathematical verification that your risk is within acceptable limits without revealing your positions
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-950/20 border border-green-800">
                <CheckCircle className="h-6 w-6 text-green-500 mb-2" />
                <h4 className="font-semibold text-green-400">ACE Policy</h4>
                <p className="text-sm text-gray-400">
                  Regulatory compliance check ensuring trades meet UAE/GCC financial regulations
                </p>
              </div>
            </div>
          </div>
        ),
        xpReward: 15,
        interactionRequired: false
      },
      {
        id: 'zk-proof-deep',
        title: 'Zero-Knowledge Proofs Explained',
        content: (
          <div className="space-y-4">
            <p className="text-gray-300 leading-relaxed">
              Zero-knowledge proofs allow you to prove you know something without revealing what you know. 
              In trading, this means proving your risk compliance without exposing your strategies.
            </p>
            <div className="p-4 rounded-lg bg-blue-950/20 border border-blue-800">
              <h4 className="font-semibold text-blue-400 mb-3">Traditional vs. zk-Proof Approach</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-medium text-red-400 mb-2">❌ Traditional</h5>
                  <ul className="space-y-1 text-gray-400">
                    <li>• Reveal all positions</li>
                    <li>• Expose trading strategies</li>
                    <li>• Share sensitive data</li>
                    <li>• Competitive disadvantage</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-green-400 mb-2">✅ zk-Proof</h5>
                  <ul className="space-y-1 text-gray-400">
                    <li>• Keep positions private</li>
                    <li>• Protect strategies</li>
                    <li>• Prove compliance only</li>
                    <li>• Maintain edge</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ),
        xpReward: 20,
        interactionRequired: true
      },
      {
        id: 'ace-policy',
        title: 'ACE Policy Compliance',
        content: (
          <div className="space-y-4">
            <p className="text-gray-300 leading-relaxed">
              The ACE (Automated Compliance Engine) ensures all trades comply with UAE and GCC financial regulations, 
              providing institutional-grade compliance for retail traders.
            </p>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-green-950/20 border border-green-800">
                <h4 className="font-semibold text-green-400 mb-2">Compliance Checks</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Position size limits based on account size</li>
                  <li>• Sector concentration limits</li>
                  <li>• Leverage restrictions</li>
                  <li>• Trading hours compliance</li>
                  <li>• Sanctions screening</li>
                </ul>
              </div>
            </div>
          </div>
        ),
        xpReward: 15,
        interactionRequired: false
      }
    ]
  },
  'risk-management': {
    title: 'Risk Management Fundamentals',
    description: 'Master the art of protecting your capital while maximizing returns',
    steps: [
      {
        id: 'var-basics',
        title: 'Understanding Value at Risk',
        content: (
          <div className="space-y-4">
            <p className="text-gray-300 leading-relaxed">
              Value at Risk (VaR) answers the question: "What's the worst loss I might face with X% confidence over Y time period?"
            </p>
            <div className="p-4 rounded-lg bg-red-950/20 border border-red-800">
              <h4 className="font-semibold text-red-400 mb-3">VaR Example</h4>
              <div className="bg-gray-900 p-3 rounded font-mono text-center">
                <div className="text-lg font-bold text-red-400 mb-1">
                  95% VaR = $5,000 (1 day)
                </div>
                <div className="text-sm text-gray-300">
                  "95% confidence that losses won't exceed $5,000 tomorrow"
                </div>
              </div>
            </div>
          </div>
        ),
        xpReward: 12,
        interactionRequired: true
      },
      {
        id: 'position-sizing',
        title: 'Position Sizing Strategies',
        content: (
          <div className="space-y-4">
            <p className="text-gray-300 leading-relaxed">
              Position sizing determines how much capital to risk on each trade. It's often more important than entry and exit timing.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-blue-950/20 border border-blue-800 text-center">
                <h5 className="font-semibold text-blue-400 mb-1">Fixed %</h5>
                <p className="text-xs text-gray-400">Risk same % on every trade</p>
              </div>
              <div className="p-3 rounded-lg bg-green-950/20 border border-green-800 text-center">
                <h5 className="font-semibold text-green-400 mb-1">Kelly Criterion</h5>
                <p className="text-xs text-gray-400">Optimize based on win rate</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-950/20 border border-purple-800 text-center">
                <h5 className="font-semibold text-purple-400 mb-1">VaR-Based</h5>
                <p className="text-xs text-gray-400">Size based on risk metrics</p>
              </div>
            </div>
          </div>
        ),
        xpReward: 18,
        interactionRequired: true
      }
    ]
  },
  'strategy-basics': {
    title: 'Trading Strategy Fundamentals',
    description: 'Learn the core concepts behind algorithmic trading strategies',
    steps: [
      {
        id: 'strategy-types',
        title: 'Types of Trading Strategies',
        content: (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-green-950/20 border border-green-800">
                <TrendingUp className="h-6 w-6 text-green-500 mb-2" />
                <h4 className="font-semibold text-green-400">Trend Following</h4>
                <p className="text-sm text-gray-400">
                  Strategies that profit from sustained price movements in one direction
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-950/20 border border-blue-800">
                <BarChart3 className="h-6 w-6 text-blue-500 mb-2" />
                <h4 className="font-semibold text-blue-400">Mean Reversion</h4>
                <p className="text-sm text-gray-400">
                  Strategies that profit when prices return to their statistical average
                </p>
              </div>
            </div>
          </div>
        ),
        xpReward: 10,
        interactionRequired: false
      }
    ]
  },
  'gamification': {
    title: 'Gamified Learning System',
    description: 'Understand how to earn XP, unlock badges, and level up your trading skills',
    steps: [
      {
        id: 'xp-system',
        title: 'Experience Points (XP) System',
        content: (
          <div className="space-y-4">
            <p className="text-gray-300 leading-relaxed">
              Earn XP by engaging with educational content, completing trades, and demonstrating trading skills.
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-2 rounded bg-emerald-950/20 border border-emerald-800">
                <div className="font-semibold text-emerald-400">Trade Preview: +5 XP</div>
                <div className="text-xs text-gray-400">Generate risk proofs</div>
              </div>
              <div className="p-2 rounded bg-blue-950/20 border border-blue-800">
                <div className="font-semibold text-blue-400">Education: +10-30 XP</div>
                <div className="text-xs text-gray-400">Learn trading concepts</div>
              </div>
              <div className="p-2 rounded bg-purple-950/20 border border-purple-800">
                <div className="font-semibold text-purple-400">Quiz Pass: +20 XP</div>
                <div className="text-xs text-gray-400">Demonstrate knowledge</div>
              </div>
              <div className="p-2 rounded bg-yellow-950/20 border border-yellow-800">
                <div className="font-semibold text-yellow-400">Streak: +5 XP</div>
                <div className="text-xs text-gray-400">Daily consistency</div>
              </div>
            </div>
          </div>
        ),
        xpReward: 8,
        interactionRequired: false
      }
    ]
  }
}

export function InteractiveEducationOverlay({ 
  isVisible, 
  onClose, 
  onXPEarned, 
  triggerElement,
  educationType 
}: InteractiveEducationOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [totalXPEarned, setTotalXPEarned] = useState(0)

  const content = educationContent[educationType]
  const steps = content.steps

  const handleStepComplete = (stepIndex: number) => {
    if (!completedSteps.has(stepIndex)) {
      setCompletedSteps(prev => new Set([...prev, stepIndex]))
      const xp = steps[stepIndex].xpReward
      setTotalXPEarned(prev => prev + xp)
      onXPEarned(xp)
    }
  }

  const progress = (completedSteps.size / steps.length) * 100
  const canProceed = completedSteps.has(currentStep)

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-950 border border-gray-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-6 w-6 text-blue-500" />
              <div>
                <h2 className="text-2xl font-bold">{content.title}</h2>
                <p className="text-gray-400">{content.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {totalXPEarned > 0 && (
                <Badge variant="success" className="flex items-center space-x-1">
                  <Star className="h-3 w-3" />
                  <span>+{totalXPEarned} XP</span>
                </Badge>
              )}
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Progress */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span>{completedSteps.size} / {steps.length} completed</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <div className="p-6">
          {/* Step Navigation */}
          <div className="flex space-x-2 mb-6 overflow-x-auto">
            {steps.map((step, index) => {
              const isCompleted = completedSteps.has(index)
              const isActive = currentStep === index
              
              return (
                <Button
                  key={step.id}
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className={`flex items-center space-x-2 whitespace-nowrap ${
                    isActive ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setCurrentStep(index)}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-gray-500" />
                  )}
                  <span className="text-sm">{step.title}</span>
                </Button>
              )
            })}
          </div>

          {/* Current Step Content */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{steps[currentStep].title}</span>
                <Badge variant="secondary" className="text-xs">
                  +{steps[currentStep].xpReward} XP
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {steps[currentStep].content}
              
              <div className="mt-6 flex justify-center">
                <Button
                  onClick={() => handleStepComplete(currentStep)}
                  disabled={completedSteps.has(currentStep)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {completedSteps.has(currentStep) ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Completed
                    </>
                  ) : (
                    <>
                      <Star className="h-4 w-4 mr-2" />
                      Mark Complete (+{steps[currentStep].xpReward} XP)
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            
            <div className="flex space-x-3">
              {currentStep < steps.length - 1 ? (
                <Button
                  onClick={() => setCurrentStep(currentStep + 1)}
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  onClick={onClose}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Award className="h-4 w-4 mr-2" />
                  Complete Module
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}