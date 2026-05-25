const isFilled = (value) => Boolean(value && value.toString().trim() !== '');

export const isValidIndonesianPhoneNumber = (value) => {
  const normalizedValue = value?.toString().trim() || '';

  return normalizedValue.startsWith('08');
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
