'use client'

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Link from '@/components/routing/Link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Sparkles, LogOut, DollarSign, Brain, Bot, GraduationCap, ArrowRight } from 'lucide-react'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<{email: string, name?: string} | null>(null)

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    const email = localStorage.getItem('userEmail')
    const name = localStorage.getItem('userName')
    
    if (!isLoggedIn) {
      navigate('/login')
    } else {
      setUser({ email: email || '', name: name || undefined })
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userName')
    navigate('/login')
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">CryptoWise Dashboard</h1>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Welcome, {user.name || user.email}!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300">
              Explore our features to make informed crypto decisions.
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/prices">
            <Card className="hover:shadow-lg transition cursor-pointer group">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 p-2 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="mt-4 text-xl">Live Prices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-primary">
                  <span>View Prices</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/predictions">
            <Card className="hover:shadow-lg transition cursor-pointer group">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 p-2 flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="mt-4 text-xl">AI Predictions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-primary">
                  <span>View Predictions</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/bots">
            <Card className="hover:shadow-lg transition cursor-pointer group">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 p-2 flex items-center justify-center">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="mt-4 text-xl">Trading Bots</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-primary">
                  <span>Explore Bots</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/education">
            <Card className="hover:shadow-lg transition cursor-pointer group">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 p-2 flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="mt-4 text-xl">Crypto Education</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-primary">
                  <span>Start Learning</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}