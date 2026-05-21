import { Link, useLocation } from 'react-router-dom';
import { LockKeyhole, LogIn, LayoutDashboard } from 'lucide-react';
import NopiLogo from '../components/ui/NopiLogo';

const Unauthorized = () => {
  const token = localStorage.getItem('token');
  const location = useLocation();
  const attemptedPath = location.state?.attemptedPath;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fffaf4] px-4 py-10 sm:px-6">
      <section className="w-full max-w-lg rounded-[8px] border border-[#f2e4d7] bg-white p-6 text-center shadow-[0_20px_45px_rgba(15,23,42,0.08)] sm:p-8">
        <NopiLogo className="mx-auto max-w-[170px]" compact />

        <div className="mx-auto mt-8 flex h-16 w-16 items-center justify-center rounded-full bg-[#fff1e4] text-[#e27c3e]">
          <LockKeyhole className="h-8 w-8" aria-hidden="true" />
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-[#b68352]">401 Unauthorized</p>
        <h1 className="mt-3 text-3xl font-bold text-[#222] sm:text-[2.4rem]">Akses Ditolak</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#666] sm:text-base">
          Anda perlu masuk terlebih dahulu untuk membuka halaman internal NOPI.
        </p>

        {attemptedPath ? (
          <p className="mt-4 rounded-[8px] bg-[#fff8f2] px-4 py-3 text-sm font-medium text-[#7a5a39]">
            Route tujuan: {attemptedPath}
          </p>
        ) : null}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {token ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#3CC360] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#34AD54]"
            >
              <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
              Ke Dashboard
            </Link>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#3CC360] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#34AD54]"
            >
              <LogIn className="h-4 w-4" aria-hidden="true" />
              Masuk
            </Link>
          )}

          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-[8px] border border-[#d8d8d8] bg-white px-5 py-3 text-sm font-bold text-[#666] transition hover:bg-[#fafafa]"
          >
            Ke Beranda
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Unauthorized;
