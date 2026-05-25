import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import { apiUrl } from '../utils/api';
import { canUseMockAuth, findMockUserByEmail, loginMockUser } from '../utils/mockAuth';

const isMockAuthEnabled = canUseMockAuth();

const LoadingSpinner = () => (
  <span
    className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
    aria-hidden="true"
  />
);

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const { setToken, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (isLoggingIn) {
      return;
    }

    setError('');
    setIsLoggingIn(true);

    try {
      if (isMockAuthEnabled && findMockUserByEmail(email)) {
        const mockLoginResult = loginMockUser({ email, password });

        if (mockLoginResult.ok) {
          setToken(mockLoginResult.token);
          setUser(mockLoginResult.user);
          localStorage.setItem('token', mockLoginResult.token);
          localStorage.setItem('user', JSON.stringify(mockLoginResult.user));
          sessionStorage.removeItem('nopi-profile-awareness-dismissed');
          navigate('/dashboard');
          return;
        }

        setError(mockLoginResult.message);
        return;
      }

      const res = await fetch(apiUrl('/api/auth/signin'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setToken(data.token);
        setUser(data.data);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.data));
        sessionStorage.removeItem('nopi-profile-awareness-dismissed');
        navigate('/dashboard'); 
      } else {
        setError(data.message || 'Login gagal. Periksa kembali email dan kata sandi Anda.');
      }
    } catch {
      setError('Tidak dapat terhubung ke server. Pastikan backend menyala.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch(apiUrl('/api/auth/google'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: tokenResponse.access_token }),
        });
        
        const data = await res.json();
        if (res.ok) {
          setToken(data.token);
          setUser(data.data);
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.data));
          sessionStorage.removeItem('nopi-profile-awareness-dismissed');
          navigate('/dashboard');
        } else {
          setError(data.message);
        }
      } catch {
        setError('Gagal terhubung ke server saat verifikasi Google.');
      }
    },
    onError: () => setError('Masuk Google dibatalkan atau gagal.'),
  });

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-gray-50">
      
      <div className="hidden bg-[#E27C3E] lg:flex lg:w-1/2 lg:flex-col lg:justify-center lg:px-14 xl:px-20">
        <h1 className="text-[3rem] font-bold leading-tight text-white xl:text-[3.6rem]">
          Kelola Keuangan <br />
          bisnis Anda dengan <br />
          cerdas hari ini!
        </h1>
      </div>

      <div className="flex w-full items-center justify-center bg-[#E27C3E] p-4 sm:p-6 lg:w-1/2 lg:bg-transparent lg:p-10">
        <div className="w-full max-w-[25rem] rounded-[8px] bg-white p-5 shadow-2xl sm:p-7 lg:p-8">
          <div className="mb-5 sm:mb-6">
            <h2 className="mb-2 text-[1.7rem] font-bold text-gray-900 sm:text-[2rem]">Selamat Datang</h2>
            <p className="text-[0.94rem] text-gray-500">Silakan masuk ke akun NOPI Anda</p>
          </div>

          {error && (
            <div className="mb-5 rounded border-l-4 border-red-500 bg-red-100 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-2 block text-[0.86rem] font-bold text-gray-900">Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full rounded-[8px] border border-transparent bg-gray-100 px-4 py-3 text-[0.95rem] outline-none transition-all focus:border-[#E27C3E] focus:bg-white focus:ring-2 focus:ring-[#E27C3E]" 
                placeholder="Masukkan email Anda" 
                required 
              />
            </div>

            <div>
              <label className="mb-2 block text-[0.86rem] font-bold text-gray-900">Kata Sandi</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full rounded-[8px] border border-transparent bg-gray-100 px-4 py-3 text-[0.95rem] outline-none transition-all focus:border-[#E27C3E] focus:bg-white focus:ring-2 focus:ring-[#E27C3E]" 
                placeholder="Masukkan kata sandi Anda" 
                required 
              />
            </div>

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-[0.83rem] font-bold text-[#E27C3E] transition-colors hover:text-[#c7652c]"
              >
                Lupa kata sandi?
              </Link>
            </div>

            <button 
              type="submit"
              disabled={isLoggingIn}
              className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#3CC360] px-4 py-3.5 text-[0.98rem] font-bold text-white shadow-sm transition-all duration-200 hover:bg-[#34AD54] active:scale-95 disabled:cursor-not-allowed disabled:opacity-75 disabled:active:scale-100"
            >
              {isLoggingIn ? (
                <>
                  <LoadingSpinner />
                  Memproses...
                </>
              ) : (
                'Masuk'
              )}
            </button>
          </form>

          <div className="mt-5 flex items-center justify-between">
            <span className="border-b w-1/3 lg:w-[38%]"></span>
            <span className="text-xs text-center text-gray-500">Atau</span>
            <span className="border-b w-1/3 lg:w-[38%]"></span>
          </div>

          <button 
            onClick={() => navigate('/register')}
            type="button" 
            className="mt-5 flex w-full items-center justify-center gap-3 rounded-[8px] bg-[#9a9a9a] px-4 py-3.5 text-[0.96rem] font-bold text-white shadow-sm transition-all duration-200 hover:bg-[#888] active:scale-95"
          >
            Daftar akun baru
          </button>

          <button 
            onClick={() => loginWithGoogle()}
            type="button" 
            className="mt-3.5 flex w-full items-center justify-center gap-3 rounded-[8px] border border-gray-300 bg-white px-4 py-3 text-[0.96rem] font-bold text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 active:scale-95"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Masuk dengan Google
          </button>

        </div>
      </div>
    </div>
  );
};

export default Login;
