import { useEffect, useState } from 'react';
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

const TAB_PATHS = {
  dashboard: '/markets',
  prediction: '/ai-prediction',
  trading: '/paper-trading',
  education: '/academy',
  sentiment: '/news-sentiment',
  portfolio: '/portfolio',
  admin: '/admin'
};

const PATH_TABS = Object.fromEntries(
  Object.entries(TAB_PATHS).map(([tab, path]) => [path, tab])
);
PATH_TABS['/'] = 'dashboard';

const normalizePath = (path) => path.replace(/\/+$/, '') || '/';

function MainApp() {
  const [activeTab, setActiveTab] = useState(() => {
    const path = normalizePath(window.location.pathname);
    return PATH_TABS[path] || 'dashboard';
  });
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const { setActiveCoinId } = useCrypto();

  useEffect(() => {
    const syncTabFromPath = () => {
      const path = normalizePath(window.location.pathname);
      const tab = PATH_TABS[path] || 'dashboard';
      setActiveTab(tab);

      if (path !== TAB_PATHS[tab]) {
        window.history.replaceState({ tab }, '', TAB_PATHS[tab]);
      }
    };

    window.addEventListener('popstate', syncTabFromPath);
    syncTabFromPath();
    return () => window.removeEventListener('popstate', syncTabFromPath);
  }, []);

  const navigateToTab = (tab) => {
    const path = TAB_PATHS[tab];
    if (!path) {
      console.error(`Cannot navigate to unknown tab: ${tab}`);
      return;
    }

    if (normalizePath(window.location.pathname) !== path) {
      window.history.pushState({ tab }, '', path);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToPrediction = (coinId) => {
    if (coinId) setActiveCoinId(coinId);
    navigateToTab('prediction');
  };

  const handleNavigateToTrading = (coinId) => {
    if (coinId) setActiveCoinId(coinId);
    navigateToTab('trading');
  };

  return (
    <div className="crypto-app-root">
      {/* 1. Global Live Ticker Bar */}
      <TickerBar />

      {/* 2. Top Header Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={navigateToTab}
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
