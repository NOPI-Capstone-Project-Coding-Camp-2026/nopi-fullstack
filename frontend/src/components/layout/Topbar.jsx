const Topbar = ({ title }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = user?.name || 'User';

  return (
    <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8 lg:py-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-gray-500">Halo, selamat datang</p>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E27C3E] text-sm font-bold text-white">
            {userName?.charAt(0)?.toUpperCase() || 'U'}
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900">{userName}</p>
            <p className="text-xs text-gray-500">Frontend Team</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;