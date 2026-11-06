'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  RefreshCw,
  Clock,
  AlertCircle,
  ChevronUp,
  ChevronDown,
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
    predicted_price: number
    predicted_change: number
    direction_accuracy: number
    direction: string
    model: string
  }
  technicals: {
    rsi: number
    macd: number
    support: number
    resistance: number
  }
}

export default function PredictionsPage() {
  const [selectedSymbol, setSelectedSymbol] = useState('SOL')
  const [selectedModel, setSelectedModel] = useState('ensemble')
  const [data, setData] = useState<PredictionData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const symbols = ['BTC', 'ETH', 'BNB', 'SOL', 'XRP']

  const fetchPrediction = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: selectedSymbol,
          modelType: selectedModel
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
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrediction()
  }, [selectedSymbol, selectedModel])

  const getDirectionIcon = (direction: string) => {
    switch(direction) {
      case 'up': return <ChevronUp className="h-5 w-5 text-green-500" />
      case 'down': return <ChevronDown className="h-5 w-5 text-red-500" />
      default: return <Minus className="h-5 w-5 text-yellow-500" />
    }
  }

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 0.55) return 'text-green-500'
    if (accuracy >= 0.5) return 'text-yellow-500'
    return 'text-red-500'
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
            <Brain className="h-10 w-10 text-primary sm:h-12 sm:w-12" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent sm:text-5xl">
              ML Price Predictor
            </h1>
          </div>
          <p className="mx-auto max-w-2xl text-base text-gray-600 dark:text-gray-300 sm:text-xl">
            Compare trained model forecasts against live market prices. Predictions cover the next daily candle.
          </p>
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
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                aria-label="Choose prediction model"
                className="w-full rounded-lg border bg-background p-3"
              >
                <option value="ensemble">Ensemble</option>
                <option value="lstm">LSTM</option>
                <option value="xgboost">XGBoost</option>
              </select>
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

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Main Content */}
        {data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="overflow-hidden rounded-2xl">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500" />
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl">
                      {selectedSymbol}/USD Live Prediction
                    </CardTitle>
                    <CardDescription>
                      Using {selectedModel === 'ensemble' ? 'Ensemble' :
                             selectedModel === 'lstm' ? 'LSTM' : 'XGBoost'} model
                    </CardDescription>
                  </div>
                  {lastUpdated && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Zap className="h-3 w-3 text-green-500" />
                      Live
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-8">
                {/* Current Price - REAL from Binance */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">
                        Current Price (Live from Binance)
                      </p>
                      <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                        ${data.current.price.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Updated: {new Date(data.current.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    <Badge className="bg-green-500">Live</Badge>
                  </div>
                </div>

                {/* Prediction - Based on ML Model */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-2xl border border-purple-100 bg-purple-50 p-6 dark:border-purple-900 dark:bg-purple-900/20">
                    <p className="text-sm text-purple-600 dark:text-purple-400 mb-2">
                      ML Prediction (next daily candle)
                    </p>
                    <div className="flex items-center gap-3 mb-4">
                      <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                        ${data.prediction.predicted_price.toFixed(2)}
                      </p>
                      <div className="flex items-center">
                        {getDirectionIcon(data.prediction.direction)}
                        <span className={`ml-1 font-medium ${
                          data.prediction.predicted_change > 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {data.prediction.predicted_change > 0 ? '+' : ''}
                          {data.prediction.predicted_change.toFixed(2)}%
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Holdout direction accuracy</span>
                        <span className={`font-medium ${getAccuracyColor(data.prediction.direction_accuracy)}`}>
                          {(data.prediction.direction_accuracy * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div
                        className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700"
                        role="progressbar"
                        aria-label="Holdout direction accuracy"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={Math.round(data.prediction.direction_accuracy * 100)}
                      >
                        <div
                          className="bg-purple-500 rounded-full h-2"
                          style={{ width: `${data.prediction.direction_accuracy * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Technical Indicators */}
                  <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <p className="text-sm text-gray-500 mb-4">Technical Indicators</p>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>RSI (14)</span>
                          <span className={data.technicals.rsi > 70 ? 'text-red-500' :
                                         data.technicals.rsi < 30 ? 'text-green-500' : ''}>
                            {data.technicals.rsi.toFixed(2)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-500 rounded-full h-2"
                            style={{ width: `${(data.technicals.rsi / 100) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>MACD</span>
                          <span className={data.technicals.macd > 0 ? 'text-green-500' : 'text-red-500'}>
                            {data.technicals.macd.toFixed(3)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Support/Resistance */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border border-green-200 dark:border-green-900 rounded-lg">
                    <p className="text-sm text-green-600 dark:text-green-400 mb-1">Support Level</p>
                    <p className="text-2xl font-bold text-green-600">
                      ${data.technicals.support.toFixed(2)}
                    </p>
                  </div>
                  <div className="p-4 border border-red-200 dark:border-red-900 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400 mb-1">Resistance Level</p>
                    <p className="text-2xl font-bold text-red-600">
                      ${data.technicals.resistance.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Model Info */}
                <div className="text-xs text-gray-500 border-t pt-4">
                  <p>Model: {data.prediction.model} (Holdout direction accuracy: {(data.prediction.direction_accuracy * 100).toFixed(1)}%)</p>
                  <p>Current price from Binance • Prediction from trained ML model</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && !data && (
          <div className="flex justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        )}
      </div>
    </div>
  )
}