import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROLES, ROLE_LABELS } from '../../constants/roles';
import { FiMail, FiLock, FiArrowRight, FiShield } from 'react-icons/fi';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loginAsRole } = useAuth();
  const navigate = useNavigate();

  const getRedirectPath = (role) => {
    return role === ROLES.CUSTOMER ? '/dashboard' : '/admin-portal/dashboard';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const result = login(email, password);
    if (result.success) {
      navigate(getRedirectPath(result.user?.role));
    } else {
      setError(result.message);
    }
  };

  const handleQuickLogin = (role) => {
    const result = loginAsRole(role);
    if (result.success) navigate(getRedirectPath(role));
  };

  return (
    <div className="auth-page">
      <div className="auth-form-panel">
        <div className="auth-form-container">
          <div className="d-flex align-items-center gap-2 mb-4">
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'linear-gradient(135deg, #ff5640, #ff8066)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 800, fontSize: 16
            }}>IN</div>
            <span style={{ fontWeight: 700, fontSize: 20 }}>InsureFlow</span>
          </div>

          <h1>Welcome back</h1>
          <p className="lead">Sign in to access your insurance dashboard</p>

          {error && (
            <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3" style={{ fontSize: 13 }}>
              <FiShield /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label" style={{ fontSize: 13, fontWeight: 600 }}>Email</label>
              <div className="position-relative">
                <FiMail style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
                <input
                  type="email"
                  className="form-control"
                  style={{ paddingLeft: 40 }}
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="form-label mb-0" style={{ fontSize: 13, fontWeight: 600 }}>Password</label>
                <Link to="/forgot-password" style={{ fontSize: 12, color: '#ff5640', textDecoration: 'none', fontWeight: 600 }}>
                  Forgot password?
                </Link>
              </div>
              <div className="position-relative">
                <FiLock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
                <input
                  type="password"
                  className="form-control"
                  style={{ paddingLeft: 40 }}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-100 mt-3 d-flex align-items-center justify-content-center gap-2">
              Sign In <FiArrowRight />
            </button>
          </form>

          <p className="text-center mt-4" style={{ fontSize: 13, opacity: 0.6 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#192b37', fontWeight: 700, textDecoration: 'none' }}>
              Create Account
            </Link>
          </p>

          <div className="text-center mt-4 pt-3" style={{ borderTop: '1px solid rgba(25,43,55,0.06)' }}>
            <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600, opacity: 0.35, marginBottom: 10 }}>
              Demo Quick Login
            </p>
            <div className="d-flex gap-2 justify-content-center flex-wrap">
              {Object.values(ROLES).map((role) => (
                <button
                  key={role}
                  onClick={() => handleQuickLogin(role)}
                  className="btn btn-sm btn-outline-secondary"
                  style={{ fontSize: 12, fontWeight: 600, padding: '6px 16px' }}
                >
                  {ROLE_LABELS[role]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="auth-brand-panel d-none d-lg-flex">
        <div className="auth-brand-content">
          <div style={{
            width: 80, height: 80, borderRadius: 24, margin: '0 auto 24px',
            background: 'linear-gradient(135deg, rgba(255,86,64,0.2), rgba(255,128,102,0.1))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, fontWeight: 800, color: 'white'
          }}>
            <FiShield />
          </div>
          <h2>Insurance Management<br/>Reimagined</h2>
          <p style={{ margin: '0 auto' }}>
            Streamline underwriting, manage policies, and empower your customers — all from one intelligent platform.
          </p>
          <div className="role-selector-demo mt-4">
            <div className="role-chip">🛡 Underwriting</div>
            <div className="role-chip">📄 Policies</div>
            <div className="role-chip">💚 Wellness</div>
          </div>
        </div>
      </div>
    </div>
  );
}
