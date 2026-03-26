#!/usr/bin/env python3

import uvicorn
import sys
import os

if __name__ == "__main__":
    # Change to the script's directory to ensure correct path
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)

    print("Starting FastAPI server in development mode...")
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)