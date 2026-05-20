import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');

  // Jika tidak punya token, tendang ke halaman login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Jika punya token, silakan lewat
  return <Outlet />;
};

export default ProtectedRoute;