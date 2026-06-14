DELIMITER $$

-- ==========================================
-- FUNCTIONS
-- ==========================================

-- 1. Cek jumlah pelamar posisi
DROP FUNCTION IF EXISTS fn_jumlah_pelamar$$
CREATE FUNCTION fn_jumlah_pelamar(p_id_pos INT) RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE v_jumlah INT;
    SELECT COUNT(*) INTO v_jumlah FROM applications WHERE id_pos = p_id_pos;
    RETURN v_jumlah;
END$$

-- 2. Cek sisa kuota posisi
DROP FUNCTION IF EXISTS fn_sisa_kuota$$
CREATE FUNCTION fn_sisa_kuota(p_id_pos INT) RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE v_kuota INT;
    DECLARE v_diterima INT;
    
    SELECT kuota INTO v_kuota FROM positions WHERE id_pos = p_id_pos;
    SELECT COUNT(*) INTO v_diterima FROM applications WHERE id_pos = p_id_pos AND status = 'Diterima';
    
    RETURN v_kuota - v_diterima;
END$$

-- 3. Cek posisi tersedia atau penuh
DROP FUNCTION IF EXISTS fn_status_posisi$$
CREATE FUNCTION fn_status_posisi(p_id_pos INT) RETURNS VARCHAR(20)
DETERMINISTIC
BEGIN
    DECLARE v_sisa INT;
    SET v_sisa = fn_sisa_kuota(p_id_pos);
    
    IF v_sisa > 0 THEN
        RETURN 'Tersedia';
    ELSE
        RETURN 'Penuh';
    END IF;
END$$

-- 4. Cek jumlah lamaran user
DROP FUNCTION IF EXISTS fn_jumlah_lamaran_user$$
CREATE FUNCTION fn_jumlah_lamaran_user(p_id_user INT) RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE v_jumlah INT;
    SELECT COUNT(*) INTO v_jumlah FROM applications WHERE id_user = p_id_user;
    RETURN v_jumlah;
END$$

-- ==========================================
-- PROCEDURES
-- ==========================================

-- 1. Create recruitment post
DROP PROCEDURE IF EXISTS sp_create_post$$
CREATE PROCEDURE sp_create_post(
    IN p_id_user INT, 
    IN p_judul VARCHAR(255), 
    IN p_deskripsi TEXT, 
    IN p_tgl_tutup DATETIME
)
BEGIN
    INSERT INTO recruitment_posts (id_user, judul, deskripsi, tgl_tutup)
    VALUES (p_id_user, p_judul, p_deskripsi, p_tgl_tutup);
END$$

-- 2. Accept application
DROP PROCEDURE IF EXISTS sp_accept_application$$
CREATE PROCEDURE sp_accept_application(IN p_id_app INT)
BEGIN
    UPDATE applications SET status = 'Diterima' WHERE id_app = p_id_app;
END$$

-- 3. Reject application
DROP PROCEDURE IF EXISTS sp_reject_application$$
CREATE PROCEDURE sp_reject_application(IN p_id_app INT)
BEGIN
    UPDATE applications SET status = 'Ditolak' WHERE id_app = p_id_app;
END$$

-- 4. Add User Skill
DROP PROCEDURE IF EXISTS sp_add_user_skill$$
CREATE PROCEDURE sp_add_user_skill(IN p_id_user INT, IN p_id_skill INT)
BEGIN
    -- Cek jika belum ada agar tidak error PK
    IF NOT EXISTS (SELECT 1 FROM user_skills WHERE id_user = p_id_user AND id_skill = p_id_skill) THEN
        INSERT INTO user_skills (id_user, id_skill) VALUES (p_id_user, p_id_skill);
    END IF;
END$$

-- 5. Remove User Skill
DROP PROCEDURE IF EXISTS sp_remove_user_skill$$
CREATE PROCEDURE sp_remove_user_skill(IN p_id_user INT, IN p_id_skill INT)
BEGIN
    DELETE FROM user_skills WHERE id_user = p_id_user AND id_skill = p_id_skill;
END$$

-- ==========================================
-- TRIGGERS
-- ==========================================

-- 1. Cek email ITS sebelum INSERT user
DROP TRIGGER IF EXISTS trg_cek_email_its$$
CREATE TRIGGER trg_cek_email_its
BEFORE INSERT ON users
FOR EACH ROW
BEGIN
    IF NEW.email NOT LIKE '%@student.its.ac.id' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Email harus menggunakan domain @student.its.ac.id';
    END IF;
END$$

