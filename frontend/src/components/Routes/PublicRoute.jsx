import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = () => {
  const token = localStorage.getItem('token');

  // Jika SUDAH punya token (sudah login), tendang ke dashboard agar tidak usah login lagi
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  // Jika belum login, silakan lewat ke halaman login/register
  return <Outlet />;
};

export default PublicRoute;