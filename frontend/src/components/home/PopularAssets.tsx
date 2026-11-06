'use client'

import { motion } from 'framer-motion'
import Link from '@/components/routing/Link'
import { ArrowUp, ArrowDown } from 'lucide-react'
import { PriceData } from '@/lib/api/prices'

interface PopularAssetsProps {
  prices: PriceData[]
}

export default function PopularAssets({ prices }: PopularAssetsProps) {
  // Take first 6 prices for display
  const displayAssets = prices.slice(0, 6)

  if (!displayAssets.length) {
    return (
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500">Loading prices...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Popular Assets</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Real-time prices from Binance and Yahoo Finance
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayAssets.map((asset, index) => (
            <motion.div
              key={asset.symbol}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/prices/${asset.symbol}`}>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{asset.symbol}</h3>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-bold text-sm">{asset.symbol.charAt(0)}</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <span className="text-2xl font-bold">
                      ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`flex items-center ${asset.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {asset.changePercent >= 0 ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
                      {Math.abs(asset.changePercent).toFixed(2)}%
                    </span>
                    {asset.volume && (
                      <span className="text-sm text-gray-500">Vol {asset.volume}</span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}