from __future__ import annotations

import json
import os
from typing import Generator

from meilisearch import Client

from .drive_fetcher import get_drive_service, list_files_in_folder, download_file_text
from .load_data import (
    normalize_document,
    ensure_index_and_settings,
    load_data_to_meilisearch,
    MEILISEARCH_URL,
    INDEX_NAME,
)

FOLDER_ID = os.getenv("DRIVE_FOLDER_ID")

# List fields to merge when the same document id appears in multiple JSON files
_MERGE_LIST_FIELDS = ('subject_other', 'subject', 'creator', 'identifier', 'rights', 'format')


def _merge_doc_into(existing: dict, new_doc: dict) -> None:
    """Merge new_doc into existing in place. List fields are merged (deduplicated, order preserved)."""
    for key in _MERGE_LIST_FIELDS:
        if key not in new_doc:
            continue
        new_val = new_doc[key]
        if not isinstance(new_val, list):
            new_val = [new_val] if new_val is not None else []
        existing_val = existing.get(key)
        if not isinstance(existing_val, list):
            existing_val = [existing_val] if existing_val is not None else []
        # Order-preserving dedupe: combine then remove duplicates by string representation
        combined = existing_val + new_val
        seen: set[str] = set()
        merged = []
        for v in combined:
            if v is None or (isinstance(v, str) and v.strip() == ''):
                continue
            k = str(v) if not isinstance(v, str) else v
            if k not in seen:
                seen.add(k)
                merged.append(v)
        existing[key] = merged
    # Update subject_other_primary from merged list if missing
    primary_list = existing.get('subject_other') or []
    if primary_list and not existing.get('subject_other_primary'):
        existing['subject_other_primary'] = primary_list[0]
    elif 'subject_other_primary' in new_doc and new_doc['subject_other_primary'] and not existing.get('subject_other_primary'):
        existing['subject_other_primary'] = new_doc['subject_other_primary']


def iter_docs_from_drive(folder_id: str) -> Generator[dict, None, None]:
    """
    Generator that:
    - lists the .json files in a Drive folder
    - downloads them, parses them, normalizes each document
    - when the same document id appears in more than one file, merges them (so list fields
      like subject_other are combined instead of the last file overwriting)
    - yields one document per unique id
    """
    service = get_drive_service()
    files = list_files_in_folder(service, folder_id)

    print(f"Found {len(files)} files in Drive folder.")

    by_id: dict[str, dict] = {}

    for i, f in enumerate(files, start=1):
        file_id = f["id"]
        name = f["name"]

        if not name.lower().endswith(".json"):
            print(f"[{i}] Skipping non-JSON file: {name}")
            continue

        print(f"[{i}] Processing file: {name}")

        text = download_file_text(service, file_id)

        try:
            raw_docs = json.loads(text)
        except json.JSONDecodeError as e:
            print(f"[{i}] JSON parsing error in {name}: {e}")
            continue

        if not isinstance(raw_docs, list):
            print(f"[{i}] Skipping {name}: content is not a list.")
            continue

        print(f"[{i}] {len(raw_docs)} records detected in {name}")

        for obj in raw_docs:
            doc = normalize_document(obj)
            doc_id = doc.get('id')
            if not doc_id:
                continue
            if doc_id in by_id:
                _merge_doc_into(by_id[doc_id], doc)
            else:
                by_id[doc_id] = doc

    for doc in by_id.values():
        yield doc


def main():
    # Connect to MeiliSearch
    meili_client = Client(MEILISEARCH_URL)

    # Ensure index and settings
    ensure_index_and_settings(meili_client, INDEX_NAME)

    # Build generator from Drive
    docs_iter = iter_docs_from_drive(FOLDER_ID)

    # Load into MeiliSearch in batches
    load_data_to_meilisearch(docs_iter, meili_client, INDEX_NAME)

    print("Drive → MeiliSearch ingestion completed.")


if __name__ == "__main__":
    main()
