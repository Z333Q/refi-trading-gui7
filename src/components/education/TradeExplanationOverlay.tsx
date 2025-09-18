import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { 
  BookOpen, 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  Target,
  Clock,
  DollarSign,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  X,
  Star,
  Award,
  Lightbulb,
  Eye,
  Brain,
  Zap
} from 'lucide-react'

interface TradeExplanation {
  tradeId: string
  symbol: string
  side: 'buy' | 'sell'
  quantity: number
  price: number
  strategy: string
  tradeType: {
    name: string
    definition: string
    characteristics: string[]
    timeHorizon: string
    riskProfile: 'low' | 'medium' | 'high'
  }
  logic: {
    technicalIndicators: string[]
    fundamentalFactors: string[]
    marketSentiment: string
    triggerReason: string
  }
  riskManagement: {
    stopLoss: number
    positionSize: string
    riskRewardRatio: string
    exitStrategy: string
  }
  marketContext: {
    conditions: string
    volatility: string
    volume: string
    trend: string
  }
  learningObjectives: string[]
  xpReward: number
}

interface TradeExplanationOverlayProps {
  trade: TradeExplanation
  isVisible: boolean
  onClose: () => void
  onClaimXP: (xp: number) => void
}

export function TradeExplanationOverlay({ 
  trade, 
  isVisible, 
  onClose, 
  onClaimXP 
}: TradeExplanationOverlayProps) {
  const [currentSection, setCurrentSection] = useState(0)
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set())
  const [hasClaimedXP, setHasClaimedXP] = useState(false)

  const sections = [
    {
      id: 'execution',
      title: 'Trade Execution Summary',
      icon: Target,
      color: 'emerald'
    },
    {
      id: 'type',
      title: 'Trade Type & Definition',
      icon: BookOpen,
      color: 'blue'
    },
    {
      id: 'logic',
      title: 'Detailed Trade Logic',
      icon: Brain,
      color: 'purple'
    },
    {
      id: 'risk',
      title: 'Risk Management',
      icon: Shield,
      color: 'red'
    },
    {
      id: 'context',
      title: 'Market Context & Timing',
      icon: BarChart3,
      color: 'amber'
    },
    {
      id: 'learning',
      title: 'Key Learning Points',
      icon: Lightbulb,
      color: 'yellow'
    }
  ]

  const handleSectionComplete = (sectionIndex: number) => {
    setCompletedSections(prev => new Set([...prev, sectionIndex]))
  }

  const handleClaimXP = () => {
    onClaimXP(trade.xpReward)
    setHasClaimedXP(true)
  }

  const progress = (completedSections.size / sections.length) * 100
  const canClaimXP = completedSections.size === sections.length && !hasClaimedXP

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-950 border border-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                trade.side === 'buy' ? 'bg-green-950/20 border border-green-800' : 'bg-red-950/20 border border-red-800'
              }`}>
                {trade.side === 'buy' ? (
                  <TrendingUp className="h-6 w-6 text-green-500" />
                ) : (
                  <TrendingDown className="h-6 w-6 text-red-500" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold">Trade Education: {trade.symbol}</h2>
                <p className="text-gray-400">
                  {trade.side.toUpperCase()} {trade.quantity} shares @ ${trade.price.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {hasClaimedXP && (
                <Badge variant="success" className="flex items-center space-x-1">
                  <Star className="h-3 w-3" />
                  <span>+{trade.xpReward} XP Earned</span>
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
              <span>Learning Progress</span>
              <span>{completedSections.size} / {sections.length} sections</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <div className="p-6">
          {/* Section Navigation */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-6">
            {sections.map((section, index) => {
              const Icon = section.icon
              const isCompleted = completedSections.has(index)
              const isActive = currentSection === index
              
              return (
                <Button
                  key={section.id}
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className={`flex flex-col items-center space-y-1 h-auto py-3 ${
                    isActive ? `border-${section.color}-500` : ''
                  }`}
                  onClick={() => setCurrentSection(index)}
                >
                  <div className="flex items-center space-x-1">
                    <Icon className={`h-4 w-4 text-${section.color}-500`} />
                    {isCompleted && <CheckCircle className="h-3 w-3 text-green-500" />}
                  </div>
                  <span className="text-xs text-center leading-tight">
                    {section.title.split(' ').slice(0, 2).join(' ')}
                  </span>
                </Button>
              )
            })}
          </div>

          {/* Section Content */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {React.createElement(sections[currentSection].icon, { 
                  className: `h-5 w-5 text-${sections[currentSection].color}-500` 
                })}
                <span>{sections[currentSection].title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentSection === 0 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-gray-900 border border-gray-800">
                      <h4 className="font-semibold mb-3">Trade Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Symbol:</span>
                          <span className="font-bold">{trade.symbol}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Direction:</span>
                          <Badge variant={trade.side === 'buy' ? 'success' : 'destructive'}>
                            {trade.side.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Quantity:</span>
                          <span>{trade.quantity} shares</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Entry Price:</span>
                          <span>${trade.price.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Notional Value:</span>
                          <span>${(trade.quantity * trade.price).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-blue-950/20 border border-blue-800">
                      <h4 className="font-semibold mb-3 text-blue-400">Strategy Context</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Strategy:</span>
                          <span className="text-blue-300">{trade.strategy}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Trade Type:</span>
                          <span className="text-blue-300">{trade.tradeType.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Time Horizon:</span>
                          <span className="text-blue-300">{trade.tradeType.timeHorizon}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Risk Profile:</span>
                          <Badge variant={
                            trade.tradeType.riskProfile === 'low' ? 'success' :
                            trade.tradeType.riskProfile === 'medium' ? 'warning' : 'destructive'
                          }>
                            {trade.tradeType.riskProfile.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => handleSectionComplete(0)}
                    className="w-full"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Section Complete
                  </Button>
                </div>
              )}

              {currentSection === 1 && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-blue-950/20 border border-blue-800">
                    <h4 className="font-semibold text-blue-400 mb-3">{trade.tradeType.name}</h4>
                    <p className="text-gray-300 mb-4">{trade.tradeType.definition}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-blue-300 mb-2">Key Characteristics:</h5>
                        <ul className="space-y-1 text-sm">
                          {trade.tradeType.characteristics.map((char, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                              <span className="text-gray-300">{char}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="p-3 rounded-lg bg-gray-800">
                          <div className="flex items-center space-x-2 mb-1">
                            <Clock className="h-4 w-4 text-amber-500" />
                            <span className="font-medium text-amber-400">Time Horizon</span>
                          </div>
                          <p className="text-sm text-gray-300">{trade.tradeType.timeHorizon}</p>
                        </div>
                        
                        <div className="p-3 rounded-lg bg-gray-800">
                          <div className="flex items-center space-x-2 mb-1">
                            <Shield className="h-4 w-4 text-red-500" />
                            <span className="font-medium text-red-400">Risk Profile</span>
                          </div>
                          <Badge variant={
                            trade.tradeType.riskProfile === 'low' ? 'success' :
                            trade.tradeType.riskProfile === 'medium' ? 'warning' : 'destructive'
                          }>
                            {trade.tradeType.riskProfile.toUpperCase()} RISK
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => handleSectionComplete(1)}
                    className="w-full"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Section Complete
                  </Button>
                </div>
              )}

              {currentSection === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-purple-950/20 border-purple-800">
                      <CardHeader>
                        <CardTitle className="text-lg text-purple-400">Technical Analysis</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <h5 className="font-medium text-purple-300 mb-2">Indicators Used:</h5>
                          <div className="space-y-2">
                            {trade.logic.technicalIndicators.map((indicator, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <BarChart3 className="h-4 w-4 text-purple-500" />
                                <span className="text-sm text-gray-300">{indicator}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="p-3 rounded-lg bg-purple-900/30">
                          <h5 className="font-medium text-purple-300 mb-1">Trigger Reason:</h5>
                          <p className="text-sm text-gray-300">{trade.logic.triggerReason}</p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-green-950/20 border-green-800">
                      <CardHeader>
                        <CardTitle className="text-lg text-green-400">Fundamental Context</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <h5 className="font-medium text-green-300 mb-2">Factors Considered:</h5>
                          <div className="space-y-2">
                            {trade.logic.fundamentalFactors.map((factor, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <TrendingUp className="h-4 w-4 text-green-500" />
                                <span className="text-sm text-gray-300">{factor}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="p-3 rounded-lg bg-green-900/30">
                          <h5 className="font-medium text-green-300 mb-1">Market Sentiment:</h5>
                          <p className="text-sm text-gray-300">{trade.logic.marketSentiment}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Button 
                    onClick={() => handleSectionComplete(2)}
                    className="w-full"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Section Complete
                  </Button>
                </div>
              )}

              {currentSection === 3 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <Card className="bg-red-950/20 border-red-800">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-2 mb-3">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                            <h4 className="font-semibold text-red-400">Stop Loss</h4>
                          </div>
                          <div className="text-2xl font-bold text-red-300 mb-1">
                            ${trade.riskManagement.stopLoss.toFixed(2)}
                          </div>
                          <p className="text-sm text-gray-400">
                            Maximum loss per share if trade goes against us
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-blue-950/20 border-blue-800">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-2 mb-3">
                            <DollarSign className="h-5 w-5 text-blue-500" />
                            <h4 className="font-semibold text-blue-400">Position Size</h4>
                          </div>
                          <div className="text-lg font-bold text-blue-300 mb-1">
                            {trade.riskManagement.positionSize}
                          </div>
                          <p className="text-sm text-gray-400">
                            Calculated based on portfolio risk tolerance
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-amber-950/20 border border-amber-800">
                        <h4 className="font-semibold text-amber-400 mb-3">Risk-Reward Analysis</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Risk-Reward Ratio:</span>
                            <span className="font-bold text-amber-300">{trade.riskManagement.riskRewardRatio}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Max Risk per Share:</span>
                            <span className="text-red-400">
                              ${(trade.price - trade.riskManagement.stopLoss).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Total Risk:</span>
                            <span className="text-red-400">
                              ${((trade.price - trade.riskManagement.stopLoss) * trade.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-lg bg-green-950/20 border border-green-800">
                        <h4 className="font-semibold text-green-400 mb-3">Exit Strategy</h4>
                        <p className="text-sm text-gray-300">{trade.riskManagement.exitStrategy}</p>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => handleSectionComplete(3)}
                    className="w-full"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Section Complete
                  </Button>
                </div>
              )}

              {currentSection === 4 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-amber-950/20 border-amber-800">
                      <CardHeader>
                        <CardTitle className="text-lg text-amber-400">Market Conditions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Overall Trend:</span>
                            <span className="text-amber-300">{trade.marketContext.trend}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Volatility:</span>
                            <span className="text-amber-300">{trade.marketContext.volatility}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Volume:</span>
                            <span className="text-amber-300">{trade.marketContext.volume}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <div className="p-4 rounded-lg bg-gray-900 border border-gray-800">
                      <h4 className="font-semibold mb-3">Why This Trade Now?</h4>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        {trade.marketContext.conditions}
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => handleSectionComplete(4)}
                    className="w-full"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Section Complete
                  </Button>
                </div>
              )}

              {currentSection === 5 && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-yellow-950/20 border border-yellow-800">
                    <h4 className="font-semibold text-yellow-400 mb-4">Key Learning Objectives</h4>
                    <div className="space-y-3">
                      {trade.learningObjectives.map((objective, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-6 h-6 rounded-full bg-yellow-600 text-white text-sm flex items-center justify-center font-bold mt-0.5">
                            {index + 1}
                          </div>
                          <p className="text-sm text-gray-300 leading-relaxed">{objective}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Card className="bg-emerald-950/20 border-emerald-800">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <Lightbulb className="h-5 w-5 text-emerald-500" />
                        <h4 className="font-semibold text-emerald-400">Pro Tip</h4>
                      </div>
                      <p className="text-sm text-emerald-300">
                        Watch for similar setups in the future. The combination of technical indicators and market conditions 
                        that triggered this trade can be applied to other symbols in similar market environments.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Button 
                    onClick={() => handleSectionComplete(5)}
                    className="w-full"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Section Complete
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* XP Reward Section */}
          {canClaimXP && (
            <Card className="bg-gradient-to-r from-yellow-950/30 to-orange-950/30 border-yellow-800">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Award className="h-8 w-8 text-yellow-500" />
                  <Star className="h-6 w-6 text-yellow-400" />
                </div>
                <h3 className="text-xl font-bold text-yellow-400 mb-2">
                  Learning Complete!
                </h3>
                <p className="text-gray-300 mb-4">
                  You've completed all sections of this trade education. Claim your XP reward!
                </p>
                <Button 
                  onClick={handleClaimXP}
                  className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-semibold shadow-lg"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Claim +{trade.xpReward} XP
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
              disabled={currentSection === 0}
            >
              Previous Section
            </Button>
            
            <Button
              onClick={() => setCurrentSection(Math.min(sections.length - 1, currentSection + 1))}
              disabled={currentSection === sections.length - 1}
            >
              Next Section
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}