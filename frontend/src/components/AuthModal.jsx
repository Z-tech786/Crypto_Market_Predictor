import { useState } from 'react';
import { useCrypto } from '../context/CryptoContext';
import {
  User,
  Mail,
  LogOut,
  Sparkles,
  Eye,
  EyeOff
} from 'lucide-react';

export const AuthModal = ({ isOpen, onClose }) => {
  const { user, setUser, authenticate, updateRiskTolerance, logout, switchRole, addToast } = useCrypto();

  const [mode, setMode] = useState(user.isAuthenticated ? 'profile' : 'login'); // 'login' | 'signup' | 'profile'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [selectedRole, setSelectedRole] = useState('student');
  const [riskTolerance, setRiskTolerance] = useState(user.riskTolerance || 'Moderate');

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (mode === 'signup') {
        await authenticate('register', { name, email, studentId, password, role: selectedRole });
      } else {
        await authenticate('login', { identifier: email, password });
      }
      addToast(mode === 'signup' ? 'Account created successfully.' : 'Successfully authenticated into NeuroCrypto!', 'success');
      setMode('profile');
      onClose();
    } catch (error) {
      addToast(error.message, 'error');
    }
  };

  const handleQuickDemoLogin = (demoRole) => {
    const isFarhan = demoRole === 'admin';
    logout();
    setUser({
      name: isFarhan ? 'Farhan Ijaz' : demoRole === 'trader' ? 'Alex Trader' : 'Sarah Student',
      email: `${demoRole}@crypto.edu`,
      studentId: isFarhan ? '23L-0568' : '23L-0858',
      role: demoRole,
      riskTolerance: demoRole === 'trader' ? 'Aggressive' : 'Moderate',
      isAuthenticated: true
    });
    setMode('profile');
    addToast(`Signed in as ${demoRole.toUpperCase()}`, 'success');
    onClose();
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await updateRiskTolerance(riskTolerance);
      addToast('Profile risk preferences updated.', 'success');
      onClose();
    } catch (error) {
      addToast(error.message, 'error');
    }
  };

  const handleLogout = () => {
    logout();
    setMode('login');
    addToast('Logged out of session.', 'info');
  };

  const currentMode = mode === 'signup'
    ? 'signup'
    : user.isAuthenticated
      ? 'profile'
      : 'login';

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="custom-modal-card auth-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="custom-modal-header">
          <div className="flex items-center gap-2">
            <User size={20} className="text-cyan-400" />
            <h3 className="modal-title">
              {currentMode === 'profile'
                ? 'User Profile & Settings'
                : currentMode === 'signup'
                ? 'Create Academic Account'
                : 'Sign In to NeuroCrypto'}
            </h3>
          </div>
          <button className="btn-close-modal" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Tab switchers if not profile */}
        {currentMode !== 'profile' && (
          <div className="auth-tab-row">
            <button
              className={`auth-tab-btn ${currentMode === 'login' ? 'active' : ''}`}
              onClick={() => setMode('login')}
            >
              Sign In
            </button>
            <button
              className={`auth-tab-btn ${currentMode === 'signup' ? 'active' : ''}`}
              onClick={() => setMode('signup')}
            >
              Sign Up
            </button>
          </div>
        )}

        <div className="auth-body">
          {/* PROFILE VIEW */}
          {currentMode === 'profile' && (
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
          {currentMode === 'login' && (
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
                    type={showPassword ? 'text' : 'password'}
                    className="trade-input password-input"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="input-addon password-visibility-toggle"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
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
          {currentMode === 'signup' && (
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
