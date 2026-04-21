@echo off
cd /d "%~dp0"
start "Best Version Backend" cmd /k "cd /d ""%~dp0backend"" && npm run dev"
timeout /t 3 >nul
start "Best Version Frontend" cmd /k "cd /d ""%~dp0"" && npm run dev"
exit /b 0
