# Dockerfile
FROM python:3.12-slim

WORKDIR /app

# зависимости системы
RUN apt-get update && apt-get install -y gcc

# зависимости python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# код
COPY . .

# запуск
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]