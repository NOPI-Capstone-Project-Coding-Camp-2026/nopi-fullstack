import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { CircleHelp, House, ReceiptText, Upload, UserRound } from 'lucide-react';
import NopiLogo from '../ui/NopiLogo';
import { AuthContext } from '../../context/AuthContext';

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: House },
  { name: 'Upload Nota', path: '/upload', icon: Upload },
  { name: 'Riwayat', path: '/history', icon: ReceiptText },
  { name: 'Profil', path: '/profile', icon: UserRound },
  { name: 'FAQ', path: '/faq', icon: CircleHelp },
];

const unlockedPaths = ['/dashboard', '/profile'];

const Sidebar = ({ onLockedNavigation }) => {
  const { isProfileComplete } = useContext(AuthContext);
  const navigate = useNavigate();
  const isRestrictedMode = !isProfileComplete;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('nopi-profile-awareness-dismissed');
    navigate('/login');
  };

  return (
    <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 flex-col border-r border-gray-200 bg-white px-5 py-7 lg:flex">
      <div className="mb-8">
        <NopiLogo className="max-w-[168px]" compact />
        <p className="mt-2 text-[0.82rem] text-gray-500">Nota Pintar untuk UMKM</p>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isDisabled = isRestrictedMode && !unlockedPaths.includes(item.path);

          if (isDisabled) {
            return (
              <button
                key={item.path}
                type="button"
                onClick={onLockedNavigation}
                className="flex w-full items-center gap-3 rounded-[8px] px-4 py-2.5 text-left text-[0.92rem] font-semibold text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
              >
                <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={2.2} />
                <span>{item.name}</span>
              </button>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-[8px] px-4 py-2.5 text-[0.92rem] font-semibold transition ${
                  isActive
                    ? 'bg-[#FFF3EC] text-[#E27C3E]'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={2.2} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="mt-5 rounded-[8px] bg-[#3CC360] px-4 py-2.5 text-[0.92rem] font-bold text-white transition hover:bg-[#34AD54]"
      >
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
