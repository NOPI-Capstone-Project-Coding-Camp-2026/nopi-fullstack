// DevSetup.jsx — Halaman khusus testing (hanya aktif di mode DEV)
// Akses via: http://localhost:5173/dev-setup
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const MOCK_USERS_KEY = 'nopi-mock-users';

const DEMO_ACCOUNTS = [
  {
    id: 'mock-demo-001',
    name: 'Demo User NOPI',
    storeName: 'Toko Demo NOPI',
    businessName: 'Toko Demo NOPI',
    email: 'demo@nopi.com',
    password: 'demo1234',
    isEmailVerified: true,
    authProvider: 'mock',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'mock-demo-002',
    name: 'Ainun Dewi',
    storeName: 'Toko Maju Jaya',
    businessName: 'Toko Maju Jaya',
    email: 'ainun@nopi.com',
    password: 'testing123',
    isEmailVerified: true,
    authProvider: 'mock',
    createdAt: new Date().toISOString(),
  },
];

const DevSetup = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle'); // idle | success | cleared

  // Lazy initializer — dijalankan sekali saat komponen pertama dibuat.
  // Tidak memerlukan useEffect karena ini adalah inisialisasi sinkron dari
  // localStorage (bukan subscripsi atau side-effect async).
  const [existingUsers, setExistingUsers] = useState(() => {
    try {
      const raw = localStorage.getItem(MOCK_USERS_KEY);
      const existing = raw ? JSON.parse(raw) : [];
      const arr = Array.isArray(existing) ? existing : [];
      const merged = [...arr];

      DEMO_ACCOUNTS.forEach((demo) => {
        if (!merged.some((u) => u.email === demo.email)) {
          merged.push(demo);
        }
      });

      localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(merged));
      // Tandai sebagai berhasil via state lain — gunakan setTimeout agar tidak
      // blocking render pertama
      setTimeout(() => setStatus('success'), 0);
      return merged;
    } catch {
      try {
        const raw = localStorage.getItem(MOCK_USERS_KEY);
        const users = raw ? JSON.parse(raw) : [];
        return Array.isArray(users) ? users : [];
      } catch {
        return [];
      }
    }
  });

  const loadExistingUsers = useCallback(() => {
    try {
      const raw = localStorage.getItem(MOCK_USERS_KEY);
      const users = raw ? JSON.parse(raw) : [];
      setExistingUsers(Array.isArray(users) ? users : []);
    } catch {
      setExistingUsers([]);
    }
  }, []);

  // Redirect ke home jika diakses di production
  useEffect(() => {
    if (!import.meta.env.DEV) {
      navigate('/');
    }
  }, [navigate]);


  const handleInjectDemoAccounts = () => {
    const existing = existingUsers;
    const merged = [...existing];

    DEMO_ACCOUNTS.forEach((demo) => {
      const alreadyExists = merged.some((u) => u.email === demo.email);
      if (!alreadyExists) {
        merged.push(demo);
      }
    });

    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(merged));
    loadExistingUsers();
    setStatus('success');
  };

  const handleClearAllAccounts = () => {
    localStorage.removeItem(MOCK_USERS_KEY);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    loadExistingUsers();
    setStatus('cleared');
  };

  const handleGoToLogin = () => navigate('/login');

  if (!import.meta.env.DEV) return null;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', sans-serif",
        padding: '24px',
      }}
    >
      <div
        style={{
          background: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '20px',
          padding: '40px',
          width: '100%',
          maxWidth: '560px',
          boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 200, 0, 0.15)',
              border: '1px solid rgba(255, 200, 0, 0.3)',
              borderRadius: '100px',
              padding: '6px 16px',
              marginBottom: '16px',
            }}
          >
            <span style={{ fontSize: '12px', color: '#fcd34d', fontWeight: 600, letterSpacing: '0.5px' }}>
              🛠 DEV MODE ONLY
            </span>
          </div>
          <h1 style={{ color: '#fff', fontSize: '26px', fontWeight: 700, margin: 0 }}>
            NOPI Testing Setup
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginTop: '8px' }}>
            Inject akun demo ke localStorage untuk testing login tanpa backend
          </p>
        </div>

        {/* Status Banner */}
        {status === 'success' && (
          <div
            style={{
              background: 'rgba(60, 195, 96, 0.15)',
              border: '1px solid rgba(60, 195, 96, 0.4)',
              borderRadius: '10px',
              padding: '12px 16px',
              marginBottom: '24px',
              color: '#86efac',
              fontSize: '14px',
              textAlign: 'center',
            }}
          >
            ✅ Akun demo berhasil di-inject! Siap untuk login.
          </div>
        )}
        {status === 'cleared' && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: '10px',
              padding: '12px 16px',
              marginBottom: '24px',
              color: '#fca5a5',
              fontSize: '14px',
              textAlign: 'center',
            }}
          >
            🗑 Semua data mock dihapus dari localStorage.
          </div>
        )}

        {/* Demo Accounts Info */}
        <div style={{ marginBottom: '24px' }}>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', marginBottom: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Akun Demo Tersedia
          </p>
          {DEMO_ACCOUNTS.map((acc) => (
            <div
              key={acc.email}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '12px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ color: '#fff', fontWeight: 600, fontSize: '15px' }}>{acc.name}</span>
                <span
                  style={{
                    background: 'rgba(60, 195, 96, 0.2)',
                    color: '#86efac',
                    fontSize: '11px',
                    padding: '3px 10px',
                    borderRadius: '100px',
                    fontWeight: 600,
                  }}
                >
                  Terverifikasi ✓
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', minWidth: '64px' }}>Email</span>
                  <code style={{ color: '#e2e8f0', fontSize: '13px', background: 'rgba(255,255,255,0.08)', padding: '2px 8px', borderRadius: '4px' }}>
                    {acc.email}
                  </code>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', minWidth: '64px' }}>Password</span>
                  <code style={{ color: '#e2e8f0', fontSize: '13px', background: 'rgba(255,255,255,0.08)', padding: '2px 8px', borderRadius: '4px' }}>
                    {acc.password}
                  </code>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Current localStorage State */}
        {existingUsers.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Akun di localStorage ({existingUsers.length})
            </p>
            {existingUsers.map((u) => (
              <div
                key={u.email}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  background: 'rgba(255,255,255,0.04)',
                  borderRadius: '8px',
                  marginBottom: '6px',
                }}
              >
                <span style={{ color: '#cbd5e1', fontSize: '13px' }}>{u.email}</span>
                <span style={{ color: u.isEmailVerified ? '#86efac' : '#fbbf24', fontSize: '12px' }}>
                  {u.isEmailVerified ? '✓ Verified' : '⏳ Unverified'}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={handleInjectDemoAccounts}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #3CC360, #34AD54)',
              border: 'none',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '15px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'opacity 0.2s',
            }}
            onMouseOver={(e) => (e.target.style.opacity = 0.85)}
            onMouseOut={(e) => (e.target.style.opacity = 1)}
          >
            🚀 Inject Akun Demo ke Browser
          </button>

          <button
            onClick={handleGoToLogin}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #E27C3E, #c7652c)',
              border: 'none',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '15px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'opacity 0.2s',
            }}
            onMouseOver={(e) => (e.target.style.opacity = 0.85)}
            onMouseOut={(e) => (e.target.style.opacity = 1)}
          >
            🔐 Pergi ke Halaman Login
          </button>

          <button
            onClick={handleClearAllAccounts}
            style={{
              width: '100%',
              padding: '14px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              color: '#fca5a5',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'opacity 0.2s',
            }}
            onMouseOver={(e) => (e.target.style.opacity = 0.7)}
            onMouseOut={(e) => (e.target.style.opacity = 1)}
          >
            🗑 Hapus Semua Data Mock
          </button>
        </div>

        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '12px', textAlign: 'center', marginTop: '24px' }}>
          Halaman ini tidak muncul di production build
        </p>
      </div>
    </div>
  );
};

export default DevSetup;
