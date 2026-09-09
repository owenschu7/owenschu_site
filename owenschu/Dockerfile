FROM python:3.13-slim

ENV PYTHONUNBUFFERED=1 PYTHONDONTWRITEBYTECODE=1 PORT=8080
WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
RUN SECRET_KEY=build-only-not-a-real-key python manage.py collectstatic --noinput

CMD exec gunicorn owenschu.wsgi:application --bind :$PORT --workers 2 --threads 8 --timeout 0
