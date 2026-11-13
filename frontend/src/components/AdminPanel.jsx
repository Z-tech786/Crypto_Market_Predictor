import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useCrypto } from '../context/CryptoContext';
import { EDUCATION_MODULES } from '../data/educationData';
import { formatUSD } from '../utils/formatters';
import {
  ShieldCheck,
  Users,
  BookOpen,
  Server,
  Activity,
  Plus,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

export const AdminPanel = () => {
  const { user, addToast, cryptos, marketDataStatus } = useCrypto();

  const [activeAdminTab, setActiveAdminTab] = useState('users'); // 'users' | 'content' | 'diagnostics' | 'market'

  // Mock User Database
  const [usersList, setUsersList] = useState([
    {
      id: 'u-1',
      name: 'Farhan Ijaz',
      email: 'farhan@academic.edu',
      studentId: '23L-0568',
      role: 'admin',
      status: 'Active',
      balance: 10000.0,
      joined: '2026-10-15'
    },
    {
      id: 'u-2',
      name: 'Zain-ul-Abideen',
      email: 'zain@academic.edu',
      studentId: '23L-0858',
      role: 'admin',
      status: 'Active',
      balance: 10000.0,
      joined: '2026-10-15'
    },
    {
      id: 'u-3',
      name: 'Sarah Connor',
      email: 'sarah.c@university.edu',
      studentId: '23L-1120',
      role: 'student',
      status: 'Active',
      balance: 8450.0,
      joined: '2026-10-22'
    },
    {
      id: 'u-4',
      name: 'Alex Rivera',
      email: 'arivera@trader.io',
      studentId: '23L-0914',
      role: 'trader',
      status: 'Active',
      balance: 14200.0,
      joined: '2026-10-28'
    },
    {
      id: 'u-5',
      name: 'Devon Miles',
      email: 'devon@test.edu',
      studentId: '23L-0112',
      role: 'student',
      status: 'Suspended',
      balance: 3200.0,
      joined: '2026-11-01'
    }
  ]);

  // Lessons list for management
  const [modules, setModules] = useState(EDUCATION_MODULES);
  const [diagnosticsData, setDiagnosticsData] = useState(null);

  useEffect(() => {
    api.getAdminUsers().then((res) => {
      if (res && res.success && res.data) setUsersList(res.data);
    });
    api.getDiagnostics().then((res) => {
      if (res && res.success && res.data) setDiagnosticsData(res.data);
    });
  }, []);

  // New Lesson form state
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonContent, setNewLessonContent] = useState('');
  const [selectedModuleId, setSelectedModuleId] = useState(modules[0]?.id || '');
  const [isAddLessonModal, setIsAddLessonModal] = useState(false);
  const marketMovers = [...cryptos].sort((a, b) => b.change24h - a.change24h);
  const marketGainers = cryptos.filter((coin) => coin.change24h >= 0).length;
  const marketLosers = cryptos.length - marketGainers;
  const marketStatusLabel = {
    connecting: 'Connecting',
    live: 'Live',
    offline: 'Offline · retrying'
  }[marketDataStatus?.status || 'live'] || 'Live';

  // User Actions
  const handleToggleUserStatus = (userId) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === 'Active' ? 'Suspended' : 'Active';
          addToast(`User ${u.name} status updated to ${nextStatus}`, 'info');
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const handleToggleUserRole = (userId) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const roles = ['student', 'trader', 'admin'];
          const nextRole = roles[(roles.indexOf(u.role) + 1) % roles.length];
          addToast(`User ${u.name} role changed to ${nextRole.toUpperCase()}`, 'info');
          return { ...u, role: nextRole };
        }
        return u;
      })
    );
  };

  const handleResetUserBalance = (userId) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          addToast(`User ${u.name}'s virtual balance reset to $10,000 USDT`, 'success');
          return { ...u, balance: 10000.0 };
        }
        return u;
      })
    );
  };

  const handleAddLesson = (e) => {
    e.preventDefault();
    if (!newLessonTitle.trim() || !newLessonContent.trim()) return;

    setModules((prev) =>
      prev.map((m) => {
        if (m.id === selectedModuleId) {
          const newLesson = {
            id: `lesson-${Date.now()}`,
            title: newLessonTitle,
            content: newLessonContent,
            keyTakeaway: 'New academic curriculum lesson contributed by Admin.'
          };
          return {
            ...m,
            lessons: [...m.lessons, newLesson]
          };
        }
        return m;
      })
    );

    addToast(`Successfully added lesson "${newLessonTitle}"!`, 'success');
    setNewLessonTitle('');
    setNewLessonContent('');
    setIsAddLessonModal(false);
  };

  return (
    <div className="admin-page">
      {/* 1. Admin Header Banner */}
      <div className="admin-header-card">
        <div className="admin-title-wrap">
          <div className="admin-shield-icon">
            <ShieldCheck size={28} className="text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="admin-heading">System Administration & Content Hub</h2>
              <span className="admin-badge" title={`Signed in as ${user.email}`}>
                Admin Access
              </span>
            </div>
            <p className="admin-sub">
              Signed in as {user.name} · Manage accounts, curriculum, and market data.
            </p>
          </div>
        </div>

        <div className="admin-tabs-nav">
          <button
            className={`admin-subtab ${activeAdminTab === 'users' ? 'active' : ''}`}
            aria-pressed={activeAdminTab === 'users'}
            onClick={() => setActiveAdminTab('users')}
          >
            <Users size={15} /> Users ({usersList.length})
          </button>
          <button
            className={`admin-subtab ${activeAdminTab === 'content' ? 'active' : ''}`}
            aria-pressed={activeAdminTab === 'content'}
            onClick={() => setActiveAdminTab('content')}
          >
            <BookOpen size={15} /> Educational Content
          </button>
          <button
            className={`admin-subtab ${activeAdminTab === 'market' ? 'active' : ''}`}
            aria-pressed={activeAdminTab === 'market'}
            onClick={() => setActiveAdminTab('market')}
          >
            <Activity size={15} /> Market Overview
          </button>
          <button
            className={`admin-subtab ${activeAdminTab === 'diagnostics' ? 'active' : ''}`}
            aria-pressed={activeAdminTab === 'diagnostics'}
            onClick={() => setActiveAdminTab('diagnostics')}
          >
            <Server size={15} /> System Diagnostics
          </button>
        </div>
      </div>

      {/* 2. TAB: User Management */}
      {activeAdminTab === 'users' && (
        <div className="admin-section-panel">
          <div className="section-head-bar">
            <div>
              <h3 className="section-title">Registered Academic Users</h3>
              <p className="text-xs text-muted">Role-based permissions & balance governance</p>
            </div>
            <button
              className="btn-admin-add"
              onClick={() => addToast('User invitation feature queued for backend API.', 'info')}
            >
              <Plus size={15} /> Invite New User
            </button>
          </div>

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Student ID</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th className="text-right">Virtual Balance</th>
                  <th>Joined</th>
                  <th className="text-center">Permissions Action</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="user-table-cell">
                        <div className="avatar-mini">{u.name.charAt(0)}</div>
                        <div>
                          <div className="font-semibold text-white">{u.name}</div>
                          <div className="text-xs text-muted">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="font-mono text-xs">{u.studentId}</td>
                    <td>
                      <button
                        className={`role-badge role-${u.role}`}
                        onClick={() => handleToggleUserRole(u.id)}
                        title="Click to cycle role (Student -> Trader -> Admin)"
                      >
                        {u.role.toUpperCase()}
                      </button>
                    </td>
                    <td>
                      <span className={`status-pill ${u.status === 'Active' ? 'active' : 'suspended'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="text-right font-mono font-medium">
                      {formatUSD(u.balance)}
                    </td>
                    <td className="text-xs text-muted">{u.joined}</td>
                    <td className="text-center actions-group">
                      <button
                        className="btn-tbl-action"
                        onClick={() => handleToggleUserStatus(u.id)}
                        title="Toggle user active/suspended status"
                      >
                        {u.status === 'Active' ? 'Suspend' : 'Activate'}
                      </button>
                      <button
                        className="btn-tbl-action"
                        onClick={() => handleResetUserBalance(u.id)}
                        title="Reset virtual USDT paper balance"
                      >
                        Reset Balance
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. TAB: Live Market Overview */}
      {activeAdminTab === 'market' && (
        <div className="admin-section-panel">
          <div className="section-head-bar">
            <div>
              <h3 className="section-title">Live Cryptocurrency Market</h3>
              <p className="text-xs text-muted">
                Prices and 24-hour performance for tracked assets
              </p>
            </div>
            <div
              className={`admin-market-status ${marketDataStatus?.status || 'live'}`}
              role="status"
              title={
                marketDataStatus?.lastUpdated
                  ? `Last successful sync: ${new Date(marketDataStatus.lastUpdated).toLocaleString()}`
                  : marketDataStatus?.error || 'Waiting for the first market data sync'
              }
            >
              <span className="status-dot"></span>
              {marketStatusLabel}
            </div>
          </div>

          <div className="admin-market-summary">
            <div className="admin-market-stat">
              <span className="text-xs text-muted">Tracked assets</span>
              <strong>{cryptos.length}</strong>
            </div>
            <div className="admin-market-stat">
              <span className="text-xs text-muted">Positive in 24h</span>
              <strong className="positive">{marketGainers}</strong>
            </div>
            <div className="admin-market-stat">
              <span className="text-xs text-muted">Negative in 24h</span>
              <strong className="negative">{marketLosers}</strong>
            </div>
          </div>

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Asset</th>
                  <th className="text-right">Price (USDT)</th>
                  <th className="text-right">24h Change</th>
                  <th className="text-right">24h Volume</th>
                </tr>
              </thead>
              <tbody>
                {marketMovers.length > 0 ? (
                  marketMovers.map((coin) => {
                    const isPositive = coin.change24h >= 0;
                    const TrendIcon = isPositive ? TrendingUp : TrendingDown;

                    return (
                      <tr key={coin.id}>
                        <td>
                          <div className="admin-market-asset">
                            <span
                              className="admin-market-asset-dot"
                              style={{ backgroundColor: coin.color }}
                              aria-hidden="true"
                            />
                            <span className="font-semibold text-white">{coin.name}</span>
                            <span className="text-xs text-muted">{coin.symbol}</span>
                          </div>
                        </td>
                        <td className="text-right font-mono">{formatUSD(coin.price)}</td>
                        <td className={`text-right admin-market-change ${isPositive ? 'positive' : 'negative'}`}>
                          <TrendIcon size={14} aria-hidden="true" />
                          {coin.change24h > 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
                        </td>
                        <td className="text-right font-mono">{formatUSD(coin.volume24h)}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="no-data-cell">
                      No market assets are available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. TAB: Educational Content Management */}
      {activeAdminTab === 'content' && (
        <div className="admin-section-panel">
          <div className="section-head-bar">
            <div>
              <h3 className="section-title">Curriculum & Quiz Management</h3>
              <p className="text-xs text-muted">Create lessons, edit content, and inspect quizzes</p>
            </div>
            <button
              className="btn-admin-add"
              onClick={() => setIsAddLessonModal(true)}
            >
              <Plus size={15} /> Add New Lesson
            </button>
          </div>

          <div className="admin-modules-grid">
            {modules.map((m) => (
              <div key={m.id} className="admin-module-card">
                <div className="admin-module-head">
                  <span className={`level-tag level-${m.level.toLowerCase()}`}>{m.level}</span>
                  <span className="text-xs text-muted">{m.lessons.length} Lessons</span>
                </div>
                <h4 className="admin-module-title">{m.title}</h4>
                <p className="admin-module-desc text-xs text-muted">{m.description}</p>

                <div className="admin-lessons-list mt-3">
                  <span className="text-xs font-semibold text-cyan-400 block mb-2">Lessons:</span>
                  {m.lessons.map((lesson, lIdx) => (
                    <div key={lesson.id} className="admin-lesson-item">
                      <span className="text-xs font-medium text-white truncate">
                        {lIdx + 1}. {lesson.title}
                      </span>
                      <button
                        className="text-xs text-rose-400 hover:text-rose-300"
                        onClick={() => {
                          setModules((prev) =>
                            prev.map((mod) =>
                              mod.id === m.id
                                ? { ...mod, lessons: mod.lessons.filter((l) => l.id !== lesson.id) }
                                : mod
                            )
                          );
                          addToast(`Deleted lesson: ${lesson.title}`, 'info');
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>

                <div className="admin-quiz-summary mt-3 pt-2 border-t border-slate-800">
                  <span className="text-xs text-muted">
                    Module Quiz: <strong>{m.quiz.title}</strong> ({m.quiz.questions.length} Questions)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. TAB: System Diagnostics */}
      {activeAdminTab === 'diagnostics' && (
        <div className="admin-section-panel">
          <div className="section-head-bar">
            <div>
              <h3 className="section-title">System & AI Infrastructure Health</h3>
              <p className="text-xs text-muted">Real-time status of AI inference engine and data microservices</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <span className="status-dot"></span> All Systems Operational
            </div>
          </div>

          <div className="diagnostics-grid">
            <div className="diag-card">
              <div className="diag-head">
                <span className="diag-title">Python AI/ML Service</span>
                <span className="diag-badge-ok">FastAPI • OK</span>
              </div>
              <div className="diag-val">124 ms</div>
              <div className="diag-sub text-muted">LSTM Inference Latency</div>
            </div>

            <div className="diag-card">
              <div className="diag-head">
                <span className="diag-title">Node.js Express Backend</span>
                <span className="diag-badge-ok">Port 5000 • OK</span>
              </div>
              <div className="diag-val">99.98%</div>
              <div className="diag-sub text-muted">Uptime (Last 30 Days)</div>
            </div>

            <div className="diag-card">
              <div className="diag-head">
                <span className="diag-title">MongoDB Connection</span>
                <span className="diag-badge-ok">ReplicaSet • OK</span>
              </div>
              <div className="diag-val">8.4 ms</div>
              <div className="diag-sub text-muted">Query Response Latency</div>
            </div>

            <div className="diag-card">
              <div className="diag-head">
                <span className="diag-title">Live Market Ticker Stream</span>
                <span className="diag-badge-ok">WebSocket • 60/s</span>
              </div>
              <div className="diag-val">14 Assets</div>
              <div className="diag-sub text-muted">Synchronized Crypto Pairs</div>
            </div>
          </div>

          <div className="system-logs-box mt-4">
            <div className="logs-head font-mono text-xs text-muted mb-2">
              Recent System & Machine Learning Service Logs:
            </div>
            <pre className="logs-content font-mono text-xs text-slate-300">
              {`[2026-11-05 18:40:02] [INFO] [FastAPI-AI] Loaded PyTorch LSTM model weights for BTC-USD (epoch: 150, loss: 0.0024)
[2026-11-05 18:41:15] [INFO] [WebSocket] Subscribed to real-time order-book feeds for 10 active tokens
[2026-11-05 18:42:30] [INFO] [Express-Auth] Verified JWT payload for user 23L-0568 (Role: ADMIN)
[2026-11-05 18:43:00] [INFO] [Paper-Engine] Simulated trading bot engine tick complete - 0 slippage anomalies
[2026-11-05 18:44:12] [INFO] [Sentiment-NLP] Aggregated 450 news headlines - Current Sentiment: Greed (72/100)`}
            </pre>
          </div>
        </div>
      )}

      {/* 6. Add Lesson Modal */}
      {isAddLessonModal && (
        <div className="modal-backdrop" onClick={() => setIsAddLessonModal(false)}>
          <div className="custom-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="custom-modal-header">
              <h3 className="modal-title">Publish Educational Lesson</h3>
              <button className="btn-close-modal" onClick={() => setIsAddLessonModal(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleAddLesson} className="custom-modal-form">
              <div className="form-group">
                <label className="form-label">Target Module</label>
                <select
                  className="coin-dropdown"
                  value={selectedModuleId}
                  onChange={(e) => setSelectedModuleId(e.target.value)}
                >
                  {modules.map((m) => (
                    <option key={m.id} value={m.id}>
                      [{m.level}] {m.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Lesson Title</label>
                <input
                  type="text"
                  className="trade-input"
                  placeholder="e.g. Understanding Zero-Knowledge Proofs (ZKPs)"
                  value={newLessonTitle}
                  onChange={(e) => setNewLessonTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Lesson Content</label>
                <textarea
                  className="trade-input font-sans text-sm"
                  rows={6}
                  placeholder="Enter detailed educational markdown / text content..."
                  value={newLessonContent}
                  onChange={(e) => setNewLessonContent(e.target.value)}
                  required
                />
              </div>

              <div className="modal-form-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsAddLessonModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-save-holding">
                  Publish Lesson
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
