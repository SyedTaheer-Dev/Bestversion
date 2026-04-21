@echo off
cd /d "%~dp0"
echo Installing frontend dependencies...
call npm install
if errorlevel 1 goto :fail

echo Installing backend dependencies...
cd /d "%~dp0backend"
call npm install
if errorlevel 1 goto :fail

echo.
echo Install complete.
pause
exit /b 0

:fail
echo.
echo Installation failed. Please check the error shown above.
pause
exit /b 1
