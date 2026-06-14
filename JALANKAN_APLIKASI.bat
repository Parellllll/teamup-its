@echo off
color 0B
echo ========================================================
echo        MEMULAI APLIKASI TEAMUP (LOCALHOST LOKAL)
echo ========================================================
echo.
echo Membuka server Database, Backend, dan Frontend...
echo.

:: Menjalankan Backend Golang di jendela baru
start "TeamUp Backend (Golang)" cmd /k "echo Menjalankan Backend (Port 8080)... && go run main.go"

:: Menjalankan Frontend Next.js di jendela baru
start "TeamUp Frontend (Next.js)" cmd /k "echo Menjalankan Frontend (Port 3000)... && cd frontend && npm run dev"

echo Server sedang dimuat di latar belakang... (Tunggu sekitar 10 detik)
echo.
echo ========================================================
echo                 CARA AKSES LOKAL
echo ========================================================
echo 1. Pastikan XAMPP (MySQL) sudah menyala.
echo 2. Buka Google Chrome atau browser apapun di laptop ini.
echo 3. Ketikkan alamat berikut di bagian atas browser:
echo.
echo    http://localhost:3000
echo.
echo Selesai! Aplikasi TeamUp akan terbuka dengan data lokalmu.
echo ========================================================
pause
