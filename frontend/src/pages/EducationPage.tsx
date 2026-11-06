'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from '@/components/routing/Link'
import {
  BookOpen,
  GraduationCap,
  Clock,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  PlayCircle,
  CheckCircle,
  Award
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'

const modules = [
  {
    id: 'basics',
    title: 'Crypto Basics',
    description: 'Start here if you\'re new to cryptocurrency',
    lessons: [
      { title: 'What is Cryptocurrency?', duration: '5 min', level: 'Beginner' },
      { title: 'How Blockchain Works', duration: '8 min', level: 'Beginner' },
      { title: 'Wallets & Keys', duration: '6 min', level: 'Beginner' },
    ]
  },
  {
    id: 'history',
    title: 'History & Evolution',
    description: 'How crypto evolved from Bitcoin to today',
    lessons: [
      { title: '2008: The Birth of Bitcoin', duration: '7 min', level: 'Beginner' },
      { title: '2013-2017: Altcoins Rise', duration: '10 min', level: 'Intermediate' },
      { title: '2020-2024: Mainstream Adoption', duration: '12 min', level: 'Advanced' },
    ]
  },
  {
    id: 'why-crypto',
    title: 'Why Crypto Matters',
    description: 'Understanding the value proposition',
    lessons: [
      { title: 'Financial Freedom', duration: '6 min', level: 'Beginner' },
      { title: 'Hedge Against Inflation', duration: '8 min', level: 'Intermediate' },
      { title: 'True Digital Ownership', duration: '7 min', level: 'Intermediate' },
    ]
  }
]

export default function EducationPage() {
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
            <GraduationCap className="h-12 w-12 text-primary" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Crypto Education
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Learn everything about cryptocurrency - from basics to advanced concepts
          </p>
        </motion.div>

        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Modules Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="text-2xl">{module.title}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {module.lessons.map((lesson, i) => (
                    <div key={i} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition">
                      <div className="flex items-center gap-3">
                        <PlayCircle className="h-4 w-4 text-primary" />
                        <div>
                          <p className="font-medium">{lesson.title}</p>
                          <p className="text-xs text-gray-500">{lesson.duration} • {lesson.level}</p>
                        </div>
                      </div>
                      <Badge variant="outline">{i+1}/{module.lessons.length}</Badge>
                    </div>
                  ))}
                  <Button className="w-full mt-4 group">
                    Start Module
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-12 grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <BookOpen className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">3</p>
              <p className="text-sm text-gray-500">Modules</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <PlayCircle className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">9</p>
              <p className="text-sm text-gray-500">Lessons</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">1+</p>
              <p className="text-sm text-gray-500">Hours</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Award className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">Beginner</p>
              <p className="text-sm text-gray-500">Friendly</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}