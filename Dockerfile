FROM python:3.11-slim

WORKDIR /app

# Install system dependencies & python requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source
COPY verde_cloud/ ./verde_cloud/

ENV PORT=8000
EXPOSE 8000

CMD ["sh", "-c", "uvicorn verde_cloud.server:app --host 0.0.0.0 --port ${PORT:-8000}"]
