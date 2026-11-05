import React, { useState } from 'react';
import { useCrypto } from '../context/CryptoContext';
import {
  User,
  Lock,
  Mail,
  Shield,
  CheckCircle,
  X,
  LogOut,
  Sliders,
  Sparkles
} from 'lucide-react';

export const AuthModal = ({ isOpen, onClose }) => {
  const { user, setUser, switchRole, addToast } = useCrypto();

  const [mode, setMode] = useState(user.isAuthenticated ? 'profile' : 'login'); // 'login' | 'signup' | 'profile'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [selectedRole, setSelectedRole] = useState('student');
  const [riskTolerance, setRiskTolerance] = useState(user.riskTolerance || 'Moderate');

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    setUser({
      name: email.split('@')[0] || 'Academic Trader',
      email: email || 'student@university.edu',
      studentId: studentId || '23L-0568',
      role: selectedRole,
      riskTolerance,
      isAuthenticated: true
    });
    addToast('Successfully authenticated into NeuroCrypto!', 'success');
    onClose();
  };

  const handleQuickDemoLogin = (demoRole) => {
    const isFarhan = demoRole === 'admin';
    setUser({
      name: isFarhan ? 'Farhan Ijaz' : demoRole === 'trader' ? 'Alex Trader' : 'Sarah Student',
      email: `${demoRole}@crypto.edu`,
      studentId: isFarhan ? '23L-0568' : '23L-0858',
      role: demoRole,
      riskTolerance: demoRole === 'trader' ? 'Aggressive' : 'Moderate',
      isAuthenticated: true
    });
    addToast(`Signed in as ${demoRole.toUpperCase()}`, 'success');
    onClose();
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setUser((prev) => ({
      ...prev,
      riskTolerance
    }));
    addToast('Profile risk preferences updated.', 'success');
    onClose();
  };

  const handleLogout = () => {
    setUser({
      name: 'Guest User',
      email: '',
      studentId: '',
      role: 'student',
      riskTolerance: 'Moderate',
      isAuthenticated: false
    });
    setMode('login');
    addToast('Logged out of session.', 'info');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="custom-modal-card auth-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="custom-modal-header">
          <div className="flex items-center gap-2">
            <User size={20} className="text-cyan-400" />
            <h3 className="modal-title">
              {mode === 'profile'
                ? 'User Profile & Settings'
                : mode === 'signup'
                ? 'Create Academic Account'
                : 'Sign In to NeuroCrypto'}
            </h3>
          </div>
          <button className="btn-close-modal" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Tab switchers if not profile */}
        {mode !== 'profile' && (
          <div className="auth-tab-row">
            <button
              className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
              onClick={() => setMode('login')}
            >
              Sign In
            </button>
            <button
              className={`auth-tab-btn ${mode === 'signup' ? 'active' : ''}`}
              onClick={() => setMode('signup')}
            >
              Sign Up
            </button>
          </div>
        )}

        <div className="auth-body">
          {/* PROFILE VIEW */}
          {mode === 'profile' && (
            <div className="profile-view-content">
              <div className="profile-header-badge">
                <div className="profile-avatar-large">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h4 className="profile-name">{user.name}</h4>
                  <span className="profile-email text-xs text-muted">{user.email}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`role-badge role-${user.role}`}>
                      {user.role.toUpperCase()}
                    </span>
                    <span className="text-xs text-muted font-mono">ID: {user.studentId}</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="profile-edit-form mt-4">
                <div className="form-group">
                  <label className="form-label">Active Role Permission</label>
                  <div className="role-btn-grid">
                    {['student', 'trader', 'admin'].map((r) => (
                      <button
                        key={r}
                        type="button"
                        className={`role-select-btn ${user.role === r ? 'active' : ''}`}
                        onClick={() => switchRole(r)}
                      >
                        {r.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Simulated Trading Risk Profile</label>
                  <select
                    className="coin-dropdown"
                    value={riskTolerance}
                    onChange={(e) => setRiskTolerance(e.target.value)}
                  >
                    <option value="Conservative">Conservative (Max 1% allocation per trade)</option>
                    <option value="Moderate">Moderate (Standard swing & mean reversion)</option>
                    <option value="Aggressive">Aggressive (High leverage breakout strategies)</option>
                  </select>
                </div>

                <div className="profile-footer-actions">
                  <button type="button" className="btn-logout" onClick={handleLogout}>
                    <LogOut size={15} /> Sign Out
                  </button>
                  <button type="submit" className="btn-save-profile">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* SIGN IN VIEW */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="auth-form">
              <div className="form-group">
                <label className="form-label">Email or Student ID</label>
                <div className="input-with-addon">
                  <input
                    type="text"
                    className="trade-input"
                    placeholder="e.g. farhan@academic.edu or 23L-0568"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <span className="input-addon">
                    <Mail size={16} />
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-with-addon">
                  <input
                    type="password"
                    className="trade-input"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span className="input-addon">
                    <Lock size={16} />
                  </span>
                </div>
              </div>

              <button type="submit" className="btn-auth-submit">
                Sign In to Account
              </button>

              {/* Demo 1-Click Access for Evaluators */}
              <div className="demo-evaluator-box mt-4">
                <span className="demo-label text-xs font-semibold text-muted block mb-2">
                  <Sparkles size={13} className="inline text-cyan-400 mr-1" />
                  Instant Evaluator 1-Click Sign In:
                </span>
                <div className="demo-buttons-row">
                  <button
                    type="button"
                    className="btn-demo-role admin"
                    onClick={() => handleQuickDemoLogin('admin')}
                  >
                    Admin Mode (Farhan / Zain)
                  </button>
                  <button
                    type="button"
                    className="btn-demo-role trader"
                    onClick={() => handleQuickDemoLogin('trader')}
                  >
                    Trader Mode
                  </button>
                  <button
                    type="button"
                    className="btn-demo-role student"
                    onClick={() => handleQuickDemoLogin('student')}
                  >
                    Student Mode
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* SIGN UP VIEW */}
          {mode === 'signup' && (
            <form onSubmit={handleLogin} className="auth-form">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="trade-input"
                  placeholder="e.g. Zain-ul-Abideen"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Student / University Roll No</label>
                <input
                  type="text"
                  className="trade-input"
                  placeholder="e.g. 23L-0858"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="trade-input"
                  placeholder="student@fast.edu.pk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Initial Role Selection</label>
                <select
                  className="coin-dropdown"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <option value="student">Student (Education & Quizzes focus)</option>
                  <option value="trader">Trader (Paper Trading & Bot focus)</option>
                  <option value="admin">Admin (Full System Management)</option>
                </select>
              </div>

              <button type="submit" className="btn-auth-submit">
                Register & Start Learning
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
