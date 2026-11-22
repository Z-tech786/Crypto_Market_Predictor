import React from 'react';
import { useCrypto } from '../context/CryptoContext';
import { formatUSD, formatPKR } from '../utils/formatters';
import { PakistanFlag } from './PakistanFlag';
import {
  Home,
  Info,
  TrendingUp,
  BrainCircuit,
  Bot,
  GraduationCap,
  Newspaper,
  PieChart,
  ShieldCheck,
  Sparkles,
  Wallet,
  User,
  SlidersHorizontal,
  MessageSquare
} from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab, onOpenAssistant, onOpenAuth }) => {
  const { user, switchRole, wallet } = useCrypto();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Markets', icon: TrendingUp },
    { id: 'prediction', label: 'AI Prediction', icon: BrainCircuit, badge: 'AI ML' },
    { id: 'chat', label: 'Bol AI', icon: MessageSquare, badge: 'Groq' },
    { id: 'trading', label: 'Paper Trading & Bots', icon: Bot, badge: 'Sim' },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'sentiment', label: 'News & Sentiment', icon: Newspaper },
    { id: 'portfolio', label: 'Portfolio', icon: PieChart },
    { id: 'about', label: 'About', icon: Info },
    { id: 'admin', label: 'Admin', icon: ShieldCheck, adminOnly: true }
  ];

  return (
    <header className="navbar-container">
      {/* 🇵🇰 Top Bismillah & National Urdu Banner */}
      <div style={{
        background: 'linear-gradient(90deg, #013818 0%, #064e3b 25%, #0b1329 50%, #064e3b 75%, #013818 100%)',
        borderBottom: '1px solid rgba(16, 185, 129, 0.35)',
        padding: '5px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        {/* Left: Pakistani Slogan in Urdu */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#34d399',
          fontWeight: 700,
          fontSize: '13px'
        }}>
          <PakistanFlag width={22} height={14} />
          <span>نیورو کرپٹو : پاکستان کا پہلا اپنا کرپٹو پلیٹ فارم</span>
        </div>

        {/* Center: Full Bismillah in Arabic calligraphy styling */}
        <div style={{
          fontFamily: "'Amiri', 'Traditional Arabic', 'Scheherazade New', 'Noto Naskh Arabic', serif",
          fontSize: '17px',
          fontWeight: 700,
          color: '#fef08a',
          letterSpacing: '1px',
          textShadow: '0 0 12px rgba(254, 240, 138, 0.45)',
          direction: 'rtl'
        }}>
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </div>

        {/* Right: National Academic Research badge */}
        <div style={{
          fontSize: '11px',
          color: '#cbd5e1',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span style={{ color: '#10b981', fontSize: '10px' }}>●</span>
          <span>FAST-NUCES FYP • فرحان اعجاز اور زین العابدین</span>
        </div>
      </div>

      <div className="navbar-top">
        {/* Brand */}
        <div
          className="navbar-brand"
          role="button"
          tabIndex={0}
          onClick={() => setActiveTab('home')}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              setActiveTab('home');
            }
          }}
        >
          <div className="brand-logo-icon">
            <BrainCircuit size={26} className="text-cyan-400" />
            <Sparkles size={14} className="brand-sparkle" />
          </div>
          <div className="brand-text">
            <div className="brand-title">
              NeuroCrypto <span className="brand-badge">AI 2.0</span>
            </div>
            <div className="brand-subtitle" style={{ color: '#34d399', fontWeight: 600 }}>
              نیورو کرپٹو — پاکستان کا پہلا اپنا کرپٹو پلیٹ فارم
            </div>
          </div>
        </div>

        {/* Global Paper Balance & AI Assistant Button & Auth */}
        <div className="navbar-actions">
          {/* Virtual Wallet Quick Display */}
          <div
            className="wallet-pill"
            onClick={() => setActiveTab('portfolio')}
            title="Click to view Virtual Portfolio"
          >
            <Wallet size={16} className="text-emerald-400" />
            <div className="wallet-pill-info">
              <span className="wallet-label">Paper Balance</span>
              <span className="wallet-value">
                {formatUSD(wallet.usdtBalance)}
                <span style={{ fontSize: '10px', color: '#34d399', display: 'block', fontWeight: 600 }}>
                  ~ {formatPKR(wallet.usdtBalance)}
                </span>
              </span>
            </div>
          </div>

          {/* AI Assistant Drawer Trigger */}
          <button
            className="btn-assistant-trigger"
            onClick={onOpenAssistant}
            title="Ask NeuroCrypto AI Assistant"
          >
            <BrainCircuit size={17} />
            <span>AI Assistant</span>
            <span className="pulse-dot"></span>
          </button>

          {/* Role Switcher Pill */}
          <div className="role-switcher">
            <span className="role-label">Role:</span>
            <select
              className="role-select"
              value={user.role}
              onChange={(e) => switchRole(e.target.value)}
              title="Switch user role to test permissions"
            >
              <option value="student">Student</option>
              <option value="trader">Trader</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* User Profile Button */}
          <button
            className="btn-user-profile"
            onClick={onOpenAuth}
            title={`Logged in as ${user.name} (${user.role})`}
          >
            <div className="user-avatar-circle">
              {user.name ? user.name.charAt(0) : 'U'}
            </div>
            <span className="user-name-text">{user?.name ? user.name.split(' ')[0] : 'User'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <nav className="navbar-tabs-bar">
        <div className="tabs-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                className={`nav-tab-btn ${isActive ? 'active' : ''} ${item.adminOnly ? 'admin-tab' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon size={16} />
                <span>{item.label}</span>
                {item.badge && <span className="tab-pill-badge">{item.badge}</span>}
                {item.adminOnly && <span className="tab-pill-badge admin-badge">Mod</span>}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
