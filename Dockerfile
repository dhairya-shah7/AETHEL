FROM python:3.11-slim

WORKDIR /app

# Install system dependencies & python requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source
COPY verde_cloud/ ./verde_cloud/

# Hugging Face Spaces default port is 7860
ENV PORT=7860
EXPOSE 7860

CMD ["sh", "-c", "uvicorn verde_cloud.server:app --host 0.0.0.0 --port ${PORT:-7860}"]
