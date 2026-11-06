/**
 * Live Price Service - Ultra Fast Real-time Prices
 * Fetches from Binance WebSocket and REST API
 */

import axios from 'axios'

const BINANCE_API = 'https://api.binance.com/api/v3'
const BINANCE_WS = 'wss://stream.binance.com:9443/ws'

// Cache for REST API calls
let priceCache: Record<string, { price: number; timestamp: number }> = {}
const CACHE_DURATION = 2000 // 2 seconds

export async function getLivePrice(symbol: string): Promise<number> {
  try {
    // Check cache first
    const cached = priceCache[symbol]
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.price
    }

    // Fetch from Binance
    const response = await axios.get(`${BINANCE_API}/ticker/price?symbol=${symbol}USDT`)
    const price = parseFloat(response.data.price)

    // Update cache
    priceCache[symbol] = { price, timestamp: Date.now() }

    return price
  } catch (error) {
    console.error(`Error fetching ${symbol} price:`, error)
    throw new Error(`Could not fetch price for ${symbol}`)
  }
}

export async function get24hrStats(symbol: string) {
  try {
    const response = await axios.get(`${BINANCE_API}/ticker/24hr?symbol=${symbol}USDT`)
    return {
      priceChange: parseFloat(response.data.priceChange),
      priceChangePercent: parseFloat(response.data.priceChangePercent),
      high24h: parseFloat(response.data.highPrice),
      low24h: parseFloat(response.data.lowPrice),
      volume: parseFloat(response.data.volume),
      quoteVolume: parseFloat(response.data.quoteVolume)
    }
  } catch (error) {
    console.error(`Error fetching 24hr stats for ${symbol}:`, error)
    return null
  }
}

// WebSocket connection for ultra-fast updates
export function connectWebSocket(symbol: string, onPriceUpdate: (price: number) => void) {
  const ws = new WebSocket(BINANCE_WS)

  ws.onopen = () => {
    // Subscribe to individual symbol ticker
    ws.send(JSON.stringify({
      method: 'SUBSCRIBE',
      params: [`${symbol.toLowerCase()}usdt@ticker`],
      id: 1
    }))
  }

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data)
    if (data.c) {
      onPriceUpdate(parseFloat(data.c))
    }
  }

  ws.onerror = (error) => {
    console.error('WebSocket error:', error)
  }

  return ws
}