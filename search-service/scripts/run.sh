#!/usr/bin/env sh
set -e

# Script to load data and run the FastAPI server with MeiliSearch integration

echo "Loading data into MeiliSearch directly from Drive (streaming)..."
python -m src.load_from_drive_streaming

# Previous method of loading data from a local JSON file (commented out)
# echo "Loading data into MeiliSearch...v2"
# python src/load_data.py \
#   --data-path prod_data/Repositorio_IPICYT_normalized.json \
#   --index documents

echo "Starting FastAPI server..."
uvicorn src.main:app --host 0.0.0.0 --port 8000