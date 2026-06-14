# 🧮 Aljabar Relasional (Relational Algebra) - TeamUp

Dosen Basis Data biasanya sangat menyukai representasi matematika dari kueri SQL. Aljabar relasional adalah fondasi logis bagaimana *database* MySQL mengeksekusi perintah. 

Berikut adalah terjemahan dari 4 Studi Kasus SQL kita ke dalam bentuk Aljabar Relasional menggunakan simbol standar:
*   **π (Pi)** = *Projection* (Sama seperti `SELECT`)
*   **σ (Sigma)** = *Selection* (Sama seperti `WHERE`)
*   **⨝ (Bowtie)** = *Inner Join*
*   **⟕ (Left Bowtie)** = *Left Outer Join*
*   **γ (Gamma)** = *Aggregation / Group By*
*   **ρ (Rho)** = *Rename / AS*

---

### 📌 Studi Kasus 1: Applicant Tracking (Sistem Evaluasi Pelamar)
**Kueri SQL Asli:** Menggabungkan tabel `applications`, `users`, dan `positions` di mana `id_post = 1`.
*(Catatan: Fungsi tingkat lanjut seperti GROUP_CONCAT disederhanakan dalam aljabar).*

**Aljabar Relasional:**
> **π** <sub>id_app, nama, departemen, nama_pos, tgl_daftar, status</sub> ( **σ** <sub>id_post = 1</sub> ( applications **⨝** <sub>applications.id_user = users.id_user</sub> users **⨝** <sub>applications.id_pos = positions.id_pos</sub> positions ) )

**Cara Baca:**
Lakukan operasi *Join* pada tabel `applications`, `users`, dan `positions`. Terapkan seleksi (σ) hanya pada yang memiliki `id_post = 1`, lalu proyeksikan (π) untuk mengambil kolom spesifik.

---

### 📌 Studi Kasus 2: Sistem Rekomendasi (Skill Matching)
**Kueri SQL Asli:** Menghitung jumlah *skill* yang cocok antara pelamar dan kebutuhan posisi, diurutkan untuk 5 besar.

**Aljabar Relasional:**
> **τ** <sub>↓jumlah_skill_cocok (LIMIT 5)</sub> ( **γ** <sub>users.id_user, COUNT(skills.id_skill) → jumlah_skill_cocok</sub> ( **σ** <sub>id_pos = 5</sub> ( users **⨝** <sub>users.id_user = user_skills.id_user</sub> user_skills **⨝** <sub>user_skills.id_skill = skills.id_skill</sub> skills **⨝** <sub>user_skills.id_skill = position_skills.id_skill</sub> position_skills ) ) )

*(Simbol **τ (Tau)** melambangkan proses pengurutan (Sorting / ORDER BY).*

---

### 📌 Studi Kasus 3: Statistik Keaktifan Tingkat Departemen
**Kueri SQL Asli:** Menghitung total pelamar di tiap departemen (`LEFT JOIN` dengan `applications`).

**Aljabar Relasional:**
> **τ** <sub>↓total_lamaran_terkirim</sub> ( **γ** <sub>users.departemen, COUNT(applications.id_app) → total_lamaran_terkirim</sub> ( users **⟕** <sub>users.id_user = applications.id_user</sub> applications ) )

**Cara Baca:**
Lakukan *Left Outer Join* antara `users` dan `applications` agar pengguna yang belum melamar tetap terhitung. Kemudian lakukan pengelompokan agregasi (γ) berdasarkan departemen sambil menghitung totalnya. Terakhir, urutkan (τ).

---

### 📌 Studi Kasus 4: Riwayat Notifikasi Kontekstual
**Kueri SQL Asli:** Menggabungkan `notifikasi` dengan posisi dan postingan yang relevan menggunakan rentetan `LEFT JOIN`.

**Aljabar Relasional:**
> **π** <sub>tgl_dibuat, judul, pesan, status_baca, nama_pos, project_judul</sub> ( **σ** <sub>id_user = 3</sub> ( notifikasi **⟕** <sub>notifikasi.id_terkait = applications.id_app ∧ (kategori = 'lamaran' ∨ kategori = 'pendaftaran')</sub> applications **⟕** <sub>applications.id_pos = positions.id_pos</sub> positions **⟕** <sub>positions.id_post = recruitment_posts.id_post</sub> recruitment_posts ) )

**Cara Baca:**
Pilih (σ) notifikasi milik `id_user = 3`. Rangkaikan (*Left Join*) ke detail aplikasi lamaran yang kategorinya cocok, teruskan ke tabel posisi, lalu ke tabel *recruitment_posts*, barulah proyeksikan (π) kolom yang ingin ditampilkan.

---
**Tips Presentasi:** Jika dosenmu menanyakan dari mana rumusnya, katakan bahwa ini adalah translasi standar dari struktur *SQL Query Relational Calculus* ke *Relational Algebra* untuk mengilustrasikan "jalur eksekusi" database sebelum dieksekusi oleh mesin MySQL.

---

### 📌 Ekstra: Aljabar Relasional Kueri Internal (Pada Function)
Meskipun *Function* berisi logika prosedural, kueri *SELECT* yang ada di **dalamnya** tetap bisa diubah menjadi Aljabar Relasional seperti yang dilakukan oleh temanmu. Berikut adalah aljabarnya untuk seluruh fungsi kita yang melakukan pengambilan data (SELECT):

#### 1. Menghitung Jumlah Pelamar pada Posisi (`fn_jumlah_pelamar`)
**Kueri SQL Internal:**
`SELECT COUNT(*) INTO v_jumlah FROM applications WHERE id_pos = p_id_pos;`

**Aljabar Relasional:**
> **Hasil** = **γ** <sub>COUNT(*)</sub> ( **σ** <sub>id_pos = p_id_pos</sub> ( applications ) )

---

#### 2. Menghitung Sisa Kuota Posisi (`fn_sisa_kuota`)
**Kueri SQL Internal (Ada 2 kueri berurutan):**
`SELECT kuota INTO v_kuota FROM positions WHERE id_pos = p_id_pos;`
`SELECT COUNT(*) INTO v_diterima FROM applications WHERE id_pos = p_id_pos AND status = 'Diterima';`

**Aljabar Relasional:**
> **T1** = **π** <sub>kuota</sub> ( **σ** <sub>id_pos = p_id_pos</sub> ( positions ) )
> **T2** = **γ** <sub>COUNT(*)</sub> ( **σ** <sub>id_pos = p_id_pos ∧ status = 'Diterima'</sub> ( applications ) )
> **Hasil** = **T1** - **T2**

---

#### 3. Menghitung Jumlah Lamaran User (`fn_jumlah_lamaran_user`)
**Kueri SQL Internal:**
`SELECT COUNT(*) INTO v_jumlah FROM applications WHERE id_user = p_id_user;`

**Aljabar Relasional:**
> **Hasil** = **γ** <sub>COUNT(*)</sub> ( **σ** <sub>id_user = p_id_user</sub> ( applications ) )

*(Catatan: Fungsi ke-4 yaitu `fn_status_posisi` tidak memiliki aljabar relasional baru karena ia tidak melakukan `SELECT` ke database, melainkan hanya memanggil fungsi `fn_sisa_kuota` dan memprosesnya dengan logika `IF/ELSE`).*
