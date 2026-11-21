import React from 'react';
import {
  GraduationCap,
  BrainCircuit,
  Server,
  Database,
  Cpu,
  Layers,
  Code2,
  ShieldCheck,
  Bot,
  TrendingUp,
  FileCode,
  ArrowRight,
  ExternalLink,
  Award,
  Terminal,
  CheckCircle2
} from 'lucide-react';

export const AboutPage = ({ onNavigate }) => {
  const teamMembers = [
    {
      name: 'Farhan Ijaz',
      rollNumber: '23L-0568',
      role: 'Full-Stack Architecture & AI Services',
      description: 'Engineered the Express.js REST API layer, MongoDB persistence pipelines, Python FastAPI microservice integration, and PyTorch LSTM predictive models.'
    },
    {
      name: 'Zain-ul-Abideen',
      rollNumber: '23L-0858',
      role: 'Frontend UI/UX, Trading Simulations & MQL5',
      description: 'Architected the React 19 single-page dashboard, Chart.js visualizations, paper trading simulation terminal, quiz engines, and custom MetaTrader 5 MQL5 Expert Advisors.'
    }
  ];

  const techStack = [
    { category: 'Frontend', items: ['React 19', 'Vite 8', 'Chart.js', 'Lucide React', 'Canvas Confetti', 'Nginx Alpine'] },
    { category: 'Backend API', items: ['Node.js 22', 'Express 5', 'Mongoose 8', 'JWT Auth', 'Helmet', 'Rate Limiter'] },
    { category: 'AI Microservice', items: ['Python 3.12', 'FastAPI', 'Uvicorn', 'PyTorch / LSTM', 'NumPy', 'Pydantic v2'] },
    { category: 'Database & DevOps', items: ['MongoDB 7.0', 'Docker Compose', 'Multi-Stage Builds', 'WiredTiger Storage'] },
    { category: 'MetaTrader 5', items: ['MQL5 Expert Advisors', 'Trade.mqh', 'PositionInfo.mqh', 'OrderInfo.mqh', 'Strategy Tester'] }
  ];

  const systemHighlights = [
    'Dual-Tier Backend Architecture: Node.js Express handles real-time web state, authentication, and order execution, while Python FastAPI provides dedicated asynchronous numerical time-series forecasting.',
    'Bayesian Confidence Envelopes: Rather than outputting mere single-point price targets, the AI engine constructs upper and lower 95% uncertainty boundaries.',
    'Adaptive Persistence Layer: Backend seamlessly connects to MongoDB 7.0 with automatic seed data, but gracefully operates in self-contained in-memory fallback if the database daemon is unavailable.',
    'Zero Real-Money Exposure: Comprehensive simulated paper trading environment with realistic 0.1% transaction fees and bid-ask slippage models.',
    'Algorithmic Trading Bot Fleet: 4 distinct quantitative strategies (RSI Mean Reversion, AI-LSTM Breakout, DCA Accumulator, Grid Volatility) with corresponding standalone MQL5 Expert Advisors for MetaTrader 5.'
  ];

  return (
    <div className="about-page-container">
      {/* 1. Header Hero */}
      <section className="about-hero-section">
        <div className="about-badge">
          <Award size={15} className="text-cyan-400" />
          <span>Academic Final Project • Web Programming (CS-3002)</span>
        </div>

        <h1 className="about-hero-title">
          About the <span className="hero-gradient-text">NeuroCrypto</span> Project
        </h1>

        <p className="about-hero-subtitle">
          An integrated full-stack web and artificial intelligence platform designed to democratize cryptocurrency education, algorithmic trading mechanics, and deep learning market analytics.
        </p>

        <div className="academic-institution-pill">
          <GraduationCap size={18} className="text-purple-400" />
          <span>FAST – National University of Computer and Emerging Sciences (NUCES)</span>
        </div>
      </section>

      {/* 2. Group Members / Authors */}
      <section className="about-team-section">
        <h2 className="section-heading text-center">Project Authors & Developers</h2>
        <p className="section-subheading text-center max-w-xl">
          Developed as the comprehensive final evaluation project for Web Programming.
        </p>

        <div className="team-cards-grid">
          {teamMembers.map((member, idx) => (
            <div key={idx} className="team-card">
              <div className="team-card-avatar">
                {member.name.charAt(0)}
              </div>
              <div className="team-card-info">
                <h3 className="team-member-name">{member.name}</h3>
                <div className="team-roll-badge">
                  <span>Roll No: {member.rollNumber}</span>
                </div>
                <div className="team-member-role">{member.role}</div>
                <p className="team-member-desc">{member.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. System Architecture Diagram & Explanation */}
      <section className="about-architecture-section">
        <h2 className="section-heading">System Architecture Overview</h2>
        <p className="section-subheading">
          A decoupled microservices ecosystem orchestrating React, Express, MongoDB, FastAPI, and MetaTrader 5.
        </p>

        <div className="architecture-diagram-card">
          <div className="architecture-tiers-grid">
            <div className="arch-tier-box">
              <div className="tier-header">
                <Layers size={20} className="text-cyan-400" />
                <h4>Client Layer</h4>
              </div>
              <p className="tier-spec">React 19 + Vite (Port 5173 / 8081)</p>
              <ul className="tier-list">
                <li>Single-Page Application (SPA)</li>
                <li>Chart.js Financial Visualizations</li>
                <li>Persistent Local Storage & Context API</li>
                <li>Nginx Reverse Proxy in Docker</li>
              </ul>
            </div>

            <div className="arch-tier-arrow">➔</div>

            <div className="arch-tier-box">
              <div className="tier-header">
                <Server size={20} className="text-blue-400" />
                <h4>API Gateway</h4>
              </div>
              <p className="tier-spec">Node.js + Express 5 (Port 5000)</p>
              <ul className="tier-list">
                <li>RESTful Microservice Endpoints</li>
                <li>JWT Authentication & Role Control</li>
                <li>Paper Order Matching Engine</li>
                <li>Graceful In-Memory Mock Fallback</li>
              </ul>
            </div>

            <div className="arch-tier-arrow">➔</div>

            <div className="arch-tier-box">
              <div className="tier-header">
                <Cpu size={20} className="text-purple-400" />
                <h4>AI Prediction Engine</h4>
              </div>
              <p className="tier-spec">Python FastAPI (Port 8000)</p>
              <ul className="tier-list">
                <li>PyTorch LSTM Recurrent Network</li>
                <li>95% Bayesian Confidence Intervals</li>
                <li>Multi-Head Attention Weights</li>
                <li>Conversational NLP Explainer</li>
              </ul>
            </div>

            <div className="arch-tier-arrow">➔</div>

            <div className="arch-tier-box">
              <div className="tier-header">
                <Database size={20} className="text-emerald-400" />
                <h4>Persistence</h4>
              </div>
              <p className="tier-spec">MongoDB 7.0 (Port 27017)</p>
              <ul className="tier-list">
                <li>WiredTiger High-Throughput Engine</li>
                <li>Automated Seed Data Injection</li>
                <li>Persistent Watchlists & User Trades</li>
                <li>Curriculum & Quiz Records</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Technology Stack Matrix */}
      <section className="about-tech-section">
        <h2 className="section-heading">Full Technology Stack</h2>
        <div className="tech-matrix-grid">
          {techStack.map((stack, idx) => (
            <div key={idx} className="tech-stack-card">
              <h4 className="tech-category-title">{stack.category}</h4>
              <div className="tech-badge-wrap">
                {stack.items.map((tech, techIdx) => (
                  <span key={techIdx} className="tech-badge-item">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Key Pedagogical & Design Features */}
      <section className="about-highlights-section">
        <h2 className="section-heading">Core Engineering & Pedagogical Highlights</h2>
        <div className="highlights-list">
          {systemHighlights.map((highlight, index) => (
            <div key={index} className="highlight-item">
              <CheckCircle2 size={20} className="highlight-icon text-cyan-400" />
              <p>{highlight}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Navigation Footer Banner */}
      <section className="about-footer-cta">
        <div className="cta-box">
          <h3>Explore the Platform</h3>
          <p>Test the live modules or return to the platform home overview.</p>
          <div className="cta-actions">
            <button className="btn-hero-primary" onClick={() => onNavigate('home')}>
              <span>Return Home</span>
            </button>
            <button className="btn-hero-secondary" onClick={() => onNavigate('dashboard')}>
              <TrendingUp size={16} />
              <span>Live Markets</span>
            </button>
            <button className="btn-hero-tertiary" onClick={() => onNavigate('prediction')}>
              <BrainCircuit size={16} />
              <span>AI Prediction</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
