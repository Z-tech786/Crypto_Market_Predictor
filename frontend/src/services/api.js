// Central API Service Client connecting React to Express Backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const handleResponse = async (res) => {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${res.status}`);
  }
  return await res.json();
};

export const api = {
  // 1. Cryptos & Markets
  async getCryptos() {
    try {
      const res = await fetch(`${API_BASE_URL}/cryptos`);
      return await handleResponse(res);
    } catch (err) {
      console.warn('[API Client] Falling back to local data:', err.message);
      return null;
    }
  },

  async getGlobalMetrics() {
    try {
      const res = await fetch(`${API_BASE_URL}/cryptos/global/metrics`);
      return await handleResponse(res);
    } catch (err) {
      return null;
    }
  },

  async getPrediction(coinId, horizon = '7d') {
    try {
      const res = await fetch(`${API_BASE_URL}/cryptos/${coinId}/prediction?horizon=${horizon}`);
      return await handleResponse(res);
    } catch (err) {
      return null;
    }
  },

  // 2. Paper Trading
  async getWallet() {
    try {
      const res = await fetch(`${API_BASE_URL}/trades/wallet`);
      return await handleResponse(res);
    } catch (err) {
      return null;
    }
  },

  async getTradeHistory() {
    try {
      const res = await fetch(`${API_BASE_URL}/trades/history`);
      return await handleResponse(res);
    } catch (err) {
      return null;
    }
  },

  async executeTrade(tradePayload) {
    try {
      const res = await fetch(`${API_BASE_URL}/trades`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tradePayload)
      });
      return await handleResponse(res);
    } catch (err) {
      console.warn('[API Client] Local paper trade fallback:', err.message);
      return null;
    }
  },

  async resetWallet() {
    try {
      const res = await fetch(`${API_BASE_URL}/trades/reset`, { method: 'POST' });
      return await handleResponse(res);
    } catch (err) {
      return null;
    }
  },

  // 3. Education
  async getModules() {
    try {
      const res = await fetch(`${API_BASE_URL}/education/modules`);
      return await handleResponse(res);
    } catch (err) {
      return null;
    }
  },

  async submitQuiz(quizId, answers) {
    try {
      const res = await fetch(`${API_BASE_URL}/education/quiz/${quizId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers })
      });
      return await handleResponse(res);
    } catch (err) {
      return null;
    }
  },

  // 4. News & Sentiment
  async getNews() {
    try {
      const res = await fetch(`${API_BASE_URL}/news`);
      return await handleResponse(res);
    } catch (err) {
      return null;
    }
  },

  // 5. Bot Strategies
  async getBots() {
    try {
      const res = await fetch(`${API_BASE_URL}/bots`);
      return await handleResponse(res);
    } catch (err) {
      return null;
    }
  },

  async toggleBot(botId) {
    try {
      const res = await fetch(`${API_BASE_URL}/bots/${botId}/toggle`, { method: 'POST' });
      return await handleResponse(res);
    } catch (err) {
      return null;
    }
  },

  // 6. AI Assistant Chat
  async askAssistant(query, activeCoin = 'Bitcoin') {
    try {
      const res = await fetch(`${API_BASE_URL}/assistant/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, activeCoin })
      });
      return await handleResponse(res);
    } catch (err) {
      return null;
    }
  },

  // 7. Admin
  async getAdminUsers() {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users`);
      return await handleResponse(res);
    } catch (err) {
      return null;
    }
  },

  async toggleUserRole(userId) {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, { method: 'PUT' });
      return await handleResponse(res);
    } catch (err) {
      return null;
    }
  },

  async toggleUserStatus(userId) {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/status`, { method: 'PUT' });
      return await handleResponse(res);
    } catch (err) {
      return null;
    }
  },

  async getDiagnostics() {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/diagnostics`);
      return await handleResponse(res);
    } catch (err) {
      return null;
    }
  }
};
