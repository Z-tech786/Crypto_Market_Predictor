import { useState, useEffect, useCallback } from 'react'
import { getLivePrice, get24hrStats, connectWebSocket } from '@shared/api/live-prices'

interface PriceData {
  price: number
  change: number
  changePercent: number
  high24h: number
  low24h: number
  volume: number
  quoteVolume: number
}

export function useLivePrice(symbol: string) {
  const [data, setData] = useState<PriceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLive, setIsLive] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true)
        const [price, stats] = await Promise.all([
          getLivePrice(symbol),
          get24hrStats(symbol)
        ])

        setData({
          price,
          change: stats?.priceChange || 0,
          changePercent: stats?.priceChangePercent || 0,
          high24h: stats?.high24h || price,
          low24h: stats?.low24h || price,
          volume: stats?.volume || 0,
          quoteVolume: stats?.quoteVolume || 0
        })
        setLastUpdate(new Date())
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch price')
      } finally {
        setLoading(false)
      }
    }

    fetchInitialData()

    // WebSocket for real-time updates
    const ws = connectWebSocket(symbol, (newPrice) => {
      setData(prev => {
        if (!prev) return null
        const change = newPrice - prev.price
        const changePercent = (change / prev.price) * 100
        return {
          ...prev,
          price: newPrice,
          change,
          changePercent
        }
      })
      setIsLive(true)
      setLastUpdate(new Date())
    })

    return () => {
      ws.close()
    }
  }, [symbol])

  // REST API fallback every 10 seconds if WebSocket fails
  useEffect(() => {
    if (!isLive) {
      const interval = setInterval(async () => {
        try {
          const price = await getLivePrice(symbol)
          setData(prev => {
            if (!prev) return null
            const change = price - prev.price
            const changePercent = (change / prev.price) * 100
            return {
              ...prev,
              price,
              change,
              changePercent
            }
          })
          setLastUpdate(new Date())
        } catch (err) {
          console.error('Fallback fetch error:', err)
        }
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [symbol, isLive])

  return { data, loading, error, isLive, lastUpdate }
}
