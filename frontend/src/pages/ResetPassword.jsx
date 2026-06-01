import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiUrl } from '../utils/api';
import Swal from 'sweetalert2';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const { token } = useParams(); // <-- Menangkap token acak dari URL
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Kata sandi baru harus memiliki minimal 8 karakter.',
        confirmButtonColor: '#E27C3E'
      });
      return;
    }

    Swal.fire({
      title: 'Memperbarui Kata Sandi...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      // Menembak rute backend dengan membawa token di URL dan password baru di body
      const res = await fetch(apiUrl(`/api/auth/reset-password/${token}`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      });
      
      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Kata sandi Anda telah berhasil diubah. Silakan masuk kembali.',
          confirmButtonColor: '#3CC360',
        }).then((result) => {
          if (result.isConfirmed || result.isDismissed) {
            navigate('/login'); 
          }
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: data.message || 'Tautan tidak valid atau sudah kadaluarsa.',
          confirmButtonColor: '#E27C3E'
        });
      }
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Koneksi Terputus',
        text: 'Tidak dapat terhubung ke server. Pastikan backend menyala.',
        confirmButtonColor: '#E27C3E'
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#ff8c00] px-4 py-10 sm:px-6">
      <div className="w-full max-w-[25rem] rounded-[8px] bg-white p-5 shadow-2xl sm:p-7 lg:p-8">
        <h1 className="text-[1.7rem] font-bold text-gray-900 sm:text-[2rem] tracking-tight leading-tight">
          Buat Kata Sandi Baru
        </h1>
        <p className="mt-2 text-[0.94rem] leading-relaxed text-gray-500">
          Pastikan kata sandi baru Anda kuat dan mudah diingat. Minimal 8 karakter.
        </p>

        <form onSubmit={handleResetPassword} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-[0.86rem] font-bold text-gray-900">Kata Sandi Baru</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Masukkan kata sandi baru"
              className="w-full rounded-[8px] border border-transparent bg-gray-100 px-4 py-3 text-[0.95rem] outline-none transition-all focus:border-[#E27C3E] focus:bg-white focus:ring-2 focus:ring-[#E27C3E] placeholder:text-gray-400"
              required
              minLength={8}
            />
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#3CC360] px-4 py-3.5 text-[0.98rem] font-bold text-white shadow-sm transition-all duration-200 hover:bg-[#34AD54] active:scale-95"
          >
            Simpan Kata Sandi →
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
