@echo off
color 0D
echo ========================================================
echo   MEMBUKA JALUR INTERNET TEAMUP (BEDA WI-FI / JARAK JAUH)
echo ========================================================
echo.
echo Sedang menyiapkan 3 jendela... Mohon tunggu jangan ditutup!
echo.

:: Menjalankan Backend Golang
start "TeamUp Backend" cmd /k "echo Menjalankan Backend Golang... && go run main.go"

:: Menjalankan Frontend Next.js
start "TeamUp Frontend" cmd /k "echo Menjalankan Frontend Next.js... && cd frontend && npm run dev"

:: Menjalankan Tunnel untuk Frontend
start "Tunnel Web" cmd /k "echo Membuka jalur internet Web... && npx localtunnel --port 3000 --local-host 127.0.0.1 --subdomain teamup-web-parel"

echo Selesai dimuat! (Butuh waktu sekitar 10-15 detik untuk stabil)
echo.
echo ========================================================
echo                 CARA AKSES UNTUK DOSEN
echo ========================================================
echo Suruh dosen buka browser di HP/Laptop mereka, lalu 
echo buka *link* ini:
echo.
echo 👉 https://teamup-web-parel.loca.lt
echo.
echo Catatan: Jika saat dibuka muncul halaman peringatan "Localtunnel",
echo suruh dosen klik tombol biru "Click to Continue" saja.
echo ========================================================
pause
