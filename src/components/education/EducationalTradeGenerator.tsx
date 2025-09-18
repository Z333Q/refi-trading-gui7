import React, { useState, useEffect } from 'react'
import { TradeExplanationOverlay } from './TradeExplanationOverlay'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { 
  Play, 
  BookOpen, 
  TrendingUp, 
  Brain,
  Target,
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

interface EducationalTradeGeneratorProps {
  onXPEarned: (xp: number) => void
}

const tradeTemplates = [
  {
    symbol: 'AAPL',
    side: 'buy' as const,
    strategy: 'PPO Momentum',
    tradeType: {
      name: 'Momentum Breakout',
      definition: 'A momentum breakout trade involves buying a security when it breaks above a significant resistance level with strong volume, expecting the upward momentum to continue.',
      characteristics: [
        'Entry on breakout above resistance',
        'High volume confirmation required',
        'Trend-following approach',
        'Typically held for days to weeks',
        'Risk managed with trailing stops'
      ],
      timeHorizon: '3-10 trading days',
      riskProfile: 'medium' as const
    },
    logic: {
      technicalIndicators: [
        'RSI above 60 indicating strong momentum',
        '20-day moving average trending upward',
        'Volume 150% above average on breakout',
        'MACD showing bullish crossover'
      ],
      fundamentalFactors: [
        'Strong quarterly earnings beat expectations',
        'Positive analyst upgrades this week',
        'New product launch generating buzz',
        'Sector rotation into technology'
      ],
      marketSentiment: 'Bullish sentiment driven by AI innovation and strong consumer demand for premium devices',
      triggerReason: 'Price broke above $235 resistance with 2.1M volume, confirming institutional buying interest'
    },
    riskManagement: {
      stopLoss: 232.50,
      positionSize: '2% of portfolio (calculated using Kelly Criterion)',
      riskRewardRatio: '1:3 (risking $6.49 to make $19.47 per share)',
      exitStrategy: 'Take 50% profit at $255 target, trail remaining position with 3% stop'
    },
    marketContext: {
      conditions: 'Market is in a confirmed uptrend with technology sector showing relative strength. Low VIX suggests stable conditions favorable for momentum strategies.',
      volatility: 'Moderate (20-day ATR: $4.20)',
      volume: 'Above average (150% of 20-day average)',
      trend: 'Strong uptrend with higher highs and higher lows'
    },
    learningObjectives: [
      'Understand how to identify valid breakout patterns with volume confirmation',
      'Learn to combine technical indicators with fundamental catalysts for higher probability trades',
      'Master proper position sizing using portfolio percentage rules',
      'Develop skills in setting appropriate risk-reward ratios for momentum trades',
      'Practice trailing stop techniques to maximize profits while protecting capital'
    ],
    xpReward: 25
  },
  {
    symbol: 'TSLA',
    side: 'sell' as const,
    strategy: 'TD3 Mean Reversion',
    tradeType: {
      name: 'Mean Reversion Short',
      definition: 'A mean reversion trade that involves selling an overbought security expecting it to return to its statistical average price level.',
      characteristics: [
        'Entry when price is statistically overbought',
        'Relies on price returning to mean',
        'Counter-trend approach',
        'Shorter holding periods',
        'Tight risk management required'
      ],
      timeHorizon: '1-5 trading days',
      riskProfile: 'high' as const
    },
    logic: {
      technicalIndicators: [
        'RSI above 80 indicating severe overbought condition',
        'Price 2.5 standard deviations above 20-day moving average',
        'Bollinger Bands showing extreme expansion',
        'Stochastic oscillator in overbought territory'
      ],
      fundamentalFactors: [
        'No significant fundamental news to justify price spike',
        'Valuation metrics stretched compared to peers',
        'Options flow showing heavy call buying (contrarian signal)',
        'Insider selling reported this week'
      ],
      marketSentiment: 'Euphoric sentiment with retail FOMO driving prices beyond reasonable valuations',
      triggerReason: 'Price reached 2.5 standard deviations above mean with declining volume, suggesting exhaustion'
    },
    riskManagement: {
      stopLoss: 435.00,
      positionSize: '1.5% of portfolio (reduced size due to counter-trend nature)',
      riskRewardRatio: '1:2.5 (risking $9.14 to make $22.86 per share)',
      exitStrategy: 'Target $403 (return to 20-day MA), cover 75% at target, trail remainder'
    },
    marketContext: {
      conditions: 'Market showing signs of overextension with several high-beta names reaching extreme levels. VIX remains low but starting to tick higher.',
      volatility: 'High (20-day ATR: $12.80)',
      volume: 'Declining on recent rallies (bearish divergence)',
      trend: 'Parabolic move showing signs of exhaustion'
    },
    learningObjectives: [
      'Learn to identify overbought conditions using multiple oscillators',
      'Understand the psychology behind mean reversion setups',
      'Master counter-trend trading with proper risk management',
      'Develop skills in recognizing price exhaustion patterns',
      'Practice managing short positions with tight stops'
    ],
    xpReward: 30
  },
  {
    symbol: 'NVDA',
    side: 'buy' as const,
    strategy: 'RVI-Q Swing',
    tradeType: {
      name: 'Swing Trade Setup',
      definition: 'A swing trade that aims to capture price moves over several days to weeks by identifying and trading with intermediate-term trends.',
      characteristics: [
        'Holds positions for days to weeks',
        'Focuses on intermediate-term price swings',
        'Uses both technical and fundamental analysis',
        'Moderate risk with defined exit points',
        'Targets 5-15% price moves'
      ],
      timeHorizon: '5-15 trading days',
      riskProfile: 'medium' as const
    },
    logic: {
      technicalIndicators: [
        'Relative Vigor Index showing bullish divergence',
        'Price forming higher low while RVI made higher low',
        '50-day moving average providing support',
        'Volume profile showing accumulation at current levels'
      ],
      fundamentalFactors: [
        'AI chip demand continuing to accelerate',
        'Data center expansion driving revenue growth',
        'New GPU architecture announcement expected',
        'Strong guidance from cloud providers'
      ],
      marketSentiment: 'Cautiously optimistic on AI infrastructure spending despite recent volatility',
      triggerReason: 'RVI divergence confirmed with price holding above key support, suggesting institutional accumulation'
    },
    riskManagement: {
      stopLoss: 162.00,
      positionSize: '2.5% of portfolio (standard swing trade allocation)',
      riskRewardRatio: '1:2.8 (risking $8.29 to make $23.21 per share)',
      exitStrategy: 'Initial target $193.50, scale out 60% at target, trail remainder with 5% stop'
    },
    marketContext: {
      conditions: 'Semiconductor sector showing resilience despite broader market uncertainty. AI theme remains strong with institutional support.',
      volatility: 'Elevated but declining (20-day ATR: $8.90)',
      volume: 'Steady accumulation pattern visible',
      trend: 'Consolidation within larger uptrend'
    },
    learningObjectives: [
      'Master the use of Relative Vigor Index for momentum analysis',
      'Learn to identify bullish divergences between price and momentum indicators',
      'Understand how to combine sector analysis with individual stock setups',
      'Develop patience for swing trade setups with proper risk-reward ratios',
      'Practice scaling out of profitable positions to maximize returns'
    ],
    xpReward: 20
  }
]

export function EducationalTradeGenerator({ onXPEarned }: EducationalTradeGeneratorProps) {
  const [currentTrade, setCurrentTrade] = useState<TradeExplanation | null>(null)
  const [showOverlay, setShowOverlay] = useState(false)
  const [availableTrades, setAvailableTrades] = useState(tradeTemplates)

  const generateEducationalTrade = () => {
    if (availableTrades.length === 0) {
      // Reset available trades if all have been used
      setAvailableTrades(tradeTemplates)
    }

    const template = availableTrades[Math.floor(Math.random() * availableTrades.length)]
    
    // Get current market price (simulated)
    const basePrice = template.symbol === 'AAPL' ? 238.99 : 
                     template.symbol === 'TSLA' ? 425.86 : 170.29
    const currentPrice = basePrice * (0.995 + Math.random() * 0.01) // ±0.5% variation
    
    const trade: TradeExplanation = {
      tradeId: `edu_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      symbol: template.symbol,
      side: template.side,
      quantity: [25, 50, 75, 100][Math.floor(Math.random() * 4)],
      price: currentPrice,
      strategy: template.strategy,
      tradeType: template.tradeType,
      logic: template.logic,
      riskManagement: {
        ...template.riskManagement,
        stopLoss: template.side === 'buy' 
          ? currentPrice * 0.97 // 3% below entry for long
          : currentPrice * 1.03  // 3% above entry for short
      },
      marketContext: template.marketContext,
      learningObjectives: template.learningObjectives,
      xpReward: template.xpReward
    }

    setCurrentTrade(trade)
    setShowOverlay(true)
    
    // Remove this template from available trades to avoid repetition
    setAvailableTrades(prev => prev.filter(t => t !== template))
  }

  const handleCloseOverlay = () => {
    setShowOverlay(false)
    setCurrentTrade(null)
  }

  const handleXPClaim = (xp: number) => {
    onXPEarned(xp)
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <Button
          onClick={generateEducationalTrade}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg"
        >
          <Brain className="h-4 w-4 mr-2" />
          Generate Educational Trade
        </Button>
        <p className="text-sm text-gray-400 mt-2">
          Learn trading concepts through real market scenarios
        </p>
      </div>

      {currentTrade && (
        <TradeExplanationOverlay
          trade={currentTrade}
          isVisible={showOverlay}
          onClose={handleCloseOverlay}
          onClaimXP={handleXPClaim}
        />
      )}
    </div>
  )
}