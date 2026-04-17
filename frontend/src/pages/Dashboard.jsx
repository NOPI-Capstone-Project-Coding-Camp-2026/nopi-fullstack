import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { BookmarkIcon, ChartIcon, PieIcon, PlusIcon } from '../components/ui/AppIcons';

const Dashboard = () => {
  return (
    <DashboardLayout>
      <section className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <h1 className="text-[2rem] font-semibold leading-[1.08] tracking-[-0.05em] text-[#ea8327] sm:text-[2.6rem] lg:text-[3.35rem]">
            Selamat datang kembali, Nama User
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#2d2d2d] sm:text-[1.02rem] sm:leading-7 lg:text-[1.15rem]">
            Inilah ringkasan keuangan bisnis anda Hari ini.
          </p>
        </div>

        <Link
          to="/upload"
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#35c759] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(53,199,89,0.2)] transition hover:bg-[#2db44f] sm:w-auto sm:px-8 sm:py-4 sm:text-[1.02rem]"
        >
          <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          Tambah Nota
        </Link>
      </section>

      <section className="mt-7 grid gap-5 lg:mt-8 xl:grid-cols-[1.6fr_0.8fr] xl:gap-8">
        <div className="rounded-[24px] bg-white p-5 shadow-[0_16px_34px_rgba(15,23,42,0.08)] sm:rounded-[28px] sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <ChartIcon className="h-6 w-6 text-[#d96f0a] sm:h-8 sm:w-8" />
            <span className="rounded-full bg-[#7e7e7e] px-3 py-1.5 text-[0.68rem] font-medium text-white sm:px-5 sm:py-2 sm:text-xs">
              Bulan ini
            </span>
          </div>

          <p className="mt-6 text-[0.95rem] uppercase tracking-[0.12em] text-[#8d8d8d] sm:mt-8 sm:text-[1.15rem]">
            Total Pendapatan
          </p>
          <div className="mt-3 text-[2.5rem] font-semibold tracking-[-0.06em] text-[#3b9b52] sm:text-[4rem]">Rp 0</div>
          <p className="mt-4 text-sm leading-6 text-[#8d8d8d] sm:mt-5 sm:text-xl">Belum ada data transaksi</p>
        </div>

        <div className="space-y-5 xl:space-y-8">
          <div className="rounded-[24px] bg-white p-5 shadow-[0_16px_34px_rgba(15,23,42,0.08)] sm:rounded-[28px] sm:p-8 xl:p-10">
            <BookmarkIcon className="h-6 w-6 text-[#d96f0a] sm:h-8 sm:w-8" />
            <p className="mt-6 text-[0.9rem] uppercase tracking-[0.14em] text-[#8d8d8d] sm:mt-10 sm:text-[1rem]">
              Nota Terproses
            </p>
            <div className="mt-3 text-[2.2rem] font-semibold tracking-[-0.04em] text-[#222] sm:text-[3.1rem]">0</div>
          </div>

          <div className="rounded-[24px] bg-white p-5 shadow-[0_16px_34px_rgba(15,23,42,0.08)] sm:rounded-[28px] sm:p-8 xl:p-10">
            <PieIcon className="h-6 w-6 text-[#d96f0a] sm:h-8 sm:w-8" />
            <p className="mt-6 text-[0.9rem] uppercase tracking-[0.14em] text-[#8d8d8d] sm:mt-10 sm:text-[1rem]">Laba Bersih</p>
            <div className="mt-3 text-[2.15rem] font-semibold tracking-[-0.04em] text-[#222] sm:text-[3rem]">Rp 0</div>
            <p className="mt-6 max-w-[18rem] text-sm leading-6 text-[#f1781c] sm:mt-10 sm:text-lg sm:leading-8 lg:max-w-[14rem]">
              Laba bersih akan muncul setelah nota berhasil diproses dan disimpan.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-5 xl:mt-10 xl:grid-cols-[1.6fr_0.8fr] xl:gap-8">
        <div>
          <div className="mb-5 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-[1.7rem] font-semibold tracking-[-0.05em] text-[#ea8327] sm:text-[2.1rem]">
              Aktivitas Riwayat
            </h2>
            <Link to="/history" className="text-sm font-semibold text-[#262626] sm:text-base">
              Lihat Semua Riwayat
            </Link>
          </div>

          <div className="rounded-[22px] bg-white px-5 py-7 shadow-[0_12px_28px_rgba(15,23,42,0.06)] sm:rounded-[24px] sm:px-7 sm:py-10">
            <p className="text-sm leading-6 text-[#8d8d8d] sm:text-lg sm:leading-8">
              Belum ada riwayat transaksi. Mulai dengan upload nota pertama Anda.
            </p>
          </div>
        </div>

        <div className="rounded-[24px] bg-[#f3f3f3] p-5 shadow-[0_16px_34px_rgba(15,23,42,0.05)] sm:rounded-[28px] sm:p-10">
          <div className="flex min-h-[190px] flex-col items-center justify-center text-center sm:min-h-[260px]">
            <div className="text-6xl text-[#979797] sm:text-8xl">⌁</div>
            <h3 className="mt-5 text-xl font-medium text-[#f0831b] sm:mt-6 sm:text-2xl">Aktivitas terbaru</h3>
            <p className="mt-3 max-w-xs text-sm leading-6 text-[#8d8d8d] sm:mt-4 sm:text-base sm:leading-7">
              Belum ada data. mulai dengan memindai nota Pertama anda
            </p>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default Dashboard;
