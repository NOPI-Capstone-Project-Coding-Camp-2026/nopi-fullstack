import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center px-8">
      <Link to="/" className="text-2xl font-bold text-blue-600">NOPI</Link>
      
      <div className="flex items-center gap-6">
        {user ? (
          <>
            <span className="text-gray-700 font-medium">Halo, {user.name}</span>
            <button 
              onClick={logout} 
              className="bg-red-500 text-white px-4 py-2 rounded-[8px] hover:bg-red-600 transition-all shadow-sm"
            >
              Logout
            </button>
          </>
        ) : (
          <div className="space-x-4">
            <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-800">Login</Link>
            <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-[8px] hover:bg-blue-700">Daftar</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
