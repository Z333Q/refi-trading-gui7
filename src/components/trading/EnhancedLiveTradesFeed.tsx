import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { TradingConceptTooltip, useTradingConceptTooltip, ConceptLink } from '../education/TradingConceptTooltip'
import { TradeExplanationOverlay } from '../education/TradeExplanationOverlay'
import { 
  Activity, 
  ExternalLink, 
  Hash, 
  Shield, 
  BookOpen,
  HelpCircle,
  Star,
  Brain
} from 'lucide-react'

interface Trade {
  id: string
  symbol: string
  side: 'buy' | 'sell'
  quantity: number
  price: number
  timestamp: string
  strategy: string
  status: 'pending' | 'filled' | 'cancelled'
  pnl?: number
  proofHash?: string
  aceVerdict?: string
  anchorTxHash?: string
}

interface EnhancedLiveTradesFeedProps {
  trades: Trade[]
  onXPEarned: (xp: number) => void
}

// Generate educational explanations for trades
const generateTradeExplanation = (trade: Trade) => {
  const explanations = {
    'PPO Momentum': {
      tradeType: {
        name: 'Momentum Continuation',
        definition: 'A momentum trade that enters positions in the direction of the prevailing trend when technical indicators confirm continued strength.',
        characteristics: [
          'Follows existing price trends',
          'Enters on pullbacks or breakouts',
          'Uses momentum oscillators for timing',
          'Typically held for several days',
          'Profits from trend continuation'
        ],
        timeHorizon: '3-10 trading days',
        riskProfile: 'medium' as const
      },
      logic: {
        technicalIndicators: [
          'PPO (Percentage Price Oscillator) showing bullish signal',
          'Price above 20-day exponential moving average',
          'Relative strength vs. market showing outperformance',
          'Volume confirming the move with above-average activity'
        ],
        fundamentalFactors: [
          'Sector showing relative strength',
          'No negative news or earnings concerns',
          'Institutional flow showing net buying',
          'Options activity suggesting bullish positioning'
        ],
        marketSentiment: 'Positive momentum with institutional support',
        triggerReason: 'PPO crossed above signal line with price confirming breakout pattern'
      },
      learningObjectives: [
        'Understand how PPO differs from MACD and when to use each',
        'Learn to identify high-probability momentum setups',
        'Master the timing of entries using momentum oscillators',
        'Develop skills in trend-following position management'
      ]
    },
    'TD3 Mean Reversion': {
      tradeType: {
        name: 'Statistical Mean Reversion',
        definition: 'A mean reversion trade that exploits temporary price deviations from statistical norms, expecting prices to return to their average levels.',
        characteristics: [
          'Counter-trend approach',
          'Based on statistical analysis',
          'Shorter holding periods',
          'Higher win rate but smaller average wins',
          'Requires precise timing and risk management'
        ],
        timeHorizon: '1-5 trading days',
        riskProfile: 'high' as const
      },
      logic: {
        technicalIndicators: [
          'Price 2+ standard deviations from mean',
          'Bollinger Bands showing extreme readings',
          'RSI in oversold/overbought territory',
          'Z-score indicating statistical extremes'
        ],
        fundamentalFactors: [
          'No fundamental reason for extreme price move',
          'Valuation metrics suggesting overextension',
          'Market microstructure showing imbalance',
          'Historical patterns supporting reversion'
        ],
        marketSentiment: 'Extreme sentiment creating temporary mispricing opportunity',
        triggerReason: 'Statistical models indicating high probability of mean reversion'
      },
      learningObjectives: [
        'Learn to identify statistically significant price deviations',
        'Understand the psychology behind mean reversion',
        'Master counter-trend trading with tight risk controls',
        'Develop skills in statistical analysis for trading'
      ]
    },
    'RVI-Q Swing': {
      tradeType: {
        name: 'Swing Trade with RVI Confirmation',
        definition: 'A swing trade that uses the Relative Vigor Index to identify optimal entry points within established trends for intermediate-term moves.',
        characteristics: [
          'Intermediate-term holding period',
          'Uses RVI for momentum confirmation',
          'Targets significant price swings',
          'Combines trend and momentum analysis',
          'Balanced risk-reward approach'
        ],
        timeHorizon: '5-15 trading days',
        riskProfile: 'medium' as const
      },
      logic: {
        technicalIndicators: [
          'RVI showing bullish divergence with price',
          'Price forming higher lows while maintaining trend',
          'Support/resistance levels clearly defined',
          'Volume patterns confirming accumulation/distribution'
        ],
        fundamentalFactors: [
          'Sector fundamentals remain strong',
          'Company-specific catalysts on horizon',
          'Earnings expectations well-defined',
          'Analyst sentiment stable or improving'
        ],
        marketSentiment: 'Measured optimism with focus on intermediate-term catalysts',
        triggerReason: 'RVI divergence confirmed with price holding key support levels'
      },
      learningObjectives: [
        'Master the use of Relative Vigor Index for swing trading',
        'Learn to identify and trade bullish/bearish divergences',
        'Understand swing trading position management',
        'Develop patience for intermediate-term setups'
      ]
    }
  }

  const baseExplanation = explanations[trade.strategy as keyof typeof explanations] || explanations['PPO Momentum']
  
  return {
    tradeId: trade.id,
    symbol: trade.symbol,
    side: trade.side,
    quantity: trade.quantity,
    price: trade.price,
    strategy: trade.strategy,
    ...baseExplanation,
    riskManagement: {
      ...baseExplanation.riskManagement,
      stopLoss: trade.side === 'buy' 
        ? trade.price * 0.97 
        : trade.price * 1.03
    },
    xpReward: baseExplanation.tradeType.riskProfile === 'high' ? 30 : 
              baseExplanation.tradeType.riskProfile === 'medium' ? 20 : 15
  }
}

