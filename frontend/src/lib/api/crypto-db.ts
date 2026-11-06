// Crypto Information Database
// Detailed information about cryptocurrencies

export interface CryptoInfo {
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

export const cryptoDatabase: Record<string, CryptoInfo> = {
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
    marketCap: '~ billion',
    allTimeHigh: '',
    allTimeLow: '.50',
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
      'Low transaction fees (<.01)',
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
    marketCap: '~ trillion',
    allTimeHigh: ',750',
    allTimeLow: '.01',
    useCases: ['Store of value', 'Digital gold', 'Cross-border payments', 'Hedge against inflation'],
    features: ['Decentralized', 'Secure', 'Limited supply', 'Global', 'Censorship-resistant'],
    strengths: ['First mover advantage', 'Strongest network effect', 'Most secure', 'Global recognition'],
    weaknesses: ['Slow transactions', 'High energy consumption', 'Limited scalability']
  },
  ETH: {
    name: 'Ethereum',
    fullName: 'Ethereum (ETH)',
    description: 'Ethereum is a decentralized global computer that enables smart contracts and dApps.',
    longDescription: 'Ethereum is a decentralized blockchain with smart contract functionality. It\'s the foundation for DeFi, NFTs, and countless Web3 applications.',
    founded: '2015',
    founder: 'Vitalik Buterin',
    website: 'https://ethereum.org',
    whitepaper: 'https://ethereum.org/whitepaper',
    github: 'https://github.com/ethereum',
    twitter: 'https://twitter.com/ethereum',
    consensus: 'Proof of Stake (PoS)',
    maxSupply: 'No max supply',
    circulatingSupply: '~120 million ETH',
    marketCap: 'Unknown',
    allTimeHigh: 'Unknown',
    allTimeLow: 'Unknown',
    useCases: ['Smart contracts', 'DeFi', 'NFTs', 'DAOs', 'Layer 2 solutions'],
    features: ['Programmable', 'EVM compatible', 'Large ecosystem', 'Active development']
  }
}

export function getCryptoInfo(symbol: string): CryptoInfo {
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
    features: ['Cryptocurrency', 'Digital asset', 'Block-based']
  }

  return cryptoDatabase[symbol] || defaultInfo
}
