import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar'; // Jika kamu sudah buat Navbar

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
        <div className="min-h-screen bg-gray-50">
          <Navbar /> {/* Navbar akan muncul di semua halaman */}
          
          <Routes>
            {/* Alur Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Halaman Utama (Diproteksi) */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <div className="p-8 text-center">
                    <h1 className="text-3xl font-bold">Selamat Datang di NOPI</h1>
                    <p className="text-gray-600 mt-2">Nota Pintar untuk kelola keuanganmu.</p>
                  </div>
                </ProtectedRoute>
              } 
            />

            {/* Jika user nyasar ke URL salah, arahkan ke login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;