import sys
import os

# Добавляем путь к проекту в PYTHONPATH
path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if path not in sys.path:
    sys.path.append(path)

from backend.main import app

# Для PythonAnywhere
application = app 