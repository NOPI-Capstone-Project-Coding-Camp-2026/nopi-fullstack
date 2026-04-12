import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UploadPage from './pages/UploadPage';
import History from './pages/History';
import ProfilePage from './pages/ProfilePage';
import FaqPage from './pages/FaqPage';
import ForgotPassword from './pages/ForgotPassword';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/history" element={<History />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/faq" element={<FaqPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
