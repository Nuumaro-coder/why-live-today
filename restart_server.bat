@echo off
chcp 65001 >nul
echo Останавливаем текущий сервер...
taskkill /F /IM python.exe /FI "WINDOWTITLE eq uvicorn*" >nul 2>&1
timeout /t 2 /nobreak >nul

echo Активируем виртуальное окружение...
call venv\Scripts\activate.bat

echo Запускаем сервер...
cd backend
start cmd /k "python -m uvicorn main:app --reload"

echo Сервер запущен! Откройте http://127.0.0.1:8000 в браузере
timeout /t 3 