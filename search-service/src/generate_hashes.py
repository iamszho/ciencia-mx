#!/usr/bin/env python3
"""
Script to generate hashes for each document in consolidated_data.json
and count the structure (number of fields) of each object.
"""

import json
import hashlib
import os

# Configuration
DATA_PATH = 'prod_data/consolidated_data.json'

def generate_hash(obj, fields_to_hash=None):
    """Generate a SHA256 hash of the JSON representation of the object, using only specified fields."""
    if fields_to_hash is None:
        fields_to_hash = ['repository', 'datestamp']
    # Create a copy with only the specified fields
    obj_copy = {k: v for k, v in obj.items() if k in fields_to_hash}
    # Sort keys to ensure consistent hashing
    obj_str = json.dumps(obj_copy, sort_keys=True, separators=(',', ':'))
    return hashlib.sha256(obj_str.encode('utf-8')).hexdigest()

def count_structure(obj):
    """Count the number of top-level fields in the object."""
    return len(obj)

def main():
    if not os.path.exists(DATA_PATH):
        print(f"Error: {DATA_PATH} not found.")
        return

    print(f"Loading data from {DATA_PATH}...")
    with open(DATA_PATH, 'r', encoding='utf-8') as f:
        documents = json.load(f)

    print(f"Processing {len(documents)} documents...")

    hashes = []
    for i, doc in enumerate(documents, start=1):
        doc_hash = generate_hash(doc)
        field_count = count_structure(doc)
        hashes.append({
            'id': doc.get('id', f'unknown_{i}'),
            'hash': doc_hash,
            'field_count': field_count
        })
        if i % 1000 == 0:
            print(f"Processed {i} documents...")

    # Save hashes to a file
    output_path = 'prod_data/hashes.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(hashes, f, indent=2)

    print(f"Hashes saved to {output_path}")
    print(f"Total documents: {len(hashes)}")

if __name__ == "__main__":
    main()