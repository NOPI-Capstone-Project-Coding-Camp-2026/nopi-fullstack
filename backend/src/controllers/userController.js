import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const updateProfile = async (req, res) => {
  try {
    // req.user didapat dari authMiddleware yang memverifikasi token JWT
    const userId = req.user.userId; 
    const { profileImage, businessName, businessCategory, businessAddress, phoneNumber } = req.body;

    // Update data user di database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        profileImage,
        businessName,
        businessCategory,
        businessAddress,
        phoneNumber, 
      },
    });

    // Singkirkan password sebelum mengirim data kembali ke frontend
    const { password, ...safeUserData } = updatedUser;

    res.status(200).json({ 
      message: "Profil bisnis berhasil diperbarui!", 
      data: safeUserData 
    });
  } catch (error) {
    console.log("🚨 ERROR UPDATE PROFILE:", error);
    res.status(500).json({ message: "Terjadi kesalahan server saat memperbarui profil." });
  }
};