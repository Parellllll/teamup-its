-- ==========================================
-- STUDI KASUS QUERY SQL (TEAMUP)
-- ==========================================

-- Studi Kasus 1: Applicant Tracking (Dashboard Evaluasi Pelamar)
-- Studi Kasus Bisnis: Sistem HR / Inisiator proyek membutuhkan tampilan komprehensif dari seluruh pelamar 
-- pada sebuah Recruitment Post. Sistem harus mampu menyajikan nama pelamar, departemen, peran yang dilamar, 
-- merangkum seluruh keahlian (skill) pelamar ke dalam satu baris teks, serta menghitung total portofolio 
-- yang dimiliki tiap pelamar untuk mempermudah proses penyaringan kandidat.
SELECT 
    a.id_app,
    u.nama AS nama_pelamar,
    u.departemen,
    p.nama_pos AS melamar_sebagai,
    a.tgl_daftar,
    a.status,
    (SELECT COUNT(*) FROM portofolios pf WHERE pf.id_user = u.id_user) AS jumlah_portofolio,
    GROUP_CONCAT(DISTINCT s.nama_skill SEPARATOR ', ') AS keahlian
FROM applications a
JOIN users u ON a.id_user = u.id_user
JOIN positions p ON a.id_pos = p.id_pos
LEFT JOIN user_skills us ON u.id_user = us.id_user
LEFT JOIN skills s ON us.id_skill = s.id_skill
WHERE p.id_post = 1 -- (Contoh: melihat pelamar untuk Recruitment Post ID 1)
GROUP BY a.id_app, u.id_user, p.id_pos
ORDER BY a.tgl_daftar DESC;


-- Studi Kasus 2: Sistem Rekomendasi (Skill Matching Algorithm)
-- Studi Kasus Bisnis: Sistem rekrutmen memerlukan fitur otomatisasi untuk memberikan rekomendasi kandidat 
-- terbaik bagi sebuah posisi spesifik (misal: Frontend Developer). Sistem harus mampu menyeleksi dan mengurutkan 
-- 5 kandidat teratas berdasarkan jumlah kecocokan mutlak antara keahlian yang dimiliki kandidat 
-- dengan keahlian yang disyaratkan oleh posisi tersebut.
SELECT 
    u.id_user,
    u.nama,
    u.departemen,
    u.angkatan,
    COUNT(us.id_skill) AS jumlah_skill_cocok,
    GROUP_CONCAT(s.nama_skill SEPARATOR ', ') AS skill_yang_cocok
FROM users u
JOIN user_skills us ON u.id_user = us.id_user
JOIN skills s ON us.id_skill = s.id_skill
JOIN position_skills ps ON us.id_skill = ps.id_skill
WHERE ps.id_pos = 5 -- (Contoh: mencari kandidat untuk posisi ID 5)
GROUP BY u.id_user
ORDER BY jumlah_skill_cocok DESC
LIMIT 5;


-- Studi Kasus 3: Statistik Keaktifan Tingkat Departemen
-- Studi Kasus Bisnis: Direktorat Kemahasiswaan memerlukan laporan analitik terkait tingkat partisipasi 
-- mahasiswa dari setiap program studi (Departemen). Sistem harus mengkalkulasi total lamaran yang dikirim, 
-- jumlah lamaran yang berstatus 'Diterima' maupun 'Ditolak', serta menghitung persentase keberhasilan 
-- (Success Rate) secara agregat untuk keperluan evaluasi kampus.
SELECT 
    u.departemen,
    COUNT(a.id_app) AS total_lamaran_terkirim,
    SUM(CASE WHEN a.status = 'Diterima' THEN 1 ELSE 0 END) AS total_diterima,
    SUM(CASE WHEN a.status = 'Ditolak' THEN 1 ELSE 0 END) AS total_ditolak,
    CONCAT(ROUND((SUM(CASE WHEN a.status = 'Diterima' THEN 1 ELSE 0 END) / COUNT(a.id_app)) * 100, 1), '%') AS success_rate
FROM users u
LEFT JOIN applications a ON u.id_user = a.id_user
GROUP BY u.departemen
ORDER BY total_lamaran_terkirim DESC;


-- Studi Kasus 4: Riwayat Notifikasi Kontekstual
-- Studi Kasus Bisnis: Pengguna memerlukan daftar riwayat notifikasi yang informatif. Karena tabel notifikasi 
-- hanya merujuk pada ID Terkait, sistem harus mampu menelusuri data secara dinamis. Apabila notifikasi dikategorikan 
-- sebagai "lamaran" atau "pendaftaran", sistem wajib menarik data tambahan dari tabel lain untuk menampilkan 
-- nama peran (Position) dan judul proyek (Recruitment Post) secara langsung pada antarmuka pengguna.
SELECT 
    n.tgl_dibuat,
    n.judul,
    n.pesan,
    n.status_baca,
    COALESCE(p.nama_pos, '-') AS posisi_terkait,
    COALESCE(rp.judul, '-') AS project_terkait
FROM notifikasi n
LEFT JOIN applications a ON n.id_terkait = a.id_app AND n.kategori IN ('lamaran', 'pendaftaran')
LEFT JOIN positions p ON a.id_pos = p.id_pos
LEFT JOIN recruitment_posts rp ON p.id_post = rp.id_post
WHERE n.id_user = 3 -- (Contoh: Menarik riwayat notifikasi milik User ID 3)
ORDER BY n.tgl_dibuat DESC;
