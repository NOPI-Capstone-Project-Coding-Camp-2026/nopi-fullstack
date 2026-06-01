const MOCK_USERS_KEY = 'nopi-mock-users';

const isMockAuthEnabled =
  import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_AUTH !== 'false';

const normalizeEmail = (email) => email.trim().toLowerCase();

const getStoredMockUsers = () => {
  const rawUsers = localStorage.getItem(MOCK_USERS_KEY);

  if (!rawUsers) {
    return [];
  }

  try {
    const parsedUsers = JSON.parse(rawUsers);
    return Array.isArray(parsedUsers) ? parsedUsers : [];
  } catch {
    return [];
  }
};

const saveStoredMockUsers = (users) => {
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
};

const sanitizeMockUser = (user) => {
  const { password: _PASSWORD, ...safeUser } = user;
  return safeUser;
};

const buildMockToken = (email) => `mock-token-${normalizeEmail(email)}`;

export const canUseMockAuth = () => isMockAuthEnabled;

export const findMockUserByEmail = (email) => {
  const normalizedEmail = normalizeEmail(email);
  return getStoredMockUsers().find((user) => user.email === normalizedEmail) || null;
};

export const registerMockUser = ({ storeName, email, password }) => {
  const normalizedEmail = normalizeEmail(email);
  const mockUsers = getStoredMockUsers();

  if (mockUsers.some((user) => user.email === normalizedEmail)) {
    return {
      ok: false,
      message: 'Email ini sudah digunakan pada akun testing.',
    };
  }

  const createdUser = {
    id: `mock-${Date.now()}`,
    name: storeName,
    storeName,
    businessName: storeName,
    email: normalizedEmail,
    password,
    isEmailVerified: false,
    authProvider: 'mock',
    createdAt: new Date().toISOString(),
  };

  saveStoredMockUsers([...mockUsers, createdUser]);

  return {
    ok: true,
    user: sanitizeMockUser(createdUser),
  };
};

export const verifyMockUser = (email) => {
  const normalizedEmail = normalizeEmail(email);
  const mockUsers = getStoredMockUsers();
  let verifiedUser = null;

  const updatedUsers = mockUsers.map((user) => {
    if (user.email !== normalizedEmail) {
      return user;
    }

    verifiedUser = {
      ...user,
      isEmailVerified: true,
      verifiedAt: new Date().toISOString(),
    };

    return verifiedUser;
  });

  if (!verifiedUser) {
    return {
      ok: false,
      message: 'Akun testing tidak ditemukan.',
    };
  }

  saveStoredMockUsers(updatedUsers);

  return {
    ok: true,
    user: sanitizeMockUser(verifiedUser),
  };
};

export const loginMockUser = ({ email, password }) => {
  const mockUser = findMockUserByEmail(email);

  if (!mockUser) {
    return {
      ok: false,
      reason: 'not_found',
      message: 'Akun testing tidak ditemukan.',
    };
  }

  if (mockUser.password !== password) {
    return {
      ok: false,
      reason: 'wrong_password',
      message: 'Kata sandi untuk akun testing tidak sesuai.',
    };
  }

  if (!mockUser.isEmailVerified) {
    return {
      ok: false,
      reason: 'unverified',
      message: 'Akun testing ini belum diverifikasi. Selesaikan verifikasi email terlebih dahulu.',
    };
  }

  return {
    ok: true,
    token: buildMockToken(mockUser.email),
    user: sanitizeMockUser(mockUser),
  };
};
