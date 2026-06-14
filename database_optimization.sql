-- ==========================================
-- EVALUASI DAN OPTIMASI KINERJA SQL
-- ==========================================

-- Tujuan: Mengoptimalkan kecepatan pembacaan data (SELECT), 
-- terutama untuk studi kasus query kompleks yang menggunakan GROUP BY dan WHERE.

-- 1. Evaluasi Awal (Gunakan EXPLAIN sebelum optimasi)
-- Menjalankan EXPLAIN pada Query Statistik Departemen (Studi Kasus 3)
-- Perhatikan kolom 'type' (biasanya 'ALL') dan 'rows' (jumlah baris yang dipindai database).
EXPLAIN 
SELECT u.departemen, COUNT(a.id_app) 
FROM users u 
LEFT JOIN applications a ON u.id_user = a.id_user 
GROUP BY u.departemen;


-- 2. Optimasi (Pembuatan B-Tree Index)
-- Menambahkan index pada kolom yang sering digunakan untuk penyaringan (WHERE) 
-- atau pengelompokan (GROUP BY). (Catatan: Foreign Key sudah otomatis ter-index oleh MySQL InnoDB).

-- Index untuk mempercepat pengelompokan (GROUP BY) berdasarkan departemen
CREATE INDEX idx_users_departemen ON users(departemen);

-- Index komposit untuk mempercepat pencarian notifikasi spesifik milik user tertentu
CREATE INDEX idx_notifikasi_user_kategori ON notifikasi(id_user, kategori);

-- Index untuk mempercepat pencarian status aplikasi (misal: mencari yang 'Diterima' saja)
CREATE INDEX idx_applications_status ON applications(status);


-- 3. Evaluasi Ulang (Setelah Index Dibuat)
-- Menjalankan EXPLAIN kembali pada Query yang sama.
-- Perhatikan bahwa kolom 'type' berpotensi berubah menjadi 'index' atau 'ref', 
-- dan jumlah 'rows' yang dipindai menjadi jauh lebih efisien.
EXPLAIN 
SELECT u.departemen, COUNT(a.id_app) 
FROM users u 
LEFT JOIN applications a ON u.id_user = a.id_user 
GROUP BY u.departemen;
