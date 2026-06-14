# 📊 Draft Struktur Slide Presentasi (Sesuai Rubrik Penilaian)

Berikut adalah rancangan halaman per halaman (*slide*) untuk presentasi PowerPoint kamu. Rancangan ini dijamin akan menutupi **100% kriteria rubrik dosen** agar kelompokmu mendapat nilai maksimal (60/60 untuk Demo).

---

## 1. Slide Judul
*   **Isi:** Judul Aplikasi ("TeamUp: Platform Rekrutmen Proyek & Lomba Mahasiswa")
*   **Visual:** Logo TeamUp (bisa ambil *screenshot* dari web) dan Nama Anggota Kelompok.

## 2. Pemahaman Permasalahan (Memenuhi Kriteria No. 1 - Bobot 5)
*   **Judul Slide:** Latar Belakang & Kebutuhan Sistem
*   **Isi:** 
    *   **Masalah:** Sulitnya mencari anggota tim yang memiliki *skill* spesifik untuk lomba/proyek kampus secara cepat.
    *   **Solusi (Kebutuhan Sistem):** Sistem *database* yang mampu mencatat riwayat keahlian (skills), portofolio, dan merekam lamaran secara otomatis.
*   **Tips Presentasi:** Jelaskan dengan percaya diri bahwa *database* kalian didesain khusus untuk menyelesaikan masalah *matchmaking* tim.

## 3. Desain Basis Data (Memenuhi Kriteria No. 2 - Bobot 15)
*   **Judul Slide:** Entity Relationship Diagram (ERD) & Relasi
*   **Isi:**
    *   Masukkan gambar **ERD** kalian di sini.
    *   Berikan *bullet points* untuk menyoroti relasi penting:
        *   `users` ke `recruitment_posts` (1 to Many).
        *   Relasi *Many-to-Many* pada `user_skills` (menjembatani User dan Skill) dan `position_skills`.
*   **Tips Presentasi:** Dosen sangat memperhatikan apakah tabel penghubung (*bridge table*) seperti `user_skills` dibuat dengan benar. Tekankan bagian itu.

## 4. Implementasi & Kualitas Data (Memenuhi Kriteria No. 3 - Bobot 5)
*   **Judul Slide:** Implementasi Data Dummy
*   **Isi:**
    *   Sebutkan bahwa *database* telah diisi dengan **lebih dari 50 data dummy realistis**.
    *   Masukkan *Screenshot* tampilan tabel `users` dan `recruitment_posts` dari phpMyAdmin yang terlihat penuh dengan data (bukan tulisan "test1" atau "asd", melainkan nama dan email sungguhan).

## 5. Query SQL (Memenuhi Kriteria No. 4 - Bobot 10)
*   **Judul Slide:** Query Lanjut (JOIN, Subquery, Grouping)
*   **Isi:**
    *   Tampilkan cuplikan kode dari `database_queries.sql`.
    *   *Screenshot 1:* Query menggunakan `JOIN` ganda (misal: Menampilkan pelamar beserta keahliannya).
    *   *Screenshot 2:* Query menggunakan agregasi (misal: Menghitung total pelamar di setiap departemen).
*   **Tips Presentasi:** Jangan cuma menaruh kode, tapi taruh *screenshot* hasil tabel outputnya juga di sebelah kodenya.

## 6. Trigger (Memenuhi Kriteria No. 5 - Bobot 8)
*   **Judul Slide:** Otomatisasi dengan Trigger
*   **Isi:**
    *   Sebutkan 2 fitur unggulan kalian:
        1.  **Pencegah Spam:** `trg_cegah_spam_daftar` (Menolak pelamar yang mencoba melamar 2 kali di posisi yang sama).
        2.  **Penutupan Otomatis:** `trg_tutup_posisi_otomatis` (Mengubah status posisi menjadi 'Tutup' ketika jumlah pelamar yang 'Diterima' sudah mencapai kuota maksimal).
    *   Masukkan *screenshot* kode *Trigger* dan bukti penolakan *error* (bisa dipancing dengan melamar 2x di phpMyAdmin).

## 7. Function dan Stored Procedure (Memenuhi Kriteria No. 6 - Bobot 7)
*   **Judul Slide:** Logika Bisnis dengan Routine
*   **Isi:**
    *   **Function:** `fn_sisa_kuota(p_id_pos)` -> Jelaskan bahwa fungsi ini secara *real-time* menghitung sisa kursi lowongan. Tampilkan *screenshot* eksekusi phpMyAdmin yang tadi kamu buat!
    *   **Stored Procedure:** `sp_terima_pelamar` -> Jelaskan prosedur ini mengurus penerimaan pelamar sekaligus menembak notifikasi secara transaksional (*ACID compliance*).

## 8. Evaluasi Kinerja SQL (Memenuhi Kriteria No. 7 - Bobot 7)
*   **Judul Slide:** Evaluasi Kinerja (Indexing)
*   **Isi:**
    *   Tampilkan perbandingan performa menggunakan perintah `EXPLAIN`.
    *   **Sebelum Index:** Tunjukkan *screenshot* `EXPLAIN` (di phpMyAdmin) yang menunjukkan tipe pencarian `ALL` (lambat karena mengecek semua baris).
    *   **Sesudah Index:** Tunjukkan pembuatan `CREATE INDEX idx_users_departemen` dan *screenshot* `EXPLAIN` yang berubah menjadi tipe pencarian `ref` atau `range` (sangat cepat).
*   **Catatan:** Semua *query* pengujian ini sudah saya siapkan lengkap di dalam file `database_optimization.sql`.

## 9. Demo Aplikasi (Memenuhi Kriteria No. 8 - Bobot 3)
*   **Judul Slide:** Live Demo: TeamUp Web App
*   **Isi:** 
    *   Hanya tuliskan "Waktunya Live Demo!" di slide ini.
    *   Keluarkan *browser*-mu dan buka `http://localhost:3000`.
    *   Tunjukkan bagaimana data dari *database* (seperti daftar lowongan) terhubung langsung dengan antarmuka (UI) web yang indah.
*   **Tips Presentasi:** Penguasaan materi akan terlihat saat kamu menjelaskan bahwa "Website ini menarik data secara *live* dari MySQL menggunakan *Golang API*." Ini akan menjadi nilai *plus* (*wow factor*) yang memukau dosen.
