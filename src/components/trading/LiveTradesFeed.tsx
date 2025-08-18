import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Activity, ExternalLink, Hash, Shield } from 'lucide-react'

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

interface LiveTradesFeedProps {
  trades: Trade[]
}

export function LiveTradesFeed({ trades }: LiveTradesFeedProps) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-emerald-500" />
          <span>Live Trades Feed</span>
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
            trades.map((trade) => (
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
                
                <div className="text-sm text-gray-400 mb-2">
                  Strategy: {trade.strategy}
                </div>
                
                {trade.status === 'filled' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div className="p-2 rounded bg-blue-950/20 border border-blue-800">
                      <div className="flex items-center space-x-1 mb-1">
                        <Hash className="h-3 w-3 text-blue-500" />
                        <span className="text-blue-400 font-medium">zk-Proof</span>
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
            ))
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
            <span className="text-gray-400">Avg Fill Time:</span>
            <span className="text-gray-300">1.2s</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}