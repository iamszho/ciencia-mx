#!/usr/bin/env sh
set -e

# Script to ONLY reload data from Google Drive to MeiliSearch
# This does NOT start the FastAPI server

echo "🔄 Reloading data into MeiliSearch from Drive (streaming)..."
echo "⏰ Start time: $(date)"

python -m src.load_from_drive_streaming

echo "✅ Data reload completed!"
echo "⏰ End time: $(date)"

# Show stats
echo ""
echo "📊 Current index statistics:"
python -c "
from meilisearch import Client
import os

client = Client(os.getenv('MEILISEARCH_URL', 'http://meilisearch:7700'))
stats = client.index('documents').get_stats()
print(f'  - Documents: {stats.number_of_documents:,}')
print(f'  - Indexing: {stats.is_indexing}')
"
