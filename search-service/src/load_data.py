#!/usr/bin/env python3
"""
Script to load documents from JSON files into MeiliSearch.
Supports streaming large JSON arrays and normalizing fields required by the frontend:
- title, creator (text), subject, description, date (year), rights, format, type, language, identifier

By default reads from `prod_data/deduplicated_data.json`, but you can override DATA_PATH env var for
`prod_data/Repositorio_IPICYT_normalized.json` or any other file. The script will normalize keys and
assign incremental numeric `id` values (primary keys) with `original_id` kept.
"""

from _codecs import charmap_decode
import io
import json
import os
import argparse
from typing import Generator, Iterable, List
from meilisearch import Client
from slugify import slugify

# Configuration
MEILISEARCH_URL = os.getenv('MEILISEARCH_URL', 'http://meilisearch:7700')
INDEX_NAME = os.getenv('INDEX_NAME', 'documents')
DATA_PATH = os.getenv('DATA_PATH', 'prod_data/deduplicated_data.json')
BATCH_SIZE = int(os.getenv('BATCH_SIZE', '5000'))  # Optimized for faster loading


def normalize_creator(creator):
    creators = []
    if isinstance (creator, str): 
        creators.append(creator) 
    if isinstance(creator, dict):
        creators.append(creator.get('#text'))
    if isinstance(creator, list):
        # take first element that is a string or has '#text'
        for el in creator:
            if isinstance(el, dict):
                if el.get('#text'):
                    creators.append(el.get('#text'))
                # if el.get('@id'):
                #     creators.append(el.get('@id'))
            elif isinstance(el, str):
                creators.append(el)
    return creators


def _normalize_string_list(raw, field_name: str = 'subject_other'):
    """Turn raw value into a list of strings. Handles list of dicts with #text."""
    if raw is None:
        return []
    if isinstance(raw, str):
        return [raw] if raw.strip() else []
    if not isinstance(raw, list):
        return []
    out = []
    for item in raw:
        if isinstance(item, str):
            if item.strip():
                out.append(item)
        elif isinstance(item, dict):
            text = item.get('#text') or item.get('@value')
            if text and str(text).strip():
                out.append(str(text).strip())
    return out


def normalize_date(date_field, datestamp=None):
    # Extract the year string from `date` field (which can be list/dict/string)
    year = None
    if isinstance(date_field, list) and date_field:
        first = date_field[0]
        if isinstance(first, dict):
            year = first.get('year') or first.get('full')
        else:
            year = str(first)
    elif isinstance(date_field, dict):
        year = date_field.get('year') or date_field.get('full')
    elif isinstance(date_field, str):
        # try to extract year if format is YYYY or YYYY-MM
        if len(date_field) >= 4 and date_field[:4].isdigit():
            year = date_field[:4]
        else:
            year = date_field
    # fallback to datestamp
    if not year and datestamp and isinstance(datestamp, str) and len(datestamp) >= 4:
        year = datestamp[:4]
    return year


def normalize_document(doc: dict) -> dict:
    raw_title = doc.get('title')
    title = ""

    if isinstance(raw_title, list):
        title = raw_title[0]
    elif isinstance(raw_title, str):
        title = raw_title

    """Create a normalized document with fields expected by the frontend and MeiliSearch."""
    d = {}
    # Transform ID to be Meilisearch-compatible (only alphanumeric, -, _)
    original_id = doc.get('id')
    if original_id:
        # Replace invalid characters with underscores
        d['id'] = original_id.replace(':', '_').replace('/', '_').replace('.', '_')
    else:
        d['id'] = None
    d['original_id'] = original_id
    d['repository'] = doc.get('repository')
    d['title'] = title
    d['creator'] = normalize_creator(doc.get('creator'))
    # date
    d['datestamp'] = doc.get('datestamp')
    d['date'] = normalize_date(doc.get('date'), doc.get('datestamp'))
    # description
    desc = doc.get('description')
    if isinstance(desc, list):
        d['description'] = desc[0]
    else:
        d['description'] = desc
    # list fields
    d['subject'] = doc.get('subject') if isinstance(doc.get('subject'), list) else ([doc['subject']] if doc.get('subject') else [])
    raw_subject_other = doc.get('subject_other')
    d['subject_other'] = _normalize_string_list(raw_subject_other, 'subject_other')
    d['subject_other_primary'] = d['subject_other'][0] if d['subject_other'] else None
    d['rights'] = doc.get('rights') if isinstance(doc.get('rights'), list) else ([doc['rights']] if doc.get('rights') else [])
    d['format'] = doc.get('format') if isinstance(doc.get('format'), list) else ([doc['format']] if doc.get('format') else [])
    d['identifier'] = doc.get('identifier') if isinstance(doc.get('identifier'), list) else ([doc['identifier']] if doc.get('identifier') else [])
    d['type'] = doc.get('type')
    d['language'] = doc.get('language')
    # slug required to build URL
    d['slug'] = slugify(title)
    return d



