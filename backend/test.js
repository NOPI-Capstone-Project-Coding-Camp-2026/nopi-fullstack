// Gunakan 'import' alih-alih 'require'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Sedang mencoba menghubungkan ke Supabase...')
  
  // 1. Buat User dummy
  // Tip: Gunakan email yang berbeda kalau kamu running berkali-kali karena email itu @unique
  const newUser = await prisma.user.create({
    data: {
      email: `owner_${Date.now()}@nopi.com`, 
      name: 'Dewi Ainun',
    },
  })
  console.log('✅ User Berhasil Dibuat:', newUser)

  // 2. Buat Nota dummy untuk user tersebut
  const newNota = await prisma.nota.create({
    data: {
      toko: 'Toko Maju Jaya',
      totalHarga: 150000,
      userId: newUser.id
    },
  })
  console.log('✅ Nota Berhasil Dibuat:', newNota)
}

main()
  .catch((e) => {
    console.error('❌ Terjadi kesalahan:', e.message)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })