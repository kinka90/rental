# Aplikasi Sewa Motor - Demo

Fitur:
- Menampilkan daftar motor dan status real-time (Firebase Realtime Database)
- Form penyewaan interaktif (estimasi harga berdasarkan jam)
- Perekaman transaksi ke `/transactions` pada Realtime Database
- Admin area dengan login (Firebase Auth) untuk melihat riwayat dan total pendapatan
- Notifikasi/konfirmasi via WhatsApp (membuka tautan wa.me)
- Export PDF sederhana (jsPDF)

Cara pakai:
1. Buat project di Firebase.
2. Aktifkan Realtime Database dan Authentication (Email/Password).
3. Ganti konfigurasi di `firebase.js` dengan kredensial Firebase-mu.
4. Siapkan struktur data contoh di Realtime Database:
{
  "motors": {
    "M001": { "name": "Honda Beat", "plate": "F 1234 AB", "status":"available" },
    "M002": { "name": "Yamaha Mio", "plate": "F 5678 CD", "status":"available" }
  }
}
5. Buka `index.html` secara lokal (atau deploy ke Vercel/GitHub Pages).
6. Untuk Admin: buka `admin.html`, buat akun admin dengan tombol 'Buat Akun (sekali)', lalu login.

Deploy:
- Push ke GitHub, lalu hubungkan repo ke Vercel (deploy otomatis).
- Atau gunakan `vercel` CLI.

Catatan:
- Untuk demo offline, beberapa fungsi (seperti penandaan transaksi selesai secara otomatis) perlu dikembangkan.
- Ganti `firebase.js` config agar aplikasi terhubung ke proyek Firebase mu.
