"""
Security helpers: API key authentication and rate limiting.
"""
import os
from fastapi import Header, HTTPException, Request
from slowapi import Limiter
from slowapi.util import get_remote_address

# Rate limiter - 60 requests/minute per IP for search endpoints
limiter = Limiter(key_func=get_remote_address)

# Allowed MeiliSearch filter operators (prevents injection)
ALLOWED_OPERATORS = frozenset({"CONTAINS", "=", "!=", ">", ">=", "<", "<="})

# Max limit and offset for pagination
MAX_LIMIT = 100
MAX_OFFSET = 10000


def verify_api_key(x_api_key: str | None = Header(None, alias="X-API-Key")) -> None:
    """
    Verify X-API-Key header for protected endpoints (/ingest, /reset, PATCH /resource).
    Raises 401 if key is missing or invalid. Raises 503 if INGEST_API_KEY is not configured.
    """
    expected = os.getenv("INGEST_API_KEY")
    if not expected:
        raise HTTPException(
            status_code=503,
            detail="Server misconfigured: INGEST_API_KEY environment variable is not set",
        )
    if not x_api_key or x_api_key != expected:
        raise HTTPException(status_code=401, detail="Invalid or missing API key")


def clamp_limit(value: int, default: int = 20) -> int:
    """Clamp limit to [1, MAX_LIMIT]."""
    if value < 1:
        return default
    return min(value, MAX_LIMIT)


def clamp_offset(value: int) -> int:
    """Clamp offset to [0, MAX_OFFSET]."""
    if value < 0:
        return 0
    return min(value, MAX_OFFSET)


def validate_operator(value: str) -> str:
    """Validate operator against allowlist. Returns value if valid, else raises 400."""
    upper = value.upper()
    if upper not in ALLOWED_OPERATORS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid operator: {value}. Allowed: {', '.join(sorted(ALLOWED_OPERATORS))}",
        )
    return upper
