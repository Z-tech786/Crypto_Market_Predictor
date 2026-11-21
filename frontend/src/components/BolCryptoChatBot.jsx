import React, { useState, useEffect, useRef } from 'react';
import { useCrypto } from '../context/CryptoContext';
import { formatUSD } from '../utils/formatters';
import {
  BrainCircuit,
  Bot,
  Sparkles,
  Send,
  Trash2,
  Key,
  Cpu,
  Layers,
  TrendingUp,
  Activity,
  Copy,
  Check,
  Zap,
  Globe2,
  RefreshCw,
  Info,
  ChevronDown,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

const GROQ_MODELS = [
  { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B', description: 'Deep Reasoning & Versatile (Recommended)' },
  { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B', description: 'Ultra-Fast Sub-Second Response' },
  { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B', description: 'MoE Architecture with 32k Context' }
];

const SUGGESTED_PROMPTS = [
  {
    title: 'Analyze Bitcoin Momentum',
    prompt: 'Analyze current Bitcoin market structure, RSI momentum, and 24h trend.',
    icon: TrendingUp,
    color: '#f59e0b'
  },
  {
    title: 'Explain LSTM AI Bot',
    prompt: 'How does the PyTorch LSTM neural network forecast crypto prices with Bayesian bands?',
    icon: BrainCircuit,
    color: '#06b6d4'
  },
  {
    title: 'RSI vs Grid Trading',
    prompt: 'Compare the RSI Mean Reversion bot versus Grid Trading bot. When should I use each?',
    icon: Bot,
    color: '#10b981'
  },
  {
    title: 'Solana vs Ethereum',
    prompt: 'What are the fundamental architectural differences between Ethereum EVM and Solana Proof of History?',
    icon: Layers,
    color: '#a855f7'
  },
  {
    title: 'Bitcoin Halving Economics',
    prompt: 'Explain how the Bitcoin halving cycle impacts miner hashrate, stock-to-flow, and macro supply compression.',
    icon: Zap,
    color: '#3b82f6'
  },
  {
    title: 'Risk Management Rules',
    prompt: 'What are the top 5 risk management and position-sizing rules every crypto trader must follow?',
    icon: Activity,
    color: '#ec4899'
  }
];

export const BolCryptoChatBot = () => {
  const { cryptos, globalMetrics } = useCrypto();

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('bol_chat_messages');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'welcome-msg',
        role: 'assistant',
        content: `### 👋 Welcome to Bol Crypto AI!
I am your high-performance cryptocurrency intelligence assistant powered by **Groq LPU hardware**.

I am connected with real-time market data across **${cryptos.length} tracked assets**, quantitative bots (RSI, LSTM, DCA, Grid), and blockchain technical architecture.

Ask me anything about market analysis, trading algorithms, tokenomics, or choose a prompt starter below!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: 'llama-3.3-70b-versatile',
        source: 'Groq Cloud LPU'
      }
    ];
  });

  const [inputQuery, setInputQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState('llama-3.3-70b-versatile');
  const [isLoading, setIsLoading] = useState(false);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('bol_groq_api_key') || '');
  const [tempApiKey, setTempApiKey] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('bol_chat_messages', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleCopyMessage = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveApiKey = () => {
    const cleanKey = tempApiKey.trim();
    setApiKey(cleanKey);
    if (cleanKey) {
      localStorage.setItem('bol_groq_api_key', cleanKey);
    } else {
      localStorage.removeItem('bol_groq_api_key');
    }
    setIsKeyModalOpen(false);
  };

  const handleClearChat = () => {
    const reset = [
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: 'Conversation cleared. How can I assist you with crypto market analysis or algorithmic bots today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: selectedModel
      }
    ];
    setMessages(reset);
    localStorage.setItem('bol_chat_messages', JSON.stringify(reset));
  };

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isLoading) return;

    const userMessageId = `user-${Date.now()}`;
    const userMsg = {
      id: userMessageId,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    // Build context with top coins
    const topCoinsContext = cryptos.slice(0, 5).map((c) => ({
      name: c.name,
      symbol: c.symbol,
      price: c.price,
      change24h: c.change24h
    }));

    try {
      const response = await fetch('/api/groq-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          messages: messages.slice(-6).concat(userMsg).map((m) => ({
            role: m.role,
            content: m.content
          })),
          model: selectedModel,
          apiKey: apiKey || undefined,
          cryptoContext: { topCoins: topCoinsContext }
        })
      });

      const data = await response.json();

      const botMsg = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'I processed your query. Please ask any specific questions regarding crypto markets or bots.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: data.model || selectedModel,
        source: data.source || 'Groq Cloud LPU',
        isFallback: data.isFallback
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      // Local fallback on connection failure
      const botMsg = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: `### 💡 Bol Crypto AI Response\n\nI received your query: *"**${query}**"*\n\nOur system incorporates real-time analytics for ${cryptos.length} assets, LSTM predictions, and algorithmic bot mechanics. For uninterrupted ultra-fast responses, you can also add your free Groq API key in the top settings.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: selectedModel,
        isFallback: true
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Helper to render rich markdown-like content cleanly
  const renderMessageContent = (text) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      // Headers
      if (line.startsWith('### ')) {
        return <h4 key={i} className="chat-h3">{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('## ')) {
        return <h3 key={i} className="chat-h2">{line.replace('## ', '')}</h3>;
      }
      if (line.startsWith('# ')) {
        return <h2 key={i} className="chat-h1">{line.replace('# ', '')}</h2>;
      }
      // Bullet items
      if (line.trim().startsWith('* ') || line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
        return (
          <div key={i} className="chat-bullet-line">
            <span className="chat-bullet-dot">•</span>
            <span>{line.replace(/^[\*\-\•]\s*/, '')}</span>
          </div>
        );
      }
      // Empty lines
      if (!line.trim()) {
        return <div key={i} className="chat-spacing" />;
      }
      // Standard line
      return <p key={i} className="chat-para">{line}</p>;
    });
  };

  return (
    <div className="bol-chat-container">
      {/* 1. Header Toolbar */}
      <div className="bol-chat-header">
        <div className="bol-brand">
          <div className="bol-avatar-glow">
            <Bot size={22} className="text-cyan-400" />
            <Sparkles size={12} className="bol-sparkle" />
          </div>
          <div>
            <div className="bol-title-row">
              <h2 className="bol-title">Bol Crypto AI</h2>
              <span className="bol-groq-badge">Powered by Groq LPUs</span>
            </div>
            <p className="bol-subtitle">Instant Quantitative & Market Intelligence Assistant</p>
          </div>
        </div>

        {/* Header Right Controls */}
        <div className="bol-header-controls">
          {/* Model Selector */}
          <div className="model-selector-wrapper">
            <Cpu size={14} className="text-cyan-400" />
            <select
              className="model-select"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              {GROQ_MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* API Key Modal Button */}
          <button
            className={`btn-control-pill ${apiKey ? 'has-key' : ''}`}
            onClick={() => {
              setTempApiKey(apiKey);
              setIsKeyModalOpen(true);
            }}
            title={apiKey ? 'Custom Groq API Key Configured' : 'Configure Custom Groq API Key'}
          >
            <Key size={14} className={apiKey ? 'text-emerald-400' : 'text-amber-400'} />
            <span>{apiKey ? 'Groq Key Active' : 'Set Groq Key'}</span>
          </button>

          {/* Clear Chat */}
          <button
            className="btn-control-icon"
            onClick={handleClearChat}
            title="Clear Chat History"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* 2. Live Market Sync Ribbon */}
      <div className="bol-market-sync-ribbon">
        <div className="sync-badge">
          <span className="sync-pulse"></span>
          <span>Live Context Sync:</span>
        </div>
        <div className="sync-coins">
          {cryptos.slice(0, 4).map((c) => (
            <div key={c.id || c.symbol} className="sync-coin-item">
              <span className="sync-sym">{c.symbol}:</span>
              <span className="sync-price">{formatUSD(c.price)}</span>
              <span className={c.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                {c.change24h >= 0 ? '+' : ''}{c.change24h}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Messages Chat Body */}
      <div className="bol-messages-body">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`bol-message-row ${isUser ? 'user-row' : 'bot-row'}`}
            >
              <div className={`bol-message-avatar ${isUser ? 'user-avatar' : 'bot-avatar'}`}>
                {isUser ? 'You' : <BrainCircuit size={18} className="text-cyan-400" />}
              </div>

              <div className="bol-message-content-box">
                <div className="message-header-meta">
                  <span className="sender-name">{isUser ? 'You' : 'Bol Crypto AI'}</span>
                  <span className="meta-time">{msg.timestamp}</span>
                  {!isUser && (
                    <span className="meta-model-tag">
                      {msg.model?.replace('llama-3.3-70b-versatile', 'Llama 3.3 70B') || 'Groq LPU'}
                    </span>
                  )}
                </div>

                <div className="message-text">
                  {renderMessageContent(msg.content)}
                </div>

                {!isUser && (
                  <div className="message-footer-actions">
                    <button
                      className="btn-msg-copy"
                      onClick={() => handleCopyMessage(msg.id, msg.content)}
                      title="Copy response to clipboard"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check size={12} className="text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                    {msg.source && (
                      <span className="msg-source-note">⚡ {msg.source}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="bol-message-row bot-row">
            <div className="bol-message-avatar bot-avatar">
              <BrainCircuit size={18} className="text-cyan-400 animate-spin" />
            </div>
            <div className="bol-message-content-box loading-box">
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span className="loading-text">Groq LPU generating institutional analysis...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 4. Suggested Quick Prompts (visible if conversation is short) */}
      {messages.length <= 3 && (
        <div className="suggested-prompts-tray">
          <div className="suggested-tray-title">
            <Sparkles size={14} className="text-cyan-400" />
            <span>Recommended Research Prompts</span>
          </div>
          <div className="suggested-grid">
            {SUGGESTED_PROMPTS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  className="suggested-prompt-card"
                  onClick={() => handleSendMessage(item.prompt)}
                >
                  <div className="prompt-card-top">
                    <Icon size={16} style={{ color: item.color }} />
                    <span className="prompt-card-title">{item.title}</span>
                  </div>
                  <p className="prompt-card-text">{item.prompt}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Input Field Area */}
      <div className="bol-chat-input-area">
        <div className="input-box-wrapper">
          <textarea
            ref={inputRef}
            className="chat-textarea"
            placeholder="Ask Bol Crypto AI anything about market indicators, LSTM predictions, bot algorithms, or DeFi..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
          />
          <button
            className={`btn-send-message ${inputQuery.trim() ? 'active' : ''}`}
            onClick={() => handleSendMessage()}
            disabled={!inputQuery.trim() || isLoading}
            title="Send Message (Enter)"
          >
            <Send size={18} />
          </button>
        </div>

        <div className="chat-input-footnote">
          <span>Press <strong>Enter</strong> to send, <strong>Shift + Enter</strong> for newline. Powered by high-speed Groq LPU models.</span>
          <span className="disclaimer-text">Paper trading & educational simulator. No real financial risk.</span>
        </div>
      </div>

      {/* 6. Groq API Key Configuration Modal */}
      {isKeyModalOpen && (
        <div className="bol-modal-backdrop" onClick={() => setIsKeyModalOpen(false)}>
          <div className="bol-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="flex items-center gap-2">
                <Key size={18} className="text-cyan-400" />
                <h3 className="modal-title">Groq AI API Key Configuration</h3>
              </div>
              <button
                className="btn-close-modal"
                onClick={() => setIsKeyModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <p className="modal-desc">
              Bol Crypto AI connects directly to <strong>Groq Cloud LPUs</strong>. You can get a 100% free API key from{' '}
              <a
                href="https://console.groq.com/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 underline inline-flex items-center gap-1"
              >
                console.groq.com/keys <ExternalLink size={12} />
              </a>.
            </p>

            <div className="input-group">
              <label className="input-label">Your Groq API Key (gsk_...)</label>
              <input
                type="password"
                className="text-input"
                placeholder="gsk_..."
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
              />
              <span className="input-hint">
                Keys are stored securely in your browser's local storage and never exposed.
              </span>
            </div>

            <div className="modal-actions">
              {apiKey && (
                <button
                  className="btn-danger-outline"
                  onClick={() => {
                    setTempApiKey('');
                    setApiKey('');
                    localStorage.removeItem('bol_groq_api_key');
                    setIsKeyModalOpen(false);
                  }}
                >
                  Remove Key
                </button>
              )}
              <div className="modal-actions-right">
                <button
                  className="btn-secondary"
                  onClick={() => setIsKeyModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn-primary"
                  onClick={handleSaveApiKey}
                >
                  Save API Key
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
