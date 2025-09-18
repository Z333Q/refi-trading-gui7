import { useState, useEffect, useRef } from 'react'
import { usePolygonWebSocket } from './usePolygonWebSocket'
import type { DualProofGate, SafeModeStatus } from '@/types/trading'

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

interface Position {
  symbol: string
  quantity: number
  avgPrice: number
  currentPrice: number
  unrealizedPnl: number
  realizedPnl: number
  side: 'long' | 'short'
}

interface MarketData {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
  bid: number
  ask: number
  lastUpdate: string
}

interface PortfolioMetrics {
  totalValue: number
  dailyPnl: number
  dailyPnlPercent: number
  totalPnl: number
  totalPnlPercent: number
  buyingPower: number
  marginUsed: number
  riskScore: number
}

const SYMBOLS = ['AAPL', 'TSLA', 'NVDA', 'MSFT', 'GOOGL', 'AMZN', 'META', 'NFLX']
const STRATEGIES = ['PPO Momentum', 'TD3 Mean Reversion', 'RVI-Q Swing']

// Polygon.io API key - in production, this should come from environment variables
const POLYGON_API_KEY = import.meta.env.VITE_POLYGON_API_KEY || 'demo' // Use 'demo' for testing

// Base prices for realistic movement
const BASE_PRICES: Record<string, number> = {
  'AAPL': 202.38,
  'TSLA': 302.63,
  'NVDA': 173.72,
  'MSFT': 524.11,
  'GOOGL': 189.13,
  'AMZN': 214.75,
  'META': 750.01,
  'NFLX': 1158.60
}

