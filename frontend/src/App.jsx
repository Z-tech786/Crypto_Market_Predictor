import React, { useState } from 'react';
import { CryptoProvider, useCrypto } from './context/CryptoContext';
import { Navbar } from './components/Navbar';
import { TickerBar } from './components/TickerBar';
import { MarketDashboard } from './components/MarketDashboard';
import { AIPredictionView } from './components/AIPredictionView';
import { SimulatedTrading } from './components/SimulatedTrading';
import { EducationSystem } from './components/EducationSystem';
import { NewsSentiment } from './components/NewsSentiment';
import { PortfolioView } from './components/PortfolioView';
import { AdminPanel } from './components/AdminPanel';
import { AIAssistantModal } from './components/AIAssistantModal';
import { AuthModal } from './components/AuthModal';
import { Toast } from './components/Toast';
import { BrainCircuit } from 'lucide-react';
import './App.css';

function MainApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const { setActiveCoinId } = useCrypto();

  const handleNavigateToPrediction = (coinId) => {
    if (coinId) setActiveCoinId(coinId);
    setActiveTab('prediction');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToTrading = (coinId) => {
    if (coinId) setActiveCoinId(coinId);
    setActiveTab('trading');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="crypto-app-root">
      {/* 1. Global Live Ticker Bar */}
      <TickerBar />

      {/* 2. Top Header Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* 3. Main Views Content Container */}
      <main className="main-content-layout">
        {activeTab === 'dashboard' && (
          <MarketDashboard
            onNavigateToPrediction={handleNavigateToPrediction}
            onNavigateToTrading={handleNavigateToTrading}
          />
        )}

        {activeTab === 'prediction' && (
          <AIPredictionView onNavigateToTrading={handleNavigateToTrading} />
        )}

        {activeTab === 'trading' && <SimulatedTrading />}

        {activeTab === 'education' && <EducationSystem />}

        {activeTab === 'sentiment' && <NewsSentiment />}

        {activeTab === 'portfolio' && (
          <PortfolioView onNavigateToTrading={handleNavigateToTrading} />
        )}

        {activeTab === 'admin' && <AdminPanel />}
      </main>

      {/* 4. Global Floating AI Assistant Bubble */}
      <button
        className="floating-ai-fab"
        onClick={() => setIsAssistantOpen(true)}
        title="Open NeuroCrypto AI Assistant"
      >
        <div className="fab-glow-ring"></div>
        <BrainCircuit size={24} className="text-cyan-400" />
        <span className="fab-label">AI Explainer</span>
      </button>

      {/* 5. Modals & Drawers */}
      <AIAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* 6. Notifications Toast System */}
      <Toast />

      {/* 7. Academic Footer */}
      <footer className="crypto-footer">
        <div className="footer-container">
          <div className="footer-left">
            <span className="footer-title">
              AI-Based Crypto Market Prediction & Educational Assistant System
            </span>
            <p className="footer-subtitle">
              MERN Stack Web Programming Final Project • Fast NUCES
            </p>
          </div>

          <div className="footer-middle">
            <div className="academic-authors">
              <span className="author-tag">Farhan Ijaz (23L-0568)</span>
              <span className="author-tag">Zain-ul-Abideen (23L-0858)</span>
            </div>
          </div>

          <div className="footer-right">
            <span className="disclaimer-mini">
              Paper Trading & Educational Simulation • Zero Real-Money Risk
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <CryptoProvider>
      <MainApp />
    </CryptoProvider>
  );
}
