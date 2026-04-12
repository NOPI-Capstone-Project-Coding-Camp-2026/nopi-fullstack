import Sidebar from './Sidebar';
import Topbar from './Topbar';

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[linear-gradient(90deg,#fffaf4_0,#fffaf4_18rem,#ffffff_18rem,#ffffff_100%)]">
      <div className="flex">
        <Sidebar />

        <div className="flex-1 min-h-screen lg:ml-[280px]">
          <Topbar />

          <main className="px-6 pb-12 sm:px-8 lg:px-14">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
