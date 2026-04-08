import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage'; // <--- Import Landing Page

// Komponen Pembatas (Hanya bisa akses jika sudah login)
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Wrapper utama aplikasi */}
        <div className="min-h-screen bg-gray-50 flex flex-col">
          
          {/* Catatan Senior: Jika Navbar global ini dirasa "bertabrakan" 
            dengan desain Landing Page, kamu bisa memindahkannya ke 
            dalam masing-masing komponen (Dashboard/Login/Register) nantinya. 
            Untuk sekarang kita biarkan di sini agar rapi.
          */}
          
          {/* Area Konten Utama */}
          <div className="flex-grow">
            <Routes>
              
              {/* --- HALAMAN PUBLIK --- */}
              {/* Landing Page sekarang jadi halaman paling depan */}
              <Route path="/" element={<LandingPage />} />
              
              {/* Alur Auth */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* --- HALAMAN MEMBER (DIPROTEKSI) --- */}
              {/* Dashboard kita pindah ke /dashboard */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <div className="p-8 text-center">
                      <h1 className="text-3xl font-bold">Dashboard NOPI</h1>
                      <p className="text-gray-600 mt-2">Selamat datang kembali! Nota Pintar siap kelola keuanganmu.</p>
                      {/* Nanti fitur Upload Nota ditaruh di sini */}
                    </div>
                  </ProtectedRoute>
                } 
              />

              {/* Jika user nyasar ke URL salah, arahkan ke halaman utama (Landing Page) */}
              <Route path="*" element={<Navigate to="/" replace />} />
              
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;