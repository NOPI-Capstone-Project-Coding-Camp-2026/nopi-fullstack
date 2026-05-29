import { useContext, useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import NopiLogo from '../ui/NopiLogo';
import { BarsIcon, CloseIcon, GridIcon, InfoIcon, ReceiptIcon, UserIcon } from '../ui/AppIcons';
import { AuthContext } from '../../context/AuthContext';

const unlockedPaths = ['/dashboard', '/profile'];
const awarenessStorageKey = 'nopi-profile-awareness-dismissed';

const mobileMenuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: GridIcon },
  { name: 'Upload', path: '/upload', icon: ReceiptIcon },
  { name: 'Riwayat', path: '/history', icon: BarsIcon },
  { name: 'Profil', path: '/profile', icon: UserIcon },
  { name: 'FAQ', path: '/faq', icon: InfoIcon },
];

const DashboardLayout = ({ children }) => {
  const { isProfileComplete, missingProfileFields, token } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAwarenessDismissed, setIsAwarenessDismissed] = useState(
    () => sessionStorage.getItem(awarenessStorageKey) === 'true'
  );
  const navigate = useNavigate();
  const location = useLocation();

  const isRestrictedMode = !isProfileComplete;
  const isCurrentPathUnlocked = unlockedPaths.includes(location.pathname);
  const blockedPath = useMemo(
    () => (isRestrictedMode && !isCurrentPathUnlocked ? location.pathname : null),
    [isCurrentPathUnlocked, isRestrictedMode, location.pathname]
  );
  const redirectedFrom = location.state?.redirectedFrom;
  const isAwarenessOpen = isRestrictedMode && (!isAwarenessDismissed || Boolean(redirectedFrom));

  useEffect(() => {
    // Guard: jangan redirect ke /profile jika tidak ada token
    // (user sedang logout atau sesi expired — biarkan ProtectedRoute/SessionTracker yang handle)
    if (blockedPath && token) {
      navigate('/profile', {
        replace: true,
        state: {
          redirectedFrom: blockedPath,
        },
      });
    }
  }, [blockedPath, navigate, token]);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const dismissAwareness = () => {
    sessionStorage.setItem(awarenessStorageKey, 'true');
    setIsAwarenessDismissed(true);

    if (redirectedFrom) {
      navigate('/profile', { replace: true });
    }
  };

  const showAwareness = () => {
    setIsAwarenessDismissed(false);
    closeMobileMenu();
  };

  const handleAwarenessCta = () => {
    dismissAwareness();
    closeMobileMenu();
    navigate('/profile');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem(awarenessStorageKey);
    closeMobileMenu();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#fffaf4] lg:bg-[linear-gradient(90deg,#fffaf4_0,#fffaf4_16rem,#ffffff_16rem,#ffffff_100%)]">
      {isAwarenessOpen ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#1f1f1f]/50 px-4 py-6">
          <div className="w-full max-w-xl rounded-[8px] bg-white p-6 shadow-[0_22px_50px_rgba(15,23,42,0.2)] sm:p-7">
            <span className="inline-flex rounded-full bg-[#fff3e7] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#d96f0a]">
              Profil bisnis belum lengkap
            </span>
            <h2 className="mt-4 text-2xl font-semibold tracking-[-0.05em] text-[#222] sm:text-[2rem]">
              Lengkapi profil bisnis sebelum memakai fitur lain
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#5c5c5c] sm:text-[0.98rem]">
              Anda tetap bisa masuk ke dashboard utama, tetapi fitur lain akan dikunci sampai data bisnis
              wajib terisi.
            </p>

            <div className="mt-5 rounded-[8px] border border-[#f2e4d7] bg-[#fff9f3] px-4 py-4">
              <p className="text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-[#b68352]">
                Data yang masih dibutuhkan
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {missingProfileFields.map((field) => (
                  <span
                    key={field.key}
                    className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#7a5a39] ring-1 ring-[#f1dcc9]"
                  >
                    {field.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleAwarenessCta}
                className="inline-flex w-full items-center justify-center rounded-[8px] bg-[#35c759] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2db44f] sm:w-auto"
              >
                Lengkapi Profil
              </button>
              <button
                type="button"
                onClick={dismissAwareness}
                className="inline-flex w-full items-center justify-center rounded-[8px] border border-[#d8d8d8] bg-white px-5 py-3 text-sm font-semibold text-[#666] transition hover:bg-[#fafafa] sm:w-auto"
              >
                Nanti
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div
        className={`fixed inset-0 z-40 bg-[#1f1f1f]/40 transition-opacity duration-200 lg:hidden ${
          isMobileMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={closeMobileMenu}
        aria-hidden="true"
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[84vw] max-w-[300px] flex-col border-r border-[#efe3d8] bg-white px-5 py-5 shadow-[0_20px_45px_rgba(15,23,42,0.14)] transition-transform duration-200 lg:hidden ${
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
            className="inline-flex h-10 w-10 items-center justify-center rounded-[8px] border border-[#f0e5d8] bg-[#fff8f0] text-[#e27c3e]"
            aria-label="Tutup menu navigasi"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-8 flex-1 space-y-2">
          {mobileMenuItems.map((item) => {
            const Icon = item.icon;
            const isDisabled = isRestrictedMode && !unlockedPaths.includes(item.path);

            if (isDisabled) {
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={showAwareness}
                  className="flex w-full items-center gap-3 rounded-[8px] px-4 py-3 text-left text-sm font-semibold text-[#5f5f5f] transition hover:bg-[#faf6f1] hover:text-[#1f1f1f]"
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {item.name}
                </button>
              );
            }

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-3 rounded-[8px] px-4 py-3 text-sm font-semibold transition',
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
          className="mt-6 rounded-[8px] bg-[#3CC360] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#34AD54]"
        >
          Logout
        </button>
      </aside>

      <div className="flex">
        <Sidebar onLockedNavigation={showAwareness} />

        <div className="flex-1 min-h-screen lg:ml-[256px]">
          <Topbar onMenuOpen={() => setIsMobileMenuOpen(true)} />
          <main className="px-4 pt-4 pb-8 sm:px-5 sm:pt-5 lg:px-10 lg:pt-8 lg:pb-10">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
