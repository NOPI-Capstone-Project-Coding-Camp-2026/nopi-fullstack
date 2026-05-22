import { Link } from 'react-router-dom';
import { Compass, Home, LayoutDashboard } from 'lucide-react';
import NopiLogo from '../components/ui/NopiLogo';

const NotFound = () => {
  const token = localStorage.getItem('token');

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f9fc] px-4 py-10 sm:px-6">
      <section className="w-full max-w-lg rounded-[8px] border border-gray-200 bg-white p-6 text-center shadow-[0_20px_45px_rgba(15,23,42,0.08)] sm:p-8">
        <NopiLogo className="mx-auto max-w-[170px]" compact />

        <div className="mx-auto mt-8 flex h-16 w-16 items-center justify-center rounded-full bg-[#eef7ff] text-[#2563eb]">
          <Compass className="h-8 w-8" aria-hidden="true" />
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-[#6b7280]">404 Not Found</p>
        <h1 className="mt-3 text-3xl font-bold text-[#222] sm:text-[2.4rem]">Halaman Tidak Ditemukan</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#666] sm:text-base">
          Route yang Anda buka tidak tersedia atau sudah dipindahkan.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to={token ? '/dashboard' : '/'}
            className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#3CC360] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#34AD54]"
          >
            {token ? (
              <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Home className="h-4 w-4" aria-hidden="true" />
            )}
            {token ? 'Ke Dashboard' : 'Ke Beranda'}
          </Link>

          {!token ? (
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-[8px] border border-[#d8d8d8] bg-white px-5 py-3 text-sm font-bold text-[#666] transition hover:bg-[#fafafa]"
            >
              Masuk
            </Link>
          ) : null}
        </div>
      </section>
    </main>
  );
};

export default NotFound;
