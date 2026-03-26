FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Instalar dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar todo el código, incluyendo scripts/run.sh
COPY . .

# Limpiar posibles CRLF y dar permisos de ejecución al script
RUN sed -i 's/\r$//' scripts/run.sh && chmod +x scripts/run.sh

EXPOSE 8000

CMD ["./scripts/run.sh"]
