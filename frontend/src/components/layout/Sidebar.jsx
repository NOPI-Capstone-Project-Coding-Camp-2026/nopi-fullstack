import { NavLink } from 'react-router-dom';
import NopiLogo from '../ui/NopiLogo';
import { BarsIcon, GridIcon, InfoIcon, ReceiptIcon } from '../ui/AppIcons';

const menuItems = [
  { to: '/dashboard', label: 'Beranda', icon: GridIcon },
  { to: '/history', label: 'Riwayat Transaksi', icon: BarsIcon },
  { to: '/upload', label: 'Scan/Upload', icon: ReceiptIcon },
  { to: '/faq', label: 'FAQ', icon: InfoIcon },
];

const Sidebar = () => {
  return (
    <aside className="hidden min-h-screen w-[280px] border-r border-[#f3ece2] bg-[#fffaf4] px-10 py-12 lg:fixed lg:inset-y-0 lg:left-0 lg:block">
      <NopiLogo />

      <nav className="mt-16 space-y-4">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 rounded-2xl px-5 py-3 text-[1.05rem] font-medium transition',
                  isActive ? 'bg-[#ffe1c5] text-[#ff922f]' : 'text-[#ff922f] hover:bg-[#fff0df]',
                ].join(' ')
              }
            >
              <Icon className="h-6 w-6 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
