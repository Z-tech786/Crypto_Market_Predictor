import { useState, useEffect } from 'react'
import { PriceData, fetchAllPrices, connectWebSocket } from '@/lib/api/prices'

export function usePrices() {
  const [prices, setPrices] = useState<PriceData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLive, setIsLive] = useState(false)

  // Fetch initial prices
  useEffect(() => {
    const loadPrices = async () => {
      try {
        setLoading(true)
        const data = await fetchAllPrices()
        setPrices(data)
        setError(null)
      } catch (err) {
        setError('Failed to fetch prices')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadPrices()

    // Refresh every 60 seconds as fallback
    const interval = setInterval(loadPrices, 60000)
    return () => clearInterval(interval)
  }, [])

  // WebSocket for real-time updates
  useEffect(() => {
    const ws = connectWebSocket((update) => {
      setPrices(prev => 
        prev.map(p => 
          p.symbol === update.symbol 
            ? { ...p, ...update }
            : p
        )
      )
      setIsLive(true)
    })

    return () => {
      ws.close()
    }
  }, [])

  return { prices, loading, error, isLive }
}

// Hook for single asset
export function useAssetPrice(symbol: string) {
  const { prices } = usePrices()
  return prices.find(p => p.symbol === symbol)
}