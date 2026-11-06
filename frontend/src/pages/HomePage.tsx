'use client'

import Hero from '@/components/home/Hero'
import Features from '@/components/home/Features'
import LiveTicker from '@/components/home/LiveTicker'
import PopularAssets from '@/components/home/PopularAssets'
import { usePrices } from '@/hooks/usePrices'
import Link from '@/components/routing/Link'
import { Button } from '@/components/ui/Button'
import { GraduationCap, ArrowRight } from 'lucide-react'

export default function HomePage() {
  const { prices, loading, isLive } = usePrices()

  return (
    <div>
      <Hero />
      {!loading && <LiveTicker prices={prices} isLive={isLive} />}
      
      {/* EDUCATION SECTION - ADD THIS */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-red-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <GraduationCap className="h-16 w-16 text-white" />
            <h2 className="text-5xl font-bold text-white">Crypto Education</h2>
          </div>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            New to crypto? Start your learning journey today - from basics to advanced trading strategies.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/education">
                Start Learning
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/20 text-white border-white hover:bg-white/30" asChild>
              <Link href="/education#basics">
                Beginner's Guide
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Features />
      <PopularAssets prices={prices} />
    </div>
  )
}