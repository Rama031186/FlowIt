import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FiUser, FiMail, FiLock, FiArrowRight, FiShield } from 'react-icons/fi';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    const result = register(name, email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
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

          <h1>Create Account</h1>
          <p className="lead">Join InsureFlow to manage your insurance needs</p>

          {error && (
            <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3" style={{ fontSize: 13 }}>
              <FiShield /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label" style={{ fontSize: 13, fontWeight: 600 }}>Full Name</label>
              <div className="position-relative">
                <FiUser style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
                <input type="text" className="form-control" style={{ paddingLeft: 40 }} placeholder="Enter your full name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label" style={{ fontSize: 13, fontWeight: 600 }}>Email</label>
              <div className="position-relative">
                <FiMail style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
                <input type="email" className="form-control" style={{ paddingLeft: 40 }} placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label" style={{ fontSize: 13, fontWeight: 600 }}>Password</label>
              <div className="position-relative">
                <FiLock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
                <input type="password" className="form-control" style={{ paddingLeft: 40 }} placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label" style={{ fontSize: 13, fontWeight: 600 }}>Confirm Password</label>
              <div className="position-relative">
                <FiLock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
                <input type="password" className="form-control" style={{ paddingLeft: 40 }} placeholder="Confirm your password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-100 mt-3 d-flex align-items-center justify-content-center gap-2">
              Create Account <FiArrowRight />
            </button>
          </form>

          <p className="text-center mt-4" style={{ fontSize: 13, opacity: 0.6 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#192b37', fontWeight: 700, textDecoration: 'none' }}>Sign In</Link>
          </p>
        </div>
      </div>

      <div className="auth-brand-panel d-none d-lg-flex">
        <div className="auth-brand-content">
          <div style={{
            width: 80, height: 80, borderRadius: 24, margin: '0 auto 24px',
            background: 'linear-gradient(135deg, rgba(88,153,196,0.2), rgba(88,153,196,0.1))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, color: 'white'
          }}>
            <FiUser />
          </div>
          <h2>Start Your<br/>Insurance Journey</h2>
          <p style={{ margin: '0 auto' }}>
            Browse modular products, build custom coverage, and protect what matters most.
          </p>
        </div>
      </div>
    </div>
  );
}
