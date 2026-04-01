FROM python:3.11-slim as builder
WORKDIR /app

RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

RUN sed -i 's/\r$//' scripts/run.sh && chmod +x scripts/run.sh

FROM python:3.11-slim as runner

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/opt/venv/bin:$PATH"

WORKDIR /app

RUN groupadd --system py_group && \
    useradd --system --gid py_group py_user 

COPY --from=builder /opt/venv /opt/venv

COPY --chown=py_user:py_group --from=builder /app /app

USER py_user

EXPOSE 8000

CMD ["./scripts/run.sh"]