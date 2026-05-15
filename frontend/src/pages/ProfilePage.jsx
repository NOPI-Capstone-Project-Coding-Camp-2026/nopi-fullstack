import { useContext, useState } from 'react';
import { CircleAlert, CircleCheckBig } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { CloseIcon, UserIcon } from '../components/ui/AppIcons';
import { AuthContext } from '../context/AuthContext';
import { getBusinessProfile, getBusinessProfileCompleteness } from '../utils/businessProfile';
import Swal from 'sweetalert2'; // <--- IMPORT SWEETALERT DITAMBAHKAN DI SINI

const businessCategoryOptions = [
  'Toko Kelontong / Sembako',
  'Makanan & Minuman',
  'Fashion / Pakaian',
  'Kosmetik & Kecantikan',
  'Elektronik & Aksesoris',
  'ATK / Percetakan',
  'Kesehatan / Apotek',
  'Rumah Tangga',
  'Digital / Jasa Digital',
  'Jasa / Servis',
  'Pendidikan / Kursus',
  'Lainnya',
];

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
  const { user, setUser, missingProfileFields, isProfileComplete } = useContext(AuthContext);
  const currentUser = user || JSON.parse(localStorage.getItem('user') || '{}');
  const businessProfile = getBusinessProfile(currentUser);
  const [storeLogo, setStoreLogo] = useState(businessProfile.storeLogo);
  const [storeName, setStoreName] = useState(businessProfile.storeName);
  const [businessCategory, setBusinessCategory] = useState(businessProfile.businessCategory);
  const [businessAddress, setBusinessAddress] = useState(businessProfile.businessAddress);
  const [phoneNumber, setPhoneNumber] = useState(businessProfile.phoneNumber);
  
  const profilePreview = getBusinessProfileCompleteness({
    ...currentUser,
    storeLogo,
    businessLogo: storeLogo,
    profileImage: storeLogo,
    storeName,
    businessName: storeName,
    storeCategory: businessCategory,
    businessCategory,
    storeAddress: businessAddress,
    businessAddress,
    storeContactNumber: phoneNumber,
    storePhone: phoneNumber,
    phoneNumber,
  });

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setStoreLogo(reader.result?.toString() || '');
    };
    reader.readAsDataURL(file);
  };

  // --- FUNGSI HANDLESAVE YANG SUDAH TERHUBUNG KE BACKEND ---
  const handleSave = async () => {
    // 1. Siapkan struktur data
    const updatedUser = {
      ...currentUser,
      storeLogo,
      businessLogo: storeLogo,
      profileImage: storeLogo,
      storeName,
      businessName: storeName,
      storeCategory: businessCategory,
      businessCategory,
      storeAddress: businessAddress,
      businessAddress,
      storeContactNumber: phoneNumber,
      storePhone: phoneNumber,
      phoneNumber,
    };

    // Tampilkan animasi loading
    Swal.fire({
      title: 'Menyimpan Perubahan...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    try {
      const token = localStorage.getItem('token');

      // 2. Tembak API ke backend
      const res = await fetch('http://localhost:5000/api/user/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        // Pastikan nama key sesuai dengan schema Prisma
        body: JSON.stringify({ 
          profileImage: storeLogo,
          businessName: storeName,
          businessCategory,
          businessAddress,
          phoneNumber
        }),
      });

      const result = await res.json();

      if (res.ok) {
        // 3. Gabungkan kembalian dari backend dengan data lokal
        const finalUserData = { ...updatedUser, ...result.data };

        localStorage.setItem('user', JSON.stringify(finalUserData));
        setUser(finalUserData);

        if (getBusinessProfileCompleteness(finalUserData).isComplete) {
          sessionStorage.removeItem('nopi-profile-awareness-dismissed');
        }

        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Profil bisnis berhasil disimpan di database.',
          confirmButtonColor: '#35c759'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Gagal Menyimpan',
          text: result.message,
          confirmButtonColor: '#ea8327'
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Koneksi Terputus',
        text: 'Tidak dapat terhubung ke server.',
        confirmButtonColor: '#ea8327'
      });
    }
  };
  // --------------------------------------------------------------------

  const handleReset = () => {
    setStoreLogo(businessProfile.storeLogo);
    setStoreName(businessProfile.storeName);
    setBusinessCategory(businessProfile.businessCategory);
    setBusinessAddress(businessProfile.businessAddress);
    setPhoneNumber(businessProfile.phoneNumber);
  };

  const fieldStatus = (value) => Boolean(value && value.toString().trim() !== '');

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.06em] text-[#ea8327] sm:text-4xl lg:text-[3.2rem]">
          Profil Bisnis
        </h1>
        <p className="mt-3 text-base text-[#2d2d2d] sm:text-[1.05rem] lg:text-[1.15rem]">
          Kelola identitas toko Anda tanpa mengubah data akun yang dipakai untuk autentikasi.
        </p>
      </div>

      <div className="mt-10">
        <div className="rounded-[8px] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.07)] sm:p-8">
          <div
            className={`mb-6 rounded-[8px] border px-4 py-4 ${
              isProfileComplete
                ? 'border-[#d9efdf] bg-[#f3fff6]'
                : 'border-[#f2e4d7] bg-[#fff8f2]'
            }`}
          >
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[#b68352]">
              Status kelengkapan
            </p>
            <p className="mt-2 text-sm font-semibold text-[#2c2c2c]">
              {isProfileComplete
                ? 'Profil bisnis Anda sudah lengkap dan semua fitur sudah aktif.'
                : `Lengkapi ${missingProfileFields.length} data wajib agar semua fitur NOPI bisa digunakan.`}
            </p>
            {!isProfileComplete ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {missingProfileFields.map((field) => (
                  <span
                    key={field.key}
                    className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#7a5a39] ring-1 ring-[#f1dcc9]"
                  >
                    {field.label}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div className="mb-6 rounded-[8px] border border-[#f2e4d7] bg-[#fff8f2] px-4 py-4">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[#b68352]">Ringkasan bisnis</p>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-[0.78rem] font-medium text-[#9d9d9d]">Nama toko aktif</p>
                <p className="mt-1 font-semibold text-[#2c2c2c]">{businessProfile.displayBusinessName}</p>
              </div>
              <div>
                <p className="text-[0.78rem] font-medium text-[#9d9d9d]">Email terdaftar</p>
                <p className="mt-1 break-all font-semibold text-[#2c2c2c]">{currentUser?.email || '-'}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[#9d9d9d]">
            <div className="h-6 w-1 rounded-[8px] bg-[#ff9735]" />
            <h2 className="text-2xl font-medium tracking-[-0.04em] sm:text-[1.9rem]">Identitas Bisnis</h2>
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <div className="mb-3 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center sm:gap-4">
                <label className="block text-sm font-medium text-[#2c2c2c]">Foto Toko / Logo</label>
                <StatusBadge filled={fieldStatus(storeLogo)} />
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {storeLogo ? (
                  <img
                    src={storeLogo}
                    alt={`Preview logo ${storeName || businessProfile.displayBusinessName}`}
                    className="h-20 w-20 rounded-[8px] object-cover ring-4 ring-[#fff1e1] sm:h-24 sm:w-24"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-[8px] bg-[#fff1e1] text-xl font-semibold text-[#ea8327] sm:h-24 sm:w-24 sm:text-2xl">
                    {(storeName || businessProfile.displayBusinessName)?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}

                <label className="inline-flex w-full cursor-pointer items-center justify-center rounded-[8px] bg-[#fff1e1] px-5 py-3 text-sm font-semibold text-[#ea8327] transition hover:bg-[#ffe6ca] sm:w-auto">
                  Pilih Logo
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
              <select
                value={businessCategory}
                onChange={(e) => setBusinessCategory(e.target.value)}
                className="w-full appearance-none rounded-[8px] border border-transparent bg-[#fff1e1] px-5 py-4 text-[#2c2c2c] outline-none transition focus:border-[#f3c18d]"
              >
                <option value="">Pilih kategori bisnis</option>
                {businessCategoryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
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

            <div>
              <div className="mb-2 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center sm:gap-4">
                <label className="block text-sm font-medium text-[#2c2c2c]">Nomor Telefon</label>
                <StatusBadge filled={fieldStatus(phoneNumber)} />
              </div>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Contoh: 0812xxxxxxx"
                className="w-full rounded-[8px] border border-transparent bg-[#fff1e1] px-5 py-4 text-[#2c2c2c] outline-none transition focus:border-[#f3c18d]"
              />
            </div>

            <div>
              <div className="mb-2 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center sm:gap-4">
                <label className="block text-sm font-medium text-[#2c2c2c]">Email Terdaftar</label>
                <StatusBadge filled={fieldStatus(businessProfile.registeredEmail)} />
              </div>
              <input
                type="email"
                value={businessProfile.registeredEmail}
                readOnly
                className="w-full cursor-not-allowed rounded-[8px] border border-[#e6ddd2] bg-[#f8f4ef] px-5 py-4 text-[#7b7b7b] outline-none"
              />
              <p className="mt-2 text-[0.8rem] text-[#9d9d9d]">
                Email terhubung ke akun login dan tidak dapat diubah dari halaman ini.
              </p>
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
          {profilePreview.isComplete ? 'SIMPAN PERUBAHAN' : 'SIMPAN & AKTIFKAN FITUR'}
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