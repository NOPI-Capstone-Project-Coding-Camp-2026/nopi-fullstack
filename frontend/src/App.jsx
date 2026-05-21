import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';

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

function App() {
  return (
    <AuthProvider>
      <Router>
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
