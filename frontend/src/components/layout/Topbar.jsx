import { Link } from 'react-router-dom';
import { UserIcon } from '../ui/AppIcons';

const Topbar = () => {
  return (
    <header className="px-6 py-7 sm:px-8 lg:px-10">
      <div className="flex items-center justify-end">
        <Link
          to="/profile"
          className="inline-flex items-center gap-3 rounded-full px-2 py-1 text-base font-medium text-[#ff922f] transition hover:bg-[#fff2e6]"
        >
          <UserIcon className="h-6 w-6" />
          <span>Profil</span>
        </Link>
      </div>
    </header>
  );
};

export default Topbar;