export function EnhancedLiveTradesFeed({ trades, onXPEarned }: EnhancedLiveTradesFeedProps) {
  const [selectedTradeForEducation, setSelectedTradeForEducation] = useState<string | null>(null)
  const [showEducationOverlay, setShowEducationOverlay] = useState(false)
  const [educatedTrades, setEducatedTrades] = useState<Set<string>>(new Set())
  
  const {
    activeTooltip,
    tooltipPosition,
    showTooltip,
    hideTooltip,
    getConcept
  } = useTradingConceptTooltip()

  const formatPrice = (price: number) => `$${price.toFixed(2)}`
  const formatTime = (timestamp: string) => {
    const now = new Date()
    const tradeTime = new Date(timestamp)
    const diffMs = now.getTime() - tradeTime.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffSecs = Math.floor((diffMs % 60000) / 1000)
    
    if (diffMins > 0) return `${diffMins}m ago`
    return `${diffSecs}s ago`
  }

  const handleLearnFromTrade = (tradeId: string) => {
    setSelectedTradeForEducation(tradeId)
    setShowEducationOverlay(true)
  }

  const handleEducationComplete = (xp: number) => {
    if (selectedTradeForEducation) {
      setEducatedTrades(prev => new Set([...prev, selectedTradeForEducation]))
      onXPEarned(xp)
    }
    setShowEducationOverlay(false)
    setSelectedTradeForEducation(null)
  }

  const selectedTrade = selectedTradeForEducation 
    ? trades.find(t => t.id === selectedTradeForEducation)
    : null

  const tradeExplanation = selectedTrade ? generateTradeExplanation(selectedTrade) : null

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-emerald-500" />
            <span>Educational Trades Feed</span>
            <Badge variant="secondary" className="ml-auto">
              {trades.length} trades
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {trades.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No recent trades</p>
              </div>
            ) : (
              trades.map((trade) => {
                const hasEducation = educatedTrades.has(trade.id)
                
                return (
                  <div
                    key={trade.id}
                    className={`p-3 rounded-lg border transition-all duration-300 ${
                      trade.status === 'pending' 
                        ? 'border-yellow-800 bg-yellow-950/20 animate-pulse' 
                        : trade.status === 'filled'
                        ? 'border-green-800 bg-green-950/20'
                        : 'border-red-800 bg-red-950/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={trade.side === 'buy' ? 'success' : 'destructive'}
                          className="text-xs font-bold"
                        >
                          {trade.side.toUpperCase()}
                        </Badge>
                        <span className="font-bold">{trade.symbol}</span>
                        <span className="text-sm text-gray-400">
                          {trade.quantity} @ {formatPrice(trade.price)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={
                            trade.status === 'pending' ? 'warning' :
                            trade.status === 'filled' ? 'success' : 'destructive'
                          }
                          className="text-xs"
                        >
                          {trade.status}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {formatTime(trade.timestamp)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-gray-400">
                        Strategy: <ConceptLink 
                          conceptId="momentum" 
                          onShow={showTooltip}
                        >
                          {trade.strategy}
                        </ConceptLink>
                      </div>
                      
                      {trade.status === 'filled' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleLearnFromTrade(trade.id)}
                          className={`text-xs ${
                            hasEducation 
                              ? 'border-green-600 text-green-400' 
                              : 'border-blue-600 text-blue-400'
                          }`}
                        >
                          {hasEducation ? (
                            <>
                              <Star className="h-3 w-3 mr-1" />
                              Learned
                            </>
                          ) : (
                            <>
                              <BookOpen className="h-3 w-3 mr-1" />
                              Learn (+{trade.strategy === 'TD3 Mean Reversion' ? '30' : '20'} XP)
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                    
                    {trade.status === 'filled' && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                        <div className="p-2 rounded bg-blue-950/20 border border-blue-800">
                          <div className="flex items-center space-x-1 mb-1">
                            <Hash className="h-3 w-3 text-blue-500" />
                            <ConceptLink conceptId="zk-proof" onShow={showTooltip}>
                              <span className="text-blue-400 font-medium">zk-Proof</span>
                            </ConceptLink>
                          </div>
                          <div className="font-mono text-blue-300 truncate">
                            {trade.proofHash}
                          </div>
                        </div>
                        
                        <div className="p-2 rounded bg-green-950/20 border border-green-800">
                          <div className="flex items-center space-x-1 mb-1">
                            <Shield className="h-3 w-3 text-green-500" />
                            <span className="text-green-400 font-medium">ACE</span>
                          </div>
                          <div className="font-mono text-green-300">
                            {trade.aceVerdict}
                          </div>
                        </div>
                        
                        <div className="p-2 rounded bg-purple-950/20 border border-purple-800">
                          <div className="flex items-center space-x-1 mb-1">
                            <ExternalLink className="h-3 w-3 text-purple-500" />
                            <span className="text-purple-400 font-medium">Anchor</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="font-mono text-purple-300 truncate">
                              {trade.anchorTxHash}
                            </div>
                            <Button variant="ghost" size="icon" className="h-4 w-4">
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
          
          <div className="mt-4 p-3 rounded-lg bg-gray-900 border border-gray-800">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Trade Execution:</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-emerald-400">Active</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-gray-400">Educational Mode:</span>
              <div className="flex items-center space-x-2">
                <BookOpen className="h-3 w-3 text-blue-400" />
                <span className="text-blue-400">Learn from every trade</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
          onClaimXP={onXPEarned}
          position={tooltipPosition}
        />
      )}

      {/* Trade Education Overlay */}
      {tradeExplanation && (
        <TradeExplanationOverlay
          trade={tradeExplanation}
          isVisible={showEducationOverlay}
          onClose={() => setShowEducationOverlay(false)}
          onClaimXP={handleEducationComplete}
        />
      )}
    </>
  )
}