// frontend/src/utils/axiosInstance.js
import axios from 'axios';
import Swal from 'sweetalert2'; // 🚨 Import SweetAlert di sini

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', // Ganti dengan URL backend kamu
});

// Sisipkan token ke setiap request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Tangkap response dari backend
axiosInstance.interceptors.response.use(
  (response) => response, // Jika sukses, biarkan lewat
  (error) => {
    // Jika backend mengirim status 401 (Unauthorized / Token Expired)
    if (error.response && error.response.status === 401) {
      // 1. Hapus token dan data user dari local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // 2. Tampilkan SweetAlert
      Swal.fire({
        icon: 'error',
        title: 'Akses Ditolak',
        text: 'Sesi Anda telah berakhir. Silakan login kembali.',
        confirmButtonText: 'Login Kembali',
        confirmButtonColor: '#d33',
        allowOutsideClick: false
      }).then(() => {
        // 3. Arahkan paksa ke halaman login setelah user klik tombol
        window.location.href = '/login';
      });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;