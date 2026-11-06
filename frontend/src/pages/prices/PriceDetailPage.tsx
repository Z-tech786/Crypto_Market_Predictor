'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Link from '@/components/routing/Link'
import {
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Clock,
  AlertCircle,
  Zap,
  Globe,
  DollarSign,
  BarChart3,
  Activity,
  Github,
  Twitter,
  MessageCircle,
  ExternalLink,
  Calendar,
  Users,
  Target,
  Rocket,
  Sparkles,
  ChevronLeft,
  ArrowUp,
  ArrowDown,
  Star,
  Info,
  Shield,
  Zap as ZapIcon,
  Cpu,
  Network,
  Coins
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import axios from 'axios'

// Types
interface PriceData {
  price: number
  change: number
  changePercent: number
  high24h: number
  low24h: number
  volume: number
  quoteVolume: number
}

interface CryptoInfo {
  name: string
  fullName: string
  description: string
  longDescription: string
  founded: string
  founder: string
  website: string
  whitepaper?: string
  github?: string
  twitter?: string
  discord?: string
  consensus: string
  maxSupply: string
  circulatingSupply: string
  marketCap: string
  allTimeHigh: string
  allTimeLow: string
  useCases: string[]
  features: string[]
  roadmap?: { year: string; event: string }[]
  competitors?: string[]
  strengths?: string[]
  weaknesses?: string[]
  whyInvest?: string[]
  futureOutlook?: string[]
}

// Crypto Database
const cryptoDatabase: Record<string, CryptoInfo> = {
  SOL: {
    name: 'Solana',
    fullName: 'Solana (SOL)',
    description: 'Solana is a high-performance blockchain supporting builders around the world creating crypto apps that scale today.',
    longDescription: 'Solana is a decentralized blockchain built to enable scalable, user-friendly apps for the world. It achieves high transaction speeds through a unique combination of proof-of-history (PoH) and proof-of-stake (PoS) consensus mechanisms. Solana can process 50,000+ transactions per second with sub-second finality and extremely low fees.',
    founded: '2020',
    founder: 'Anatoly Yakovenko',
    website: 'https://solana.com',
    whitepaper: 'https://solana.com/solana-whitepaper.pdf',
    github: 'https://github.com/solana-labs',
    twitter: 'https://twitter.com/solana',
    discord: 'https://discord.gg/solana',
    consensus: 'Proof of History (PoH) + Proof of Stake (PoS)',
    maxSupply: 'No max supply (inflationary)',
    circulatingSupply: '~450 million SOL',
    marketCap: '~$45 billion',
    allTimeHigh: '$260',
    allTimeLow: '$0.50',
    useCases: [
      'DeFi applications',
      'NFT marketplaces',
      'Web3 gaming',
      'Decentralized exchanges',
      'Payment processing'
    ],
    features: [
      '50,000+ TPS (transactions per second)',
      'Sub-second finality',
      'Low transaction fees (<$0.01)',
      'EVM compatibility via Neon',
      'Energy efficient'
    ],
    roadmap: [
      { year: '2020', event: 'Mainnet Beta Launch' },
      { year: '2021', event: 'DeFi Summer on Solana' },
      { year: '2022', event: 'Solana Mobile Stack Launch' },
      { year: '2023', event: 'Solana Saga Phone Release' },
      { year: '2024', event: 'Firedancer Validator Client' },
      { year: '2025', event: 'Token Extensions & Upgrades' }
    ],
    competitors: ['Ethereum', 'BNB Chain', 'Avalanche', 'Polygon', 'Near Protocol'],
    strengths: [
      'Extremely fast transaction speed',
      'Very low fees',
      'Growing ecosystem',
      'Strong developer community',
      'Institutional adoption'
    ],
    weaknesses: [
      'Network outages in past',
      'Centralization concerns',
      'Competition from Ethereum L2s',
      'Younger ecosystem compared to Ethereum'
    ],
    whyInvest: [
      'High scalability solution for mass adoption',
      'Strong venture capital backing',
      'Growing DeFi and NFT ecosystem',
      'Real-world partnerships and adoption',
      'Innovative technology stack'
    ],
    futureOutlook: [
      'Firedancer validator client to improve decentralization',
      'Solana Mobile Stack for Web3 adoption on mobile',
      'Token extensions for enterprise use cases',
      'Potential ETF approval',
      'Expansion in Asian markets'
    ]
  },
  BTC: {
    name: 'Bitcoin',
    fullName: 'Bitcoin (BTC)',
    description: 'Bitcoin is the first decentralized cryptocurrency, operating on a peer-to-peer network without central authority.',
    longDescription: 'Bitcoin is the world\'s first cryptocurrency, created in 2009 by an anonymous person or group known as Satoshi Nakamoto. It operates on a decentralized network using blockchain technology and proof-of-work consensus.',
    founded: '2009',
    founder: 'Satoshi Nakamoto',
    website: 'https://bitcoin.org',
    whitepaper: 'https://bitcoin.org/bitcoin.pdf',
    github: 'https://github.com/bitcoin',
    twitter: 'https://twitter.com/bitcoin',
    consensus: 'Proof of Work (PoW)',
    maxSupply: '21 million BTC',
    circulatingSupply: '~19.5 million BTC',
    marketCap: '~$1 trillion',
    allTimeHigh: '$73,750',
    allTimeLow: '$0.01',
    useCases: ['Store of value', 'Digital gold', 'Cross-border payments', 'Hedge against inflation'],
    features: ['Decentralized', 'Secure', 'Limited supply', 'Global', 'Censorship-resistant'],
    strengths: ['First mover advantage', 'Strongest network effect', 'Most secure', 'Global recognition'],
    weaknesses: ['Slow transactions', 'High energy consumption', 'Limited scalability']
  },
  ETH: {
    name: 'Ethereum',
    fullName: 'Ethereum (ETH)',
    description: 'Ethereum is a decentralized global computer that enables smart contracts and dApps.',
    longDescription: 'Ethereum is a decentralized blockchain with smart contract functionality. It\'s the foundation for DeFi, NFTs, and countless Web3 applications. Ethereum transitioned to Proof of Stake in 2022, reducing energy consumption by 99.9%.',
    founded: '2015',
    founder: 'Vitalik Buterin',
    website: 'https://ethereum.org',
    whitepaper: 'https://ethereum.org/whitepaper',
    github: 'https://github.com/ethereum',
    twitter: 'https://twitter.com/ethereum',
    consensus: 'Proof of Stake (PoS)',
    maxSupply: 'No max supply',
    circulatingSupply: '~120 million ETH',
    marketCap: '~$350 billion',
    allTimeHigh: '$4,800',
    allTimeLow: '$0.40',
    useCases: ['Smart contracts', 'DeFi', 'NFTs', 'DAOs', 'Layer 2 solutions'],
    features: ['Programmable', 'EVM compatible', 'Large ecosystem', 'Active development'],
    strengths: ['First-mover in smart contracts', 'Largest developer ecosystem', 'Most dApps'],
    weaknesses: ['High gas fees during congestion', 'Scalability challenges', 'Competition from L1s']
  }
}

// Helper function to get crypto info with fallback
function getCryptoInfo(symbol: string): CryptoInfo {
  const defaultInfo: CryptoInfo = {
    name: symbol,
    fullName: `${symbol} (${symbol})`,
    description: `${symbol} is a cryptocurrency trading on various exchanges.`,
    longDescription: `${symbol} is a digital asset in the cryptocurrency market. More information will be updated soon.`,
    founded: 'N/A',
    founder: 'Unknown',
    website: '#',
    consensus: 'Various',
    maxSupply: 'Unknown',
    circulatingSupply: 'Unknown',
    marketCap: 'Unknown',
    allTimeHigh: 'Unknown',
    allTimeLow: 'Unknown',
    useCases: ['Trading', 'Investment', 'Digital asset'],
    features: ['Cryptocurrency', 'Digital asset', 'Blockchain-based']
  }
  return cryptoDatabase[symbol] || defaultInfo
}

// Live price fetching function
async function getLivePrice(symbol: string): Promise<number> {
  try {
    const response = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}USDT`)
    return parseFloat(response.data.price)
  } catch (error) {
    console.error(`Error fetching ${symbol} price:`, error)
    throw new Error(`Could not fetch price for ${symbol}`)
  }
}

async function get24hrStats(symbol: string) {
  try {
    const response = await axios.get(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}USDT`)
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

export default function CryptoDetailPage() {
  const { symbol: routeSymbol = 'BTC' } = useParams<{ symbol: string }>()
  const symbol = routeSymbol.toUpperCase()
  const cryptoInfo = getCryptoInfo(symbol)
  
  const [priceData, setPriceData] = useState<PriceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [time, setTime] = useState(new Date())

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [price, stats] = await Promise.all([
          getLivePrice(symbol),
          get24hrStats(symbol)
        ])

        setPriceData({
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

    fetchData()

    // Set up polling every 5 seconds
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [symbol])

  const formatPrice = (price: number | undefined) => {
    if (price === undefined) return '---'
    if (price < 0.01) return price.toFixed(6)
    if (price < 1) return price.toFixed(4)
    if (price < 10) return price.toFixed(3)
    if (price < 1000) return price.toFixed(2)
    return price.toLocaleString(undefined, { maximumFractionDigits: 2 })
  }

  const formatLargeNumber = (num: number | undefined) => {
    if (num === undefined) return '---'
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B'
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M'
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K'
    return num.toString()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button variant="ghost" size="sm" asChild>
            <Link href="/prices">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Prices
            </Link>
          </Button>
        </motion.div>

        {/* Header with Symbol Info */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {symbol}
            </div>
            <div>
              <h1 className="text-4xl font-bold flex items-center gap-2">
                {cryptoInfo.name}
                <span className="text-2xl text-gray-400">({symbol})</span>
              </h1>
              <div className="flex items-center gap-2 mt-1 text-gray-500">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Founded: {cryptoInfo.founded}</span>
                <span className="mx-2">•</span>
                <Users className="h-4 w-4" />
                <span className="text-sm">Founder: {cryptoInfo.founder}</span>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex gap-2">
            {cryptoInfo.website && cryptoInfo.website !== '#' && (
              <Button variant="outline" size="icon" asChild>
                <a href={cryptoInfo.website} target="_blank" rel="noopener noreferrer">
                  <Globe className="h-4 w-4" />
                </a>
              </Button>
            )}
            {cryptoInfo.github && (
              <Button variant="outline" size="icon" asChild>
                <a href={cryptoInfo.github} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                </a>
              </Button>
            )}
            {cryptoInfo.twitter && (
              <Button variant="outline" size="icon" asChild>
                <a href={cryptoInfo.twitter} target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-4 w-4" />
                </a>
              </Button>
            )}
            {cryptoInfo.discord && (
              <Button variant="outline" size="icon" asChild>
                <a href={cryptoInfo.discord} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </motion.div>

        {/* Live Price Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="overflow-hidden border-2 border-primary/20">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500" />
            <CardContent className="p-6">
              {loading && !priceData ? (
                <div className="flex justify-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : error ? (
                <div className="text-center py-12 text-red-500">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4" />
                  <p>{error}</p>
                </div>
              ) : priceData ? (
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Left side - Current Price */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {time.toLocaleTimeString()}
                      </Badge>
                      <Badge className="bg-green-500 flex items-center gap-1">
                        <Zap className="h-3 w-3 animate-pulse" />
                        LIVE
                      </Badge>
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={priceData.price}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-2"
                      >
                        <p className="text-sm text-gray-500">Current Price (USDT)</p>
                        <div className="flex items-center gap-4">
                          <span className="text-6xl font-bold">
                            ${formatPrice(priceData.price)}
                          </span>
                          <div className={`flex items-center px-3 py-1 rounded-full ${
                            priceData.changePercent > 0 
                              ? 'bg-green-100 text-green-700' 
                              : priceData.changePercent < 0
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {priceData.changePercent > 0 ? <ArrowUp className="h-5 w-5" /> : 
                             priceData.changePercent < 0 ? <ArrowDown className="h-5 w-5" /> : 
                             <Minus className="h-5 w-5" />}
                            <span className="text-xl font-bold ml-1">
                              {Math.abs(priceData.changePercent).toFixed(2)}%
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">
                          24h Change: ${priceData.change.toFixed(2)}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Right side - 24h Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">24h High</p>
                      <p className="text-lg font-semibold text-green-600">
                        ${formatPrice(priceData.high24h)}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">24h Low</p>
                      <p className="text-lg font-semibold text-red-600">
                        ${formatPrice(priceData.low24h)}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Volume (24h)</p>
                      <p className="text-lg font-semibold">
                        {formatLargeNumber(priceData.volume)} {symbol}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Volume (USDT)</p>
                      <p className="text-lg font-semibold">
                        ${formatLargeNumber(priceData.quoteVolume)}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs for Detailed Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="what-is">What is {symbol}?</TabsTrigger>
              <TabsTrigger value="why-invest">Why Invest?</TabsTrigger>
              <TabsTrigger value="future">Future Outlook</TabsTrigger>
              <TabsTrigger value="stats">Stats</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>About {cryptoInfo.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {cryptoInfo.longDescription}
                  </p>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Key Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {cryptoInfo.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Sparkles className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Rocket className="h-5 w-5 text-primary" />
                      Use Cases
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {cryptoInfo.useCases.map((useCase, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <ZapIcon className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                          <span>{useCase}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* What is SOL Tab */}
            <TabsContent value="what-is">
              <Card>
                <CardHeader>
                  <CardTitle>What is {symbol}?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-lg">{cryptoInfo.description}</p>
                    
                    <h3 className="text-xl font-bold mt-6">How Does It Work?</h3>
                    <p>{cryptoInfo.longDescription}</p>
                    
                    <h3 className="text-xl font-bold mt-6">Technology</h3>
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Cpu className="h-5 w-5 text-primary" />
                          <span className="font-semibold">Consensus</span>
                        </div>
                        <p>{cryptoInfo.consensus}</p>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Network className="h-5 w-5 text-primary" />
                          <span className="font-semibold">Network</span>
                        </div>
                        <p>Decentralized blockchain</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Why Invest Tab */}
            <TabsContent value="why-invest">
              <Card>
                <CardHeader>
                  <CardTitle>Why Invest in {symbol}?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {cryptoInfo.strengths && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-green-500" />
                        Strengths
                      </h3>
                      <ul className="space-y-2">
                        {cryptoInfo.strengths.map((strength, i) => (
                          <li key={i} className="flex items-start gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-900 rounded">
                            <Shield className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {cryptoInfo.weaknesses && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                        Considerations
                      </h3>
                      <ul className="space-y-2">
                        {cryptoInfo.weaknesses.map((weakness, i) => (
                          <li key={i} className="flex items-start gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-900 rounded">
                            <Info className="h-4 w-4 text-yellow-500 mt-1 flex-shrink-0" />
                            <span>{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {cryptoInfo.whyInvest && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Rocket className="h-5 w-5 text-primary" />
                        Investment Thesis
                      </h3>
                      <ul className="space-y-2">
                        {cryptoInfo.whyInvest.map((point, i) => (
                          <li key={i} className="flex items-start gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-900 rounded">
                            <Star className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Future Outlook Tab */}
            <TabsContent value="future">
              <Card>
                <CardHeader>
                  <CardTitle>The Future of {symbol}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {cryptoInfo.roadmap && cryptoInfo.roadmap.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Roadmap & Milestones</h3>
                      <div className="space-y-4">
                        {cryptoInfo.roadmap.map((item, i) => (
                          <div key={i} className="flex gap-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <Badge variant="outline" className="h-fit">{item.year}</Badge>
                            <p>{item.event}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {cryptoInfo.futureOutlook && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Future Outlook</h3>
                      <ul className="space-y-2">
                        {cryptoInfo.futureOutlook.map((point, i) => (
                          <li key={i} className="flex items-start gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-900 rounded">
                            <Rocket className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Stats Tab */}
            <TabsContent value="stats">
              <Card>
                <CardHeader>
                  <CardTitle>{symbol} Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded">
                        <span className="text-gray-500">Market Cap</span>
                        <span className="font-semibold">{cryptoInfo.marketCap}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded">
                        <span className="text-gray-500">Circulating Supply</span>
                        <span className="font-semibold">{cryptoInfo.circulatingSupply}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded">
                        <span className="text-gray-500">Max Supply</span>
                        <span className="font-semibold">{cryptoInfo.maxSupply}</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded">
                        <span className="text-gray-500">All-Time High</span>
                        <span className="font-semibold text-green-600">{cryptoInfo.allTimeHigh}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded">
                        <span className="text-gray-500">All-Time Low</span>
                        <span className="font-semibold text-red-600">{cryptoInfo.allTimeLow}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded">
                        <span className="text-gray-500">Consensus</span>
                        <span className="font-semibold">{cryptoInfo.consensus}</span>
                      </div>
                    </div>
                  </div>

                  {cryptoInfo.competitors && (
                    <div className="mt-6">
                      <h3 className="font-semibold mb-3">Competitors</h3>
                      <div className="flex flex-wrap gap-2">
                        {cryptoInfo.competitors.map((comp, i) => (
                          <Badge key={i} variant="secondary">{comp}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}