'use client'

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Link from '@/components/routing/Link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Sparkles, LogOut, DollarSign, Brain, Bot, GraduationCap, ArrowRight } from 'lucide-react'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<{email: string} | null>(null)

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    const email = localStorage.getItem('userEmail')

    if (!isLoggedIn) {
      navigate('/login')
    } else {
      setUser({ email: email || 'User' })
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userEmail')
    navigate('/login')
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Your workspace</p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">CryptoWise Dashboard</h1>
          </div>
          <Button variant="outline" onClick={handleLogout} className="rounded-full">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        <section className="relative mb-10 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-800 px-6 py-8 text-white shadow-xl shadow-indigo-950/10 sm:px-10 sm:py-10">
          <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full border-[32px] border-white/10" />
          <div className="pointer-events-none absolute -bottom-28 right-40 h-56 w-56 rounded-full bg-cyan-400/20 blur-2xl" />
          <div className="relative max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm text-blue-50">
              <Sparkles className="h-4 w-4" />
              Your crypto toolkit
            </div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Welcome back</h2>
            <p className="mt-2 break-all text-blue-100">{user.email}</p>
            <p className="mt-5 max-w-xl text-sm leading-6 text-blue-50 sm:text-base">
              Explore live market prices, model forecasts, trading tools, and learning resources—all from one place.
            </p>
          </div>
        </section>

        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Explore CryptoWise</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Choose where you want to go next.</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/prices">
            <Card className="group h-full cursor-pointer rounded-2xl transition duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg dark:hover:border-blue-800">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500 shadow-lg shadow-blue-500/20">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="mt-3 text-lg">Live Prices</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Track the crypto market</span>
                <span className="text-primary">
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition" />
                </span>
              </CardContent>
            </Card>
          </Link>

          <Link href="/predictions">
            <Card className="group h-full cursor-pointer rounded-2xl transition duration-200 hover:-translate-y-1 hover:border-violet-300 hover:shadow-lg dark:hover:border-violet-800">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500 shadow-lg shadow-violet-500/20">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="mt-3 text-lg">AI Predictions</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Explore model forecasts</span>
                <span className="text-primary">
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition" />
                </span>
              </CardContent>
            </Card>
          </Link>

          <Link href="/bots">
            <Card className="group h-full cursor-pointer rounded-2xl transition duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg dark:hover:border-emerald-800">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 shadow-lg shadow-emerald-500/20">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="mt-3 text-lg">Trading Bots</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Browse automated tools</span>
                <span className="text-primary">
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition" />
                </span>
              </CardContent>
            </Card>
          </Link>

          <Link href="/education">
            <Card className="group h-full cursor-pointer rounded-2xl transition duration-200 hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg dark:hover:border-orange-800">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500 shadow-lg shadow-orange-500/20">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="mt-3 text-lg">Crypto Education</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Build your market knowledge</span>
                <span className="text-primary">
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition" />
                </span>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
