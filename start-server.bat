@echo off
echo Starting PHP built-in server...
start /B php -S localhost:9000 -t public

echo Starting Caddy...
start /B caddy.exe run

echo Servers started! Access your site at http://localhost:8000
echo Press Ctrl+C to stop the servers 