def ensure_index_and_settings(client: Client, index_name: str):
    """Create index and configure all Meilisearch settings in one place."""
    try:
        task_info = client.create_index(index_name, {'primaryKey': 'id'})
        client.wait_for_task(task_info.task_uid, timeout_in_ms=30000)  # 30 seconds for index creation
        print(f"✓ Created index '{index_name}' with primary key 'id'")
    except Exception:
        print(f"Index '{index_name}' exists or could not be created; continuing")

    index = client.index(index_name)
    # Consolidated settings: search, filter, sort, faceting, pagination
    settings = {
        'searchableAttributes': ['title', 'description', 'creator', 'subject', 'identifier'],
        'filterableAttributes': ['repository', 'type', 'subject', 'subject_other', 'subject_other_primary', 'rights', 'format', 'language', 'date', 'creator', 'identifier', 'title', 'description'],
        'sortableAttributes': ['datestamp'],
        'faceting': {
            'maxValuesPerFacet': 1000,
            'sortFacetValuesBy': {'*': 'count'}
        },
        'pagination': {
            'maxTotalHits': 800000
        }
    }
    
    try:
        task = index.update_settings(settings)
        result = client.wait_for_task(task.task_uid, timeout_in_ms=60000)  # 60 seconds for settings update
        
        if result.status == 'failed':
            print(f"✗ Failed to update settings: {result.error}")
            raise Exception(f"Settings update failed: {result.error}")
        else:
            print(f"✓ Updated all index settings for '{index_name}'")
            print(f"  - Faceting: maxValuesPerFacet=1000, sortBy=count")
            print(f"  - Pagination: maxTotalHits=800000")
    except Exception as e:
        print(f"✗ Failed to update index settings: {e}")
        raise  # Don't hide the error


def load_data_to_meilisearch(documents: Iterable[dict], client: Client, index_name: str, batch_size: int | None = None):
    """Load modified documents into MeiliSearch.

    `documents` can be a list or an iterable/generator that yields dicts.
    Uses upsert semantics: existing documents with the same primary key are updated.
    """
    size = batch_size if batch_size is not None else BATCH_SIZE
    # Create index if it doesn't exist
    try:
        task_info = client.create_index(index_name, {'primaryKey': 'id'})
        client.wait_for_task(task_info.task_uid)
        print(f"✓ Created index '{index_name}' with primary key 'id'")
    except Exception as e:
        print(f"Index '{index_name}' might already exist: {e}")

    # Get the index
    index = client.index(index_name)

    # Load documents in batches. Support both sequence and generator.
    failed_batches = []
    batch = []
    batch_num = 0
    processed = 0
    # If `documents` supports len and slicing, we can compute total. Else we stream.
    try:
        total_docs = len(documents)
    except Exception:
        total_docs = None

    if total_docs is not None:
        total_batches = (total_docs + size - 1) // size
        # documents is sequence-like
        for i in range(0, total_docs, size):
            batch = documents[i:i + size]
            batch_num = i // size + 1
            try:
                task_info = index.add_documents(batch)
                client.wait_for_task(task_info.task_uid, timeout_in_ms=120000)  # 2 minutes
                processed += len(batch)
                print(f"✓ Loaded batch {batch_num}/{total_batches}: {len(batch)} documents")
            except Exception as e:
                print(f"✗ Failed to load batch {batch_num}/{total_batches}: {len(batch)} documents - Error: {e}")
                failed_batches.append(batch_num)
                continue
    else:
        # stream from iterable
        for doc in documents:
            batch.append(doc)
            if len(batch) >= size:
                batch_num += 1
                try:
                    task_info = index.add_documents(batch)
                    client.wait_for_task(task_info.task_uid, timeout_in_ms=120000)  # 2 minutes
                    processed += len(batch)
                    print(f"✓ Loaded batch {batch_num}: {len(batch)} documents (total processed: {processed})")
                except Exception as e:
                    print(f"✗ Failed to load batch {batch_num}: {len(batch)} documents - Error: {e}")
                    failed_batches.append(batch_num)
                batch = []
        # last batch
        if batch:
            batch_num += 1
            try:
                task_info = index.add_documents(batch)
                client.wait_for_task(task_info.task_uid, timeout_in_ms=120000)  # 2 minutes
                processed += len(batch)
                print(f"✓ Loaded final batch {batch_num}: {len(batch)} documents (total processed: {processed})")
            except Exception as e:
                print(f"✗ Failed to load final batch {batch_num}: {len(batch)} documents - Error: {e}")
                failed_batches.append(batch_num)

    # Verify
    try:
        stats = index.get_stats()
        print(f"✓ Index stats: {stats.number_of_documents} documents indexed")
    except Exception as e:
        print(f"✗ Error getting index stats: {e}")

    # Report failed batches
    if failed_batches:
        print(f"\n⚠ Warning: {len(failed_batches)} batches failed to load: {failed_batches}")
    else:
        print("\n✓ All batches loaded successfully!")

# if __name__ == '__main__':
#     parser = argparse.ArgumentParser(description='Load JSON data into MeiliSearch with normalization')
#     parser.add_argument('--data-path', default=DATA_PATH, help='Path to JSON data file to index')
#     parser.add_argument('--meili', default=MEILISEARCH_URL, help='MeiliSearch URL')
#     parser.add_argument('--index', default=INDEX_NAME, help='Index name')
#     parser.add_argument('--batch-size', type=int, default=BATCH_SIZE, help='Indexing batch size')
#     args = parser.parse_args()

#     # Update configuration from args
#     DATA_PATH = args.data_path
#     MEILISEARCH_URL = args.meili
#     INDEX_NAME = args.index
#     BATCH_SIZE = args.batch_size

#     meili_client = Client(MEILISEARCH_URL)
#     # Ensure index and settings
#     ensure_index_and_settings(meili_client, INDEX_NAME)

#     try:
#         docs_iter = iter_modified_documents(DATA_PATH)
#     except FileNotFoundError:
#         print(f"Error: DATA_PATH {DATA_PATH} not found.")
#         raise

#     load_data_to_meilisearch(docs_iter, meili_client, INDEX_NAME)
#     print("✓ Data loading complete!")