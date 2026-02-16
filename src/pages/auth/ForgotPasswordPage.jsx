import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FiMail, FiArrowRight, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const { resetPassword } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const result = resetPassword(email);
    if (result.success) {
      setSent(true);
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

          {!sent ? (
            <>
              <h1>Reset Password</h1>
              <p className="lead">Enter your email and we'll send you a reset link</p>

              {error && (
                <div className="alert alert-danger py-2 px-3" style={{ fontSize: 13 }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label" style={{ fontSize: 13, fontWeight: 600 }}>Email Address</label>
                  <div className="position-relative">
                    <FiMail style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
                    <input type="email" className="form-control" style={{ paddingLeft: 40 }} placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary btn-lg w-100 mt-2 d-flex align-items-center justify-content-center gap-2">
                  Send Reset Link <FiArrowRight />
                </button>
              </form>
            </>
          ) : (
            <div className="text-center animate-fade-in">
              <div style={{
                width: 80, height: 80, borderRadius: '50%', margin: '0 auto 20px',
                background: 'rgba(45,156,91,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <FiCheckCircle size={36} color="#2d9c5b" />
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 800 }}>Check Your Email</h2>
              <p style={{ fontSize: 14, opacity: 0.6, maxWidth: 320, margin: '8px auto 0' }}>
                We've sent a password reset link to <strong>{email}</strong>. Please check your inbox.
              </p>
            </div>
          )}

          <div className="text-center mt-4">
            <Link to="/login" className="d-inline-flex align-items-center gap-2" style={{ fontSize: 13, color: '#192b37', fontWeight: 600, textDecoration: 'none' }}>
              <FiArrowLeft size={14} /> Back to Sign In
            </Link>
          </div>
        </div>
      </div>

      <div className="auth-brand-panel d-none d-lg-flex">
        <div className="auth-brand-content">
          <h2>Don't Worry</h2>
          <p style={{ margin: '0 auto' }}>
            We'll help you regain access to your account in no time.
          </p>
        </div>
      </div>
    </div>
  );
}
