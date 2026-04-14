import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { BookmarkIcon, ChartIcon, PieIcon, PlusIcon } from '../components/ui/AppIcons';

const Dashboard = () => {
  return (
    <DashboardLayout>
      <section className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-[3.35rem] font-semibold tracking-[-0.06em] text-[#ea8327]">
            Selamat datang kembali, Nama User
          </h1>
          <p className="mt-3 text-[1.15rem] text-[#2d2d2d]">
            Inilah ringkasan keuangan bisnis anda Hari ini.
          </p>
        </div>

        <Link
          to="/upload"
          className="inline-flex items-center gap-2 rounded-2xl bg-[#35c759] px-8 py-5 text-[1.05rem] font-semibold text-white shadow-[0_14px_28px_rgba(53,199,89,0.2)] transition hover:bg-[#2db44f]"
        >
          <PlusIcon className="h-5 w-5" />
          Tambah Nota
        </Link>
      </section>

      <section className="mt-8 grid gap-8 xl:grid-cols-[1.6fr_0.8fr]">
        <div className="rounded-[28px] bg-white p-7 shadow-[0_16px_34px_rgba(15,23,42,0.08)]">
          <div className="flex items-start justify-between gap-4">
            <ChartIcon className="h-8 w-8 text-[#d96f0a]" />
            <span className="rounded-full bg-[#7e7e7e] px-5 py-2 text-xs font-medium text-white">Bulan ini</span>
          </div>

          <p className="mt-8 text-[1.15rem] uppercase tracking-[0.12em] text-[#8d8d8d]">
            Total Pendapatan
          </p>
          <div className="mt-3 text-[4rem] font-semibold tracking-[-0.06em] text-[#3b9b52]">Rp 0</div>
          <p className="mt-5 text-xl text-[#8d8d8d]">Belum ada data transaksi</p>
        </div>

        <div className="space-y-8">
          <div className="rounded-[28px] bg-white p-10 shadow-[0_16px_34px_rgba(15,23,42,0.08)]">
            <BookmarkIcon className="h-8 w-8 text-[#d96f0a]" />
            <p className="mt-10 text-[1rem] uppercase tracking-[0.14em] text-[#8d8d8d]">
              Nota Terproses
            </p>
            <div className="mt-3 text-[3.1rem] font-semibold tracking-[-0.04em] text-[#222]">0</div>
          </div>

          <div className="rounded-[28px] bg-white p-10 shadow-[0_16px_34px_rgba(15,23,42,0.08)]">
            <PieIcon className="h-8 w-8 text-[#d96f0a]" />
            <p className="mt-10 text-[1rem] uppercase tracking-[0.14em] text-[#8d8d8d]">Laba Bersih</p>
            <div className="mt-3 text-[3rem] font-semibold tracking-[-0.04em] text-[#222]">Rp 0</div>
            <p className="mt-14 max-w-[14rem] text-lg leading-8 text-[#f1781c]">
              Laba bersih akan muncul setelah nota berhasil diproses dan disimpan.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-8 xl:grid-cols-[1.6fr_0.8fr]">
        <div>
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-[2.1rem] font-semibold tracking-[-0.05em] text-[#ea8327]">
              Aktivitas Riwayat
            </h2>
            <Link to="/history" className="text-base font-semibold text-[#262626]">
              Lihat Semua Riwayat
            </Link>
          </div>

          <div className="rounded-[24px] bg-white px-7 py-10 shadow-[0_12px_28px_rgba(15,23,42,0.06)]">
            <p className="text-lg text-[#8d8d8d]">
              Belum ada riwayat transaksi. Mulai dengan upload nota pertama Anda.
            </p>
          </div>
        </div>

        <div className="rounded-[28px] bg-[#f3f3f3] p-10 shadow-[0_16px_34px_rgba(15,23,42,0.05)]">
          <div className="flex min-h-[260px] flex-col items-center justify-center text-center">
            <div className="text-8xl text-[#979797]">⌁</div>
            <h3 className="mt-6 text-2xl font-medium text-[#f0831b]">Aktivitas terbaru</h3>
            <p className="mt-4 max-w-xs text-base leading-7 text-[#8d8d8d]">
              Belum ada data. mulai dengan memindai nota Pertama anda
            </p>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default Dashboard;
