# Why Live Today

Веб-приложение, генерирующее циничные причины жить от уставшего доктора.

## Установка на PythonAnywhere

1. Создайте новое веб-приложение на PythonAnywhere:
   - Выберите "Manual configuration"
   - Выберите Python 3.10

2. В разделе "Code":
   - Укажите путь к исходному коду: `/home/YOUR_USERNAME/why_live_today`
   - Укажите путь к WSGI файлу: `/var/www/YOUR_USERNAME_pythonanywhere_com_wsgi.py`

3. В разделе "Virtualenv":
   - Создайте новое виртуальное окружение: `/home/YOUR_USERNAME/why_live_today/venv`
   - Установите зависимости: `pip install -r requirements.txt`

4. В разделе "Static files":
   - URL: `/static/`
   - Directory: `/home/YOUR_USERNAME/why_live_today/frontend/static`

5. Нажмите "Reload" для применения изменений

## Локальная разработка

1. Создайте виртуальное окружение:
```bash
python -m venv venv
```

2. Активируйте виртуальное окружение:
```bash
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate
```

3. Установите зависимости:
```bash
pip install -r requirements.txt
```

4. Запустите сервер:
```bash
cd backend
python -m uvicorn main:app --reload
```

5. Откройте http://127.0.0.1:8000 в браузере

## Features

- Clean, minimalist black interface
- AI-generated reasons to live
- Like/Dislike system to find the perfect reason
- Save your favorite reasons

## Tech Stack

- Backend: Python (FastAPI)
- Frontend: HTML, CSS, JavaScript
- AI: OpenAI API
- Database: SQLite (for MVP)

## Project Structure

```
why_live_today/
├── backend/
│   ├── main.py
│   ├── config.py
│   └── database.py
├── frontend/
│   ├── static/
│   │   ├── css/
│   │   └── js/
│   └── templates/
├── requirements.txt
└── README.md
``` 