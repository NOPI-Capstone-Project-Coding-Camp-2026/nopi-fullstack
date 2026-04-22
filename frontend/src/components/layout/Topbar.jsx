import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { MenuIcon } from '../ui/AppIcons';

const Topbar = ({ onMenuOpen }) => {
  const { user } = useContext(AuthContext);
  const userName = user?.name || 'User';
  const profileImage = user?.profileImage;

  return (
    <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5 lg:px-6 lg:py-4">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onMenuOpen}
            className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-[#f0e5d8] bg-[#fff8f0] text-[#e27c3e] transition hover:bg-[#fff1e4] lg:hidden"
            aria-label="Buka menu navigasi"
          >
            <MenuIcon className="h-4.5 w-4.5" />
          </button>

          <div className="min-w-0">
            <p className="text-[0.72rem] font-medium text-gray-500 sm:text-xs">Halo, selamat datang</p>
            <p className="truncate text-sm font-semibold text-gray-900 sm:text-[0.95rem] lg:text-base">{userName}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {profileImage ? (
            <img
              src={profileImage}
              alt={`Foto profil ${userName}`}
              className="h-9 w-9 rounded-[8px] object-cover ring-2 ring-[#f5c7a4] sm:h-10 sm:w-10"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#E27C3E] text-[0.82rem] font-bold text-white sm:h-10 sm:w-10">
              {userName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          )}

          <div className="hidden text-right sm:block">
            <p className="text-[0.9rem] font-semibold text-gray-900">{userName}</p>
            <p className="text-[0.72rem] text-gray-500">Frontend Team</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
