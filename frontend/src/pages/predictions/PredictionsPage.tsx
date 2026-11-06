'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Clock,
  AlertCircle,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

interface PredictionData {
  current: {
    price: number
    timestamp: string
    source: string
  }
  prediction: {
    current_price: number
    predicted_price: number
    predicted_change: number
    direction_accuracy: number
    direction: 'up' | 'down' | 'sideways'
    model: string
  }
  support: number
  resistance: number
}

interface ModelMetrics {
  accuracy: number
  mse: number
  mae: number
  lastTrained: string
}

const symbols = ['BTC', 'ETH', 'BNB', 'SOL', 'XRP']

export default function PredictionsPage() {
  const [selectedSymbol, setSelectedSymbol] = useState('BTC')
  const [data, setData] = useState<PredictionData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null)

  useEffect(() => {
    fetch(`/api/predict?symbol=${selectedSymbol}&model=xgboost`)
      .then(async response => {
        if (!response.ok) {
          const result = await response.json()
          throw new Error(result.error || 'Failed to load model metrics')
        }
        return response.json()
      })
      .then(data => {
        setMetrics({
          accuracy: data.direction_accuracy * 100,
          mse: data.mse,
          mae: data.mae,
          lastTrained: data.timestamp ? new Date(data.timestamp).toLocaleDateString() : 'Unknown'
        })
      })
      .catch(err => {
        setMetrics(null)
        console.error('Failed to load model metrics:', err)
      })
  }, [selectedSymbol])

  const fetchPrediction = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: selectedSymbol
        })
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch prediction')
      }

      setData(result.data)
      setLastUpdated(new Date())

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch prediction')
      console.error('Prediction error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrediction()

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchPrediction, 15000)
    return () => clearInterval(interval)
  }, [selectedSymbol])

  const getDirectionIcon = (direction: string) => {
    switch(direction) {
      case 'up': return <TrendingUp className="h-5 w-5 text-green-500" />
      case 'down': return <TrendingDown className="h-5 w-5 text-red-500" />
      default: return <Minus className="h-5 w-5 text-yellow-500" />
    }
  }

  const formatPrice = (price: number | undefined) => {
    if (price === undefined || price === null) return 'N/A'
    // Show different decimal places based on price
    if (price < 1) return price.toFixed(4)  // XRP, etc.
    if (price < 10) return price.toFixed(3) // SOL, etc.
    if (price < 1000) return price.toFixed(2) // ETH, etc.
    return price.toFixed(2) // BTC, etc.
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="h-12 w-12 text-primary" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent sm:text-5xl">
              ML Price Predictor
            </h1>
          </div>
          <p className="text-base text-gray-600 dark:text-gray-300 mb-2 sm:text-xl">
            Live market prices and XGBoost forecasts for the next daily candle
          </p>
          {metrics && (
            <div className="flex justify-center gap-4 text-sm">
              <Badge variant="outline" className="bg-blue-100 dark:bg-blue-950">
                Holdout direction accuracy: {metrics.accuracy.toFixed(1)}%
              </Badge>
              <Badge variant="outline" className="bg-green-100 dark:bg-green-950">
                MSE: {metrics.mse.toFixed(6)}
              </Badge>
              <Badge variant="outline" className="bg-purple-100 dark:bg-purple-950">
                MAE: {metrics.mae.toFixed(6)}
              </Badge>
            </div>
          )}
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-3 gap-4 mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Asset</CardTitle>
            </CardHeader>
            <CardContent>
              <select
                value={selectedSymbol}
                onChange={(e) => setSelectedSymbol(e.target.value)}
                aria-label="Choose cryptocurrency"
                className="w-full rounded-lg border bg-background p-3"
              >
                {symbols.map(symbol => (
                  <option key={symbol} value={symbol}>{symbol}</option>
                ))}
              </select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Model</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-2 bg-primary/10 rounded-lg text-center font-medium">
                {metrics
                  ? `XGBoost (${metrics.accuracy.toFixed(1)}% historical direction accuracy)`
                  : 'XGBoost'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={fetchPrediction}
                disabled={loading}
                className="w-full"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Live Prediction Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500" />
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl">Live Prediction</CardTitle>
                  <CardDescription>
                    XGBoost Model • {metrics?.lastTrained ? `Trained on ${metrics.lastTrained}` : 'Loading model metrics'}
                  </CardDescription>
                </div>
                {data?.current?.source && (
                  <Badge variant="outline" className="text-xs">
                    Source: {data.current.source}
                  </Badge>
                )}
                {lastUpdated && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {lastUpdated.toLocaleTimeString()}
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent>
              {loading && !data ? (
                <div className="flex justify-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : data ? (
                <div className="space-y-6">
                  {/* Current Price */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">
                          Current Price (Live)
                        </p>
                        <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                          ${formatPrice(data.current.price)}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          Updated: {new Date(data.current.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      <Badge className="bg-green-500 flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        LIVE
                      </Badge>
                    </div>
                  </div>

                  {/* Prediction */}
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl">
                    <div className="flex justify-between items-start mb-4">
                      <p className="text-sm text-purple-600 dark:text-purple-400">
                        ML Prediction (XGBoost)
                      </p>
                      <Badge variant="outline" className="bg-purple-100">
                        {(data.prediction.direction_accuracy * 100).toFixed(1)}% historical direction accuracy
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4">
                      <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                        ${formatPrice(data.prediction.predicted_price)}
                      </p>
                      <div className={`flex items-center px-3 py-1 rounded-full ${
                        data.prediction.direction === 'up'
                          ? 'bg-green-100 text-green-700'
                          : data.prediction.direction === 'down'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {data.prediction.direction === 'up' ? '↑' :
                         data.prediction.direction === 'down' ? '↓' : '→'}
                        {Math.abs(data.prediction.predicted_change).toFixed(2)}%
                      </div>
                    </div>

                    {/* Price Change Info */}
                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Expected Change: </span>
                        <span className={data.prediction.predicted_change > 0 ? 'text-green-500' : 'text-red-500'}>
                          {data.prediction.predicted_change > 0 ? '+' : ''}
                          {data.prediction.predicted_change.toFixed(2)}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Model: </span>
                        <span className="font-medium">XGBoost</span>
                      </div>
                    </div>
                  </div>

                  {/* Support/Resistance */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border border-green-200 dark:border-green-900 rounded-lg">
                      <p className="text-sm text-green-600 dark:text-green-400 mb-1">Support Level</p>
                      <p className="text-2xl font-bold text-green-600">
                        ${formatPrice(data.support)}
                      </p>
                    </div>
                    <div className="p-4 border border-red-200 dark:border-red-900 rounded-lg">
                      <p className="text-sm text-red-600 dark:text-red-400 mb-1">Resistance Level</p>
                      <p className="text-2xl font-bold text-red-600">
                        ${formatPrice(data.resistance)}
                      </p>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="text-xs text-gray-500 border-t pt-4">
                    <p>• Prediction based on XGBoost model trained on 3+ years of historical data</p>
                    <p>• Support/Resistance levels calculated from recent price action</p>
                    <p>• Live prices fetched from Binance (crypto) and GoldAPI (metals)</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No prediction available. Click refresh to generate.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Model Performance Card */}
        {metrics && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>XGBoost Model Performance</CardTitle>
                <CardDescription>Trained on your cryptocurrency dataset</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <p className="text-sm text-gray-500">Holdout direction accuracy</p>
                    <p className="text-2xl font-bold text-green-500">{metrics.accuracy.toFixed(1)}%</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <p className="text-sm text-gray-500">MSE</p>
                    <p className="text-2xl font-bold">{metrics.mse.toFixed(6)}</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <p className="text-sm text-gray-500">MAE</p>
                    <p className="text-2xl font-bold">{metrics.mae.toFixed(6)}</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <p className="text-sm text-gray-500">Last Trained</p>
                    <p className="text-2xl font-bold">{metrics.lastTrained}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </motion.div>
        )}

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center text-xs text-gray-500"
        >
          <p>⚠️ Disclaimer: These predictions are for educational purposes only. Not financial advice.</p>
          <p className="mt-1">Live prices from Binance • ML predictions from XGBoost model trained on historical data</p>
        </motion.div>
      </div>
    </div>
  )
}