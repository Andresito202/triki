@echo off
cd /d E:\todo\Proyectos\fincara-z-creator-main\triki3d-multiplayer
start "Servidor Triki 3100" cmd /k "cd /d E:\todo\Proyectos\fincara-z-creator-main\triki3d-multiplayer && set PORT=3100 && \"C:\Program Files\nodejs\node.exe\" server.js"
timeout /t 2 /nobreak >nul
start "" http://127.0.0.1:3100
