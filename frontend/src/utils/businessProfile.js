const isFilled = (value) => Boolean(value && value.toString().trim() !== '');

/**
 * Validasi nomor telepon seluler Indonesia.
 *
 * Root Cause Bug sebelumnya:
 *   Hanya mengecek prefix '08' — input "08" (2 digit) dianggap valid,
 *   sehingga profile completeness gate bisa dilewati dengan data palsu.
 *
 * Fix:
 *   - Strip non-digit sebelum validasi (toleran terhadap strip/spasi)
 *   - Minimal 10 digit (misal: 081234567 → 9 digit, tidak valid)
 *   - Maksimal 13 digit (nomor ID terpanjang = 0811-xxxx-xxxx = 13 digit)
 */
export const isValidIndonesianPhoneNumber = (value) => {
  const digitsOnly = value?.toString().replace(/\D/g, '') || '';
  return digitsOnly.startsWith('08') && digitsOnly.length >= 10 && digitsOnly.length <= 13;
};

export const requiredBusinessProfileFields = [
  { key: 'storeName', label: 'Nama toko' },
  { key: 'businessCategory', label: 'Kategori bisnis' },
  { key: 'businessAddress', label: 'Lokasi/alamat' },
  { key: 'phoneNumber', label: 'Nomor telepon', validate: isValidIndonesianPhoneNumber },
  { key: 'registeredEmail', label: 'Email terdaftar' },
];

export const getBusinessProfile = (user) => {
  const storeName = user?.storeName || user?.businessName || user?.name || '';
  const businessCategory = user?.businessCategory || user?.storeCategory || '';
  const businessAddress = user?.businessAddress || user?.storeAddress || '';
  const phoneNumber =
    user?.storeContactNumber || user?.storePhone || user?.phoneNumber || user?.phone || '';
  const registeredEmail = user?.email || '';
  const storeLogo = user?.storeLogo || user?.businessLogo || user?.profileImage || '';

  return {
    storeName,
    businessCategory,
    businessAddress,
    phoneNumber,
    registeredEmail,
    storeLogo,
    displayBusinessName: storeName || 'Toko Anda',
  };
};

export const getBusinessProfileCompleteness = (user) => {
  const profile = getBusinessProfile(user);
  const missingFields = requiredBusinessProfileFields.filter(
    ({ key, validate }) => !isFilled(profile[key]) || (validate && !validate(profile[key]))
  );

  return {
    isComplete: missingFields.length === 0,
    missingFields,
    completionCount: requiredBusinessProfileFields.length - missingFields.length,
    totalRequiredFields: requiredBusinessProfileFields.length,
    profile,
  };
};
