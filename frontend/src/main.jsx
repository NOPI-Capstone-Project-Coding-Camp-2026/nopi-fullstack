import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';

// Ambil Client ID dari .env (Pastikan namanya diawali VITE_)
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "isi-dengan-string-sembarang-dulu-jika-belum-ada";

// Cek di console apakah Client ID terbaca
console.log("Client ID Google:", GOOGLE_CLIENT_ID);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Bungkus komponen App dengan Provider dari Google */}
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
)