'use client'

import { motion } from 'framer-motion'
import { 
  Users, 
  Target, 
  Award, 
  TrendingUp, 
  Brain, 
  Bot, 
  LineChart,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Sparkles
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import Link from '@/components/routing/Link'

const teamMembers = [
  {
    name: 'Farhan Ijaz',
    role: 'Founder & CEO',
    expertise: 'Visionary Leader, AI Strategy',
    description: 'Leading CryptoWise with a vision to democratize crypto trading through artificial intelligence.',
    icon: Brain,
    color: 'from-blue-500 to-cyan-500',
    initials: 'FI',
    social: {
      github: '#',
      twitter: '#',
      linkedin: '#'
    }
  },
  {
    name: 'M Shaheer',
    role: 'Crypto Expert',
    expertise: 'Blockchain Analysis, Market Trends',
    description: 'Cryptocurrency specialist with deep expertise in market analysis and blockchain technology.',
    icon: LineChart,
    color: 'from-purple-500 to-pink-500',
    initials: 'MS',
    social: {
      github: '#',
      twitter: '#',
      linkedin: '#'
    }
  },
  {
    name: 'Hafiz Fahad',
    role: 'Bot Trading Expert',
    expertise: 'Algorithmic Trading, Strategy Development',
    description: 'Expert in developing and deploying automated trading bots with proven track record.',
    icon: Bot,
    color: 'from-green-500 to-emerald-500',
    initials: 'HF',
    social: {
      github: '#',
      twitter: '#',
      linkedin: '#'
    }
  }
]

const companyStats = [
  { label: 'Founded', value: '2024', icon: Sparkles },
  { label: 'Team Members', value: '3', icon: Users },
  { label: 'Models Trained', value: '4+', icon: Brain },
  { label: 'Accuracy Rate', value: '94%', icon: Target }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 px-4 py-1 text-sm">
            🌟 Meet the Team
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CryptoWise
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            We're on a mission to democratize crypto trading through cutting-edge artificial intelligence
          </p>
        </motion.div>

        {/* Company Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {companyStats.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            The experts behind CryptoWise
          </p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 3) }}
              whileHover={{ y: -5 }}
              className="relative"
            >
              <Card className="h-full overflow-hidden hover:shadow-2xl transition-all duration-300">
                {/* Colored top bar */}
                <div className={`h-2 bg-gradient-to-r ${member.color}`} />
                
                <CardHeader className="text-center">
                  <div className="relative mb-4">
                    <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-r ${member.color} p-1`}>
                      <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                          {member.initials}
                        </span>
                      </div>
                    </div>
                    <Badge 
                      className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
                      variant="secondary"
                    >
                      {member.role}
                    </Badge>
                  </div>
                  
                  <CardTitle className="text-2xl mb-1">{member.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {member.expertise}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="text-center">
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {member.description}
                  </p>
                  
                  <div className="flex justify-center space-x-4">
                    <Button variant="ghost" size="icon" asChild>
                      <a href={member.social.github} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <a href={member.social.twitter} target="_blank" rel="noopener noreferrer">
                        <Twitter className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Company Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                <span className="font-bold text-primary">CryptoWise</span> was founded by{' '}
                <span className="font-semibold">Farhan Ijaz</span> with a simple observation: 
                cryptocurrency trading is complex, emotional, and often driven by guesswork rather than data.
              </p>
              <p>
                Alongside <span className="font-semibold">M Shaeer</span>, our crypto market expert, and{' '}
                <span className="font-semibold">Hafiz Fahad</span>, our bot trading specialist, 
                we set out to build a platform that removes emotion from trading and provides 
                data-driven insights powered by machine learning.
              </p>
              <p>
                Today, CryptoWise combines cutting-edge AI with real-time market data to help 
                traders make informed decisions. Our ensemble models achieve up to 94% accuracy 
                in predicting price movements, and our automated trading bots execute strategies 
                with precision.
              </p>
            </div>

            {/* Key Achievements */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-600 dark:text-blue-400">Models Deployed</p>
                <p className="text-2xl font-bold">4+</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-green-600 dark:text-green-400">Data Points</p>
                <p className="text-2xl font-bold">1M+</p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-sm text-purple-600 dark:text-purple-400">Bots Available</p>
                <p className="text-2xl font-bold">6</p>
              </div>
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <p className="text-sm text-orange-600 dark:text-orange-400">Active Users</p>
                <p className="text-2xl font-bold">1K+</p>
              </div>
            </div>
          </div>

          {/* Mission & Vision Cards */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Target className="h-6 w-6" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg opacity-90">
                  To democratize cryptocurrency trading by making advanced AI predictions 
                  and automated trading accessible to everyone, from beginners to experts.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Award className="h-6 w-6" />
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg opacity-90">
                  Become the world's most trusted AI-powered crypto trading platform, 
                  where data-driven decisions replace emotional trading.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" asChild>
                  <a href="mailto:farhan@cryptowise.com">
                    <Mail className="mr-2 h-4 w-4" />
                    Email Farhan (CEO)
                  </a>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <a href="mailto:shaeer@cryptowise.com">
                    <Mail className="mr-2 h-4 w-4" />
                    Email Shaeer (Crypto Expert)
                  </a>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <a href="mailto:fahad@cryptowise.com">
                    <Mail className="mr-2 h-4 w-4" />
                    Email Fahad (Bot Expert)
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Technology Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8">Powered By</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'TensorFlow',
              'XGBoost',
              'LSTM',
              'Transformers',
              'React',
              'Vite',
              'Express',
              'Python',
              'Binance API',
              'Gold API'
            ].map((tech, i) => (
              <Card key={i} className="text-center hover:shadow-md transition">
                <CardContent className="py-4">
                  <p className="font-medium">{tech}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-16 text-center"
        >
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="py-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Start?</h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of traders using AI-powered predictions
              </p>
              <div className="flex gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/predictions">Try Predictions</Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-white/20 text-white border-white hover:bg-white/30" asChild>
                  <Link href="/bots">Explore Bots</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}