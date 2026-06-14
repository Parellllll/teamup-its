# TeamUp (TCollab) Platform Requirements Document

## 1. Fitur Utama Platform

Platform TeamUp (TCollab) dirancang untuk menyentralisasi proses rekrutmen tim akademik/non-akademik dengan fitur utama berikut:

- **Manajemen Portofolio & Skill**: Mahasiswa dapat membangun profil profesional mereka dengan menambahkan daftar keahlian (skills) spesifik dan tautan portofolio (karya/proyek sebelumnya).
- **Manajemen Postingan Rekrutmen (Recruitment Post)**: Pengguna dapat membuat pengumuman pencarian anggota tim yang dilengkapi dengan detail posisi spesifik (misal: Hacker, Hipster, Hustler) beserta batasan kuota untuk masing-masing posisi.
- **Sistem Pendaftaran (Apply) & Pencocokan**: Pelamar dapat mendaftar ke posisi tertentu. Sistem dilengkapi fungsi pengecekan otomatis untuk melihat persentase kecocokan (match) antara skill pelamar dengan skill yang dibutuhkan posisi tersebut (minimal 50%).
- **Menyetujui Pendaftaran Pelamar (Stand-alone)**: Fitur khusus bagi pembuat rekrutmen untuk menyeleksi, menerima, atau menolak pelamar yang masuk secara terstruktur, lengkap dengan penambahan catatan feedback.
- **Otomatisasi Sistem (Database Triggers)**: Platform dapat menutup pendaftaran secara otomatis jika kuota suatu posisi sudah terpenuhi atau jika tenggat waktu (deadline) rekrutmen sudah habis, mencegah penumpukan data yang tidak relevan.

## 2. Pengguna Platform (User Roles)

Sistem ini dirancang khusus untuk lingkungan kampus, penggunanya terbagi menjadi:

- **Mahasiswa (User Reguler)**: Bertindak dalam dua peran fleksibel:
  - **Sebagai Pelamar (Applicant)**: Mencari dan mendaftar ke tim kompetisi, hackathon, atau proyek riset lintas departemen. (Akses dibatasi hanya untuk mahasiswa aktif yang divalidasi menggunakan email domain `@its.ac.id`).
  - **Sebagai Pembuat Post (Recruiter)**: Mahasiswa yang bertindak sebagai ketua tim atau inisiator proyek yang sedang mencari rekan tambahan dengan keahlian spesifik.
- **Admin Sistem (Opsional/Pengembangan)**: Pengguna dengan hak akses tertinggi untuk mengelola master data (seperti menambahkan daftar kategori skill baru yang baku), memantau aktivitas sistem, dan menangani pelaporan penyalahgunaan platform.

## 3. Preferensi Teknologi (Tech Stack)

Pengembangan platform ini menggunakan kombinasi teknologi modern yang difokuskan pada kecepatan akses dan keandalan relasi data:

- **Backend**: Menggunakan bahasa pemrograman **Go (Golang)**. Dipilih karena performanya yang sangat cepat, ringan, dan tangguh dalam menangani banyak request bersamaan (misalnya saat terjadi lonjakan pendaftaran mendekati deadline rekrutmen).
- **Database**: Menggunakan **MySQL (RDBMS)**. Dipilih karena struktur data pelamar, skill, dan posisi sangat saling berelasi erat. MySQL terbukti solid untuk mengelola skema relasional kompleks, Stored Procedures, dan Triggers yang mengotomatisasi logika bisnis aplikasi.
- **Frontend**: Menggunakan **Next.js** (berbasis React.js). Dipilih karena mendukung pembuatan antarmuka pengguna (UI) yang reaktif, single-page application (SPA) yang mulus tanpa loading ulang halaman, dan direkomendasikan untuk platform modern dengan optimasi performa dan UI/UX (Tailwind CSS).
