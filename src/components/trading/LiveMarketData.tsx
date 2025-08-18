import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { TrendingUp, TrendingDown, Activity } from 'lucide-react'

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

interface LiveMarketDataProps {
  marketData: MarketData[]
  connectionStatus?: 'disconnected' | 'connecting' | 'connected' | 'error'
  error?: string | null
}

export function LiveMarketData({ marketData, connectionStatus = 'connected', error }: LiveMarketDataProps) {
  const formatPrice = (price: number) => `$${price.toFixed(2)}`
  const formatChange = (change: number) => `${change >= 0 ? '+' : ''}${change.toFixed(2)}`
  const formatPercent = (percent: number) => `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`
  const formatVolume = (volume: number) => {
    if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`
    if (volume >= 1000) return `${(volume / 1000).toFixed(0)}K`
    return volume.toString()
  }

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-400'
      case 'connecting': return 'text-yellow-400'
      case 'error': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Live Data'
      case 'connecting': return 'Connecting...'
      case 'error': return 'Simulated Data'
      default: return 'Disconnected'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-blue-500" />
          <span>Live Market Data</span>
          <Badge 
            variant={connectionStatus === 'connected' ? 'success' : connectionStatus === 'error' ? 'destructive' : 'secondary'} 
            className="ml-auto"
          >
            <div className={`w-2 h-2 rounded-full mr-1 ${
              connectionStatus === 'connected' ? 'bg-green-400 animate-pulse' : 
              connectionStatus === 'connecting' ? 'bg-yellow-400 animate-pulse' :
              connectionStatus === 'error' ? 'bg-red-400' : 'bg-gray-400'
            }`} />
            {getConnectionStatusText()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {marketData.map((data) => {
            const isPositive = data.changePercent >= 0
            const Icon = isPositive ? TrendingUp : TrendingDown
            
            return (
              <div
                key={data.symbol}
                className="p-3 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
              >
                {/* Main row with symbol, price, and change */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-lg">{data.symbol}</span>
                    <Icon className={`h-4 w-4 ${isPositive ? 'text-green-500' : 'text-red-500'}`} />
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">{formatPrice(data.price)}</div>
                    <div className={`text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                      {formatChange(data.change)} ({formatPercent(data.changePercent)})
                    </div>
                  </div>
                </div>
                
                {/* Details row with bid/ask and volume */}
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                  <div className="space-y-1">
                    <div>Bid: <span className="text-gray-300">{formatPrice(data.bid)}</span></div>
                    <div>Ask: <span className="text-gray-300">{formatPrice(data.ask)}</span></div>
                  </div>
                  <div className="text-right space-y-1">
                    <div>Vol: <span className="text-gray-300">{formatVolume(data.volume)}</span></div>
                    <div className="text-xs">
                      {new Date(data.lastUpdate).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        <div className="mt-4 p-3 rounded-lg bg-gray-900 border border-gray-800">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Market Status:</span>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
              }`} />
              <span className={getConnectionStatusColor()}>
                {connectionStatus === 'connected' ? 'Market Open' : 'Using Fallback Data'}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-gray-400">Data Source:</span>
            <span className="text-gray-300">
              {connectionStatus === 'connected' ? 'Polygon.io WebSocket' : 'Simulated'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}