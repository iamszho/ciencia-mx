from fastapi import FastAPI, HTTPException, Request, UploadFile, File, Form, Depends
from fastapi.middleware.cors import CORSMiddleware
from meilisearch import Client
import os
import json
from contextlib import asynccontextmanager
from typing import List, Optional
from urllib.parse import unquote

from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from .facets.facets_service import router as facets_router
from .load_from_drive_streaming import main as load_drive_data
from .load_data import ensure_index_and_settings, load_data_to_meilisearch, normalize_document
from .incremental_ingest import load_and_normalize_documents
from .security import limiter, verify_api_key, clamp_limit, clamp_offset, validate_operator

# MeiliSearch client
client = Client(os.getenv('MEILISEARCH_URL', 'http://localhost:7700'))

# Index name
INDEX_NAME = 'documents'

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Configure index and all settings in one place
    print("Setting up Meilisearch index and configuration...")
    try:
        ensure_index_and_settings(client, INDEX_NAME)
        print("✓ Meilisearch ready!")
    except Exception as e:
        print(f"✗ Error configuring Meilisearch: {e}")
    
    yield
    # Shutdown (if needed)

app = FastAPI(lifespan=lifespan)

# Rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS - restrict to configured origins (comma-separated CORS_ORIGINS env)
_cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").strip()
cors_origins_list = [o.strip() for o in _cors_origins.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(facets_router)

@app.get("/search/partial")
@limiter.limit("60/minute")
async def partial_search(request: Request, q: str):
    try:
        results = client.index(INDEX_NAME).search(q, {'limit': 3})
        return {"results": results['hits']}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/search/total")
@limiter.limit("60/minute")
async def total_search(request: Request, q: str = "", limit: int = 20, offset: int = 0, operator: str = "CONTAINS"):
    limit = clamp_limit(limit)
    offset = clamp_offset(offset)
    operator = validate_operator(operator)
    params = dict(request.query_params)
    filters = []
    exclude_keys = ['limit', 'offset', 'q', 'operator']
    # Itera sobre cada clave y valor en el objeto
    for key, value in params.items():
        if key in exclude_keys:
            continue
        filters.append(f"{key} {operator} '{unquote(value)}'")
            
    # join parts with " AND "
    filter_query = "" if not filters else ' AND '.join(filters)
    try:
        results = client.index(INDEX_NAME).search(q, {'limit': limit, 'offset': offset, 'filter': filter_query})
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/search/recent")
@limiter.limit("60/minute")
async def get_documents(request: Request, limit: int = 100, offset: int = 0):
    limit = clamp_limit(limit, default=100)
    offset = clamp_offset(offset)
    try:
        results = client.index(INDEX_NAME).search('', {'limit': limit, 'offset': offset, 'sort': ['datestamp:desc']})
        return {"results": results['hits'], "count": len(results['hits'])}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/stats")
@limiter.limit("60/minute")
async def get_stats(request: Request):
    try:
        results = client.index(INDEX_NAME).get_stats()
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/settings")
@limiter.limit("60/minute")
async def get_settings(request: Request):
    """Get current MeiliSearch index settings including pagination config"""
    try:
        index = client.index(INDEX_NAME)
        settings = index.get_settings()
        return settings
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/debug/faceting-config")
@limiter.limit("60/minute")
async def get_faceting_config(request: Request):
    """Get current faceting configuration from Meilisearch (for debugging)"""
    try:
        index = client.index(INDEX_NAME)
        settings = index.get_settings()
        return {
            "faceting": settings.get('faceting', {}),
            "filterableAttributes": settings.get('filterableAttributes', []),
            "pagination": settings.get('pagination', {})
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/resource/{id}")
@limiter.limit("60/minute")
async def get_resource_by_id(request: Request, id: str):
    try:
        resource = client.index(INDEX_NAME).get_document(id)
        return {"resource": resource}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.patch("/resource/{id}")
async def patch_resource_by_id(id: str, body: dict, _: None = Depends(verify_api_key)):
    """
    Partial update of a document by id.
    Send only the fields to change in the JSON body; they are merged into the existing document.
    The document id cannot be changed (taken from the URL).
    """
    if not body:
        raise HTTPException(status_code=400, detail="Request body must be a non-empty JSON object with fields to update.")
    try:
        index = client.index(INDEX_NAME)
        current = index.get_document(id)
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Document not found: {id}")
    merged = {**current, **body}
    merged["id"] = current["id"]  # keep primary key from existing document
    task_info = index.add_documents([merged])
    client.wait_for_task(task_info.task_uid, timeout_in_ms=30000)
    return {"resource": merged, "message": "Document updated"}


def load_deduplicated_data():
    """Load and modify deduplicated data for indexing."""
    DATA_PATH = 'prod_data/deduplicated_data.json'
    if not os.path.exists(DATA_PATH):
        raise FileNotFoundError(f"{DATA_PATH} not found.")

    with open(DATA_PATH, 'r', encoding='utf-8') as f:
        documents = json.load(f)

    # Modify documents: generate incremental IDs, keep original as 'original_id'
    modified_documents = []
    for i, doc in enumerate(documents, start=1):
        new_doc = doc.copy()
        new_doc['original_id'] = new_doc.pop('id')  # Rename 'id' to 'original_id'
        new_doc['id'] = i  # Set new incremental ID
        modified_documents.append(new_doc)

    return modified_documents

# Allowed directory for file_path ingest (security: no path escape)
PROD_DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "prod_data"))


