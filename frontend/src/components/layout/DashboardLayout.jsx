import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import NopiLogo from '../ui/NopiLogo';
import { BarsIcon, CloseIcon, GridIcon, InfoIcon, ReceiptIcon, UserIcon } from '../ui/AppIcons';

const mobileMenuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: GridIcon },
  { name: 'Upload', path: '/upload', icon: ReceiptIcon },
  { name: 'History', path: '/history', icon: BarsIcon },
  { name: 'Profile', path: '/profile', icon: UserIcon },
  { name: 'FAQ', path: '/faq', icon: InfoIcon },
];

const DashboardLayout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    closeMobileMenu();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#fffaf4] lg:bg-[linear-gradient(90deg,#fffaf4_0,#fffaf4_18rem,#ffffff_18rem,#ffffff_100%)]">
      <div
        className={`fixed inset-0 z-40 bg-[#1f1f1f]/40 transition-opacity duration-200 lg:hidden ${
          isMobileMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={closeMobileMenu}
        aria-hidden="true"
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[86vw] max-w-[320px] flex-col border-r border-[#efe3d8] bg-white px-5 py-6 shadow-[0_20px_45px_rgba(15,23,42,0.14)] transition-transform duration-200 lg:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <NopiLogo className="max-w-[155px]" compact />
            <p className="mt-2 text-xs text-gray-500">Nota Pintar untuk UMKM</p>
          </div>

          <button
            type="button"
            onClick={closeMobileMenu}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#f0e5d8] bg-[#fff8f0] text-[#e27c3e]"
            aria-label="Tutup menu navigasi"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-8 flex-1 space-y-2">
          {mobileMenuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition',
                    isActive
                      ? 'bg-[#fff1e4] text-[#e27c3e]'
                      : 'text-[#5f5f5f] hover:bg-[#faf6f1] hover:text-[#1f1f1f]',
                  ].join(' ')
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-6 rounded-2xl bg-[#3CC360] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#34AD54]"
        >
          Logout
        </button>
      </aside>

      <div className="flex">
        <Sidebar />

        <div className="flex-1 min-h-screen lg:ml-[280px]">
          <Topbar onMenuOpen={() => setIsMobileMenuOpen(true)} />
          <main className="px-4 pt-5 pb-10 sm:px-6 sm:pt-6 lg:px-14 lg:pt-10 lg:pb-12">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
