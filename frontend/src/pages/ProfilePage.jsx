import DashboardLayout from '../components/layout/DashboardLayout';
import { CloseIcon, UserIcon } from '../components/ui/AppIcons';

const ProfilePage = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-[3.2rem] font-semibold tracking-[-0.06em] text-[#ea8327]">
          Profil Bisnis
        </h1>
        <p className="mt-3 text-[1.15rem] text-[#2d2d2d]">
          Kelola informasi toko dan pengaturan standar kalkulasi AI anda.
        </p>
      </div>

      <div className="mt-10 grid gap-8 xl:grid-cols-[1.45fr_0.9fr]">
        <div className="rounded-[26px] bg-white p-8 shadow-[0_12px_30px_rgba(15,23,42,0.07)]">
          <div className="flex items-center gap-3 text-[#9d9d9d]">
            <div className="h-6 w-1 rounded-full bg-[#ff9735]" />
            <h2 className="text-[1.9rem] font-medium tracking-[-0.04em]">Identitas Bisnis</h2>
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#2c2c2c]">Nama Toko</label>
              <input
                type="text"
                defaultValue={user?.name || ''}
                className="w-full rounded-2xl border border-transparent bg-[#fff1e1] px-5 py-4 text-[#2c2c2c] outline-none transition focus:border-[#f3c18d]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#2c2c2c]">Kategori Bisnis</label>
              <input
                type="text"
                defaultValue="Kuliner & Minuman"
                className="w-full rounded-2xl border border-transparent bg-[#fff1e1] px-5 py-4 text-[#2c2c2c] outline-none transition focus:border-[#f3c18d]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#2c2c2c]">Lokasi/Alamat</label>
              <textarea
                rows="4"
                defaultValue={user?.email || ''}
                className="w-full rounded-2xl border border-transparent bg-[#fff1e1] px-5 py-4 text-[#2c2c2c] outline-none transition focus:border-[#f3c18d]"
              />
            </div>
          </div>
        </div>

        <div className="rounded-[26px] bg-white p-8 shadow-[0_12px_30px_rgba(15,23,42,0.07)]">
          <div className="flex items-center gap-3 text-[#9d9d9d]">
            <div className="h-6 w-1 rounded-full bg-[#5ad66d]" />
            <h2 className="text-[1.9rem] font-medium tracking-[-0.04em]">Kelengkapan Profil</h2>
          </div>

          <p className="mt-5 text-base text-[#2c2c2c]">Lanjutkan mengatur profilmu.</p>
          <div className="mt-5 text-[3rem] font-semibold tracking-[-0.05em] text-[#2c2c2c]">50%</div>
          <div className="mt-2 h-3 rounded-full bg-[#f8ebdf]">
            <div className="h-3 w-1/2 rounded-full bg-[#ea8327]" />
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <button
          type="button"
          className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#35c759] px-8 py-5 text-lg font-semibold tracking-[0.08em] text-white shadow-[0_14px_28px_rgba(53,199,89,0.2)] transition hover:bg-[#2db44f]"
        >
          <UserIcon className="h-5 w-5" />
          SIMPAN PERUBAHAN
        </button>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-3 rounded-2xl border border-[#a5a5a5] bg-white px-8 py-5 text-lg font-medium tracking-[0.08em] text-[#8c8c8c] transition hover:bg-[#fafafa]"
        >
          <CloseIcon className="h-5 w-5" />
          BATAL
        </button>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
