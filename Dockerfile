FROM python:3.13-slim

ENV PYTHONUNBUFFERED=1 PYTHONDONTWRITEBYTECODE=1 PORT=8080
WORKDIR /app

COPY owenschu/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Pre-compress the Godot web export (37MB wasm) in its own layer, copied
# in before the rest of the app. Brotli at max quality on a file this size
# is slow (multiple minutes) -- keeping this layer isolated means it's
# cached and skipped on every build that doesn't touch godot-export/,
# instead of re-running on every unrelated code change.
COPY owenschu/godot-export/ ./godot-export/
RUN python -m whitenoise.compress godot-export

COPY owenschu/ .
RUN SECRET_KEY=build-only-not-a-real-key python manage.py collectstatic --noinput

CMD exec gunicorn owenschu.wsgi:application --bind :$PORT --workers 2 --threads 8 --timeout 0
