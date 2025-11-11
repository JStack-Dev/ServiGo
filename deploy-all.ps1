# ==========================================
# Script de despliegue ServiGo (Full Stack)
# PowerShell version - Compatible con Windows
# ==========================================

Write-Host ""
Write-Host "--------------------------------------------"
Write-Host "SERVIGO DEPLOY - FRONTEND & BACKEND" -ForegroundColor Cyan
Write-Host "--------------------------------------------"
Write-Host ""
Write-Host "Escribe un mensaje para el commit:" -ForegroundColor Cyan
$MESSAGE = Read-Host

# ==== FRONTEND ====
Write-Host ""
Write-Host "Desplegando FRONTEND (Vercel)..." -ForegroundColor Yellow
Set-Location ./frontend
git add .
git commit -m "Frontend: $MESSAGE"
git push origin main
Set-Location ..

# ==== BACKEND ====
Write-Host ""
Write-Host "Desplegando BACKEND (Render)..." -ForegroundColor Yellow
Set-Location ./backend
git add .
git commit -m "Backend: $MESSAGE"
git push origin main
Set-Location ..

Write-Host ""
Write-Host "--------------------------------------------"
Write-Host "DEPLOY COMPLETADO CORRECTAMENTE" -ForegroundColor Green
Write-Host "--------------------------------------------"
