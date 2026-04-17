import { NavLink, useNavigate } from 'react-router-dom';
import { CircleHelp, House, ReceiptText, Upload, UserRound } from 'lucide-react';
import NopiLogo from '../ui/NopiLogo';

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: House },
  { name: 'Upload Nota', path: '/upload', icon: Upload },
  { name: 'History', path: '/history', icon: ReceiptText },
  { name: 'Profile', path: '/profile', icon: UserRound },
  { name: 'FAQ', path: '/faq', icon: CircleHelp },
];

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 z-30 h-screen w-72 flex-col border-r border-gray-200 bg-white px-6 py-8">
      <div className="mb-10">
        <NopiLogo className="max-w-[180px]" compact />
        <p className="mt-2 text-sm text-gray-500">Nota Pintar untuk UMKM</p>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-[#FFF3EC] text-[#E27C3E]'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <Icon className="h-5 w-5 shrink-0" strokeWidth={2.2} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="mt-6 rounded-xl bg-[#3CC360] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#34AD54]"
      >
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