-- 2. Cegah SPAM / Double daftar di posisi yang sama
DROP TRIGGER IF EXISTS trg_cegah_double_daftar$$
CREATE TRIGGER trg_cegah_double_daftar
BEFORE INSERT ON applications
FOR EACH ROW
BEGIN
    IF EXISTS (SELECT 1 FROM applications WHERE id_user = NEW.id_user AND id_pos = NEW.id_pos) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Anda sudah mendaftar di posisi ini sebelumnya.';
    END IF;
END$$

-- 3. Tolak lamaran jika posisi sudah penuh atau tutup
DROP TRIGGER IF EXISTS trg_tolak_lamaran_tutup$$
CREATE TRIGGER trg_tolak_lamaran_tutup
BEFORE INSERT ON applications
FOR EACH ROW
BEGIN
    DECLARE v_status_pos VARCHAR(50);
    DECLARE v_sisa_kuota INT;
    
    SELECT status INTO v_status_pos FROM positions WHERE id_pos = NEW.id_pos;
    -- Memanfaatkan fungsi yang sudah dibuat sebelumnya
    SET v_sisa_kuota = fn_sisa_kuota(NEW.id_pos);
    
    IF v_status_pos = 'Tutup' OR v_sisa_kuota <= 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Pendaftaran ditolak, posisi ini sudah penuh atau ditutup.';
    END IF;
END$$

-- 4. Auto tutup posisi jika kuota penuh saat menerima pelamar
DROP TRIGGER IF EXISTS trg_tutup_posisi_otomatis$$
CREATE TRIGGER trg_tutup_posisi_otomatis
AFTER UPDATE ON applications
FOR EACH ROW
BEGIN
    DECLARE v_sisa_kuota INT;
    
    IF NEW.status = 'Diterima' AND OLD.status != 'Diterima' THEN
        SET v_sisa_kuota = fn_sisa_kuota(NEW.id_pos);
        IF v_sisa_kuota <= 0 THEN
            UPDATE positions SET status = 'Tutup' WHERE id_pos = NEW.id_pos;
        END IF;
    END IF;
END$$

-- 5. (IDE TAMBAHAN) Notifikasi otomatis ke pembuat post saat ada pelamar baru
DROP TRIGGER IF EXISTS trg_notif_lamaran_baru$$
CREATE TRIGGER trg_notif_lamaran_baru
AFTER INSERT ON applications
FOR EACH ROW
BEGIN
    DECLARE v_id_pembuat INT;
    DECLARE v_nama_pelamar VARCHAR(255);
    DECLARE v_nama_posisi VARCHAR(255);
    
    -- Ambil id pembuat postingan
    SELECT p.id_user INTO v_id_pembuat 
    FROM positions pos 
    JOIN recruitment_posts p ON pos.id_post = p.id_post 
    WHERE pos.id_pos = NEW.id_pos;
    
    -- Ambil nama pelamar dan posisi
    SELECT nama INTO v_nama_pelamar FROM users WHERE id_user = NEW.id_user;
    SELECT nama_pos INTO v_nama_posisi FROM positions WHERE id_pos = NEW.id_pos;
    
    INSERT INTO notifikasi (id_user, judul, pesan, kategori, id_terkait)
    VALUES (v_id_pembuat, 'Pendaftar Baru', CONCAT(v_nama_pelamar, ' telah mendaftar untuk posisi ', v_nama_posisi, '.'), 'pendaftaran', NEW.id_app);
END$$

-- 6. (IDE TAMBAHAN) Notifikasi otomatis ke pelamar saat status lamaran diubah (Diterima/Ditolak)
DROP TRIGGER IF EXISTS trg_notif_status_lamaran$$
CREATE TRIGGER trg_notif_status_lamaran
AFTER UPDATE ON applications
FOR EACH ROW
BEGIN
    DECLARE v_nama_posisi VARCHAR(255);
    SELECT nama_pos INTO v_nama_posisi FROM positions WHERE id_pos = NEW.id_pos;

    IF NEW.status = 'Diterima' AND OLD.status != 'Diterima' THEN
        INSERT INTO notifikasi (id_user, judul, pesan, kategori, id_terkait)
        VALUES (NEW.id_user, 'Lamaran Diterima 🎉', CONCAT('Selamat! Lamaranmu untuk posisi ', v_nama_posisi, ' telah diterima.'), 'lamaran', NEW.id_app);
    ELSEIF NEW.status = 'Ditolak' AND OLD.status != 'Ditolak' THEN
        INSERT INTO notifikasi (id_user, judul, pesan, kategori, id_terkait)
        VALUES (NEW.id_user, 'Lamaran Ditolak', CONCAT('Maaf, lamaranmu untuk posisi ', v_nama_posisi, ' belum bisa kami terima.'), 'lamaran', NEW.id_app);
    END IF;
END$$

DELIMITER ;
