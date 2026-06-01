import { useMemo, useState } from 'react';
import { googleLogout } from '@react-oauth/google';
import { AuthContext } from './AuthContext';
import { getBusinessProfileCompleteness } from '../utils/businessProfile';

const normalizeUserIdentity = (savedUser) => {
  if (!savedUser) {
    return null;
  }

  const normalizedUser = { ...savedUser };

  if (!normalizedUser.storeName && normalizedUser.businessName) {
    normalizedUser.storeName = normalizedUser.businessName;
  }

  if (!normalizedUser.businessName && normalizedUser.storeName) {
    normalizedUser.businessName = normalizedUser.storeName;
  }

  if (!normalizedUser.storeName && normalizedUser.name) {
    normalizedUser.storeName = normalizedUser.name;
  }

  if (!normalizedUser.businessName && normalizedUser.name) {
    normalizedUser.businessName = normalizedUser.name;
  }

  return normalizedUser;
};

export const AuthProvider = ({ children }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const savedToken = localStorage.getItem('token');

    if (!savedToken) {
      return null;
    }

    const parsedUser = JSON.parse(localStorage.getItem('user') || 'null');
    const normalizedUser = normalizeUserIdentity(parsedUser);

    if (normalizedUser) {
      localStorage.setItem('user', JSON.stringify(normalizedUser));
    }

    return normalizedUser;
  });

  const logout = () => {
    // Set flag PERTAMA sebelum apapun — memicu DashboardLayout return null
    // sehingga tidak ada UI (modal, banner, tombol) yang sempat flash saat logout.
    setIsLoggingOut(true);
    // Revoke Google OAuth session agar akun Google tidak auto-restore setelah logout
    googleLogout();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('nopi-profile-awareness-dismissed');
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  };

  const profileCompleteness = useMemo(() => getBusinessProfileCompleteness(user), [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        setToken,
        setUser,
        logout,
        isLoggingOut,
        isProfileComplete: profileCompleteness.isComplete,
        missingProfileFields: profileCompleteness.missingFields,
        businessProfile: profileCompleteness.profile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
