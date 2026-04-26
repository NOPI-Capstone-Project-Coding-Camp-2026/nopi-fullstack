# Testing Notes

Dokumen ini berisi langkah singkat untuk menjalankan pengecekan project `nopi-fullstack`.

## 1. Masuk ke root project

```bash
cd "/Users/daniswararizky/Documents/IT Project/nopi_capstone/nopi-fullstack"
```

## 2. Install dependency

Install dependency per folder karena frontend dan backend punya `package.json` masing-masing.

```bash
cd frontend
npm install

cd ../backend
npm install
```

## 3. Test frontend

Saat ini frontend belum punya script automated test seperti `vitest` atau `jest`.
Pengecekan yang tersedia adalah lint dan build.

```bash
cd "/Users/daniswararizky/Documents/IT Project/nopi_capstone/nopi-fullstack/frontend"
npm run lint
npm run build
```

Arti hasilnya:
- `npm run lint` memeriksa error style dan potensi masalah di kode React.
- `npm run build` memastikan aplikasi bisa dibundel untuk production.

Status verifikasi lokal:
- `npm run build` berhasil dijalankan.
- `npm run lint` tersedia sebagai script frontend.

## 4. Jalankan frontend untuk pengecekan manual

```bash
cd "/Users/daniswararizky/Documents/IT Project/nopi_capstone/nopi-fullstack/frontend"
npm run dev
```

Lalu buka URL Vite yang muncul di terminal, biasanya `http://localhost:5173`.

Checklist manual yang disarankan:
- Landing page tampil normal.
- Navigasi navbar dan route utama berjalan.
- Halaman login, register, forgot password, dan reset password bisa dibuka.
- Dashboard, upload, history, FAQ, dan profile page tampil tanpa error UI.
- Upload box dan preview receipt muncul sesuai harapan.

## 5. Cek backend

Backend saat ini belum memiliki script `test` otomatis juga.
Script yang tersedia di `backend/package.json` adalah:
- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run preview`

Untuk mencoba backend secara manual:

```bash
cd "/Users/daniswararizky/Documents/IT Project/nopi_capstone/nopi-fullstack/backend"
npm run dev
```

Jika backend memakai environment variable, pastikan file `.env` sudah terisi sebelum dijalankan.

## 6. Catatan penting

- Di environment pengecekan ini, `backend` gagal menjalankan `npm run lint` karena `eslint` belum tersedia saat command dijalankan. Biasanya ini selesai setelah `npm install` dijalankan di folder `backend`.
- Tidak ditemukan script `npm test` di frontend maupun backend.
- Jadi untuk saat ini, standar pengecekan project ini adalah `lint`, `build`, dan manual testing.

## 7. Rekomendasi urutan sebelum push

```bash
cd "/Users/daniswararizky/Documents/IT Project/nopi_capstone/nopi-fullstack/frontend"
npm run lint
npm run build

cd ../backend
npm install
npm run lint
```

Kalau semua aman, lanjut:

```bash
cd "/Users/daniswararizky/Documents/IT Project/nopi_capstone/nopi-fullstack"
git status
git add .
git commit -m "your message"
git push origin setup-danis
```
