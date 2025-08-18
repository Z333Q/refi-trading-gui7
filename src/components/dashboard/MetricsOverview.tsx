import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { formatCurrency, formatPercent } from '@/lib/utils'
import { TrendingUp, TrendingDown, DollarSign, Activity, Shield, Zap } from 'lucide-react'

const metrics = [
  {
    title: 'Portfolio Value',
    value: '$124,567.89',
    change: '+2.34%',
    positive: true,
    icon: DollarSign,
  },
  {
    title: 'Daily P&L',
    value: '+$2,856.12',
    change: '+1.87%',
    positive: true,
    icon: TrendingUp,
  },
  {
    title: 'Active Strategies',
    value: '3',
    change: 'PPO, TD3, RVI-Q',
    positive: true,
    icon: Activity,
  },
  {
    title: 'Risk Score',
    value: '2.1/10',
    change: 'Low Risk',
    positive: true,
    icon: Shield,
  },
  {
    title: 'Avg Latency',
    value: '89ms',
    change: 'p95: 142ms',
    positive: true,
    icon: Zap,
  },
  {
    title: 'Sharpe Ratio',
    value: '1.86',
    change: '+0.23 vs benchmark',
    positive: true,
    icon: TrendingUp,
  },
]

export function MetricsOverview() {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
      {metrics.map((metric) => {
        const Icon = metric.icon
        return (
          <Card key={metric.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate pr-2">
                {metric.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-gray-400 flex-shrink-0" />
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-2xl font-bold truncate">{metric.value}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">
                {metric.change}
              </p>
              {metric.positive && (
                <div className="absolute top-0 right-0 w-1 h-full bg-emerald-500 rounded-r-xl" />
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}