import { Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/layout/Navbar'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import HomePage from '@/pages/HomePage'
import AboutPage from '@/pages/about/AboutPage'
import AssistantPage from '@/pages/assistant/AssistantPage'
import ContactPage from '@/pages/contact/ContactPage'
import PredictionsPage from '@/pages/predictions/PredictionsPage'
import PredictionPage from '@/pages/predictions/PredictionPage'
import PricesPage from '@/pages/prices/PricesPage'
import PriceDetailPage from '@/pages/prices/PriceDetailPage'
import EducationPage from '@/pages/EducationPage'
import BotsPage from '@/pages/BotsPage'
import DashboardPage from '@/pages/DashboardPage'
import MyBotsPage from '@/pages/dashboard/MyBotsPage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'

export default function App() {
  return (
    <ThemeProvider>
      <Navbar />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/assistant" element={<AssistantPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/predictions" element={<PredictionsPage />} />
          <Route path="/prediction" element={<PredictionPage />} />
          <Route path="/prices" element={<PricesPage />} />
          <Route path="/prices/:symbol" element={<PriceDetailPage />} />
          <Route path="/education" element={<EducationPage />} />
          <Route path="/bots" element={<BotsPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/my-bots" element={<MyBotsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<div className="p-12 text-center">Page not found</div>} />
        </Routes>
      </main>
      <Toaster position="top-right" />
    </ThemeProvider>
  )
}
