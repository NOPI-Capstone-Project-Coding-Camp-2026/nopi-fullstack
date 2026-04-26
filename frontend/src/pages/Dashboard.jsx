import { useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { BookmarkIcon, ChartIcon, PlusIcon } from '../components/ui/AppIcons';
import { AuthContext } from '../context/AuthContext';
import {
  calculateDashboardMetrics,
  formatCurrency,
  getMonthOptions,
  normalizedHistoryItems,
} from '../data/transactions';
import { getBusinessProfile } from '../utils/businessProfile';

const Dashboard = () => {
  const { user, isProfileComplete } = useContext(AuthContext);
  const { displayBusinessName, businessCategory, businessAddress } = getBusinessProfile(user);
  const monthOptions = useMemo(() => getMonthOptions(normalizedHistoryItems), []);
  const activeMonthKey = monthOptions[0]?.value || '';
  const dashboardMetrics = useMemo(
    () => calculateDashboardMetrics(normalizedHistoryItems, activeMonthKey),
    [activeMonthKey]
  );
  const recentItems = useMemo(() => normalizedHistoryItems.slice(0, 5), []);
  const primaryActionPath = isProfileComplete ? '/upload' : '/profile';
  const historyPath = isProfileComplete ? '/history' : '/profile';

  return (
    <DashboardLayout>
      <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <h1 className="text-[1.7rem] font-semibold leading-[1.08] tracking-[-0.05em] text-[#ea8327] sm:text-[2.2rem] lg:text-[2.8rem]">
            Selamat datang kembali, {displayBusinessName}
          </h1>
          <p className="mt-2.5 max-w-2xl text-[0.92rem] leading-6 text-[#2d2d2d] sm:text-[0.98rem] lg:text-[1.02rem]">
            Inilah ringkasan keuangan bisnis Anda untuk {dashboardMetrics.activeMonthLabel}.
          </p>
          <p className="mt-2 text-[0.82rem] text-[#8d8d8d] sm:text-[0.88rem]">
            {businessCategory ? `${businessCategory}` : 'Profil bisnis Anda akan tampil di sini'}
            {businessAddress ? ` • ${businessAddress}` : ''}
          </p>
        </div>

        <Link
          to={primaryActionPath}
          className={`inline-flex w-full items-center justify-center gap-2 rounded-[8px] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(53,199,89,0.18)] transition sm:w-auto sm:px-6 sm:text-[0.96rem] ${
            isProfileComplete ? 'bg-[#35c759] hover:bg-[#2db44f]' : 'bg-[#ea8327] hover:bg-[#d96f0a]'
          }`}
        >
          <PlusIcon className="h-4 w-4" />
          {isProfileComplete ? 'Tambah Nota' : 'Isi Profile Sekarang'}
        </Link>
      </section>

      {!isProfileComplete ? (
        <section className="mt-5 rounded-[8px] border border-[#f2e4d7] bg-[#fff7ee] px-5 py-4 shadow-[0_10px_20px_rgba(234,131,39,0.08)]">
          <p className="text-sm font-semibold text-[#8a561d]">Akses fitur lanjutan masih dikunci sementara.</p>
          <p className="mt-1.5 text-[0.92rem] leading-6 text-[#7a5a39]">
            Lengkapi profil bisnis Anda terlebih dahulu agar upload nota, history, dan fitur lainnya aktif normal.
          </p>
        </section>
      ) : null}

      <section className="mt-6 grid gap-4 lg:mt-7 xl:grid-cols-[1.55fr_0.85fr]">
        <div className="rounded-[8px] bg-white p-5 shadow-[0_14px_30px_rgba(15,23,42,0.07)] sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <ChartIcon className="h-5 w-5 text-[#d96f0a] sm:h-6 sm:w-6" />
            <span className="rounded-[8px] bg-[#7e7e7e] px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.12em] text-white sm:text-[0.68rem]">
              {dashboardMetrics.activeMonthLabel}
            </span>
          </div>

          <p className="mt-5 text-[0.8rem] uppercase tracking-[0.12em] text-[#8d8d8d] sm:text-[0.88rem]">
            Total Modal
          </p>
          <div className="mt-2 text-[2rem] font-semibold tracking-[-0.06em] text-[#3b9b52] sm:text-[2.8rem]">
            {formatCurrency(dashboardMetrics.totalCapital)}
          </div>
          <p className="mt-3 text-[0.88rem] leading-6 text-[#8d8d8d] sm:text-[0.94rem]">
            Total modal dihitung dari penjumlahan seluruh harga beli dalam satu bulan.
          </p>
        </div>

        <div className="rounded-[8px] bg-white p-5 shadow-[0_14px_30px_rgba(15,23,42,0.07)] sm:p-6">
          <BookmarkIcon className="h-5 w-5 text-[#d96f0a] sm:h-6 sm:w-6" />
          <p className="mt-5 text-[0.78rem] uppercase tracking-[0.14em] text-[#8d8d8d] sm:text-[0.86rem]">
              Nota Terproses
          </p>
          <div className="mt-2 text-[1.9rem] font-semibold tracking-[-0.04em] text-[#222] sm:text-[2.5rem]">
            {dashboardMetrics.processedReceipts}
          </div>
          <p className="mt-3 max-w-[18rem] text-[0.88rem] leading-6 text-[#8d8d8d] sm:text-[0.94rem]">
            Jumlah nota yang tercatat pada bulan terpilih akan tampil di sini, termasuk saat data masih kosong.
          </p>
        </div>
      </section>

      <section className="mt-8 xl:mt-9">
        <div>
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-[1.45rem] font-semibold tracking-[-0.05em] text-[#ea8327] sm:text-[1.8rem]">
              Aktivitas Riwayat
            </h2>
            <Link
              to={historyPath}
              className={`text-sm font-semibold sm:text-[0.95rem] ${
                isProfileComplete ? 'text-[#262626]' : 'text-[#c07f47]'
              }`}
            >
              {isProfileComplete ? 'Lihat Semua Riwayat' : 'Lengkapi Profile untuk Membuka Riwayat'}
            </Link>
          </div>

          <div className="rounded-[8px] bg-white shadow-[0_12px_28px_rgba(15,23,42,0.06)]">
            {recentItems.length === 0 ? (
              <div className="px-5 py-8 sm:px-6 sm:py-9">
                <p className="text-[0.92rem] leading-6 text-[#8d8d8d] sm:text-[0.96rem]">
                  Belum ada riwayat transaksi. Mulai dengan upload nota pertama Anda.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#f4f0ea]">
                {recentItems.map((item) => (
                  <div
                    key={item.id}
                    className="grid gap-3 px-5 py-4 text-[0.92rem] text-[#2c2c2c] sm:grid-cols-[1.2fr_0.8fr_0.7fr] sm:px-6"
                  >
                    <div>
                      <p className="font-semibold">{item.merchant}</p>
                      <p className="mt-1 text-[0.82rem] text-[#909090]">
                        {item.dateLabel} • {item.timeLabel}
                      </p>
                    </div>
                    <div>
                      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[#b0b0b0]">
                        Harga Beli
                      </p>
                      <p className="mt-1 font-medium">{item.cost}</p>
                    </div>
                    <div>
                      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[#b0b0b0]">
                        Harga Jual
                      </p>
                      <p className="mt-1 font-medium">{item.sellPrice}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default Dashboard;
