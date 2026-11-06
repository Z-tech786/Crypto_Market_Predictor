'use client'

import { useRef } from 'react'
import { ArrowUp, ArrowDown } from 'lucide-react'
import { PriceData } from '@/lib/api/prices'

interface LiveTickerProps {
  prices: PriceData[]
  isLive?: boolean
}

export default function LiveTicker({ prices, isLive }: LiveTickerProps) {
  const tickerRef = useRef<HTMLDivElement>(null)

  // Double the prices for seamless scrolling
  const displayPrices = [...prices, ...prices]

  if (!prices.length) return null

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-2 overflow-hidden relative">
      {isLive && (
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
          <span className="flex items-center gap-1 text-xs text-white bg-green-500/20 px-2 py-1 rounded-full">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            LIVE
          </span>
        </div>
      )}
      <div 
        ref={tickerRef}
        className="flex animate-scroll whitespace-nowrap"
        style={{ animation: 'scroll 30s linear infinite' }}
      >
        {displayPrices.map((item, i) => (
          <div key={`${item.symbol}-${i}`} className="flex items-center gap-2 text-white mx-4">
            <span className="font-bold">{item.symbol}</span>
            <span>${item.price.toFixed(2)}</span>
            <span className={`flex items-center ${item.changePercent >= 0 ? 'text-green-300' : 'text-red-300'}`}>
              {item.changePercent >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
              {Math.abs(item.changePercent).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}