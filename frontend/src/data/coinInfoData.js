// Curated encyclopedic fundamentals, historical facts, and tech specifications for cryptocurrencies

export const COIN_INFO_DATA = {
  bitcoin: {
    name: 'Bitcoin',
    symbol: 'BTC',
    founder: 'Satoshi Nakamoto',
    genesisDate: 'January 3, 2009',
    consensus: 'Proof of Work (PoW)',
    algorithm: 'SHA-256',
    blockTime: '~10 minutes',
    maxSupply: '21,000,000 BTC',
    halvingCycle: 'Every 210,000 blocks (~4 years)',
    whitepaperTitle: 'Bitcoin: A Peer-to-Peer Electronic Cash System',
    whitepaperUrl: 'https://bitcoin.org/bitcoin.pdf',
    website: 'https://bitcoin.org',
    explorer: 'https://mempool.space',
    github: 'https://github.com/bitcoin/bitcoin',
    tagline: 'The First Decentralized Digital Currency and Global Digital Gold',
    description: `Bitcoin (BTC) is the world's first decentralized digital currency, introduced in 2008 by an anonymous programmer or group of programmers using the pseudonym Satoshi Nakamoto. Released as open-source software in January 2009, Bitcoin enables peer-to-peer value transfer over the internet without reliance on any central bank, government, or intermediary financial institution.

Transactions are cryptographically verified by network nodes through Proof-of-Work (PoW) mining and immutably recorded in a publicly distributed ledger known as the blockchain. Bitcoin has a strictly enforced supply cap of 21 million coins, making it inherently disinflationary. Every 210,000 blocks (roughly every four years), the block reward issued to miners is reduced by half in an event known as the "Bitcoin Halving", systematically slowing new token issuance until the final satoshi is mined around the year 2140.`,
    keyFeatures: [
      'Strict 21 Million Maximum Supply Cap preventing inflationary dilution',
      'Decentralized Proof-of-Work consensus secured by global SHA-256 hashrate',
      'Lightning Network Layer-2 protocol enabling near-instant, micro-fee payments',
      'Censorship-resistant, permissionless settlement accessible to anyone globally',
      'Adopted by publicly traded institutions, ETFs, and nation-states as a sovereign treasury reserve'
    ],
    useCases: [
      'Digital Store of Value ("Digital Gold") against fiat currency debasement',
      'Borderles Peer-to-Peer Financial Settlement without banking hours or wire fees',
      'Institutional Treasury Diversification & Macro Inflation Hedge',
      'Micropayments and remittance via the off-chain Lightning Network'
    ]
  },
  ethereum: {
    name: 'Ethereum',
    symbol: 'ETH',
    founder: 'Vitalik Buterin & Ethereum Foundation',
    genesisDate: 'July 30, 2015',
    consensus: 'Proof of Stake (PoS)',
    algorithm: 'Gas / EVM (Ethereum Virtual Machine)',
    blockTime: '~12 seconds',
    maxSupply: 'No hard cap (Dynamic issuance via EIP-1559 burn)',
    halvingCycle: 'Not applicable (Issuance governed by validator staking yield)',
    whitepaperTitle: 'A Next-Generation Smart Contract and Decentralized Application Platform',
    whitepaperUrl: 'https://ethereum.org/en/whitepaper/',
    website: 'https://ethereum.org',
    explorer: 'https://etherscan.io',
    github: 'https://github.com/ethereum/go-ethereum',
    tagline: 'The World Computer for Smart Contracts, Decentralized Finance & Web3',
    description: `Ethereum is a global, decentralized computing platform that pioneers smart contract functionality. Proposed in late 2013 by programmer Vitalik Buterin and officially launched in July 2015, Ethereum enables software developers to build and deploy immutable decentralized applications (dApps) across financial services, gaming, governance, and non-fungible tokens (NFTs).

In September 2022, Ethereum executed "The Merge", transitioning its consensus engine from energy-intensive Proof-of-Work to Proof-of-Stake (PoS). This reduced network electrical consumption by over 99.9% while introducing validator staking yields. Through EIP-1559, a portion of every transaction base fee is permanently burned, making ETH supply deflationary during periods of elevated network activity.`,
 
    useCases: [
      'Automated Decentralized Finance (DeFi) lending, borrowing, and automated market making (DEXs)',
      'Digital Identity, Non-Fungible Tokens (NFTs), and Tokenized Real-World Assets (RWAs)',
      'Decentralized Autonomous Organizations (DAOs) and on-chain corporate governance',
      'Settlement and data availability layer for scalable Layer-2 execution rollups'
    ]
  },
  solana: {
    name: 'Solana',
    symbol: 'SOL',
    founder: 'Anatoly Yakovenko & Greg Fitzgerald',
    genesisDate: 'March 16, 2020',
    consensus: 'Proof of History (PoH) + Proof of Stake (PoS)',
    algorithm: 'Tower BFT & SeaLevel Parallel Runtime',
    blockTime: '~400 milliseconds',
    maxSupply: 'No hard cap (Initial inflation with annual disinflation schedule)',
    halvingCycle: 'Continuous programmatic disinflation (-15% per year to 1.5% terminal rate)',
    whitepaperTitle: 'Solana: A new architecture for a high performance blockchain v0.8.13',
    whitepaperUrl: 'https://solana.com/solana-whitepaper.pdf',
    website: 'https://solana.com',
    explorer: 'https://solscan.io',
    github: 'https://github.com/solana-labs/solana',
    tagline: 'High-Throughput, Sub-Second Global Blockchain Built for Mass Adoption',
    description: `Solana is a high-performance Layer-1 blockchain engineered for widespread, consumer-scale decentralized applications. Founded by former Qualcomm engineer Anatoly Yakovenko, Solana introduces Proof of History (PoH)—a cryptographically verifiable high-frequency timestamping sequence that solves the distributed clock problem in decentralized networks.

Combined with its parallel transaction processing engine (SeaLevel) and Tower BFT consensus, Solana achieves theoretical throughput of over 65,000 transactions per second (TPS) with sub-second finality and average network fees under a fraction of a cent ($0.00025). This architecture makes it a prime destination for high-frequency trading, real-time decentralized exchanges, decentralized physical infrastructure networks (DePIN), and consumer social apps.`,
    keyFeatures: [
      'Proof of History (PoH) decentralized clock reducing node communication overhead',
      'SeaLevel parallel smart contract execution processing thousands of non-overlapping transactions simultaneously',
      'Ultra-low fees averaging less than $0.001 per transaction',
      'Sub-400 millisecond block times enabling real-time decentralized application responsiveness',
      'Rapidly expanding ecosystem spanning DePIN, DeFi, high-volume DEXs, and mobile Web3'
    ],
    useCases: [
      'High-frequency decentralized trading and central limit order book DEXs',
      'Decentralized Physical Infrastructure Networks (DePIN) such as Helium and Render',
      'Global consumer payments with instant confirmation (Solana Pay)',
      'Mass-minting of compressed NFTs (cNFTs) for gaming and social media'
    ]
  },
  binancecoin: {
    name: 'BNB',
    symbol: 'BNB',
    founder: 'Changpeng Zhao (CZ) & Binance',
    genesisDate: 'July 8, 2017',
    consensus: 'Proof of Staked Authority (PoSA)',
    algorithm: 'Parlia Consensus Engine',
    blockTime: '~3 seconds',
    maxSupply: 'Target 100,000,000 BNB (Continuous auto-burn reduction)',
    halvingCycle: 'Quarterly programmatic auto-burn based on price and blocks produced',
    whitepaperTitle: 'Binance Smart Chain: A Dual-chain Architecture for Smart Contracts',
    whitepaperUrl: 'https://www.bnbchain.org',
    website: 'https://www.bnbchain.org',
    explorer: 'https://bscscan.com',
    github: 'https://github.com/bnb-chain',
    tagline: 'The Native Fuel of the BNB Chain and Binance Ecosystem',
    description: `BNB is the native utility and gas token powering the BNB Chain ecosystem, originally launched via an Initial Coin Offering (ICO) in 2017 by cryptocurrency exchange Binance. Initially an ERC-20 token on Ethereum, BNB migrated to its own native blockchain architecture, evolving into the high-performance BNB Smart Chain (BSC) with EVM compatibility and BEP-20 standards.

BNB features a programmatic Auto-Burn formula that automatically calculates tokens to be destroyed each quarter until the circulating supply reaches exactly 100 million tokens. BNB holders enjoy transaction fee discounts on Binance, participation in token launchpads, and gas payment capabilities for thousands of dApps deployed on BNB Chain.`,
    keyFeatures: [
      'EVM-compatible BNB Smart Chain with 3-second block finality and low fees',
      'Automated quarterly token burn algorithm systematically reducing supply toward 100M BNB',
      'High utility: exchange fee discounts, Launchpool rewards, and Web3 gas',
      'Multi-chain architecture including opBNB Layer-2 and BNB Greenfield storage'
    ],
    useCases: [
      'Gas payment for decentralized finance and games on BNB Smart Chain',
      'Exchange fee discount tier privileges on the Binance trading terminal',
      'Token Launchpool staking and Initial Farm Offerings (IFOs)'
    ]
  },
  ripple: {
    name: 'XRP',
    symbol: 'XRP',
    founder: 'Chris Larsen, Jed McCaleb & Arthur Britto',
    genesisDate: 'June 2, 2012',
    consensus: 'XRP Ledger Consensus Protocol (Federated Byzantine Agreement)',
    algorithm: 'Unique Node Lists (UNL)',
    blockTime: '3-5 seconds',
    maxSupply: '100,000,000,000 XRP',
    halvingCycle: 'Not applicable (Fixed maximum supply created at genesis)',
    whitepaperTitle: 'The Ripple Protocol Consensus Algorithm',
    whitepaperUrl: 'https://ripple.com/files/ripple_consensus_whitepaper.pdf',
    website: 'https://ripple.com',
    explorer: 'https://xrpscan.com',
    github: 'https://github.com/XRPLF/rippled',
    tagline: 'Enterprise-Grade Digital Asset for Global Cross-Border Remittance',
    description: `XRP is the native digital asset of the XRP Ledger (XRPL), an open-source, permissionless blockchain launched in 2012 by Arthur Britto, Jed McCaleb, and David Schwartz. Engineered specifically for high-speed cross-border payments and enterprise banking liquidity, the XRP Ledger does not rely on Proof of Work or Proof of Stake; instead, it utilizes a Federated Byzantine Consensus mechanism that confirms transactions in 3 to 5 seconds.

XRP serves as a bridge currency in Ripple's liquidity solutions, enabling financial institutions to transfer capital across borders without having to pre-fund nostro/vostro correspondent bank accounts in advance.`,
    keyFeatures: [
      'Federated Consensus finalizing transactions in 3 to 5 seconds',
      'Negligible transaction fees (fractions of a cent) burned on execution',
      'Built-in Decentralized Exchange (DEX) natively embedded in the ledger since 2012',
      'High enterprise adoption across cross-border payment corridors and banks'
    ],
    useCases: [
      'Institutional on-demand liquidity (ODL) and cross-border bank remittance',
      'Bridge asset between illiquid fiat currency currency corridors',
      'Decentralized token issuance and Automated Market Maker liquidity'
    ]
  },
  cardano: {
    name: 'Cardano',
    symbol: 'ADA',
    founder: 'Charles Hoskinson & IOHK',
    genesisDate: 'September 29, 2017',
    consensus: 'Ouroboros Proof of Stake',
    algorithm: 'Extended UTXO (EUTXO) Model',
    blockTime: '~20 seconds',
    maxSupply: '45,000,000,000 ADA',
    halvingCycle: 'Decaying monetary expansion into staking treasury reserves',
    whitepaperTitle: 'Ouroboros: A Provably Secure Proof-of-Stake Blockchain Protocol',
    whitepaperUrl: 'https://cardano.org/research/',
    website: 'https://cardano.org',
    explorer: 'https://cardanoscan.io',
    github: 'https://github.com/input-output-hk/cardano-node',
    tagline: 'Peer-Reviewed Proof-of-Stake Blockchain Platform',
    description: `Cardano is a third-generation, research-driven blockchain platform founded by Ethereum co-founder Charles Hoskinson. Developed through evidence-based peer-reviewed academic research and formal verification methods, Cardano is built using the Haskell programming language to ensure maximum software correctness, security, and mathematical rigor.

Cardano uses the Ouroboros Proof-of-Stake consensus protocol, mathematically proven to deliver the same security guarantees as Bitcoin's Proof of Work while operating at a fraction of the energy. Its Extended UTXO (EUTXO) accounting model provides deterministic smart contract execution, predictable fees, and robust parallel processing.`,
    keyFeatures: [
      'Ouroboros: mathematically proven peer-reviewed Proof-of-Stake consensus',
      'Two-layer architecture separating Cardano Settlement Layer (CSL) and Computational Layer (CCL)',
      'Deterministic smart contract execution via the Extended UTXO model',
      'On-chain decentralized treasury and Voltaire era community voting governance'
    ],
    useCases: [
      'Formal verification smart contracts for financial and supply-chain applications',
      'Decentralized digital identity management (Atala PRISM)',
      'Community-governed decentralized autonomous organization operations'
    ]
  },
  'avalanche-2': {
    name: 'Avalanche',
    symbol: 'AVAX',
    founder: 'Emin Gün Sirer & Ava Labs',
    genesisDate: 'September 21, 2020',
    consensus: 'Avalanche Snow Consensus Family',
    algorithm: 'Directed Acyclic Graph (DAG) + Subnets',
    blockTime: '<1 second finality',
    maxSupply: '720,000,000 AVAX',
    halvingCycle: 'Staking reward emissions with 100% of transaction fees burned',
    whitepaperTitle: 'Scalable and Probabilistic Leaderless BFT Consensus through Metastability',
    whitepaperUrl: 'https://www.avalabs.org/whitepapers',
    website: 'https://www.avax.network',
    explorer: 'https://snowtrace.io',
    github: 'https://github.com/ava-labs/avalanchego',
    tagline: 'Blazingly Fast, Infinitely Scalable Subnet Ecosystem',
    description: `Avalanche is a smart contracts platform designed for scalable enterprise and decentralized application deployment. Built by Cornell Professor Emin Gün Sirer and the Ava Labs team, Avalanche introduces a novel consensus mechanism that combines the benefits of classical consensus (speed and finality) with Nakamoto consensus (scale and decentralization) via subsampling and metastability.

The platform architecture divides duties across three primary built-in chains: the Exchange Chain (X-Chain) for assets, the Platform Chain (P-Chain) for subnets and staking, and the Contract Chain (C-Chain) for EVM smart contracts. Avalanche's hallmark feature is Subnets—custom, sovereign blockchains tailored with custom gas tokens and compliance rules.`,
    keyFeatures: [
      'Sub-second deterministic transaction finality without chain reorgs',
      'Avalanche Subnet technology allowing developers to launch independent sovereign blockchains',
      '100% of all AVAX transaction fees are permanently burned, creating structural scarcity',
      'Multi-chain architecture isolating asset issuance from smart contract execution'
    ],
    useCases: [
      'Custom institutional enterprise subnets (e.g. Evergreen subnets with KYC compliance)',
      'High-throughput EVM decentralized finance (DeFi)',
      'Web3 gaming blockchains requiring dedicated, unshared blockspace'
    ]
  },
  chainlink: {
    name: 'Chainlink',
    symbol: 'LINK',
    founder: 'Sergey Nazarov & Steve Ellis',
    genesisDate: 'September 19, 2017',
    consensus: 'Decentralized Oracle Networks (DONs)',
    algorithm: 'Chainlink Cross-Chain Interoperability Protocol (CCIP)',
    blockTime: 'Sub-second data feeds',
    maxSupply: '1,000,000,000 LINK',
    halvingCycle: 'Not applicable (Utility and node staking reward model)',
    whitepaperTitle: 'Chainlink 2.0: Next Steps in the Evolution of Decentralized Oracle Networks',
    whitepaperUrl: 'https://chain.link/whitepaper',
    website: 'https://chain.link',
    explorer: 'https://etherscan.io/token/0x514910771af9ca656af840dff83e8264ecf986ca',
    github: 'https://github.com/smartcontractkit/chainlink',
    tagline: 'The Industry Standard Web3 Services Platform & Cross-Chain Communication Protocol',
    description: `Chainlink is the industry-standard decentralized computing and oracle platform that seamlessly connects smart contracts on any blockchain with external real-world data, APIs, off-chain computation, and traditional banking infrastructure. Founded by Sergey Nazarov, Chainlink solves the "Blockchain Oracle Problem"—the fundamental limitation that blockchains cannot inherently fetch data from outside their closed networks.

Chainlink secures hundreds of billions of dollars across top DeFi protocols via its decentralized price feeds. Through its flagship Cross-Chain Interoperability Protocol (CCIP), Chainlink provides a secure, universal messaging standard allowing token transfers and arbitrary smart contract instructions across heterogeneous blockchains.`,
    keyFeatures: [
      'Decentralized Data Feeds securing the majority of all Total Value Locked (TVL) in DeFi',
      'Cross-Chain Interoperability Protocol (CCIP) enabling unified multichain liquidity',
      'Chainlink Functions allowing smart contracts to connect with any Web2 API in minutes',
      'Proof of Reserve (PoR) providing real-time cryptographic auditability for stablecoins and RWAs'
    ],
    useCases: [
      'Real-time price feeds for DeFi lending, derivatives, and algorithmic stablecoins',
      'Institutional Real-World Asset (RWA) tokenization and settlement with traditional financial rails',
      'Verifiable Random Function (VRF) for provably fair on-chain gaming and lottery outcomes'
    ]
  }
};

