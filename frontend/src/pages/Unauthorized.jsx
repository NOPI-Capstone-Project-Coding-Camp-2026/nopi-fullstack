import { Link, useLocation } from 'react-router-dom';
import { LockKeyhole, LogIn, LayoutDashboard, ArrowRight } from 'lucide-react';
import nopiLogoOrange from '../assets/nopi-logo-orange.png';

const Unauthorized = () => {
  const token = localStorage.getItem('token');
  const location = useLocation();
  const attemptedPath = location.state?.attemptedPath;

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      background: '#fff8f2',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative background circles */}
      <div style={{
        position: 'absolute',
        top: '-80px',
        left: '-80px',
        width: '320px',
        height: '320px',
        borderRadius: '50%',
        background: '#fdecd8',
        opacity: 0.5,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-100px',
        right: '-100px',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: '#fdecd8',
        opacity: 0.4,
        pointerEvents: 'none',
      }} />

      {/* Card */}
      <section style={{
        width: '100%',
        maxWidth: '460px',
        borderRadius: '20px',
        background: '#ffffff',
        border: '1px solid rgba(226,124,62,0.18)',
        boxShadow: '0 20px 48px rgba(226,124,62,0.10), 0 4px 16px rgba(0,0,0,0.06)',
        padding: '2.5rem 2rem',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
        animation: 'fadeInUp 0.45s ease-out',
      }}>
        {/* Logo */}
        <div style={{ marginBottom: '1.5rem' }}>
          <img
            src={nopiLogoOrange}
            alt="Logo NOPI"
            style={{ height: '44px', width: 'auto', margin: '0 auto', display: 'block', objectFit: 'contain' }}
          />
        </div>

        {/* Divider */}
        <div style={{
          width: '40px',
          height: '2px',
          background: '#E27C3E',
          margin: '0 auto 1.75rem',
          borderRadius: '2px',
        }} />

        {/* Icon */}
        <div style={{
          width: '68px',
          height: '68px',
          borderRadius: '50%',
          background: '#fff1e4',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem',
          boxShadow: '0 4px 16px rgba(226,124,62,0.15)',
          border: '1.5px solid rgba(226,124,62,0.15)',
        }}>
          <LockKeyhole style={{ width: '30px', height: '30px', color: '#E27C3E' }} aria-hidden="true" />
        </div>

        {/* Error code */}
        <p style={{
          fontSize: '0.71rem',
          fontWeight: 700,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: '#E27C3E',
          marginBottom: '0.4rem',
        }}>
          401 Unauthorized
        </p>

        {/* Title */}
        <h1 style={{
          fontSize: '2.1rem',
          fontWeight: 800,
          color: '#1a1a1a',
          marginBottom: '0.75rem',
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
        }}>
          Akses Ditolak
        </h1>

        {/* Description */}
        <p style={{
          fontSize: '0.93rem',
          color: '#666',
          lineHeight: 1.7,
          maxWidth: '340px',
          margin: '0 auto',
        }}>
          Anda perlu masuk terlebih dahulu untuk membuka halaman internal NOPI.
        </p>

        {/* Attempted path badge */}
        {attemptedPath && (
          <div style={{
            marginTop: '1.25rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: '#fff8f2',
            border: '1px solid rgba(226,124,62,0.2)',
            borderRadius: '8px',
            padding: '0.5rem 1rem',
            fontSize: '0.82rem',
            fontWeight: 600,
            color: '#9c5a25',
            fontFamily: 'monospace',
          }}>
            <span style={{ opacity: 0.6 }}>Route:</span>
            <span>{attemptedPath}</span>
          </div>
        )}

        {/* Action buttons */}
        <div style={{
          marginTop: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}>
          {token ? (
            <Link
              to="/dashboard"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                borderRadius: '10px',
                background: '#E27C3E',
                padding: '0.875rem 1.5rem',
                fontSize: '0.9rem',
                fontWeight: 700,
                color: 'white',
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(226,124,62,0.3)',
                transition: 'background 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#cc6e33';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 18px rgba(226,124,62,0.38)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#E27C3E';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(226,124,62,0.3)';
              }}
            >
              <LayoutDashboard style={{ width: '16px', height: '16px' }} aria-hidden="true" />
              Ke Dashboard
              <ArrowRight style={{ width: '14px', height: '14px', opacity: 0.85 }} />
            </Link>
          ) : (
            <Link
              to="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                borderRadius: '10px',
                background: '#E27C3E',
                padding: '0.875rem 1.5rem',
                fontSize: '0.9rem',
                fontWeight: 700,
                color: 'white',
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(226,124,62,0.3)',
                transition: 'background 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#cc6e33';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 18px rgba(226,124,62,0.38)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#E27C3E';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(226,124,62,0.3)';
              }}
            >
              <LogIn style={{ width: '16px', height: '16px' }} aria-hidden="true" />
              Masuk ke NOPI
              <ArrowRight style={{ width: '14px', height: '14px', opacity: 0.85 }} />
            </Link>
          )}

          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '10px',
              border: '1.5px solid rgba(226,124,62,0.3)',
              background: '#ffffff',
              padding: '0.875rem 1.5rem',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: '#7a5a39',
              textDecoration: 'none',
              transition: 'background 0.15s ease, border-color 0.15s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#fff8f2';
              e.currentTarget.style.borderColor = 'rgba(226,124,62,0.5)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.borderColor = 'rgba(226,124,62,0.3)';
            }}
          >
            Ke Beranda
          </Link>
        </div>
      </section>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
};

export default Unauthorized;
