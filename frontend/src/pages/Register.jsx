import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { AuthContext } from '../context/AuthContext';
import { apiUrl } from '../utils/api';
import Swal from 'sweetalert2'; // <-- IMPORT SWEETALERT DI SINI

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Tetap kita pakai untuk error form ringan
  
  const navigate = useNavigate();
  const { setToken, setUser } = useContext(AuthContext);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(''); 
    
    // Validasi Password
    if (password.length < 8) {
      setError('Password harus memiliki minimal 8 karakter.');
      return; 
    }

    // Tampilkan animasi loading saat sedang mengirim data
    Swal.fire({
      title: 'Memproses...',
      text: 'Mohon tunggu sebentar',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const res = await fetch(apiUrl('/api/auth/signup'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        // Pop-up Sukses yang Cantik
        Swal.fire({
          icon: 'success',
          title: 'Pendaftaran Berhasil!',
          text: 'Silakan cek kotak masuk email Anda untuk melakukan verifikasi akun.',
          confirmButtonText: 'Menuju Login',
          confirmButtonColor: '#3CC360', // Warna hijau NOPI
          iconColor: '#3CC360',
          backdrop: `rgba(0,0,0,0.4)`
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/login'); 
          }
        });
      } else {
        // Pop-up Gagal dari Server
        Swal.fire({
          icon: 'error',
          title: 'Pendaftaran Gagal',
          text: data.message || 'Pastikan email belum terdaftar.',
          confirmButtonText: 'Coba Lagi',
          confirmButtonColor: '#E27C3E', // Warna oranye NOPI
        });
      }
    } catch {
      // Pop-up Gagal Koneksi
      Swal.fire({
        icon: 'error',
        title: 'Koneksi Terputus',
        text: 'Tidak dapat terhubung ke server. Pastikan backend sudah menyala.',
        confirmButtonText: 'Oke',
        confirmButtonColor: '#E27C3E',
      });
    }
  };

  const registerWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      Swal.fire({
        title: 'Verifikasi Google...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

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
          
          Swal.fire({
            icon: 'success',
            title: 'Login Google Berhasil!',
            showConfirmButton: false,
            timer: 1500,
            iconColor: '#3CC360'
          }).then(() => {
            navigate('/dashboard');
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Akses Ditolak',
            text: data.message,
            confirmButtonColor: '#E27C3E'
          });
        }
      } catch {
        Swal.fire({
          icon: 'error',
          title: 'Koneksi Terputus',
          text: 'Gagal terhubung ke server saat verifikasi Google.',
          confirmButtonColor: '#E27C3E'
        });
      }
    },
    onError: () => {
      Swal.fire({
        icon: 'warning',
        title: 'Dibatalkan',
        text: 'Pendaftaran via Google dibatalkan atau gagal.',
        confirmButtonColor: '#E27C3E'
      });
    },
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
            <h2 className="mb-2 text-[1.7rem] font-bold text-gray-900 sm:text-[2rem]">Buat Akun Baru</h2>
            <p className="text-[0.94rem] text-gray-500">Mulai perjalanan bisnis Anda dengan NOPI hari ini.</p>
          </div>

          {/* Error inline ringan tetap dipertahankan untuk validasi form */}
          {error && (
            <div className="mb-5 rounded border-l-4 border-red-500 bg-red-100 p-3 text-sm text-red-700 transition-all">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="mb-2 block text-[0.86rem] font-bold text-gray-900">Nama</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="w-full rounded-[8px] border border-transparent bg-gray-100 px-4 py-3 text-[0.95rem] outline-none transition-all focus:border-[#E27C3E] focus:bg-white focus:ring-2 focus:ring-[#E27C3E]" 
                placeholder="Masukan Nama Anda" 
                required 
              />
            </div>

            <div>
              <label className="mb-2 block text-[0.86rem] font-bold text-gray-900">Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full rounded-[8px] border border-transparent bg-gray-100 px-4 py-3 text-[0.95rem] outline-none transition-all focus:border-[#E27C3E] focus:bg-white focus:ring-2 focus:ring-[#E27C3E]" 
                placeholder="Masukan Email Anda" 
                required 
              />
            </div>

            <div>
              <label className="mb-2 block text-[0.86rem] font-bold text-gray-900">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full rounded-[8px] border border-transparent bg-gray-100 px-4 py-3 text-[0.95rem] outline-none transition-all focus:border-[#E27C3E] focus:bg-white focus:ring-2 focus:ring-[#E27C3E]" 
                placeholder="Minimal 8 karakter" 
                required 
                minLength={8} 
              />
            </div>

            <button 
              type="submit" 
              className="mt-1.5 w-full rounded-[8px] bg-[#3CC360] px-4 py-3.5 text-[0.98rem] font-bold text-white shadow-sm transition-all duration-200 hover:bg-[#34AD54] active:scale-95"
            >
              Daftar akun
            </button>
          </form>

          <div className="mt-5 flex items-center justify-between">
            <span className="border-b w-[38%]"></span>
            <span className="text-xs text-center text-gray-500">Atau</span>
            <span className="border-b w-[38%]"></span>
          </div>

          <button 
            onClick={() => registerWithGoogle()}
            type="button" 
            className="mt-5 flex w-full items-center justify-center gap-3 rounded-[8px] bg-[#F1F3F5] px-4 py-3.5 text-[0.96rem] font-medium text-gray-700 transition-all duration-200 hover:bg-[#E5E7EB] active:scale-95"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google
          </button>

          <div className="mt-6 text-center text-[0.94rem]">
            <span className="text-gray-600">Sudah punya akun? </span>
            <Link to="/login" className="text-[#E27C3E] font-bold hover:underline">
              Masuk di sini
            </Link>
          </div>

        </div>
      </div>
      
    </div>
  );
};

export default Register;
