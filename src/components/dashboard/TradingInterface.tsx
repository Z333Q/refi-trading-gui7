import React, { useState } from 'react'
import { useTradingSimulation } from '@/hooks/useTradingSimulation'
import { LiveTradesFeed } from '../trading/LiveTradesFeed'
import { LivePositions } from '../trading/LivePositions'
import { LiveMarketData } from '../trading/LiveMarketData'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { 
  Play, 
  Square, 
  Settings, 
  TrendingUp, 
  TrendingDown,
  Clock,
  CheckCircle,
  AlertTriangle,
  Zap,
  Shield
} from 'lucide-react'

const strategies = [
  {
    id: 'ppo-momentum',
    name: 'PPO Momentum',
    type: 'PPO',
    status: 'active',
    pnl: '+$1,234.56',
    pnlPercent: '+2.1%',
    positions: 3,
    lastTrade: '2 min ago',
    riskScore: 1.8,
  },
  {
    id: 'td3-mean-revert',
    name: 'TD3 Mean Reversion',
    type: 'TD3',
    status: 'active',
    pnl: '+$856.32',
    pnlPercent: '+1.4%',
    positions: 2,
    lastTrade: '5 min ago',
    riskScore: 2.3,
  },
  {
    id: 'rvi-q-swing',
    name: 'RVI-Q Swing',
    type: 'RVI-Q',
    status: 'paused',
    pnl: '-$123.45',
    pnlPercent: '-0.2%',
    positions: 0,
    lastTrade: '1 hour ago',
    riskScore: 1.2,
  },
]

const recentTrades = [
  {
    id: 1,
    symbol: 'AAPL',
    side: 'BUY',
    quantity: 100,
    price: 178.45,
    time: '14:32:15',
    strategy: 'PPO Momentum',
    status: 'filled',
    proofId: 'zk_abc123',
    aceVerdict: 'approved',
  },
  {
    id: 2,
    symbol: 'TSLA',
    side: 'SELL',
    quantity: 50,
    price: 242.18,
    time: '14:28:42',
    strategy: 'TD3 Mean Reversion',
    status: 'filled',
    proofId: 'zk_def456',
    aceVerdict: 'approved',
  },
  {
    id: 3,
    symbol: 'NVDA',
    side: 'BUY',
    quantity: 25,
    price: 456.78,
    time: '14:25:11',
    strategy: 'PPO Momentum',
    status: 'filled',
    proofId: 'zk_ghi789',
    aceVerdict: 'approved',
  },
]

export function TradingInterface() {
  const [selectedStrategy, setSelectedStrategy] = useState(strategies[0])
  const {
    trades,
    positions,
    marketData,
    dualProofGate,
    safeModeStatus,
    latencyMetrics
  } = useTradingSimulation()

  return (
    <div className="space-y-6">
      {/* Live Market Data */}
      <LiveMarketData marketData={marketData} />
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
      {/* Strategy Management */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Active Strategies
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {strategies.map((strategy) => (
              <div
                key={strategy.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedStrategy.id === strategy.id
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20'
                    : 'border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700'
                }`}
                onClick={() => setSelectedStrategy(strategy)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">{strategy.name}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {strategy.type}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    {strategy.status === 'active' ? (
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Square className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                    <Badge 
                      variant={strategy.status === 'active' ? 'success' : 'secondary'}
                      className="capitalize"
                    >
                      {strategy.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">P&L</div>
                    <div className={`font-medium ${
                      strategy.pnl.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {strategy.pnl} ({strategy.pnlPercent})
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">Positions</div>
                    <div className="font-medium">{strategy.positions}</div>
                  </div>
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">Risk Score</div>
                    <div className="font-medium">{strategy.riskScore}/10</div>
                  </div>
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">Last Trade</div>
                    <div className="font-medium">{strategy.lastTrade}</div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Risk & Compliance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-500" />
              <span>Live Risk & Compliance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dualProofGate ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">zk-VaR Proof</span>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    VaR: ${dualProofGate.zkVarProof.varEstimate.toLocaleString()}
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-400 font-mono">
                    {dualProofGate.zkVarProof.proofHash.slice(0, 16)}...
                  </div>
                </div>
                
                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">ACE Policy</span>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Verdict: {dualProofGate.acePolicyResult.verdict}
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400">
                    ${dualProofGate.acePolicyResult.originalNotional.toLocaleString()}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Generate proof to view gate status</p>
              </div>
            )}

            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Trade Loop Latency</span>
                <Zap className="h-4 w-4 text-amber-500" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div>
                  <div className="text-gray-600 dark:text-gray-400">Current</div>
                  <div className="font-medium">{Math.round(latencyMetrics.current)}ms</div>
                </div>
                <div>
                  <div className="text-gray-600 dark:text-gray-400">p95</div>
                  <div className="font-medium">{Math.round(latencyMetrics.p95)}ms</div>
                </div>
                <div>
                  <div className="text-gray-600 dark:text-gray-400">SLO</div>
                  <div className={`font-medium ${latencyMetrics.current < 150 ? 'text-green-600' : 'text-red-600'}`}>
                    {latencyMetrics.current < 150 ? '✓' : '✗'} 150ms
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trading Activity */}
      <div className="space-y-6">
        <LiveTradesFeed trades={trades} />
        <LivePositions positions={positions} />

        {/* Session Key Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>ERC-4337 Session</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Session Key Active</span>
                <Badge variant="success">Connected</Badge>
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                0x4A5b6C...89De
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Expires: 23h 45m remaining
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Daily Trade Limit</span>
                <span className="font-medium">247 / 1000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-800">
                <div className="bg-emerald-600 h-2 rounded-full" style={{width: '24.7%'}}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Daily Notional</span>
                <span className="font-medium">$45.2K / $100K</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-800">
                <div className="bg-emerald-600 h-2 rounded-full" style={{width: '45.2%'}}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  )
}