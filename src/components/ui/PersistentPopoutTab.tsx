import React, { useState } from 'react'
import { Card, CardContent } from './card'
import { Button } from './button'
import { Badge } from './badge'
import { 
  ChevronLeft, 
  ChevronRight, 
  Shield, 
  Zap, 
  Trophy,
  TrendingUp,
  Users
} from 'lucide-react'
import { Lock } from '../icons'

export function PersistentPopoutTab() {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleTab = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <>
      {/* Mobile: Hide completely on small screens */}
      <div className="hidden lg:block">
        {/* Toggle Button - Always visible on right edge */}
        <Button
          onClick={toggleTab}
          className="fixed right-0 top-1/2 transform -translate-y-1/2 h-20 w-8 rounded-l-lg rounded-r-none 
            bg-emerald-600 hover:bg-emerald-700 border-emerald-500 shadow-lg transition-all duration-300 
            flex items-center justify-center hover:shadow-emerald-500/50 z-[10000]"
          style={{ 
            writingMode: 'vertical-rl',
            textOrientation: 'mixed'
          }}
          aria-label={isExpanded ? 'Collapse information tab' : 'Expand information tab'}
        >
          {isExpanded ? (
            <ChevronRight className="h-5 w-5 text-white" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-white" />
          )}
        </Button>

        {/* Expandable Content - Only shows when expanded */}
        {isExpanded && (
          <>
            {/* Backdrop overlay */}
            <div 
              className="fixed inset-0 bg-black/20 z-[9998]"
              onClick={toggleTab}
            />
            
            {/* Content Panel */}
            <div 
              className="fixed right-8 top-1/2 transform -translate-y-1/2 z-[9999] 
                animate-in slide-in-from-right-5 duration-300"
            >
              <Card className="w-80 bg-gray-950/98 border-emerald-800 backdrop-blur-sm shadow-2xl">
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-center space-x-2 mb-4">
                    <Shield className="h-6 w-6 text-emerald-500" />
                    <h3 className="text-lg font-bold text-emerald-400">
                      ReFi.Trading Platform
                    </h3>
                  </div>

                  {/* Subtitle */}
                  <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                    Experience the future of algorithmic trading with mathematical certainty 
                    and regulatory compliance.
                  </p>

                  {/* Key Features */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-start space-x-3">
                      <Lock className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-semibold text-blue-400">Non-Custodial Security</h4>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          Your private keys remain secure. We never hold your funds - trade with 
                          complete ownership and control of your assets.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Shield className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-semibold text-purple-400">Dual-Proof Gate</h4>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          Every trade verified through zero-knowledge VaR proofs and ACE policy 
                          compliance before execution.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <TrendingUp className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-semibold text-green-400">RL Trading Agents</h4>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          Advanced reinforcement learning algorithms (PPO, TD3, RVI-Q) execute 
                          sophisticated trading strategies automatically.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Trophy className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-semibold text-yellow-400">Gamified Learning</h4>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          Master trading through interactive quests, earn XP points, unlock badges, 
                          and compete on global leaderboards.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center p-2 rounded-lg bg-emerald-950/30 border border-emerald-800">
                      <div className="text-lg font-bold text-emerald-400">99.9%</div>
                      <div className="text-xs text-gray-400">Uptime</div>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-blue-950/30 border border-blue-800">
                      <div className="text-lg font-bold text-blue-400">&lt;89ms</div>
                      <div className="text-xs text-gray-400">Latency</div>
                    </div>
                  </div>

                  {/* Compliance Badge */}
                  <div className="flex items-center justify-center space-x-2 p-2 rounded-lg bg-green-950/20 border border-green-800">
                    <Users className="h-4 w-4 text-green-500" />
                    <span className="text-xs font-medium text-green-400">
                      UAE/GCC Regulatory Compliant
                    </span>
                  </div>

                  {/* Call to Action */}
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <p className="text-xs text-center text-gray-400 leading-relaxed mb-3">
                      Join thousands of traders leveraging AI-powered strategies with 
                      mathematical risk verification.
                    </p>
                    <Badge variant="success" className="w-full justify-center py-1">
                      <Zap className="h-3 w-3 mr-1" />
                      Start Trading Now
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>

      {/* Accessibility: Screen reader announcement */}
      <div className="sr-only" aria-live="polite">
        {isExpanded ? 'Information tab expanded' : 'Information tab collapsed'}
      </div>
    </>
  )
}