def _normalize_and_ingest_documents(raw_docs: List[dict], batch_size: Optional[int] = None) -> dict:
    """Normalize a list of raw documents and upsert into MeiliSearch. Returns summary."""
    docs = []
    for obj in raw_docs:
        if not isinstance(obj, dict):
            continue
        doc = normalize_document(obj)
        if doc.get("id") is not None:
            docs.append(doc)
    if not docs:
        return {"message": "No valid documents to ingest", "ingested": 0}
    load_data_to_meilisearch(docs, client, INDEX_NAME, batch_size=batch_size)
    stats = client.index(INDEX_NAME).get_stats()
    return {"message": "Ingest complete", "ingested": len(docs), "index_total": stats.number_of_documents}


@app.post("/ingest")
async def ingest(
    file_path: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    _: None = Depends(verify_api_key),
):
    """
    Incremental ingest: add or update documents without a full rebuild.

    Provide one of:
    - file_path: path to a JSON file under prod_data (e.g. prod_data/new_records.json).
    - file: upload a JSON file (array of raw documents).

    Documents are normalized and upserted by id (existing ids are updated).
    """
    if file_path and file:
        raise HTTPException(status_code=400, detail="Provide either file_path or file, not both.")
    if not file_path and not file:
        raise HTTPException(status_code=400, detail="Provide file_path or file.")

    try:
        if file_path:
            # Restrict to prod_data: strip leading prod_data/ or / so path is relative to PROD_DATA_DIR
            path_part = file_path.strip().lstrip("/").replace("prod_data/", "", 1)
            resolved = os.path.abspath(os.path.join(PROD_DATA_DIR, os.path.normpath(path_part or ".")))
            if not resolved.startswith(PROD_DATA_DIR) or resolved == PROD_DATA_DIR:
                raise HTTPException(status_code=400, detail="file_path must be a file under prod_data.")
            if not os.path.isfile(resolved):
                raise HTTPException(status_code=404, detail=f"File not found: {file_path}")
            docs = load_and_normalize_documents(resolved)
            if not docs:
                return {"message": "No valid documents in file", "ingested": 0}
            load_data_to_meilisearch(docs, client, INDEX_NAME)
            stats = client.index(INDEX_NAME).get_stats()
            return {"message": "Ingest complete", "ingested": len(docs), "index_total": stats.number_of_documents}

        # Uploaded file
        content = await file.read()
        try:
            raw = json.loads(content.decode("utf-8"))
        except json.JSONDecodeError as e:
            raise HTTPException(status_code=400, detail=f"Invalid JSON: {e}")
        if not isinstance(raw, list):
            raise HTTPException(status_code=400, detail="JSON must be an array of documents.")
        return _normalize_and_ingest_documents(raw)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/reset")
async def reset_index(_: None = Depends(verify_api_key)):
    """Reset the index by deleting all documents and re-adding from deduplicated data."""
    try:
        print("-"*20, "Reset index...", "-"*20)
        index = client.index(INDEX_NAME)
        task_info = index.delete_all_documents()
        client.wait_for_task(task_info.task_uid)
        
        #load_drive_data()

        # # Load data
        # documents = load_deduplicated_data()
        # # Add documents in batches
        # BATCH_SIZE = 1000
        # for i in range(0, len(documents), BATCH_SIZE):
        #     batch = documents[i:i + BATCH_SIZE]
        #     task_info = index.add_documents(batch)
        #     client.wait_for_task(task_info.task_uid)

        return {"message": "Index reset successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)