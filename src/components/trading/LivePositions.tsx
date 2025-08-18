import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'

interface Position {
  symbol: string
  quantity: number
  avgPrice: number
  currentPrice: number
  unrealizedPnl: number
  realizedPnl: number
  side: 'long' | 'short'
}

interface LivePositionsProps {
  positions: Position[]
}

export function LivePositions({ positions }: LivePositionsProps) {
  const formatPrice = (price: number) => `$${price.toFixed(2)}`
  const formatPnL = (pnl: number) => {
    const sign = pnl >= 0 ? '+' : ''
    return `${sign}$${pnl.toFixed(2)}`
  }
  const formatPercent = (pnl: number, avgPrice: number, quantity: number) => {
    const totalCost = avgPrice * Math.abs(quantity)
    const percent = (pnl / totalCost) * 100
    const sign = percent >= 0 ? '+' : ''
    return `${sign}${percent.toFixed(2)}%`
  }

  const totalUnrealizedPnL = positions.reduce((sum, pos) => sum + pos.unrealizedPnl, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Wallet className="h-5 w-5 text-purple-500" />
          <span>Live Positions</span>
          <Badge variant="secondary" className="ml-auto">
            {positions.length} positions
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {positions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Wallet className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No open positions</p>
          </div>
        ) : (
          <>
            <div className="mb-4 p-3 rounded-lg bg-gray-900 border border-gray-800">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Total Unrealized P&L:</span>
                <div className={`font-bold text-lg ${totalUnrealizedPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatPnL(totalUnrealizedPnL)}
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              {positions.map((position) => {
                const isProfit = position.unrealizedPnl >= 0
                const Icon = isProfit ? TrendingUp : TrendingDown
                const marketValue = position.currentPrice * Math.abs(position.quantity)
                
                return (
                  <div
                    key={position.symbol}
                    className="p-3 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-lg">{position.symbol}</span>
                        <Badge 
                          variant={position.side === 'long' ? 'success' : 'destructive'}
                          className="text-xs"
                        >
                          {position.side.toUpperCase()}
                        </Badge>
                        <Icon className={`h-4 w-4 ${isProfit ? 'text-green-500' : 'text-red-500'}`} />
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                          {formatPnL(position.unrealizedPnl)}
                        </div>
                        <div className={`text-sm ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                          {formatPercent(position.unrealizedPnl, position.avgPrice, position.quantity)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-gray-400">Quantity</div>
                        <div className="font-medium">{Math.abs(position.quantity)}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Avg Price</div>
                        <div className="font-medium">{formatPrice(position.avgPrice)}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Current Price</div>
                        <div className="font-medium">{formatPrice(position.currentPrice)}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Market Value</div>
                        <div className="font-medium">{formatPrice(marketValue)}</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}