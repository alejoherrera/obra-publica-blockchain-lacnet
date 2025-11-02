@echo off
echo ========================================
echo Obra Publica Blockchain - Inicio Rapido
echo ========================================
echo.

echo [1/3] Verificando WSL2...
wsl --status
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: WSL2 no esta instalado.
    echo Por favor ejecuta: wsl --install
    echo Luego reinicia tu PC.
    pause
    exit /b 1
)

echo.
echo [2/3] Verificando Docker...
docker --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Docker no esta instalado o no esta corriendo.
    echo Instala Docker Desktop y asegurate de que este corriendo.
    pause
    exit /b 1
)

echo.
echo [3/3] Verificando nodo blockchain...
curl -s -X POST --data "{\"jsonrpc\":\"2.0\",\"method\":\"eth_blockNumber\",\"params\":[],\"id\":1}" http://localhost:4545 >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ADVERTENCIA: El nodo blockchain no esta respondiendo en http://localhost:4545
    echo.
    echo Opciones:
    echo 1. Si no has levantado el nodo aun, sigue las instrucciones en INSTALACION.md
    echo 2. Si ya lo levantaste, espera 1-2 minutos a que inicie completamente
    echo.
    pause
)

echo.
echo ========================================
echo Sistema listo! Abriendo servicios...
echo ========================================
echo.

echo Abriendo API en http://localhost:3000...
start cmd /k "cd /d %~dp0api && npm start"

timeout /t 3 /nobreak >nul

echo Abriendo Frontend en http://localhost:8080...
start cmd /k "cd /d %~dp0frontend && npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo Servicios iniciados!
echo ========================================
echo.
echo API:      http://localhost:3000
echo Frontend: http://localhost:8080
echo.
echo Abriendo navegador...
timeout /t 2 /nobreak >nul
start http://localhost:8080

echo.
echo Presiona cualquier tecla para cerrar esta ventana...
pause >nul
