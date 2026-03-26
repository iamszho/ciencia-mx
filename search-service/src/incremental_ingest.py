#!/usr/bin/env python3
"""
Incremental JSON ingestion: add or update documents in MeiliSearch without a full rebuild.

Use this when you have new or updated records in a JSON file (array of documents).
Documents are normalized the same way as in the full Drive load; existing documents
with the same `id` are updated, new ones are inserted.

Usage:
  # Ingest one or more JSON files (from host or inside container)
  python -m src.incremental_ingest --file prod_data/new_records.json
  python -m src.incremental_ingest --file prod_data/a.json --file prod_data/b.json

  # With custom MeiliSearch URL and index
  python -m src.incremental_ingest --file prod_data/updates.json --meili http://meilisearch:7700 --index documents

  # From Docker (no rebuild needed)
  docker compose exec api python -m src.incremental_ingest --file /app/prod_data/new_records.json

Environment:
  MEILISEARCH_URL, INDEX_NAME, BATCH_SIZE (optional, same as load_data.py)
"""

import argparse
import json
import os
import sys
from typing import Iterable, List

from meilisearch import Client

from .load_data import (
    BATCH_SIZE,
    INDEX_NAME,
    MEILISEARCH_URL,
    ensure_index_and_settings,
    load_data_to_meilisearch,
    normalize_document,
)


def load_and_normalize_documents(path: str) -> List[dict]:
    """Load a JSON file (array of raw documents) and return normalized documents."""
    with open(path, "r", encoding="utf-8") as f:
        raw = json.load(f)
    if not isinstance(raw, list):
        raise ValueError(f"JSON file must be an array of documents, got {type(raw).__name__}")
    docs = []
    skipped = 0
    for obj in raw:
        if not isinstance(obj, dict):
            skipped += 1
            continue
        doc = normalize_document(obj)
        if doc.get("id") is None:
            skipped += 1
            continue
        docs.append(doc)
    if skipped:
        print(f"  Skipped {skipped} invalid or missing-id record(s)")
    return docs


def ingest_files(
    paths: List[str],
    client: Client,
    index_name: str,
    batch_size: int | None = None,
) -> None:
    """Load and normalize documents from each file, then upsert into MeiliSearch."""
    all_docs: List[dict] = []
    for path in paths:
        if not os.path.isfile(path):
            print(f"✗ File not found: {path}")
            sys.exit(1)
        print(f"Reading {path}...")
        docs = load_and_normalize_documents(path)
        print(f"  Normalized {len(docs)} document(s)")
        all_docs.extend(docs)

    if not all_docs:
        print("No documents to ingest.")
        return

    print(f"\nUpserting {len(all_docs)} document(s) into index '{index_name}' (existing ids will be updated)...")
    load_data_to_meilisearch(all_docs, client, index_name, batch_size=batch_size)
    print("Incremental ingest complete.")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Incremental ingest: add or update documents from JSON file(s) without full rebuild."
    )
    parser.add_argument(
        "--file",
        dest="files",
        action="append",
        required=True,
        help="Path to a JSON file (array of documents). Can be repeated for multiple files.",
    )
    parser.add_argument("--meili", default=os.getenv("MEILISEARCH_URL", MEILISEARCH_URL), help="MeiliSearch URL")
    parser.add_argument("--index", default=os.getenv("INDEX_NAME", INDEX_NAME), help="Index name")
    parser.add_argument(
        "--batch-size",
        type=int,
        default=int(os.getenv("BATCH_SIZE", str(BATCH_SIZE))),
        help="Batch size for indexing",
    )
    parser.add_argument(
        "--ensure-index",
        action="store_true",
        default=True,
        help="Ensure index exists and settings are applied (default: True)",
    )
    parser.add_argument("--no-ensure-index", action="store_false", dest="ensure_index", help="Skip index/settings setup")
    args = parser.parse_args()

    client = Client(args.meili)

    if args.ensure_index:
        ensure_index_and_settings(client, args.index)

    ingest_files(args.files, client, args.index, batch_size=args.batch_size)


if __name__ == "__main__":
    main()
