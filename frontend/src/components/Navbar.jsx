import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getSocket } from '../services/socket';
import { LogOut, ShieldCheck, QrCode, ShieldAlert, Smartphone } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = ({ title = 'Dashboard' }) => {
  const { user, login, logout, isAdmin } = useAuth();
  const [socketConnected, setSocketConnected] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const socket = getSocket();

    const handleConnect = () => setSocketConnected(true);
    const handleDisconnect = () => setSocketConnected(false);

    if (socket.connected) {
      setSocketConnected(true);
    }

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-title-wrap">
        <h1 className="navbar-page-title">{title}</h1>
      </div>

      <div className="navbar-actions">
        {/* Quick QR button for Customer */}
        {!isAdmin && (
          <Link
            to="/scan-qr"
            className="btn btn-outline btn-sm"
            style={{ padding: '6px 12px', fontSize: '0.78rem' }}
            title="Scan or Pay UPI"
          >
            <QrCode size={15} color="#1a73e8" />
            <span>Scan any QR</span>
          </Link>
        )}

        {/* Real-time Socket.IO Security Indicator */}
        <div className="socket-status-pill" title={socketConnected ? 'Connected to Real-time Fraud Engine' : 'Connecting to Socket.IO...'}>
          <span className={`socket-status-dot ${socketConnected ? 'connected' : ''}`} />
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={14} color={socketConnected ? '#1e8e3e' : '#5f6368'} />
            <span>{socketConnected ? 'FraudShield Live' : 'Connecting...'}</span>
          </span>
        </div>

        {/* Role Switcher Button */}
        {!isAdmin ? (
          <button
            onClick={async () => {
              try {
                await login('admin@frauddetection.com', 'Admin@12345');
                navigate('/admin');
              } catch (e) {
                navigate('/login');
              }
            }}
            className="btn btn-primary btn-sm"
            style={{
              padding: '6px 14px',
              fontSize: '0.78rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#1a73e8',
              borderRadius: '9999px',
              cursor: 'pointer'
            }}
            title="Open Compliance Admin Portal"
          >
            <ShieldAlert size={14} />
            <span>Admin Portal</span>
          </button>
        ) : (
          <button
            onClick={async () => {
              try {
                await login('customer@example.com', 'Customer@12345');
                navigate('/dashboard');
              } catch (e) {
                navigate('/dashboard');
              }
            }}
            className="btn btn-outline btn-sm"
            style={{
              padding: '6px 14px',
              fontSize: '0.78rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              borderRadius: '9999px',
              borderColor: '#1a73e8',
              color: '#1a73e8',
              cursor: 'pointer'
            }}
            title="Switch to Customer GPay Interface"
          >
            <Smartphone size={14} />
            <span>Customer GPay</span>
          </button>
        )}

        {/* User Role Tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#3c4043' }}>
          <span style={{ fontWeight: 700 }}>{user?.name}</span>
          <span style={{ fontSize: '0.7rem', background: '#e8f0fe', color: '#174ea6', padding: '2px 8px', borderRadius: '9999px', textTransform: 'uppercase', fontWeight: 800 }}>
            {user?.role === 'admin' ? 'Compliance Admin' : 'UPI Verified'}
          </span>
        </div>

        {/* Logout Button */}
        <button className="btn-logout" onClick={handleLogout} title="Sign Out">
          <LogOut size={16} />
          <span>Exit</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
