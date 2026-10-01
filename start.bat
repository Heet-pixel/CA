@echo off
cd /d "%~dp0"
echo.
echo  Website : http://localhost:3000
echo.
where npx >nul 2>nul
if %errorlevel%==0 (
  start "" http://localhost:3000
  npx --yes serve . -l 3000 --no-clipboard
  goto end
)
where python >nul 2>nul
if %errorlevel%==0 (
  start "" http://localhost:3000
  python -m http.server 3000
  goto end
)
echo Please install Node.js (nodejs.org) or Python first.
:end
pause
