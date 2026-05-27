import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { jwtDecode } from "jwt-decode"; 
import Swal from 'sweetalert2'; // 🚨 Import SweetAlert di sini

// 🚨 Import Komponen Penjaga Keamanan (Satpam)
import ProtectedRoute from './components/Routes/ProtectedRoute';
import PublicRoute from './components/Routes/PublicRoute';

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

// =========================================================
// Komponen Pelacak Sesi (Berjalan di latar belakang)
// =========================================================
function SessionTracker() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Ubah ke detik

        // Cek apakah token sudah expired saat aplikasi dimuat
        if (decodedToken.exp < currentTime) {
          handleLogout();
        } else {
          // Pasang timer (timeout) sisa waktu token
          const timeLeft = (decodedToken.exp - currentTime) * 1000; // Ubah kembali ke milidetik
          
          const timer = setTimeout(() => {
            handleLogout();
          }, timeLeft);

          // Bersihkan timer jika komponen dilepas
          return () => clearTimeout(timer);
        }
      } catch (error) {
        // Jika token tidak valid/rusak
        handleLogout();
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    
    // Ganti alert bawaan dengan SweetAlert
    Swal.fire({
      icon: 'warning',
      title: 'Sesi Berakhir',
      text: 'Waktu login Anda sudah habis. Silakan login kembali untuk melanjutkan.',
      confirmButtonText: 'Oke, Login Ulang',
      confirmButtonColor: '#3085d6', 
      allowOutsideClick: false, // Memaksa user klik tombol
    }).then(() => {
      navigate('/login');
    });
  };

  return null; // Tidak merender UI apa pun
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

          {/* =========================================
              ZONA PUBLIK (Hanya untuk yang BELUM login)
              Jika sudah login, otomatis dilempar ke Dashboard
              ========================================= */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Route>

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

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;