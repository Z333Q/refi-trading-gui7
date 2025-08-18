import { useState, useEffect, useRef, useCallback } from 'react'

interface PolygonTrade {
  ev: string // Event type
  sym: string // Symbol
  p: number // Price
  s: number // Size
  t: number // Timestamp
  c?: number[] // Conditions
}

interface PolygonQuote {
  ev: string // Event type
  sym: string // Symbol
  bp: number // Bid price
  bs: number // Bid size
  ap: number // Ask price
  as: number // Ask size
  t: number // Timestamp
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

interface UsePolygonWebSocketProps {
  apiKey: string
  symbols: string[]
  enabled?: boolean
}

export function usePolygonWebSocket({ apiKey, symbols, enabled = true }: UsePolygonWebSocketProps) {
  const [marketData, setMarketData] = useState<MarketData[]>([])
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected')
  const [error, setError] = useState<string | null>(null)
  
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = 5
  const baseReconnectDelay = 1000

  // Store previous prices for change calculation
  const previousPricesRef = useRef<Record<string, number>>({})

  const initializeMarketData = useCallback(() => {
    const initialData = symbols.map(symbol => ({
      symbol,
      price: 0,
      change: 0,
      changePercent: 0,
      volume: 0,
      bid: 0,
      ask: 0,
      lastUpdate: new Date().toISOString()
    }))
    setMarketData(initialData)
  }, [symbols])

  const updateMarketData = useCallback((symbol: string, updates: Partial<MarketData>) => {
    setMarketData(prev => prev.map(data => 
      data.symbol === symbol 
        ? { ...data, ...updates, lastUpdate: new Date().toISOString() }
        : data
    ))
  }, [])

  const handleTradeMessage = useCallback((trade: PolygonTrade) => {
    const symbol = trade.sym
    const currentPrice = trade.p
    const previousPrice = previousPricesRef.current[symbol] || currentPrice
    
    const change = currentPrice - previousPrice
    const changePercent = previousPrice !== 0 ? (change / previousPrice) * 100 : 0

    // Update previous price
    previousPricesRef.current[symbol] = currentPrice

    updateMarketData(symbol, {
      price: currentPrice,
      change,
      changePercent,
      volume: trade.s // Add to existing volume in real implementation
    })
  }, [updateMarketData])

  const handleQuoteMessage = useCallback((quote: PolygonQuote) => {
    const symbol = quote.sym
    
    updateMarketData(symbol, {
      bid: quote.bp,
      ask: quote.ap
    })
  }, [updateMarketData])

  const handleWebSocketMessage = useCallback((event: MessageEvent) => {
    try {
      const messages = JSON.parse(event.data)
      
      if (Array.isArray(messages)) {
        messages.forEach((message: any) => {
          switch (message.ev) {
            case 'T': // Trade
              handleTradeMessage(message as PolygonTrade)
              break
            case 'Q': // Quote
              handleQuoteMessage(message as PolygonQuote)
              break
            case 'status':
              console.log('Polygon WebSocket status:', message)
              break
            default:
              // Handle other message types if needed
              break
          }
        })
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error)
    }
  }, [handleTradeMessage, handleQuoteMessage])

  const connect = useCallback(() => {
    if (!enabled || !apiKey) return

    // Validate API key format - check for placeholder or invalid values
    if (!apiKey || 
        apiKey === 'demo' || 
        apiKey === 'your_polygon_api_key_here' || 
        apiKey.trim() === '' ||
        apiKey.length < 10) {
      console.log('Invalid or demo API key detected, using fallback data')
      setConnectionStatus('error')
      setError('Invalid API key - using simulated market data')
      return
    }

    setConnectionStatus('connecting')
    setError(null)

    try {
      // Use the correct Polygon.io WebSocket endpoint with API key authentication
      const wsUrl = `wss://socket.polygon.io/stocks`
      console.log('Connecting to Polygon WebSocket:', wsUrl)
      const ws = new WebSocket(wsUrl)
      wsRef.current = ws

      ws.onopen = () => {
        console.log('Connected to Polygon WebSocket')
        
        // Send authentication message with correct format
        console.log('Sending auth message with API key:', apiKey.substring(0, 8) + '...')
        ws.send(JSON.stringify({
          action: "auth",
          params: apiKey
        }))
      }

      ws.onmessage = handleWebSocketMessage

      ws.onmessage = (event) => {
        try {
          const messages = JSON.parse(event.data)
          console.log('Received WebSocket message:', messages)
          
          if (Array.isArray(messages)) {
            messages.forEach((message: any) => {
              // Handle different message types
              if (message.ev === 'status') {
                console.log('Status message:', message)
                
                if (message.status === 'auth_success') {
                console.log('Authentication successful')
                setConnectionStatus('connected')
                reconnectAttempts.current = 0
                
                // Now subscribe to symbols
                if (symbols.length > 0) {
                  console.log('Subscribing to symbols:', symbols)
                  
                  // Subscribe to trades for all symbols at once
                  ws.send(JSON.stringify({
                    action: "subscribe",
                    params: symbols.map(symbol => `T.${symbol}`).join(',')
                  }))
                  
                  // Subscribe to quotes for all symbols at once
                  ws.send(JSON.stringify({
                    action: "subscribe",
                    params: symbols.map(symbol => `Q.${symbol}`).join(',')
                  }))
                }
                } else if (message.status === 'auth_failed') {
                console.log('Polygon authentication failed, using simulated data')
                setConnectionStatus('error')
                setError('Authentication failed - using simulated data')
                ws.close()
                } else if (message.status === 'connected') {
                  console.log('WebSocket connected, waiting for auth...')
                } else {
                  console.log('Unknown status:', message.status)
                }
              } else if (message.ev === 'T') {
                // Handle trade message
                handleTradeMessage(message as PolygonTrade)
              } else if (message.ev === 'Q') {
                // Handle quote message
                handleQuoteMessage(message as PolygonQuote)
              } else {
                console.log('Unhandled message type:', message.ev, message)
              }
            })
          } else {
            console.log('Non-array message received:', messages)
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }

      ws.onclose = (event) => {
        console.log('Polygon WebSocket closed:', event.code, event.reason)
        setConnectionStatus('disconnected')
        wsRef.current = null

        // Attempt to reconnect if not a clean close and we haven't exceeded max attempts
        if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts && enabled) {
          const delay = baseReconnectDelay * Math.pow(2, reconnectAttempts.current)
          console.log(`Attempting to reconnect in ${delay}ms (attempt ${reconnectAttempts.current + 1}/${maxReconnectAttempts})`)
          
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttempts.current++
            connect()
          }, delay)
        } else if (reconnectAttempts.current >= maxReconnectAttempts) {
          setConnectionStatus('error')
          setError('Max reconnection attempts reached - using fallback data')
        }
      }

      ws.onerror = (error) => {
        console.warn('Polygon WebSocket connection error, falling back to simulated data')
        setConnectionStatus('error')
        setError('Connection failed - using simulated data')
      }

    } catch (error) {
      console.warn('Failed to create WebSocket connection, using simulated data')
      setConnectionStatus('error')
      setError('Connection unavailable - using simulated data')
    }
  }, [enabled, apiKey, symbols, handleWebSocketMessage])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    if (wsRef.current) {
      wsRef.current.close(1000, 'Manual disconnect')
      wsRef.current = null
    }

    setConnectionStatus('disconnected')
  }, [])

  // Initialize market data when symbols change
  useEffect(() => {
    initializeMarketData()
  }, [initializeMarketData])

  // Connect/disconnect based on enabled state
  useEffect(() => {
    if (enabled && apiKey && symbols.length > 0) {
      connect()
    } else {
      disconnect()
    }

    return () => {
      disconnect()
    }
  }, [enabled, apiKey, symbols, connect, disconnect])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [disconnect])

  return {
    marketData,
    connectionStatus,
    error,
    connect,
    disconnect
  }
}