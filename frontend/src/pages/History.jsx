import DashboardLayout from '../components/layout/DashboardLayout';
import HistoryTable from '../components/history/HistoryTable';
import { CalendarIcon, ChevronDownIcon, SearchIcon } from '../components/ui/AppIcons';

const History = () => {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-[3.2rem] font-semibold tracking-[-0.06em] text-[#ea8327]">
          Riwayat Transaksi
        </h1>
        <p className="mt-3 text-[1.15rem] text-[#2d2d2d]">
          Manajemen data seluruh riwayat transaksi nota Anda.
        </p>
      </div>

      <div className="mt-10 grid gap-6 xl:grid-cols-3">
        <div className="flex items-center justify-between rounded-[20px] bg-white px-6 py-5 shadow-[0_12px_28px_rgba(15,23,42,0.06)]">
          <div className="flex items-center gap-4 text-[#909090]">
            <CalendarIcon className="h-6 w-6" />
            <span>Rentang Waktu: 01 Jan 2024 - 31 Jan 2024</span>
          </div>
          <ChevronDownIcon className="h-5 w-5 text-[#ef7d1d]" />
        </div>

        <div className="flex items-center justify-between rounded-[20px] bg-white px-6 py-5 shadow-[0_12px_28px_rgba(15,23,42,0.06)]">
          <div className="flex items-center gap-4 text-[#2d2d2d]">
            <SearchIcon className="h-6 w-6 text-[#909090]" />
            <span>Semua Merchant</span>
          </div>
          <ChevronDownIcon className="h-5 w-5 text-[#ef7d1d]" />
        </div>

        <div className="flex items-center gap-4 rounded-[20px] bg-white px-6 py-5 shadow-[0_12px_28px_rgba(15,23,42,0.06)]">
          <SearchIcon className="h-6 w-6 text-[#909090]" />
          <span className="text-[#c1c1c1]">Cari kata kunci...</span>
        </div>
      </div>

      <div className="mt-10">
        <HistoryTable />
      </div>
    </DashboardLayout>
  );
};

export default History;
