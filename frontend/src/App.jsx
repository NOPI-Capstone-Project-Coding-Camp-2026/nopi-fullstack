import { useCallback, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { AuthContext } from './context/AuthContext.js';
import { jwtDecode } from "jwt-decode"; 
import Swal from 'sweetalert2'; // 🚨 Import SweetAlert di sini
import './App.css'; // 🎨 Import custom SweetAlert2 branding NOPI

import ProtectedRoute from './components/Routes/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UploadPage from './pages/UploadPage';
import History from './pages/History';
import DetailNotaPage from './pages/DetailNotaPage';
import ProfilePage from './pages/ProfilePage';
import FaqPage from './pages/FaqPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';
import DevSetup from './pages/DevSetup';

// =========================================================
// Komponen Pelacak Sesi (Berjalan di latar belakang)
// =========================================================
//
// Root Cause Bug sebelumnya:
//   handleLogout di sini menghapus 'token' dari localStorage
//   tapi TIDAK menghapus 'user' dan TIDAK mengosongkan React state
//   di AuthContext (setToken/setUser). Akibatnya, setelah redirect
//   ke /login, context masih menyimpan data profil user lama
//   (dirty state) sampai halaman di-refresh penuh.
//
// Fix:
//   Hubungkan ke logout() dari AuthContext — fungsi ini sudah
//   membersihkan localStorage + state secara sinkron sekaligus.
//
function SessionTracker() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  // Deklarasikan sebelum useEffect agar bisa dipakai sebagai dependensi.
  // useCallback memastikan referensi stabil (tidak re-create tiap render).
  const handleExpiredSession = useCallback(() => {
    // Satu panggilan ini membersihkan localStorage + React state secara sinkron
    logout();

    Swal.fire({
      html: `
        <div style="text-align:center; padding: 4px 0 8px;">
          <img src="/nopi-logo-orange.png" alt="NOPI" style="height:36px; width:auto; object-fit:contain; margin-bottom:16px; display:block; margin-left:auto; margin-right:auto;" onerror="this.style.display='none'" />
          <div style="font-size:1.25rem; font-weight:800; color:#1a1a1a; letter-spacing:-0.02em; margin-bottom:8px;">Sesi Anda Telah Berakhir</div>
          <p style="font-size:0.9rem; color:#888; line-height:1.6;">Waktu login Anda sudah habis.<br/>Silakan masuk kembali untuk melanjutkan.</p>
        </div>
      `,
      confirmButtonText: 'Masuk Kembali',
      confirmButtonColor: '#E27C3E',
      allowOutsideClick: false,
      showClass: { popup: '' },
      customClass: { confirmButton: 'swal2-confirm' },
    }).then(() => {
      navigate('/login');
    });
  }, [logout, navigate]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      // Lewati validasi JWT untuk mock token (mode testing)
      if (token.startsWith('mock-token-')) {
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        // Cek apakah token sudah expired saat aplikasi dimuat
        if (decodedToken.exp < currentTime) {
          handleExpiredSession();
        } else {
          // Pasang timer sisa waktu token
          const timeLeft = (decodedToken.exp - currentTime) * 1000;

          const timer = setTimeout(() => {
            handleExpiredSession();
          }, timeLeft);

          // Bersihkan timer jika komponen dilepas
          return () => clearTimeout(timer);
        }
      } catch {
        // Jika token tidak valid/rusak, bersihkan sesi
        handleExpiredSession();
      }
    }
  }, [handleExpiredSession]);

  return null;
}



// =========================================================
// Komponen Utama App
// =========================================================
function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Jalankan pelacak sesi di dalam Router agar bisa memakai useNavigate */}
        <SessionTracker /> 

        <Routes>
          {/* =========================================
              ZONA BEBAS (Bisa diakses siapa saja, login atau belum)
              ========================================= */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* =========================================
              ZONA RAHASIA / TERPROTEKSI (Wajib punya Token/Login)
              Jika belum login, otomatis dilempar ke Unauthorized
              ========================================= */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/history" element={<History />} />
            <Route path="/history/detail/:notaId" element={<DetailNotaPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* =========================================
              ZONA DEV (Hanya aktif di mode development)
              ========================================= */}
          {import.meta.env.DEV && (
            <Route path="/dev-setup" element={<DevSetup />} />
          )}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;