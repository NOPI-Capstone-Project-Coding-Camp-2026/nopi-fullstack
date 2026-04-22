import { useContext, useState } from 'react';
import { CircleAlert, CircleCheckBig } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { CloseIcon, UserIcon } from '../components/ui/AppIcons';
import { AuthContext } from '../context/AuthContext';

const StatusBadge = ({ filled }) => (
  <span
    className={`inline-flex items-center gap-2 rounded-[8px] px-3 py-1 text-xs font-semibold ${
      filled ? 'bg-[#e9f9ee] text-[#249a43]' : 'bg-[#fff4e8] text-[#ea8327]'
    }`}
  >
    {filled ? <CircleCheckBig className="h-4 w-4" /> : <CircleAlert className="h-4 w-4" />}
    {filled ? 'Sudah diisi' : 'Belum terisi'}
  </span>
);

const ProfilePage = () => {
  const { user, setUser } = useContext(AuthContext);
  const currentUser = user || JSON.parse(localStorage.getItem('user') || '{}');
  const [profileImage, setProfileImage] = useState(currentUser?.profileImage || '');
  const [storeName, setStoreName] = useState(currentUser?.businessName || '');
  const [businessCategory, setBusinessCategory] = useState(currentUser?.businessCategory || '');
  const [businessAddress, setBusinessAddress] = useState(currentUser?.businessAddress || '');

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setProfileImage(reader.result?.toString() || '');
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const updatedUser = {
      ...currentUser,
      profileImage,
      businessName: storeName,
      businessCategory,
      businessAddress,
    };

    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const handleReset = () => {
    setProfileImage(currentUser?.profileImage || '');
    setStoreName(currentUser?.businessName || '');
    setBusinessCategory(currentUser?.businessCategory || '');
    setBusinessAddress(currentUser?.businessAddress || '');
  };

  const fieldStatus = (value) => Boolean(value && value.toString().trim() !== '');

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.06em] text-[#ea8327] sm:text-4xl lg:text-[3.2rem]">
          Profil Bisnis
        </h1>
        <p className="mt-3 text-base text-[#2d2d2d] sm:text-[1.05rem] lg:text-[1.15rem]">
          Kelola informasi toko dan pengaturan standar kalkulasi AI anda.
        </p>
      </div>

      <div className="mt-10">
        <div className="rounded-[8px] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.07)] sm:p-8">
          <div className="flex items-center gap-3 text-[#9d9d9d]">
            <div className="h-6 w-1 rounded-[8px] bg-[#ff9735]" />
            <h2 className="text-2xl font-medium tracking-[-0.04em] sm:text-[1.9rem]">Identitas Bisnis</h2>
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <div className="mb-3 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center sm:gap-4">
                <label className="block text-sm font-medium text-[#2c2c2c]">Foto Profil</label>
                <StatusBadge filled={fieldStatus(profileImage)} />
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Preview foto profil"
                    className="h-20 w-20 rounded-[8px] object-cover ring-4 ring-[#fff1e1] sm:h-24 sm:w-24"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-[8px] bg-[#fff1e1] text-xl font-semibold text-[#ea8327] sm:h-24 sm:w-24 sm:text-2xl">
                    {currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}

                <label className="inline-flex w-full cursor-pointer items-center justify-center rounded-[8px] bg-[#fff1e1] px-5 py-3 text-sm font-semibold text-[#ea8327] transition hover:bg-[#ffe6ca] sm:w-auto">
                  Pilih Foto
                  <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                </label>
              </div>
            </div>

            <div>
              <div className="mb-2 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center sm:gap-4">
                <label className="block text-sm font-medium text-[#2c2c2c]">Nama Toko</label>
                <StatusBadge filled={fieldStatus(storeName)} />
              </div>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full rounded-[8px] border border-transparent bg-[#fff1e1] px-5 py-4 text-[#2c2c2c] outline-none transition focus:border-[#f3c18d]"
              />
            </div>

            <div>
              <div className="mb-2 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center sm:gap-4">
                <label className="block text-sm font-medium text-[#2c2c2c]">Kategori Bisnis</label>
                <StatusBadge filled={fieldStatus(businessCategory)} />
              </div>
              <input
                type="text"
                value={businessCategory}
                onChange={(e) => setBusinessCategory(e.target.value)}
                className="w-full rounded-[8px] border border-transparent bg-[#fff1e1] px-5 py-4 text-[#2c2c2c] outline-none transition focus:border-[#f3c18d]"
              />
            </div>

            <div>
              <div className="mb-2 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center sm:gap-4">
                <label className="block text-sm font-medium text-[#2c2c2c]">Lokasi/Alamat</label>
                <StatusBadge filled={fieldStatus(businessAddress)} />
              </div>
              <textarea
                rows="4"
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                className="w-full rounded-[8px] border border-transparent bg-[#fff1e1] px-5 py-4 text-[#2c2c2c] outline-none transition focus:border-[#f3c18d]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex w-full items-center justify-center gap-3 rounded-[8px] bg-[#35c759] px-6 py-4 text-base font-semibold tracking-[0.08em] text-white shadow-[0_14px_28px_rgba(53,199,89,0.2)] transition hover:bg-[#2db44f] sm:w-auto sm:px-8 sm:py-5 sm:text-lg"
        >
          <UserIcon className="h-5 w-5" />
          SIMPAN PERUBAHAN
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex w-full items-center justify-center gap-3 rounded-[8px] border border-[#a5a5a5] bg-white px-6 py-4 text-base font-medium tracking-[0.08em] text-[#8c8c8c] transition hover:bg-[#fafafa] sm:w-auto sm:px-8 sm:py-5 sm:text-lg"
        >
          <CloseIcon className="h-5 w-5" />
          BATAL
        </button>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
