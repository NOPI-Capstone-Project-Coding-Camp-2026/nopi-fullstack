import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { MenuIcon } from '../ui/AppIcons';

const Topbar = ({ onMenuOpen }) => {
  const { user } = useContext(AuthContext);
  const userName = user?.name || 'User';
  const profileImage = user?.profileImage;

  return (
    <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8 lg:py-5">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onMenuOpen}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#f0e5d8] bg-[#fff8f0] text-[#e27c3e] transition hover:bg-[#fff1e4] lg:hidden"
            aria-label="Buka menu navigasi"
          >
            <MenuIcon className="h-5 w-5" />
          </button>

          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-500 sm:text-sm">Halo, selamat datang</p>
            <p className="truncate text-sm font-semibold text-gray-900 sm:text-base lg:text-lg">{userName}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {profileImage ? (
            <img
              src={profileImage}
              alt={`Foto profil ${userName}`}
              className="h-10 w-10 rounded-full object-cover ring-2 ring-[#f5c7a4] sm:h-11 sm:w-11"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E27C3E] text-sm font-bold text-white sm:h-11 sm:w-11">
              {userName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          )}

          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-gray-900">{userName}</p>
            <p className="text-xs text-gray-500">Frontend Team</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
