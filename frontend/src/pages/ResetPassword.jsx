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
    <div className="flex min-h-screen items-center justify-center bg-[#ee872d] px-6 py-10">
      <div className="w-full max-w-xl rounded-[8px] bg-[#fffaf5] px-10 py-12 shadow-[0_26px_46px_rgba(128,72,20,0.18)]">
        <h1 className="text-[2.8rem] font-semibold tracking-[-0.05em] text-[#2b2b2b]">
          Buat Kata Sandi Baru
        </h1>
        <p className="mt-4 max-w-lg text-[1.05rem] leading-9 text-[#8d8d8d]">
          Pastikan kata sandi baru Anda kuat dan mudah diingat. Minimal 8 karakter.
        </p>

        <form onSubmit={handleResetPassword} className="mt-10">
          <label className="mb-3 block text-lg font-semibold text-[#2b2b2b]">Kata Sandi Baru</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Masukkan kata sandi baru"
            className="w-full rounded-[8px] bg-[#ededed] px-6 py-6 text-lg text-[#2b2b2b] outline-none focus:ring-2 focus:ring-[#ee872d] placeholder:text-[#9b9b9b] transition-all"
            required
            minLength={8}
          />

          <button
            type="submit"
            className="mt-10 w-full rounded-[8px] bg-[#3CC360] px-6 py-6 text-[1.15rem] font-semibold text-white transition hover:bg-[#34AD54]"
          >
            Simpan Kata Sandi →
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
