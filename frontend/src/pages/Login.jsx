import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    try {
      setLoading(true);
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-header-icon">
            <ShieldCheck size={28} />
          </div>
          <h2 className="auth-title">Welcome to FraudShield</h2>
          <p className="auth-subtitle">
            Sign in to access your real-time fraud monitoring portal
          </p>
        </div>

        {error && (
          <div className="alert-box error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
            style={{ marginTop: '12px', padding: '12px' }}
          >
            {loading ? (
              'Authenticating...'
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* 1-Click Demo Accounts */}
        <div style={{ marginTop: '22px', paddingTop: '18px', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b', textAlign: 'center', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Quick Demo 1-Click Sign In
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              type="button"
              disabled={loading}
              onClick={async () => {
                setEmail('admin@frauddetection.com');
                setPassword('Admin@12345');
                try {
                  setLoading(true);
                  const user = await login('admin@frauddetection.com', 'Admin@12345');
                  navigate('/admin');
                } catch (err) {
                  setError('Admin login failed');
                } finally {
                  setLoading(false);
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                background: '#f8fafd',
                border: '1px solid #c2e7ff',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '0.82rem',
                color: '#1a73e8',
                fontWeight: 700
              }}
            >
              <span>👑 Sign in as Compliance Admin</span>
              <span style={{ fontSize: '0.72rem', color: '#5f6368', fontWeight: 500 }}>admin@frauddetection.com</span>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={async () => {
                setEmail('customer@example.com');
                setPassword('Customer@12345');
                try {
                  setLoading(true);
                  const user = await login('customer@example.com', 'Customer@12345');
                  navigate('/dashboard');
                } catch (err) {
                  setError('Customer login failed');
                } finally {
                  setLoading(false);
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                background: '#f8fafd',
                border: '1px solid #dadce0',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '0.82rem',
                color: '#202124',
                fontWeight: 700
              }}
            >
              <span>👤 Sign in as Customer</span>
              <span style={{ fontSize: '0.72rem', color: '#5f6368', fontWeight: 500 }}>customer@example.com</span>
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: '#64748b' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
            Register as Customer
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
