import React from 'react'
import { PerformanceChart } from '../PerformanceChart'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { TrendingUp, TrendingDown, BarChart3, Target } from 'lucide-react'

const performanceMetrics = [
  {
    title: 'Total Return',
    value: '+18.7%',
    benchmark: '+12.3%',
    period: 'YTD',
    positive: true
  },
  {
    title: 'Sharpe Ratio',
    value: '1.86',
    benchmark: '1.23',
    period: '12M',
    positive: true
  },
  {
    title: 'Max Drawdown',
    value: '-3.2%',
    benchmark: '-8.1%',
    period: '12M',
    positive: true
  },
  {
    title: 'Win Rate',
    value: '68.5%',
    benchmark: '52.3%',
    period: '30D',
    positive: true
  }
]

const strategyPerformance = [
  {
    name: 'PPO Momentum',
    return: '+12.4%',
    sharpe: '1.86',
    trades: 247,
    winRate: '68.5%',
    status: 'outperforming'
  },
  {
    name: 'TD3 Mean Reversion',
    return: '+8.9%',
    sharpe: '1.42',
    trades: 189,
    winRate: '72.3%',
    status: 'performing'
  },
  {
    name: 'RVI-Q Swing',
    return: '-1.2%',
    sharpe: '0.98',
    trades: 156,
    winRate: '64.2%',
    status: 'underperforming'
  }
]

export function PerformanceSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Performance Analytics</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Comprehensive performance metrics and strategy analysis
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {performanceMetrics.map((metric) => {
          const Icon = metric.positive ? TrendingUp : TrendingDown
          return (
            <Card key={metric.title}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {metric.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${metric.positive ? 'text-emerald-600' : 'text-red-600'}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold mb-1 ${
                  metric.positive ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {metric.value}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  vs {metric.benchmark} benchmark
                </div>
                <Badge variant="secondary" className="text-xs">
                  {metric.period}
                </Badge>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <PerformanceChart />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Strategy Performance Breakdown</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {strategyPerformance.map((strategy) => (
              <div key={strategy.name} className="p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Target className="h-5 w-5 text-gray-500" />
                    <h4 className="font-medium">{strategy.name}</h4>
                  </div>
                  <Badge 
                    variant={
                      strategy.status === 'outperforming' ? 'success' :
                      strategy.status === 'performing' ? 'secondary' : 'warning'
                    }
                    className="capitalize"
                  >
                    {strategy.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">Return</div>
                    <div className={`font-medium ${
                      strategy.return.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {strategy.return}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">Sharpe</div>
                    <div className="font-medium">{strategy.sharpe}</div>
                  </div>
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">Trades</div>
                    <div className="font-medium">{strategy.trades}</div>
                  </div>
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">Win Rate</div>
                    <div className="font-medium text-emerald-600">{strategy.winRate}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}