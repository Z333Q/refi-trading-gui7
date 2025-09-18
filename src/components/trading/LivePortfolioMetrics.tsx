import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { DollarSign, TrendingUp, TrendingDown, Shield, Zap, Activity } from 'lucide-react'

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

interface LatencyMetrics {
  current: number
  p95: number
  proofTime: number
  aceTime: number
}

interface LivePortfolioMetricsProps {
  metrics: PortfolioMetrics
  latencyMetrics: LatencyMetrics
}

export function LivePortfolioMetrics({ metrics, latencyMetrics }: LivePortfolioMetricsProps) {
  const formatCurrency = (value: number) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  const formatPercent = (value: number) => `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`

  const metricsData = [
    {
      title: 'Portfolio Value',
      value: formatCurrency(metrics.totalValue),
      change: formatPercent(metrics.totalPnlPercent),
      positive: metrics.totalPnlPercent >= 0,
      icon: DollarSign,
    },
    {
      title: 'Daily P&L',
      value: formatCurrency(metrics.dailyPnl),
      change: formatPercent(metrics.dailyPnlPercent),
      positive: metrics.dailyPnlPercent >= 0,
      icon: metrics.dailyPnl >= 0 ? TrendingUp : TrendingDown,
    },
    {
      title: 'Buying Power',
      value: formatCurrency(metrics.buyingPower),
      change: 'Available',
      positive: true,
      icon: DollarSign,
    },
    {
      title: 'Risk Score',
      value: `${metrics.riskScore.toFixed(1)}/10`,
      change: 'Low Risk',
      positive: metrics.riskScore < 5,
      icon: Shield,
    },
    {
      title: 'Current Latency',
      value: `${Math.round(latencyMetrics.current)}ms`,
      change: `p95: ${Math.round(latencyMetrics.p95)}ms`,
      positive: latencyMetrics.current < 150,
      icon: Zap,
    },
    {
      title: 'Proof Time',
      value: `${Math.round(latencyMetrics.proofTime)}ms`,
      change: `ACE: ${Math.round(latencyMetrics.aceTime)}ms`,
      positive: latencyMetrics.proofTime < 20,
      icon: Activity,
    },
  ]

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
      {metricsData.map((metric) => {
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
              <p className={`text-xs mt-1 truncate ${
                metric.positive ? 'text-green-400' : 'text-red-400'
              }`}>
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