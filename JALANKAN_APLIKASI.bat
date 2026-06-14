@echo off
color 0B
echo ========================================================
echo        MEMULAI APLIKASI TEAMUP UNTUK PRESENTASI
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
echo                 CARA AKSES UNTUK DOSEN
echo ========================================================
echo 1. Pastikan HP/Laptop Dosen terhubung ke Wi-Fi yang SAMA 
echo    dengan laptopmu (Sangat penting!).
echo.
echo 2. Suruh dosen buka browser di HP-nya, lalu ketik alamat ini:
echo    http://192.168.100.3:3000
echo.
echo Selesai! Web akan langsung terbuka di HP dosen.
echo ========================================================
pause
