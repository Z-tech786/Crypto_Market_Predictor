import React, { useState, useRef, useEffect } from 'react';
import { useCrypto } from '../context/CryptoContext';
import {
  BrainCircuit,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Trash2,
  HelpCircle,
  Lightbulb,
  BookOpen
} from 'lucide-react';

export const AIAssistantModal = ({ isOpen, onClose }) => {
  const { activeCoin, cryptos } = useCrypto();

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello! I am **NeuroCrypto AI**, your crypto educational assistant.
      
I can help you:
• Understand technical indicators (RSI, MACD, Bollinger Bands)
• Explain complex blockchain & DeFi concepts (Halving, Staking, Impermanent Loss)
• Interpret AI predictive forecasts & Bayesian uncertainty intervals
• Guide you through simulated paper trading strategies.

How can I help your learning today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Suggested quick prompts
  const quickPrompts = [
    { label: 'Explain RSI & Overbought', query: 'How do I interpret the Relative Strength Index (RSI) on a crypto chart?' },
    { label: 'What is Bitcoin Halving?', query: 'Explain Bitcoin Halving and why it affects crypto market cycles.' },
    { label: 'Explain Impermanent Loss', query: 'What is Impermanent Loss in decentralized liquidity pools?' },
    { label: `Analyze ${activeCoin.symbol} Outlook`, query: `What is the AI prediction and technical sentiment for ${activeCoin.name}?` },
    { label: 'How LSTM Predicts Price', query: 'How does an LSTM neural network predict future cryptocurrency prices?' }
  ];

  // Smart responsive AI knowledge answers
  const generateAIResponse = (query) => {
    const q = query.toLowerCase();

    if (q.includes('rsi') || q.includes('relative strength')) {
      return `**Relative Strength Index (RSI):**
      
• **What it is:** A momentum oscillator on a scale from 0 to 100 measuring the speed and velocity of recent price changes.
• **Overbought (RSI > 70):** Indicates strong buying frenzy where price may be stretched. Traders watch for consolidation or a pullback.
• **Oversold (RSI < 30):** Indicates steep panic selling. Often watched for mean-reversion bounces.
• **Divergence:** If price makes a higher high but RSI makes a lower high, it signals weakening upside momentum (bearish divergence).

*Current ${activeCoin.symbol} RSI is **${activeCoin.rsi}**, indicating ${activeCoin.rsi > 70 ? 'overbought stretch' : activeCoin.rsi < 30 ? 'oversold opportunity' : 'balanced momentum'}.*`;
    }

    if (q.includes('halving') || q.includes('bitcoin halving')) {
      return `**Bitcoin Halving Explained:**
      
• **The Mechanism:** Every 210,000 blocks (roughly every 4 years), the block reward issued to Bitcoin miners is mathematically slashed by 50%.
• **Evolution:** Started at 50 BTC in 2009 → 25 BTC (2012) → 12.5 BTC (2016) → 6.25 BTC (2020) → 3.125 BTC in 2024.
• **Economic Impact:** With supply issuance cut in half while demand stays steady or increases, halving creates supply-side compression historically leading to multi-month bull cycles.
• **Cap:** This guarantees Bitcoin's hard finite ceiling of 21,000,000 coins.`;
    }

    if (q.includes('impermanent loss') || q.includes('defi')) {
      return `**Impermanent Loss in DeFi Liquidity Pools:**
      
• **Definition:** The temporary loss of dollar value you experience when providing liquidity to an Automated Market Maker (AMM) compared to just holding the tokens in your wallet.
• **Why it occurs:** AMMs (like Uniswap) maintain a constant product formula (\`x * y = k\`). When the price ratio between the two pooled assets changes, arbitrageurs rebalance the pool, leaving you with more of the depreciating asset and less of the appreciating asset.
• **Why provide liquidity then?:** Trading fee rewards and yield farming incentives can offset and exceed impermanent loss over time.`;
    }

    if (q.includes('lstm') || q.includes('neural') || q.includes('predict') || q.includes('model')) {
      return `**How the LSTM Predictive Model Operates:**
      
1. **Long Short-Term Memory Architecture:** LSTMs are specialized recurrent neural networks designed to retain contextual memory across sequential time steps using Input, Output, and Forget gates.
2. **Multi-Variate Feature Ingestion:**
   • Historical OHLCV (Open, High, Low, Close, Volume)
   • Technical indicators (EMA 50/200, RSI, MACD)
   • On-chain metrics (active wallet count, exchange inflows)
   • Sentiment polarity scores derived from social feeds and news.
3. **Uncertainty Quantification:** The model generates confidence interval bounds (e.g. 95% Bayesian envelope) recognizing financial markets contain stochastic non-linear dynamics.`;
    }

    if (q.includes(activeCoin.name.toLowerCase()) || q.includes(activeCoin.symbol.toLowerCase())) {
      const pred = activeCoin.aiPrediction;
      return `**AI Market Assessment for ${activeCoin.name} (${activeCoin.symbol}):**
      
• **Current Spot Price:** $${activeCoin.price.toLocaleString()}
• **24h Momentum:** ${activeCoin.change24h >= 0 ? '+' : ''}${activeCoin.change24h}%
• **AI Trend Outlook:** **${pred.trend}** (Confidence: ${pred.confidence}%)
• **Forecast Target (7-Day):** $${pred.target7d.toLocaleString()}
• **Bayesian 95% CI Range:** $${pred.lowerBound7d.toLocaleString()} — $${pred.upperBound7d.toLocaleString()}
• **Primary Driver:** ${pred.factors?.[0]?.name || 'Institutional Inflows'} (${pred.factors?.[0]?.weight || '+35%'})

*Recommendation:* Maintain disciplined risk limits and test trading setups on the simulated paper terminal first.`;
    }

    // Default intelligent assistant response
    return `That's an insightful question regarding **${query}**!
    
In cryptocurrency market analysis and algorithmic systems:
• **Fundamental Drivers:** Protocol utility, developer activity, transaction throughput, tokenomics (inflation/burn rate), and regulatory developments.
• **Technical & Quantitative Drivers:** Volume distribution, moving averages, order book liquidity, and funding rates.
• **Risk Management:** Never allocate more than 1-2% of simulated portfolio equity to a single trade, and utilize stop-loss levels.

Feel free to ask me to explain any specific trading indicator, crypto concept, or how to test your strategy using the Paper Trading Bot!`;
  };

  const handleSendMessage = (textToSend = inputQuery) => {
    if (!textToSend.trim()) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsTyping(true);

    // Simulate thinking & typewriter streaming
    setTimeout(() => {
      const replyText = generateAIResponse(textToSend);
      const aiMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 850);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="assistant-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="assistant-header">
          <div className="assistant-header-left">
            <div className="assistant-bot-avatar">
              <BrainCircuit size={22} className="text-cyan-400" />
            </div>
            <div>
              <h3 className="assistant-title">NeuroCrypto AI Assistant</h3>
              <p className="assistant-subtitle">Educational Crypto LLM & Market Explainer</p>
            </div>
          </div>
          <div className="assistant-header-actions">
            <button
              className="btn-clear-chat"
              onClick={() =>
                setMessages([
                  {
                    id: 'reset',
                    sender: 'ai',
                    text: 'Chat history cleared. How can I assist your crypto studies today?',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  }
                ])
              }
              title="Clear chat history"
            >
              <Trash2 size={16} />
            </button>
            <button className="btn-close-modal" onClick={onClose} title="Close drawer">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Quick Prompts Bar */}
        <div className="assistant-prompts-bar">
          <span className="prompts-label">
            <Sparkles size={13} className="text-cyan-400" /> Quick Questions:
          </span>
          <div className="prompts-scroller">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                className="quick-prompt-pill"
                onClick={() => handleSendMessage(p.query)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Messages Body */}
        <div className="assistant-messages-body">
          {messages.map((msg) => {
            const isAI = msg.sender === 'ai';
            return (
              <div key={msg.id} className={`chat-message ${isAI ? 'ai-message' : 'user-message'}`}>
                <div className="msg-avatar">
                  {isAI ? <BrainCircuit size={16} /> : <User size={16} />}
                </div>
                <div className="msg-bubble-wrap">
                  <div className="msg-bubble">
                    {msg.text.split('\n').map((line, lIdx) => {
                      if (!line.trim()) return <br key={lIdx} />;
                      // Simple bold renderer
                      const parts = line.split(/(\*\*.*?\*\*)/g);
                      return (
                        <p key={lIdx} className="msg-line">
                          {parts.map((part, pIdx) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                              return <strong key={pIdx}>{part.slice(2, -2)}</strong>;
                            }
                            return part;
                          })}
                        </p>
                      );
                    })}
                  </div>
                  <span className="msg-time">{msg.timestamp}</span>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="chat-message ai-message">
              <div className="msg-avatar">
                <BrainCircuit size={16} />
              </div>
              <div className="msg-bubble typing-bubble">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="assistant-input-area">
          <form
            className="assistant-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <input
              type="text"
              className="assistant-input"
              placeholder="Ask anything about crypto, charts, indicators, or AI models..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
            />
            <button
              type="submit"
              className="btn-assistant-send"
              disabled={!inputQuery.trim() || isTyping}
            >
              <Send size={16} />
            </button>
          </form>
          <div className="assistant-footer-note">
            Powered by NeuroCrypto educational inference engine • Not financial advice
          </div>
        </div>
      </div>
    </div>
  );
};
