import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { 
  Activity, 
  Shield, 
  Trophy, 
  Star,
  Zap,
  Target,
  BookOpen,
  Award,
  ChevronRight,
  X,
  Sparkles,
  TrendingUp,
  Users
} from 'lucide-react'
import { Lock } from '../icons'

interface FirstTimeVisitorOverlayProps {
  onClose: () => void
  onStartOnboarding: () => void
}

export function FirstTimeVisitorOverlay({ onClose, onStartOnboarding }: FirstTimeVisitorOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [xpEarned, setXpEarned] = useState(0)

  const steps = [
    {
      title: "Welcome to the Future of Trading",
      subtitle: "Non-Custodial RL Trading Platform",
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <div className="relative inline-block">
              <img 
                src="/green-logo-only-squareArtboard 1.png" 
                alt="ReFi.Trading Logo" 
                className="h-16 w-16 animate-pulse"
                onError={(e) => {
                  // Fallback to Activity icon if logo fails to load
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <Activity className="h-16 w-16 text-emerald-500 animate-pulse hidden" />
              <div className="absolute -top-2 -right-2">
                <Sparkles className="h-6 w-6 text-yellow-400 animate-bounce" />
              </div>
            </div>
          </div>
          <p className="text-gray-300 text-center">
            Experience the next generation of algorithmic trading where <strong>you maintain full control</strong> of your funds while AI agents execute sophisticated strategies.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-800 text-center">
              <Lock className="h-6 w-6 mx-auto mb-2 text-emerald-500" />
              <div className="font-medium text-emerald-400">Non-Custodial</div>
              <div className="text-xs text-gray-400">Your keys, your crypto</div>
            </div>
            <div className="p-3 rounded-lg bg-blue-950/20 border border-blue-800 text-center">
              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-blue-500" />
              <div className="font-medium text-blue-400">RL Agents</div>
              <div className="text-xs text-gray-400">AI-powered strategies</div>
            </div>
            <div className="p-3 rounded-lg bg-purple-950/20 border border-purple-800 text-center">
              <Users className="h-6 w-6 mx-auto mb-2 text-purple-500" />
              <div className="font-medium text-purple-400">Community</div>
              <div className="text-xs text-gray-400">Learn & compete</div>
            </div>
          </div>
        </div>
      ),
      xpReward: 10
    },
    {
      title: "Dual-Proof Gate System",
      subtitle: "Mathematical Certainty Meets Regulatory Compliance",
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <Shield className="h-16 w-16 text-blue-500 animate-pulse mx-auto" />
          </div>
          <p className="text-gray-300 text-center">
            Every trade passes through our revolutionary <strong>Dual-Proof Gate</strong> - combining zero-knowledge VaR proofs with ACE policy compliance.
          </p>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-purple-950/20 border border-purple-800">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm">1</div>
              <div>
                <div className="font-medium text-purple-400">zk-VaR Proof</div>
                <div className="text-xs text-gray-400">Mathematical risk verification without revealing positions</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-green-950/20 border border-green-800">
              <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-sm">2</div>
              <div>
                <div className="font-medium text-green-400">ACE Policy Check</div>
                <div className="text-xs text-gray-400">UAE/GCC regulatory compliance validation</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-blue-950/20 border border-blue-800">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">3</div>
              <div>
                <div className="font-medium text-blue-400">Base L2 Anchor</div>
                <div className="text-xs text-gray-400">Immutable audit trail on blockchain</div>
              </div>
            </div>
          </div>
        </div>
      ),
      xpReward: 15
    },
    {
      title: "Gamified Learning Journey",
      subtitle: "Level Up Your Trading Skills",
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <div className="relative inline-block">
              <Trophy className="h-16 w-16 text-yellow-500 animate-bounce mx-auto" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                <Star className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
          <p className="text-gray-300 text-center">
            Master trading through <strong>interactive quests</strong>, earn <strong>XP points</strong>, unlock <strong>badges</strong>, and compete on <strong>leaderboards</strong>.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-yellow-950/20 border border-yellow-800 text-center">
              <Target className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
              <div className="font-medium text-yellow-400 text-sm">Complete Quests</div>
              <div className="text-xs text-gray-400">Structured learning paths</div>
            </div>
            <div className="p-3 rounded-lg bg-purple-950/20 border border-purple-800 text-center">
              <Award className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <div className="font-medium text-purple-400 text-sm">Earn Badges</div>
              <div className="text-xs text-gray-400">Show your expertise</div>
            </div>
            <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-800 text-center">
              <Star className="h-8 w-8 mx-auto mb-2 text-emerald-500" />
              <div className="font-medium text-emerald-400 text-sm">Gain XP</div>
              <div className="text-xs text-gray-400">Level up your skills</div>
            </div>
            <div className="p-3 rounded-lg bg-blue-950/20 border border-blue-800 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <div className="font-medium text-blue-400 text-sm">Compete</div>
              <div className="text-xs text-gray-400">Global leaderboards</div>
            </div>
          </div>
        </div>
      ),
      xpReward: 20
    }
  ]

  const handleNext = () => {
    const newXp = xpEarned + steps[currentStep].xpReward
    setXpEarned(newXp)
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onStartOnboarding()
    }
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-950 border border-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-10"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>

        {/* XP Display */}
        <div className="absolute top-4 left-4 flex items-center space-x-2 bg-emerald-950/50 border border-emerald-800 rounded-full px-3 py-1">
          <Star className="h-4 w-4 text-emerald-400" />
          <span className="text-sm font-bold text-emerald-400">{xpEarned} XP</span>
        </div>

        <div className="p-8 pt-16">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Progress</span>
              <span className="text-gray-400">{currentStep + 1} / {steps.length}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Content */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              {steps[currentStep].title}
            </h1>
            <p className="text-lg text-gray-400 mb-6">
              {steps[currentStep].subtitle}
            </p>
            
            {steps[currentStep].content}
          </div>

          {/* XP Reward Display */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-950/30 to-orange-950/30 border border-yellow-800 rounded-full px-4 py-2">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-medium text-yellow-400">
                +{steps[currentStep].xpReward} XP for completing this step
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index <= currentStep ? 'bg-emerald-500' : 'bg-gray-700'
                  }`}
                />
              ))}
            </div>
            
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-emerald-500/25 transition-all duration-300"
            >
              {currentStep < steps.length - 1 ? (
                <>
                  Next Step
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              ) : (
                <>
                  Start Your Journey
                  <Trophy className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}