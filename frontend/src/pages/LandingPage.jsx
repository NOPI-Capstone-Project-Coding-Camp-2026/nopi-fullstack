import React from 'react';
import { Link } from 'react-router-dom';
import NopiLogo from '../components/ui/NopiLogo';
import receiptHero from '../assets/receipt-hero.png';

const LandingPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center overflow-x-hidden bg-[#f7f9fc] px-4 sm:px-6 lg:px-8">
      
      {/* Wrapper Utama */}
      <div className="flex w-full max-w-7xl flex-col items-center justify-between gap-8 py-10 sm:gap-10 sm:py-12 lg:flex-row lg:gap-12 lg:py-24">
        
        {/* BAGIAN KIRI: Teks & Tombol */}
        <div className="flex w-full max-w-2xl flex-1 flex-col gap-5 text-center sm:gap-8 lg:text-left">
          
          <header className="flex flex-col items-center lg:items-start gap-1">
            <NopiLogo className="mx-auto lg:mx-0" />
          </header>

          {/* Headline & Deskripsi Utama */}
          <main className="flex flex-col gap-6">
            <h1 className="text-[1.95rem] font-extrabold leading-[1.15] text-[#ff8c00] sm:text-[2.9rem] lg:text-6xl">
              Nota Pintar,<br />
              Bisnis Makin Lancar.
            </h1>
            
            <p className="mx-auto max-w-lg text-[0.98rem] leading-relaxed text-gray-600 sm:text-[1.05rem] lg:mx-0 lg:text-xl">
              Otomasi pembukuan dengan
              <br className="hidden sm:block" />
              eksekusi data berbasis AI, Pantau
              <br className="hidden sm:block" />
              laba secara real-time.
            </p>

            <div className="mt-2 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
              
              <Link 
                to="/login" 
                className="block w-full rounded-[8px] bg-[#34c759] px-8 py-3.5 text-center text-[0.96rem] font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#2bb34d] hover:shadow-md active:scale-95 sm:w-auto"
              >
                Masuk
              </Link>

              <Link 
                to="/register" 
                className="block w-full rounded-[8px] bg-[#ff9f43] px-8 py-3.5 text-center text-[0.96rem] font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#f39031] hover:shadow-md active:scale-95 sm:w-auto"
              >
                Daftarkan Toko
              </Link>

            </div>
          </main>

        </div>

        {/* BAGIAN KANAN: Visual Ilustrasi */}
        <div className="hidden w-full flex-1 items-center justify-center lg:flex lg:pl-12">
          <div className="relative flex w-full max-w-[520px] items-center justify-center">
            <div className="absolute inset-0 rounded-[8px] bg-[radial-gradient(circle_at_center,rgba(240,138,42,0.12),transparent_70%)] blur-2xl" />
            <img
              src={receiptHero}
              alt="Ilustrasi nota NOPI"
              className="relative w-full max-w-[180px] object-contain drop-shadow-[0_28px_36px_rgba(240,138,42,0.18)] sm:max-w-[300px] lg:max-w-[430px]"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default LandingPage;
