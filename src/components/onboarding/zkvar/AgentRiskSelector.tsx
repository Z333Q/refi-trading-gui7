import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Button } from '../../ui/button'
import { Badge } from '../../ui/badge'
import { Progress } from '../../ui/progress'
import { 
  Shield, 
  BarChart3, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Info,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Target,
  Zap,
  Activity
} from 'lucide-react'

interface AgentConfig {
  id: string
  name: string
  riskTier: 'low' | 'medium' | 'high'
  strategy: string
  allocation: number
  status: 'active' | 'paused' | 'stopped'
  performance: {
    return: number
    sharpe: number
    maxDrawdown: number
    winRate: number
  }
}

interface AgentRiskSelectorProps {
  onConfigurationComplete: (configs: AgentConfig[]) => void
  userRiskProfile: {
    tolerance: 'conservative' | 'moderate' | 'aggressive'
    experience: 'beginner' | 'intermediate' | 'advanced' | 'expert'
    timeHorizon: string
    portfolioSize: string
  }
}

const riskTierDefinitions = {
  low: {
    name: 'Conservative Agents',
    icon: Shield,
    color: 'green',
    maxVaR: '2%',
    estimatedReturn: '5-8%',
    volatility: 'Low',
    description: 'Focus on capital preservation with minimal risk exposure',
    characteristics: [
      'Maximum 2% daily VaR',
      'Conservative position sizing',
      'Frequent rebalancing',
      'Stop-loss protection',
      'Lower volatility strategies'
    ],
    strategies: [
      { id: 'mean-reversion-conservative', name: 'Mean Reversion (Conservative)', allocation: 40 },
      { id: 'momentum-conservative', name: 'Momentum (Conservative)', allocation: 30 },
      { id: 'volatility-arbitrage', name: 'Volatility Arbitrage', allocation: 30 }
    ],
    warnings: [
      'Lower potential returns',
      'May underperform in strong bull markets',
      'Higher transaction costs due to frequent rebalancing'
    ]
  },
  medium: {
    name: 'Balanced Agents',
    icon: BarChart3,
    color: 'blue',
    maxVaR: '5%',
    estimatedReturn: '8-15%',
    volatility: 'Medium',
    description: 'Balanced approach between growth and risk management',
    characteristics: [
      '2-5% daily VaR range',
      'Diversified strategy mix',
      'Adaptive position sizing',
      'Market regime detection',
      'Risk-adjusted returns focus'
    ],
    strategies: [
      { id: 'trend-following', name: 'Trend Following', allocation: 35 },
      { id: 'mean-reversion', name: 'Mean Reversion', allocation: 25 },
      { id: 'momentum', name: 'Momentum', allocation: 25 },
      { id: 'pairs-trading', name: 'Pairs Trading', allocation: 15 }
    ],
    warnings: [
      'Moderate volatility expected',
      'Potential for drawdowns during market stress',
      'Performance varies with market conditions'
    ]
  },
  high: {
    name: 'Aggressive Agents',
    icon: TrendingUp,
    color: 'red',
    maxVaR: '10%',
    estimatedReturn: '15-25%',
    volatility: 'High',
    description: 'Maximum growth potential with higher risk tolerance',
    characteristics: [
      '5-10% daily VaR exposure',
      'Leveraged strategies',
      'High-frequency opportunities',
      'Momentum-driven approaches',
      'Opportunistic positioning'
    ],
    strategies: [
      { id: 'momentum-aggressive', name: 'Momentum (Aggressive)', allocation: 40 },
      { id: 'breakout', name: 'Breakout Strategies', allocation: 30 },
      { id: 'high-frequency', name: 'High-Frequency', allocation: 20 },
      { id: 'leveraged', name: 'Leveraged Strategies', allocation: 10 }
    ],
    warnings: [
      'High volatility and potential drawdowns',
      'Requires significant risk tolerance',
      'Not suitable for conservative investors',
      'Potential for substantial losses'
    ]
  }
}

