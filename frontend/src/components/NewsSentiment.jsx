import React, { useState } from 'react';
import { NEWS_ARTICLES, SENTIMENT_METRICS } from '../data/newsData';
import {
  Newspaper,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Flame,
  Radio,
  ExternalLink,
  ShieldCheck,
  Filter
} from 'lucide-react';

export const NewsSentiment = () => {
  const [filterTag, setFilterTag] = useState('All');
  const [articles, setArticles] = useState(NEWS_ARTICLES);

  const tags = ['All', 'Bitcoin', 'Ethereum', 'Solana', 'DeFi', 'Regulation'];

  const filteredArticles = articles.filter((item) => {
    if (filterTag === 'All') return true;
    return item.category.toLowerCase().includes(filterTag.toLowerCase());
  });

  return (
    <div className="sentiment-page">
      {/* 1. Market Sentiment Radar Dashboard */}
      <div className="sentiment-overview-grid">
        {/* Fear & Greed Card */}
        <div className="sentiment-card fear-greed-card">
          <div className="sent-card-header">
            <span className="sent-card-title">Crypto Fear & Greed Index</span>
            <Flame size={20} className="text-amber-400" />
          </div>

          <div className="gauge-display-wrap">
            <div className="gauge-dial">
              <span className="gauge-number">{SENTIMENT_METRICS.fearAndGreed.value}</span>
              <span className="gauge-scale">/ 100</span>
            </div>
            <div className="gauge-classification text-amber-400">
              {SENTIMENT_METRICS.fearAndGreed.classification}
            </div>
          </div>

          <div className="sent-history-row">
            <div className="hist-pill">
              <span className="text-muted text-xs">Yesterday</span>
              <span className="font-mono font-bold">{SENTIMENT_METRICS.fearAndGreed.yesterday}</span>
            </div>
            <div className="hist-pill">
              <span className="text-muted text-xs">Last Week</span>
              <span className="font-mono font-bold">{SENTIMENT_METRICS.fearAndGreed.lastWeek}</span>
            </div>
            <div className="hist-pill">
              <span className="text-muted text-xs">Last Month</span>
              <span className="font-mono font-bold">{SENTIMENT_METRICS.fearAndGreed.lastMonth}</span>
            </div>
          </div>
        </div>

        {/* Social Sentiment Polarity */}
        <div className="sentiment-card">
          <div className="sent-card-header">
            <span className="sent-card-title">Social Sentiment Breakdown</span>
            <Radio size={18} className="text-cyan-400" />
          </div>

          <div className="social-sentiment-meter">
            <div className="social-bar-stacked">
              <div
                className="social-bar-seg positive"
                style={{ width: `${SENTIMENT_METRICS.socialSentiment.positivePercent}%` }}
                title={`Bullish: ${SENTIMENT_METRICS.socialSentiment.positivePercent}%`}
              ></div>
              <div
                className="social-bar-seg neutral"
                style={{ width: `${SENTIMENT_METRICS.socialSentiment.neutralPercent}%` }}
                title={`Neutral: ${SENTIMENT_METRICS.socialSentiment.neutralPercent}%`}
              ></div>
              <div
                className="social-bar-seg negative"
                style={{ width: `${SENTIMENT_METRICS.socialSentiment.negativePercent}%` }}
                title={`Bearish: ${SENTIMENT_METRICS.socialSentiment.negativePercent}%`}
              ></div>
            </div>

            <div className="social-legend-row">
              <div className="legend-item">
                <span className="legend-dot bg-emerald-400"></span>
                <span>Bullish ({SENTIMENT_METRICS.socialSentiment.positivePercent}%)</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot bg-slate-400"></span>
                <span>Neutral ({SENTIMENT_METRICS.socialSentiment.neutralPercent}%)</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot bg-rose-400"></span>
                <span>Bearish ({SENTIMENT_METRICS.socialSentiment.negativePercent}%)</span>
              </div>
            </div>
          </div>

          <div className="mentions-footer text-xs text-muted">
            Analyzed {SENTIMENT_METRICS.socialSentiment.totalMentions24h} algorithmic posts across X, Reddit, and Discord.
          </div>
        </div>

        {/* Whale Flow & On-Chain Accumulation */}
        <div className="sentiment-card">
          <div className="sent-card-header">
            <span className="sent-card-title">On-Chain Whale Movement</span>
            <TrendingUp size={18} className="text-emerald-400" />
          </div>

          <div className="whale-metric-body">
            <div className="whale-score-box">
              <span className="text-xs text-muted">Accumulation Velocity</span>
              <div className="whale-score text-emerald-400 font-mono">
                {SENTIMENT_METRICS.whaleFlow.accumulationScore}
              </div>
            </div>

            <div className="whale-flow-note">
              <span className="text-xs text-muted block mb-1">Exchange Reserves:</span>
              <span className="text-xs font-mono font-medium text-white">
                {SENTIMENT_METRICS.whaleFlow.exchangeNetInflow}
              </span>
            </div>

            <div className="whale-status-tag">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>{SENTIMENT_METRICS.whaleFlow.interpretation}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. News Filter Bar */}
      <div className="news-filter-bar">
        <div className="flex items-center gap-2">
          <Newspaper size={18} className="text-blue-400" />
          <h3 className="news-heading">AI-Aggregated Intelligence Feed</h3>
        </div>

        <div className="category-pills">
          {tags.map((tag) => (
            <button
              key={tag}
              className={`cat-pill ${filterTag === tag ? 'active' : ''}`}
              onClick={() => setFilterTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* 3. News Articles List */}
      <div className="news-articles-grid">
        {filteredArticles.map((article) => {
          const isPos = article.sentiment === 'Positive';
          const isNeg = article.sentiment === 'Negative';

          return (
            <div key={article.id} className="news-card">
              <div className="news-card-header">
                <div className="news-meta">
                  <span className="news-source">{article.source}</span>
                  <span className="news-bullet">•</span>
                  <span className="news-time">{article.time}</span>
                  <span className="news-cat-pill">{article.category}</span>
                </div>

                <div className={`sentiment-badge ${isPos ? 'pos' : isNeg ? 'neg' : 'neu'}`}>
                  {isPos && <TrendingUp size={13} />}
                  {isNeg && <TrendingDown size={13} />}
                  <span>{article.sentiment} ({article.sentimentScore > 0 ? `+${article.sentimentScore}` : article.sentimentScore})</span>
                </div>
              </div>

              <h4 className="news-title">{article.title}</h4>

              {/* AI TL;DR Summary Box */}
              <div className="news-summary-box">
                <div className="summary-tag">
                  <Sparkles size={13} className="text-purple-400" />
                  <span>AI TL;DR Summary</span>
                </div>
                <p className="summary-content">{article.summary}</p>
              </div>

              <div className="news-card-footer">
                <span className="impact-tag">
                  Impact: <strong>{article.impact}</strong>
                </span>
                <span className="verified-link text-xs text-muted flex items-center gap-1">
                  NLP Verified <ExternalLink size={12} />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
