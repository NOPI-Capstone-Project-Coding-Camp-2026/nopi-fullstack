/**
 * Skeleton Loader Components untuk NOPI Nota Pintar.
 *
 * Menggantikan loading spinner statis dengan placeholder yang mencerminkan
 * bentuk konten sesungguhnya — standar UX modern (skeleton loading pattern).
 *
 * Komponen yang tersedia:
 *   - SkeletonCard      : Placeholder kartu statistik (Total Modal di Dashboard)
 *   - SkeletonTableRow  : Placeholder baris tabel (History)
 *   - SkeletonText      : Placeholder teks inline generik
 */

/**
 * Animasi pulse generik yang dipakai semua skeleton element.
 */
const pulseClass = 'animate-pulse rounded bg-[#f0e9e0]';

/**
 * SkeletonText — baris teks placeholder dengan lebar yang bisa dikonfigurasi.
 *
 * @param {{ className?: string }} props
 */
export const SkeletonText = ({ className = 'h-4 w-32' }) => (
  <span className={`${pulseClass} inline-block ${className}`} aria-hidden="true" />
);

/**
 * SkeletonCard — placeholder untuk kartu ringkasan di Dashboard.
 * Meniru struktur: ikon + judul + nilai besar + keterangan bawah.
 *
 * @param {{ className?: string }} props
 */
export const SkeletonCard = ({ className = '' }) => (
  <div
    className={`rounded-[12px] border border-[#f2e4d7] bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.06)] ${className}`}
    aria-hidden="true"
    aria-label="Memuat data..."
    role="status"
  >
    {/* Ikon placeholder */}
    <div className={`h-10 w-10 ${pulseClass}`} />

    {/* Judul placeholder */}
    <div className={`mt-4 h-3 w-24 ${pulseClass}`} />

    {/* Nilai besar placeholder */}
    <div className={`mt-3 h-8 w-40 ${pulseClass}`} />

    {/* Keterangan bawah placeholder */}
    <div className={`mt-3 h-3 w-32 ${pulseClass}`} />
  </div>
);

/**
 * SkeletonTableRow — placeholder untuk satu baris dalam tabel History.
 * Kolom: Toko | Tanggal | Total | Aksi
 *
 * @param {{ columns?: number }} props
 */
export const SkeletonTableRow = ({ columns = 4 }) => (
  <tr aria-hidden="true" role="status" aria-label="Memuat baris...">
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="px-4 py-3.5">
        <div
          className={`h-4 ${pulseClass} ${
            i === 0 ? 'w-36' : i === 1 ? 'w-24' : i === 2 ? 'w-28' : 'w-16'
          }`}
        />
      </td>
    ))}
  </tr>
);

/**
 * SkeletonDashboardSection — blok placeholder untuk seluruh bagian statistik Dashboard.
 * Menampilkan 3 SkeletonCard berderet.
 */
export const SkeletonDashboardSection = () => (
  <div
    className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    aria-busy="true"
    aria-label="Memuat statistik dashboard..."
  >
    <SkeletonCard />
    <SkeletonCard className="hidden sm:block" />
    <SkeletonCard className="hidden lg:block" />
  </div>
);
