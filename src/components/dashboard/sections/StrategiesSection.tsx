import React, { useState } from 'react'
import { useTradingSimulation } from '@/hooks/useTradingSimulation'
import { LivePortfolioMetrics } from '../../trading/LivePortfolioMetrics'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Button } from '../../ui/button'
import { Badge } from '../../ui/badge'
import { 
  Play, 
  Square, 
  Settings, 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  Activity
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
    description: 'Momentum-based strategy using Proximal Policy Optimization',
    performance: {
      sharpe: 1.86,
      maxDrawdown: -2.3,
      winRate: 68.5
    }
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
    description: 'Mean reversion strategy using Twin Delayed Deep Deterministic Policy Gradient',
    performance: {
      sharpe: 1.42,
      maxDrawdown: -4.1,
      winRate: 72.3
    }
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
    description: 'Swing trading strategy using Relative Vigor Index with Q-Learning',
    performance: {
      sharpe: 0.98,
      maxDrawdown: -1.8,
      winRate: 64.2
    }
  }
]

export function StrategiesSection() {
  const [selectedStrategy, setSelectedStrategy] = useState(strategies[0])
  const { portfolioMetrics, latencyMetrics } = useTradingSimulation()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Strategy Management</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Deploy and monitor your RL trading agents
          </p>
        </div>
        <Button>
          <Settings className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Deploy New Strategy</span>
          <span className="sm:hidden">Deploy</span>
        </Button>
      </div>

      {/* Live Metrics */}
      <LivePortfolioMetrics metrics={portfolioMetrics} latencyMetrics={latencyMetrics} />

      <div className="grid gap-6 lg:grid-cols-3 xl:grid-cols-4">
        <div className="lg:col-span-2 xl:col-span-3 space-y-4">
          {strategies.map((strategy) => (
            <Card 
              key={strategy.id}
              className={`cursor-pointer transition-all ${
                selectedStrategy.id === strategy.id
                  ? 'ring-2 ring-emerald-500 bg-emerald-50 dark:bg-emerald-950/20'
                  : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedStrategy(strategy)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Activity className="h-6 w-6 text-emerald-600" />
                    <div>
                      <CardTitle className="text-lg">{strategy.name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {strategy.type}
                        </Badge>
                        <Badge 
                          variant={strategy.status === 'active' ? 'success' : 'secondary'}
                          className="capitalize text-xs"
                        >
                          {strategy.status}
                        </Badge>
                      </div>
                    </div>
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
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {strategy.description}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">P&L</div>
                    <div className={`font-medium ${
                      strategy.pnl.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {strategy.pnl}
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
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1 xl:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Strategy Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">{selectedStrategy.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedStrategy.description}
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Sharpe Ratio</span>
                  <span className="font-medium">{selectedStrategy.performance.sharpe}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Max Drawdown</span>
                  <span className="font-medium text-red-600">{selectedStrategy.performance.maxDrawdown}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Win Rate</span>
                  <span className="font-medium text-emerald-600">{selectedStrategy.performance.winRate}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Performance
              </Button>
              <Button className="w-full" variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Configure Parameters
              </Button>
              <Button className="w-full" variant="outline">
                <TrendingUp className="h-4 w-4 mr-2" />
                Backtest Results
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}