export function useTradingSimulation() {
  const [trades, setTrades] = useState<Trade[]>([])
  const [positions, setPositions] = useState<Position[]>([])
  const [portfolioMetrics, setPortfolioMetrics] = useState<PortfolioMetrics>({
    totalValue: 124567.89,
    dailyPnl: 2856.12,
    dailyPnlPercent: 1.87,
    totalPnl: 18567.89,
    totalPnlPercent: 17.6,
    buyingPower: 45230.11,
    marginUsed: 12340.56,
    riskScore: 2.1
  })
  const [dualProofGate, setDualProofGate] = useState<DualProofGate | undefined>()
  const [safeModeStatus] = useState<SafeModeStatus>({ active: false })
  const [isGeneratingProof, setIsGeneratingProof] = useState(false)
  const [latencyMetrics, setLatencyMetrics] = useState({
    current: 89,
    p95: 142,
    proofTime: 12,
    aceTime: 4
  })
  const [isInitialized, setIsInitialized] = useState(false)

  const intervalRefs = useRef<NodeJS.Timeout[]>([])

  // Use Polygon WebSocket for live market data
  const { 
    marketData, 
    connectionStatus, 
    error: polygonError 
  } = usePolygonWebSocket({
    apiKey: POLYGON_API_KEY,
    symbols: SYMBOLS,
    enabled: true
  })

  // Fallback to simulated data if Polygon connection fails
  const [fallbackMarketData, setFallbackMarketData] = useState<MarketData[]>([])
  const [useFallback, setUseFallback] = useState(false)

  // Initialize fallback market data
  useEffect(() => {
    const initializeSimulation = async () => {
      try {
        const initialMarketData = SYMBOLS.map(symbol => ({
          symbol,
          price: BASE_PRICES[symbol] * (0.98 + Math.random() * 0.04), // ±2% variation
          change: (Math.random() - 0.5) * 10, // ±$5 change
          changePercent: (Math.random() - 0.5) * 4, // ±2% change
          volume: Math.floor(Math.random() * 1000000) + 500000,
          bid: 0,
          ask: 0,
          lastUpdate: new Date().toISOString()
        }))

        // Set bid/ask spreads
        initialMarketData.forEach(data => {
          const spread = data.price * 0.001 // 0.1% spread
          data.bid = data.price - spread / 2
          data.ask = data.price + spread / 2
        })

        setFallbackMarketData(initialMarketData)

        // Initialize some positions
        setPositions([
          {
            symbol: 'AAPL',
            quantity: 100,
            avgPrice: 176.23,
            currentPrice: initialMarketData.find(d => d.symbol === 'AAPL')?.price || 178.45,
            unrealizedPnl: 0,
            realizedPnl: 0,
            side: 'long'
          },
          {
            symbol: 'TSLA',
            quantity: 50,
            avgPrice: 245.67,
            currentPrice: initialMarketData.find(d => d.symbol === 'TSLA')?.price || 242.18,
            unrealizedPnl: 0,
            realizedPnl: 0,
            side: 'long'
          },
          {
            symbol: 'NVDA',
            quantity: 25,
            avgPrice: 452.34,
            currentPrice: initialMarketData.find(d => d.symbol === 'NVDA')?.price || 456.78,
            unrealizedPnl: 0,
            realizedPnl: 0,
            side: 'long'
          }
        ])
        
        setIsInitialized(true)
      } catch (error) {
        console.error('Error initializing trading simulation:', error)
        setIsInitialized(true) // Still mark as initialized to prevent infinite loading
      }
    }

    initializeSimulation()
  }, [])

  // Monitor Polygon connection and switch to fallback if needed
  useEffect(() => {
    if (connectionStatus === 'error' || polygonError) {
      console.log('Polygon connection unavailable, using simulated market data')
      setUseFallback(true)
    } else if (connectionStatus === 'connected') {
      console.log('Polygon connected successfully, using live market data')
      setUseFallback(false)
    }
  }, [connectionStatus, polygonError])

  // Update fallback market prices every 1-3 seconds when using fallback
  useEffect(() => {
    if (!useFallback) return

    const updateFallbackPrices = () => {
      setFallbackMarketData(prev => prev.map(data => {
        // Realistic price movement (mean reversion with volatility)
        const basePrice = BASE_PRICES[data.symbol]
        const currentDeviation = (data.price - basePrice) / basePrice
        
        // Mean reversion factor (pulls back to base price)
        const meanReversion = -currentDeviation * 0.1
        
        // Random volatility
        const volatility = (Math.random() - 0.5) * 0.002 // ±0.1%
        
        // Combine factors
        const priceChange = (meanReversion + volatility) * data.price
        const newPrice = Math.max(data.price + priceChange, basePrice * 0.8) // Floor at 20% below base
        
        const change = newPrice - data.price
        const changePercent = (change / data.price) * 100
        
        const spread = newPrice * (0.0008 + Math.random() * 0.0004) // 0.08-0.12% spread
        
        return {
          ...data,
          price: newPrice,
          change: data.change + change,
          changePercent: ((newPrice - basePrice) / basePrice) * 100,
          bid: newPrice - spread / 2,
          ask: newPrice + spread / 2,
          volume: data.volume + Math.floor(Math.random() * 10000),
          lastUpdate: new Date().toISOString()
        }
      }))
    }

    const interval = setInterval(updateFallbackPrices, 1000 + Math.random() * 2000) // 1-3 seconds
    intervalRefs.current.push(interval)

    return () => clearInterval(interval)
  }, [useFallback])

  // Update positions based on market prices
  useEffect(() => {
    const currentMarketData = useFallback ? fallbackMarketData : marketData
    
    setPositions(prev => prev.map(position => {
      const marketPrice = currentMarketData.find(d => d.symbol === position.symbol)?.price || position.currentPrice
      const unrealizedPnl = (marketPrice - position.avgPrice) * position.quantity * (position.side === 'long' ? 1 : -1)
      
      return {
        ...position,
        currentPrice: marketPrice,
        unrealizedPnl
      }
    }))
  }, [marketData, fallbackMarketData, useFallback])

  // Update portfolio metrics
  useEffect(() => {
    const totalUnrealizedPnl = positions.reduce((sum, pos) => sum + pos.unrealizedPnl, 0)
    const totalRealizedPnl = positions.reduce((sum, pos) => sum + pos.realizedPnl, 0)
    const totalPositionValue = positions.reduce((sum, pos) => sum + (pos.currentPrice * Math.abs(pos.quantity)), 0)
    
    setPortfolioMetrics(prev => ({
      ...prev,
      totalValue: Math.max(100000, prev.totalValue + (totalUnrealizedPnl - prev.totalPnl) * 0.1), // Smooth updates, minimum 100k
      dailyPnl: Math.max(-1000, prev.dailyPnl + (Math.random() - 0.3) * 50), // Bias towards positive, cap losses
      dailyPnlPercent: Math.max(-2.0, prev.dailyPnlPercent + (Math.random() - 0.3) * 0.1), // Bias towards positive
      totalPnl: totalUnrealizedPnl + totalRealizedPnl,
      totalPnlPercent: Math.max(-5.0, ((totalUnrealizedPnl + totalRealizedPnl) / Math.max(100000, prev.totalValue - totalUnrealizedPnl - totalRealizedPnl)) * 100)
    }))
  }, [positions])

  // Generate new trades every 15-30 seconds
  useEffect(() => {
    const currentMarketData = useFallback ? fallbackMarketData : marketData
    
    const generateTrade = () => {
      const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
      const strategy = STRATEGIES[Math.floor(Math.random() * STRATEGIES.length)]
      const side = Math.random() > 0.5 ? 'buy' : 'sell'
      const quantity = [25, 50, 75, 100, 150, 200][Math.floor(Math.random() * 6)]
      const marketPrice = currentMarketData.find(d => d.symbol === symbol)?.price || BASE_PRICES[symbol]
      
      // Add some slippage
      const slippage = (Math.random() - 0.5) * 0.002 // ±0.1%
      const executionPrice = marketPrice * (1 + slippage)
      
      const newTrade: Trade = {
        id: `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        symbol,
        side,
        quantity,
        price: executionPrice,
        timestamp: new Date().toISOString(),
        strategy,
        status: 'pending',
        proofHash: `zk_${Math.random().toString(36).substr(2, 8)}`,
        aceVerdict: 'approved',
        anchorTxHash: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 6)}`
      }

      setTrades(prev => {
        const updated = [newTrade, ...prev].slice(0, 50) // Keep last 50 trades
        return updated
      })

      // Simulate trade execution after 1-3 seconds
      setTimeout(() => {
        setTrades(prev => prev.map(trade => 
          trade.id === newTrade.id 
            ? { ...trade, status: 'filled' as const }
            : trade
        ))

        // Update positions
        setPositions(prev => {
          const existingPos = prev.find(p => p.symbol === symbol)
          if (existingPos) {
            const newQuantity = side === 'buy' 
              ? existingPos.quantity + quantity
              : existingPos.quantity - quantity
            
            if (newQuantity === 0) {
              return prev.filter(p => p.symbol !== symbol)
            }
            
            const newAvgPrice = side === 'buy'
              ? ((existingPos.avgPrice * existingPos.quantity) + (executionPrice * quantity)) / newQuantity
              : existingPos.avgPrice
            
            return prev.map(p => p.symbol === symbol 
              ? { ...p, quantity: newQuantity, avgPrice: newAvgPrice }
              : p
            )
          } else if (side === 'buy') {
            return [...prev, {
              symbol,
              quantity,
              avgPrice: executionPrice,
              currentPrice: executionPrice,
              unrealizedPnl: 0,
              realizedPnl: 0,
              side: 'long' as const
            }]
          }
          return prev
        })
      }, 1000 + Math.random() * 2000)
    }

    const interval = setInterval(generateTrade, 15000 + Math.random() * 15000) // 15-30 seconds
    intervalRefs.current.push(interval)

    return () => clearInterval(interval)
  }, [marketData, fallbackMarketData, useFallback])

  // Update latency metrics
  useEffect(() => {
    const updateLatency = () => {
      setLatencyMetrics(prev => ({
        current: Math.max(50, prev.current + (Math.random() - 0.5) * 20),
        p95: Math.max(100, prev.p95 + (Math.random() - 0.5) * 10),
        proofTime: Math.max(5, prev.proofTime + (Math.random() - 0.5) * 4),
        aceTime: Math.max(2, prev.aceTime + (Math.random() - 0.5) * 2)
      }))
    }

    const interval = setInterval(updateLatency, 2000 + Math.random() * 3000) // 2-5 seconds
    intervalRefs.current.push(interval)

    return () => clearInterval(interval)
  }, [])

  // Generate dual proof gate
  const generateDualProof = async () => {
    setIsGeneratingProof(true)
    
    // Simulate proof generation time
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000))
    
    const newProofGate: DualProofGate = {
      zkVarProof: {
        proofId: `proof_${Date.now()}`,
        positions: positions.map(p => ({
          id: `pos_${p.symbol}`,
          symbol: p.symbol,
          quantity: p.quantity,
          avgPrice: p.avgPrice,
          marketValue: p.currentPrice * Math.abs(p.quantity),
          unrealizedPnl: p.unrealizedPnl,
          side: p.side,
          lastUpdated: new Date().toISOString()
        })),
        varEstimate: Math.floor(Math.random() * 3000) + 1500,
        confidenceLevel: 95,
        proofHash: `0x${Math.random().toString(16).substr(2, 16)}...${Math.random().toString(16).substr(2, 8)}`,
        generatedAt: new Date().toISOString(),
        verified: true,
        circuitParams: {
          n: 12,
          timeHorizon: 1,
          method: 'historical'
        }
      },
      acePolicyResult: {
        verdict: Math.random() > 0.1 ? 'approved' : 'clamped', // 90% approval rate
        originalNotional: Math.floor(Math.random() * 10000) + 5000,
        clampedNotional: Math.random() > 0.9 ? Math.floor(Math.random() * 5000) + 2500 : undefined,
        policyVersion: '1.0',
        jurisdiction: 'uae-gcc',
        timestamp: new Date().toISOString(),
        reason: Math.random() > 0.9 ? 'Position size limit applied' : undefined
      },
      gateDecision: 'pass',
      previewAnchorTx: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 6)}`,
      postFillAnchorTx: Math.random() > 0.5 ? `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 6)}` : undefined
    }

    setDualProofGate(newProofGate)
    setIsGeneratingProof(false)
  }

  // Auto-refresh proof gate every 30-60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isGeneratingProof && Math.random() > 0.7) { // 30% chance to auto-refresh
        generateDualProof()
      }
    }, 30000 + Math.random() * 30000)

    intervalRefs.current.push(interval)
    return () => clearInterval(interval)
  }, [isGeneratingProof])

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      intervalRefs.current.forEach(interval => clearInterval(interval))
    }
  }, [])

  // Get recent trades (last 10)
  const recentTrades = trades.slice(0, 10)

  // Calculate total portfolio value
  const totalPortfolioValue = positions.reduce((sum, pos) => 
    sum + (pos.currentPrice * Math.abs(pos.quantity)), portfolioMetrics.totalValue - positions.reduce((sum, pos) => sum + (pos.currentPrice * Math.abs(pos.quantity)), 0)
  )

  return {
    trades: recentTrades,
    positions,
    marketData: useFallback ? fallbackMarketData : marketData,
    portfolioMetrics: {
      ...portfolioMetrics,
      totalValue: totalPortfolioValue
    },
    dualProofGate,
    safeModeStatus,
    isGeneratingProof,
    latencyMetrics,
    generateDualProof,
    connectionStatus,
    polygonError
  }
}