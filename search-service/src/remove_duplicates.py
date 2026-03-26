#!/usr/bin/env python3
"""
Script to remove duplicate documents from consolidated_data.json based on hash.
"""

import json
import hashlib
import os

# Configuration
DATA_PATH = 'prod_data/consolidated_data.json'
OUTPUT_PATH = 'prod_data/deduplicated_data.json'

def generate_hash(obj, fields_to_hash=None):
    """Generate a SHA256 hash of the JSON representation of the object, using only specified fields."""
    if fields_to_hash is None:
        fields_to_hash = ['repository', 'datestamp']
    # Create a copy with only the specified fields
    obj_copy = {k: v for k, v in obj.items() if k in fields_to_hash}
    # Sort keys to ensure consistent hashing
    obj_str = json.dumps(obj_copy, sort_keys=True, separators=(',', ':'))
    return hashlib.sha256(obj_str.encode('utf-8')).hexdigest()

def main():
    if not os.path.exists(DATA_PATH):
        print(f"Error: {DATA_PATH} not found.")
        return

    print(f"Loading data from {DATA_PATH}...")
    with open(DATA_PATH, 'r', encoding='utf-8') as f:
        documents = json.load(f)

    print(f"Processing {len(documents)} documents...")

    seen_hashes = set()
    unique_documents = []

    duplicates_count = 0
    for i, doc in enumerate(documents, start=1):
        doc_hash = generate_hash(doc)
        if doc_hash not in seen_hashes:
            seen_hashes.add(doc_hash)
            unique_documents.append(doc)
        else:
            duplicates_count += 1
        if i % 1000 == 0:
            print(f"Processed {i} documents...")

    print(f"Found {duplicates_count} duplicates.")
    print(f"Unique documents: {len(unique_documents)}")

    # Save deduplicated data
    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(unique_documents, f, indent=2, ensure_ascii=False)

    print(f"Deduplicated data saved to {OUTPUT_PATH}")

if __name__ == "__main__":
    main()