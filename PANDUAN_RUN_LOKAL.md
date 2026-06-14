# 🚀 Panduan Menjalankan TeamUp (Localhost)

Panduan ini dibuat agar kamu bisa menjalankan aplikasi **TeamUp** (Frontend Next.js + Backend Golang + Database MySQL) di komputer atau laptopmu sendiri secara lokal.

---

## 🛠️ Persyaratan Sistem (Prerequisites)
Pastikan laptop kamu sudah terpasang 3 aplikasi wajib ini:
1. **XAMPP** (Atau MySQL server lainnya) - Untuk menjalankan Database.
2. **Go (Golang)** - Minimal versi 1.20+ untuk menjalankan Backend API.
3. **Node.js** - Minimal versi 18+ untuk menjalankan Frontend Next.js.

---

## 📂 Langkah 1: Siapkan Database (MySQL)
Karena ini adalah aplikasi berbasis database, kita harus menyuntikkan struktur tabel dan data *dummy* ke komputermu terlebih dahulu.

1. Buka aplikasi **XAMPP Control Panel**, lalu klik **Start** pada bagian **MySQL** dan **Apache**.
2. Buka browser, masuk ke: `http://localhost/phpmyadmin/`
3. Klik tombol **New** di menu sebelah kiri, lalu buat *database* baru dengan nama: **`teamup_db`** (atau sesuaikan dengan file `.env`). *Catatan: Jika memakai default dari Parel, nama databasenya adalah `teamup` atau `teamup_db`.*
4. Klik database yang baru saja dibuat tersebut.
5. Klik tab **Import** (Impor) di menu bagian atas.
6. Klik **Choose File**, arahkan ke folder proyek ini, lalu pilih file **`database_seed.sql`**. Gulir ke bawah dan klik **Import/Go**. (Ini akan memasukkan tabel dan data *dummy* pengguna).
7. Ulangi langkah 5 & 6, namun kali ini pilih file **`database_routines.sql`**. (Ini akan memasukkan sistem *Trigger* dan fungsi otomatis).

---

## ⚙️ Langkah 2: Konfigurasi Frontend
Secara *default*, kunci konfigurasi rahasia (.env) tidak ikut terunggah ke GitHub demi keamanan. Jadi kamu harus membuatnya secara manual.

1. Buka folder `TeamUp/frontend`.
2. Buat sebuah file baru bernama **`.env.local`** (ingat, pakai titik di depannya).
3. Isi file tersebut dengan 1 baris kode ini:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080/api
   ```
4. Simpan file tersebut.

---

## 🚀 Langkah 3: Jalankan Aplikasi (Cara Instan)
Jika kamu menggunakan **Windows**, cara menjalankan aplikasinya sangat mudah karena sudah disiapkan *Script* otomatis:

1. Buka folder utama `TeamUp`.
2. Klik ganda (*Double-click*) file bernama **`JALANKAN_APLIKASI.bat`**.
3. Akan muncul 2 jendela hitam (Terminal). Satu untuk menjalankan *Backend* Golang, satu lagi untuk mengunduh modul dan menjalankan *Frontend* Next.js.
4. **Biarkan kedua jendela tersebut tetap terbuka.** Tunggu sekitar 10 - 20 detik.
5. Buka browser, lalu kunjungi: 👉 **`http://localhost:3000`**

### 💻 Menjalankan Manual (Jika tidak pakai Windows / BAT gagal)
Jika file `.bat` tidak bisa jalan, kamu bisa menyalakannya secara manual:
- **Terminal 1 (Backend):** Buka folder utama `TeamUp`, ketik `go run main.go`
- **Terminal 2 (Frontend):** Buka folder `TeamUp/frontend`, ketik `npm install` lalu `npm run dev`

---

## 🔑 Cara Login dengan Akun Dummy
Semua akun *dummy* yang ada di dalam database telah disiapkan dengan kata sandi yang sama agar kamu mudah melakukan *testing*.

*   **Email Percobaan:** `andi.firmansyah@student.its.ac.id` (atau email apapun berakhiran @student.its.ac.id yang ada di *database*).
*   **Password:** `password123`

Selamat mengeksplorasi aplikasi TeamUp! 🎉
