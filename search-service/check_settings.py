#!/usr/bin/env python3
"""
Script to check MeiliSearch pagination settings
"""
import os
from meilisearch import Client

# MeiliSearch client
client = Client(os.getenv('MEILISEARCH_URL', 'http://localhost:7700'))
INDEX_NAME = 'documents'

try:
    index = client.index(INDEX_NAME)
    settings = index.get_settings()
    
    print("=" * 50)
    print("MeiliSearch Index Settings")
    print("=" * 50)
    print(f"\n📊 Pagination Settings:")
    print(f"   maxTotalHits: {settings.get('pagination', {}).get('maxTotalHits', 'NOT SET')}")
    print(f"\n📈 Faceting Settings:")
    print(f"   maxValuesPerFacet: {settings.get('faceting', {}).get('maxValuesPerFacet', 'NOT SET')}")
    print(f"\n🔍 Full Pagination Config:")
    print(f"   {settings.get('pagination', 'NOT SET')}")
    print("=" * 50)
    
except Exception as e:
    print(f"❌ Error: {e}")
