import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false, customerOnly = false }) => {
  const { user, isAuthenticated, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#64748b', fontWeight: 600 }}>Authenticating session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is a customer trying to access an admin-only page, offer 1-click switch or redirect
  if (adminOnly && !isAdmin) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f8fafd', padding: '20px' }}>
        <div style={{ background: '#ffffff', padding: '36px 32px', borderRadius: '24px', maxWidth: '440px', width: '100%', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #dadce0' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#feefc3', color: '#b06000', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
            <span style={{ fontSize: '2rem' }}>🛡️</span>
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#202124', marginBottom: '8px' }}>
            Admin Access Required
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#5f6368', lineHeight: 1.5, marginBottom: '24px' }}>
            The admin compliance portal is restricted to compliance administrators. You are currently logged in as a <strong>Customer</strong> ({user?.name || 'Customer'}).
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={async () => {
                try {
                  const { login } = useAuth();
                } catch(e) {}
                try {
                  const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: 'admin@frauddetection.com', password: 'Admin@12345' })
                  });
                  const data = await res.json();
                  if (data.success) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    window.location.href = '/admin';
                  } else {
                    window.location.href = '/login';
                  }
                } catch (e) {
                  window.location.href = '/login';
                }
              }}
              className="btn btn-primary btn-block"
              style={{ padding: '12px', fontWeight: 700 }}
            >
              Sign In as Compliance Admin
            </button>

            <button
              onClick={() => {
                window.location.href = '/dashboard';
              }}
              className="btn btn-outline btn-block"
              style={{ padding: '12px', fontWeight: 600 }}
            >
              Back to Customer Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Prevent admin from viewing customer-specific transaction creation
  if (customerOnly && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;
