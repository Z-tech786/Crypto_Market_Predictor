import Link from '@/components/routing/Link'
import { Sparkles, Github, Twitter, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl">CryptoWise</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              AI-powered cryptocurrency predictions and automated trading bots for smarter investing.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/prices" className="text-gray-600 dark:text-gray-400 hover:text-primary">Prices</Link></li>
              <li><Link href="/predictions" className="text-gray-600 dark:text-gray-400 hover:text-primary">Predictions</Link></li>
              <li><Link href="/bots" className="text-gray-600 dark:text-gray-400 hover:text-primary">Bots</Link></li>
              <li><Link href="/assistant" className="text-gray-600 dark:text-gray-400 hover:text-primary">Assistant</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-primary">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-primary">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2024 CryptoWise. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}