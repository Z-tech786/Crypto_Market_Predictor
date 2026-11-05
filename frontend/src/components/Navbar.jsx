import React from 'react';
import { useCrypto } from '../context/CryptoContext';
import { formatUSD } from '../utils/formatters';
import {
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
  SlidersHorizontal
} from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab, onOpenAssistant, onOpenAuth }) => {
  const { user, switchRole, wallet } = useCrypto();

  const navItems = [
    { id: 'dashboard', label: 'Markets', icon: TrendingUp },
    { id: 'prediction', label: 'AI Prediction', icon: BrainCircuit, badge: 'AI ML' },
    { id: 'trading', label: 'Paper Trading & Bots', icon: Bot, badge: 'Sim' },
    { id: 'education', label: 'Academy', icon: GraduationCap },
    { id: 'sentiment', label: 'News & Sentiment', icon: Newspaper },
    { id: 'portfolio', label: 'Portfolio', icon: PieChart },
    { id: 'admin', label: 'Admin', icon: ShieldCheck, adminOnly: true }
  ];

  return (
    <header className="navbar-container">
      <div className="navbar-top">
        {/* Brand */}
        <div className="navbar-brand" onClick={() => setActiveTab('dashboard')}>
          <div className="brand-logo-icon">
            <BrainCircuit size={26} className="text-cyan-400" />
            <Sparkles size={14} className="brand-sparkle" />
          </div>
          <div className="brand-text">
            <div className="brand-title">
              NeuroCrypto <span className="brand-badge">AI 2.0</span>
            </div>
            <div className="brand-subtitle">Prediction & Educational Ecosystem</div>
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
              <span className="wallet-value">{formatUSD(wallet.usdtBalance)}</span>
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
            <span className="user-name-text">{user.name.split(' ')[0]}</span>
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