export function AgentRiskSelector({ onConfigurationComplete, userRiskProfile }: AgentRiskSelectorProps) {
  const [selectedTier, setSelectedTier] = useState<'low' | 'medium' | 'high'>('medium')
  const [customAllocations, setCustomAllocations] = useState<Record<string, number>>({})
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [acceptedWarnings, setAcceptedWarnings] = useState<Set<string>>(new Set())

  const getRecommendedTier = (): 'low' | 'medium' | 'high' => {
    if (userRiskProfile.tolerance === 'conservative' || userRiskProfile.experience === 'beginner') {
      return 'low'
    } else if (userRiskProfile.tolerance === 'aggressive' && userRiskProfile.experience === 'expert') {
      return 'high'
    }
    return 'medium'
  }

  const recommendedTier = getRecommendedTier()
  const currentTierDef = riskTierDefinitions[selectedTier]

  const handleAllocationChange = (strategyId: string, allocation: number) => {
    setCustomAllocations(prev => ({
      ...prev,
      [strategyId]: allocation
    }))
  }

  const getTotalAllocation = () => {
    const strategies = currentTierDef.strategies
    return strategies.reduce((total, strategy) => {
      return total + (customAllocations[strategy.id] || strategy.allocation)
    }, 0)
  }

  const handleWarningAcceptance = (tierId: string) => {
    setAcceptedWarnings(prev => new Set([...prev, tierId]))
  }

  const canProceed = () => {
    const totalAllocation = getTotalAllocation()
    const hasAcceptedWarnings = selectedTier === 'high' ? acceptedWarnings.has('high') : true
    return Math.abs(totalAllocation - 100) < 1 && hasAcceptedWarnings
  }

  const handleComplete = () => {
    const strategies = currentTierDef.strategies
    const configs: AgentConfig[] = strategies.map((strategy, index) => ({
      id: `agent-${selectedTier}-${index}`,
      name: strategy.name,
      riskTier: selectedTier,
      strategy: strategy.name,
      allocation: customAllocations[strategy.id] || strategy.allocation,
      status: 'active' as const,
      performance: {
        return: Math.random() * 20 - 5, // -5% to 15%
        sharpe: Math.random() * 2 + 0.5, // 0.5 to 2.5
        maxDrawdown: -(Math.random() * 15 + 2), // -2% to -17%
        winRate: Math.random() * 30 + 50 // 50% to 80%
      }
    }))

    onConfigurationComplete(configs)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Target className="h-16 w-16 mx-auto mb-4 text-blue-500" />
        <h2 className="text-2xl font-bold mb-2">Agent Risk Selection</h2>
        <p className="text-gray-400">
          Choose your trading agent risk tier and customize strategy allocations
        </p>
      </div>

      {/* Recommendation Banner */}
      <Card className="bg-blue-950/20 border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Info className="h-5 w-5 text-blue-500" />
            <div>
              <span className="font-medium text-blue-400">Recommended for You: </span>
              <span className="text-blue-300">
                {riskTierDefinitions[recommendedTier].name}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Based on your {userRiskProfile.tolerance} risk tolerance and {userRiskProfile.experience} experience level.
          </p>
        </CardContent>
      </Card>

      {/* Risk Tier Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {Object.entries(riskTierDefinitions).map(([tierId, tierDef]) => {
          const Icon = tierDef.icon
          const isSelected = selectedTier === tierId
          const isRecommended = recommendedTier === tierId
          
          return (
            <Card
              key={tierId}
              className={`cursor-pointer transition-all ${
                isSelected
                  ? `border-${tierDef.color}-500 bg-${tierDef.color}-950/30 ring-2 ring-${tierDef.color}-500`
                  : `border-gray-700 hover:border-${tierDef.color}-600`
              } ${isRecommended ? 'ring-2 ring-blue-400' : ''}`}
              onClick={() => setSelectedTier(tierId as 'low' | 'medium' | 'high')}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon className={`h-6 w-6 text-${tierDef.color}-500`} />
                    <div>
                      <CardTitle className="text-lg">{tierDef.name}</CardTitle>
                      <p className="text-sm text-gray-400">{tierDef.description}</p>
                    </div>
                  </div>
                  {isRecommended && (
                    <Badge variant="secondary" className="text-xs">
                      Recommended
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-400">Max VaR:</span>
                    <div className="font-medium">{tierDef.maxVaR}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Expected Return:</span>
                    <div className="font-medium">{tierDef.estimatedReturn}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Volatility:</span>
                    <div className="font-medium">{tierDef.volatility}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Strategies:</span>
                    <div className="font-medium">{tierDef.strategies.length}</div>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium mb-2">Key Features:</div>
                  <ul className="text-xs text-gray-400 space-y-1">
                    {tierDef.characteristics.slice(0, 3).map((char, index) => (
                      <li key={index}>• {char}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Selected Tier Configuration */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <currentTierDef.icon className={`h-5 w-5 text-${currentTierDef.color}-500`} />
              <span>Configure {currentTierDef.name}</span>
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <Settings className="h-4 w-4 mr-2" />
              {showAdvanced ? 'Hide' : 'Show'} Advanced
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Strategy Allocation */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">Strategy Allocation</h4>
              <div className="text-sm">
                Total: <span className={`font-bold ${
                  Math.abs(getTotalAllocation() - 100) < 1 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {getTotalAllocation().toFixed(1)}%
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              {currentTierDef.strategies.map((strategy) => {
                const currentAllocation = customAllocations[strategy.id] || strategy.allocation
                
                return (
                  <div key={strategy.id} className="p-3 rounded-lg bg-gray-900 border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{strategy.name}</span>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={currentAllocation}
                          onChange={(e) => handleAllocationChange(strategy.id, parseFloat(e.target.value) || 0)}
                          className="w-16 px-2 py-1 text-sm border border-gray-600 rounded bg-gray-800 text-gray-100"
                        />
                        <span className="text-sm text-gray-400">%</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full bg-${currentTierDef.color}-500`}
                        style={{ width: `${Math.min(currentAllocation, 100)}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Advanced Settings */}
          {showAdvanced && (
            <div className="space-y-4 p-4 rounded-lg bg-blue-950/20 border border-blue-800">
              <h4 className="font-semibold text-blue-400">Advanced Configuration</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Rebalancing Frequency</label>
                  <select className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-900 text-gray-100">
                    <option value="intraday">Intraday</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Risk Monitoring</label>
                  <select className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-900 text-gray-100">
                    <option value="continuous">Continuous</option>
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Stop Loss Threshold</label>
                  <select className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-900 text-gray-100">
                    <option value="5">5% (Tight)</option>
                    <option value="10">10% (Standard)</option>
                    <option value="15">15% (Loose)</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Position Sizing Method</label>
                  <select className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-900 text-gray-100">
                    <option value="fixed">Fixed Allocation</option>
                    <option value="kelly">Kelly Criterion</option>
                    <option value="var-based">VaR-Based</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Warnings for High Risk */}
          {selectedTier === 'high' && !acceptedWarnings.has('high') && (
            <Card className="bg-red-950/20 border-red-800">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-red-400 mb-2">High Risk Warning</h4>
                    <ul className="text-sm text-red-300 space-y-1 mb-4">
                      {currentTierDef.warnings.map((warning, index) => (
                        <li key={index}>• {warning}</li>
                      ))}
                    </ul>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="accept-high-risk"
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleWarningAcceptance('high')
                          } else {
                            setAcceptedWarnings(prev => {
                              const newSet = new Set(prev)
                              newSet.delete('high')
                              return newSet
                            })
                          }
                        }}
                        className="rounded border-red-600 bg-red-950"
                      />
                      <label htmlFor="accept-high-risk" className="text-sm text-red-300">
                        I understand and accept these risks
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Configuration Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg bg-gray-900 border border-gray-700">
            <div className="text-center">
              <div className={`text-2xl font-bold text-${currentTierDef.color}-400`}>
                {currentTierDef.maxVaR}
              </div>
              <div className="text-sm text-gray-400">Maximum VaR</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold text-${currentTierDef.color}-400`}>
                {currentTierDef.strategies.length}
              </div>
              <div className="text-sm text-gray-400">Active Strategies</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold text-${currentTierDef.color}-400`}>
                {currentTierDef.estimatedReturn}
              </div>
              <div className="text-sm text-gray-400">Estimated Return</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center">
        <Button
          onClick={handleComplete}
          disabled={!canProceed()}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
        >
          <Play className="h-5 w-5 mr-2" />
          Deploy Selected Agents
        </Button>
      </div>

      {/* Legal Disclaimers */}
      <Card className="bg-amber-950/20 border-amber-800">
        <CardContent className="p-4">
          <div className="space-y-3 text-xs text-amber-300">
            <div className="font-semibold text-amber-400">Important Disclaimers:</div>
            <ul className="space-y-1 list-disc list-inside">
              <li>Past performance does not guarantee future results. All trading involves risk of loss.</li>
              <li>Estimated returns are projections based on historical data and may not reflect actual future performance.</li>
              <li>Zero-knowledge proofs verify risk compliance but do not eliminate market risk or guarantee profits.</li>
              <li>High-risk agents may result in substantial losses. Only invest what you can afford to lose.</li>
              <li>This platform is not suitable for all investors. Consider your financial situation and risk tolerance.</li>
              <li>Regulatory compliance varies by jurisdiction. Ensure compliance with local laws before trading.</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {!canProceed() && (
        <div className="text-center text-sm text-amber-400">
          {Math.abs(getTotalAllocation() - 100) >= 1 && "Please ensure total allocation equals 100%"}
          {selectedTier === 'high' && !acceptedWarnings.has('high') && " • Accept risk warnings to proceed"}
        </div>
      )}
    </div>
  )
}