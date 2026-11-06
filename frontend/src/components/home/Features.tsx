'use client'

import { motion } from 'framer-motion'
import { 
  Brain, 
  Bot, 
  MessageSquare, 
  LineChart, 
  Shield, 
  Zap,
  GraduationCap  // ADD THIS IMPORT
} from 'lucide-react'
import Link from '@/components/routing/Link'

const features = [
  {
    icon: Brain,
    title: 'AI Price Predictions',
    description: 'Advanced LSTM and Transformer models predict price movements with up to 94% accuracy.',
    link: '/predictions'
  },
  {
    icon: Bot,
    title: 'Trading Bot Marketplace',
    description: 'Deploy pre-built bots or create custom strategies with our visual builder.',
    link: '/bots'
  },
  {
    icon: MessageSquare,
    title: 'AI Assistant',
    description: 'Get real-time market insights and personalized guidance from our AI.',
    link: '/assistant'
  },
  {
    icon: LineChart,
    title: 'Real-Time Analytics',
    description: 'Live price charts, technical indicators, and market depth data.',
    link: '/prices'
  },
  {
    icon: Shield,
    title: 'Risk Management',
    description: 'Built-in stop-loss, take-profit, and position sizing tools.',
    link: '/bots'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Execute trades in milliseconds with our optimized infrastructure.',
    link: '/prices'
  },
  // ADD THIS NEW FEATURE
  {
    icon: GraduationCap,
    title: 'Crypto Education',
    description: 'Learn from basics to advanced - blockchain, trading, and more.',
    link: '/education'
  }
]

export default function Features() {
  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">
            Why Choose{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CryptoWise
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Everything you need to succeed in crypto trading, powered by cutting-edge AI
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Link href={feature.link}>
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all h-full cursor-pointer">
                  <div className="w-16 h-16 rounded-xl bg-primary/10 p-3 mb-6">
                    <feature.icon className="w-full h-full text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}