#!/bin/bash

# Script to run the FastAPI server in development mode with auto-reload

# Activate virtual environment
source .venv/bin/activate

echo "Starting FastAPI server in development mode..."
uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload