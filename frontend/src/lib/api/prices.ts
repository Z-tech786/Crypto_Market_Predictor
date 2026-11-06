// Crypto and metals price API service

const BINANCE_API = 'https://api.binance.com/api/v3'
const GOLD_API = 'https://www.gold-api.com/api'

export interface PriceData {
  symbol: string
  price: number
  change: number
  changePercent: number
  high24h?: number
  low24h?: number
  volume?: string
}

// Fetch crypto prices from Binance
export async function fetchCryptoPrices(symbols: string[] = ['BTC', 'ETH', 'BNB', 'SOL', 'XRP']): Promise<PriceData[]> {
  try {
    const response = await fetch(`${BINANCE_API}/ticker/24hr`)
    const data = await response.json()
    
    const prices: PriceData[] = []
    
    symbols.forEach(symbol => {
      const pair = `${symbol}USDT`
      const ticker = data.find((item: any) => item.symbol === pair)
      
      if (ticker) {
        prices.push({
          symbol,
          price: parseFloat(ticker.lastPrice),
          change: parseFloat(ticker.priceChange),
          changePercent: parseFloat(ticker.priceChangePercent),
          high24h: parseFloat(ticker.highPrice),
          low24h: parseFloat(ticker.lowPrice),
          volume: parseFloat(ticker.volume).toFixed(2)
        })
      }
    })
    
    return prices
  } catch (error) {
    console.error('Error fetching crypto prices:', error)
    return []
  }
}
// src/lib/api/prices.ts
// src/lib/api/prices.ts - Update fetchMetalPrices function

export async function fetchMetalPrices(): Promise<PriceData[]> {
  try {
    const API_KEY = '94479e729962d9f1f4bca437008fff37e76155dab758a48a93b606a934f45344'
    
    // CORRECT ENDPOINT from your test
    const baseUrl = 'https://api.gold-api.com/price'
    
    console.log('Fetching gold prices...')
    
    // Fetch gold price - NO api_key in URL (it might be not needed)
    const goldResponse = await fetch(`${baseUrl}/XAU`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    
    if (!goldResponse.ok) {
      throw new Error(`Gold API responded with ${goldResponse.status}`)
    }
    
    const goldData = await goldResponse.json()
    console.log('Gold data:', goldData)
    
    // Fetch silver price
    const silverResponse = await fetch(`${baseUrl}/XAG`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    
    if (!silverResponse.ok) {
      throw new Error(`Silver API responded with ${silverResponse.status}`)
    }
    
    const silverData = await silverResponse.json()
    console.log('Silver data:', silverData)
    
    // Calculate 24h change (simulated since API doesn't provide it)
    const goldChange = (Math.random() - 0.5) * 10
    const silverChange = (Math.random() - 0.5) * 0.5
    
    return [
      {
        symbol: 'GOLD',
        price: goldData.price || 0,
        change: goldChange,
        changePercent: (goldChange / goldData.price) * 100 || 0,
        high24h: goldData.price * 1.01, // Simulated high
        low24h: goldData.price * 0.99,  // Simulated low
        volume: 'N/A'
      },
      {
        symbol: 'SILVER',
        price: silverData.price || 0,
        change: silverChange,
        changePercent: (silverChange / silverData.price) * 100 || 0,
        high24h: silverData.price * 1.02,
        low24h: silverData.price * 0.98,
        volume: 'N/A'
      }
    ]
  } catch (error) {
    console.error('Error fetching metal prices:', error)
    return getFallbackMetalPrices()
  }
}

// Keep your fallback function
function getFallbackMetalPrices(): PriceData[] {
  return [
    {
      symbol: 'GOLD',
      price: 1950.50,
      change: 2.30,
      changePercent: 0.12,
      high24h: 1960.00,
      low24h: 1945.00,
      volume: 'N/A'
    },
    {
      symbol: 'SILVER',
      price: 23.75,
      change: -0.15,
      changePercent: -0.63,
      high24h: 24.10,
      low24h: 23.50,
      volume: 'N/A'
    }
  ]
}

// Fetch all prices (crypto + metals)
export async function fetchAllPrices(): Promise<PriceData[]> {
  try {
    const [cryptoPrices, metalPrices] = await Promise.allSettled([
      fetchCryptoPrices(),
      fetchMetalPrices()
    ])
    
    const prices: PriceData[] = []
    
    if (cryptoPrices.status === 'fulfilled') {
      prices.push(...cryptoPrices.value)
    }
    
    if (metalPrices.status === 'fulfilled') {
      prices.push(...metalPrices.value)
    } else {
      prices.push(...getFallbackMetalPrices())
    }
    
    return prices
  } catch (error) {
    console.error('Error fetching all prices:', error)
    return []
  }
}

// WebSocket connection for real-time crypto prices
export function connectWebSocket(onPriceUpdate: (data: any) => void) {
  const ws = new WebSocket('wss://stream.binance.com:9443/ws')
  
  const streams = [
    'btcusdt@ticker',
    'ethusdt@ticker',
    'bnbusdt@ticker',
    'solusdt@ticker',
    'xrpusdt@ticker'
  ]
  
  ws.onopen = () => {
    ws.send(JSON.stringify({
      method: 'SUBSCRIBE',
      params: streams,
      id: 1
    }))
  }
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data)
    if (data.data) {
      onPriceUpdate({
        symbol: data.data.s.replace('USDT', ''),
        price: parseFloat(data.data.c),
        change: parseFloat(data.data.p),
        changePercent: parseFloat(data.data.P)
      })
    }
  }
  
  ws.onerror = (error) => {
    console.error('WebSocket error:', error)
  }
  
  return ws
}