// Dynamic fallback helper for any coin not explicitly hardcoded
export const getCoinInfo = (coin) => {
  if (!coin) return null;
  const id = coin.id || coin.coinId || coin.symbol.toLowerCase();
  if (COIN_INFO_DATA[id]) {
    return COIN_INFO_DATA[id];
  }

  // Dynamic fallback synthesis based on coin properties
  return {
    name: coin.name || 'Cryptocurrency',
    symbol: coin.symbol || 'CRYPTO',
    founder: 'Decentralized Core Contributors',
    genesisDate: 'Multi-Year Production Track Record',
    consensus: coin.category?.includes('L1') ? 'Proof of Stake (PoS)' : 'Decentralized Smart Contract Protocol',
    algorithm: 'Cryptographic Elliptic Curve Digital Signatures (ECDSA)',
    blockTime: 'Dynamic consensus confirmation',
    maxSupply: coin.circulatingSupply || 'Market Driven',
    halvingCycle: 'Programmatic algorithmic emission schedule',
    whitepaperTitle: `${coin.name} Technical Architecture and Protocol Whitepaper`,
    whitepaperUrl: 'https://coinmarketcap.com',
    website: 'https://coinmarketcap.com',
    explorer: 'https://blockchain.com',
    github: 'https://github.com',
    tagline: `Innovative ${coin.category || 'Digital Asset'} Protocol in the Global Web3 Ecosystem`,
    description: `${coin.name} (${coin.symbol}) is a decentralized digital asset categorized under ${coin.category || 'Digital Currency'}. It operates with high liquidity, public ledger transparency, and cryptographic security across the decentralized financial economy.`,
    keyFeatures: [
      `High-throughput public blockchain verification for ${coin.name}`,
      `Transparent on-chain volume and continuous market valuation`,
      'Integrated with global decentralized and centralized liquidity pools'
    ],
    useCases: [
      'Digital asset portfolio diversification and value transfer',
      'Decentralized finance utility and ecosystem participation'
    ]
  };
};
