# src/drive_fetcher.py
from __future__ import annotations
from dotenv import load_dotenv

import io
import json
import os
from pathlib import Path
from typing import List, Dict
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload

load_dotenv()

SCOPES = ["https://www.googleapis.com/auth/drive.readonly"]

# Prefer GOOGLE_SA_JSON (inline JSON); fallback to GOOGLE_SA_FILE (path to file)
SERVICE_ACCOUNT_JSON = os.getenv("GOOGLE_SA_JSON")
SERVICE_ACCOUNT_FILE = os.getenv("GOOGLE_SA_FILE")

if SERVICE_ACCOUNT_JSON:
    try:
        _credentials_info = json.loads(SERVICE_ACCOUNT_JSON)
    except json.JSONDecodeError:
        raise RuntimeError("GOOGLE_SA_JSON is set but is not valid JSON")
elif SERVICE_ACCOUNT_FILE and Path(SERVICE_ACCOUNT_FILE).exists():
    _credentials_info = None  # will use file in get_drive_service
else:
    raise RuntimeError(
        "Google Drive credentials required. Set either: "
        "GOOGLE_SA_JSON (JSON string of service account key) or "
        "GOOGLE_SA_FILE (path to a .json key file that exists)."
    )


def get_drive_service():
    """
    Create an authenticated Google Drive API client using the service account.
    """
    if _credentials_info is not None:
        creds = service_account.Credentials.from_service_account_info(
            _credentials_info,
            scopes=SCOPES,
        )
    else:
        creds = service_account.Credentials.from_service_account_file(
            str(SERVICE_ACCOUNT_FILE),
            scopes=SCOPES,
        )
    service = build("drive", "v3", credentials=creds)
    return service


def list_files_in_folder(service, folder_id: str) -> List[Dict]:
    """
    List ALL files inside a Drive folder.
    (If later you want to filter by mimeType or name, we can do it here.)
    """
    query = f"'{folder_id}' in parents"
    files: List[Dict] = []
    page_token = None

    while True:
        response = (
            service.files()
            .list(
                q=query,
                spaces="drive",
                fields="nextPageToken, files(id, name, mimeType)",
                pageToken=page_token,
            )
            .execute()
        )

        files.extend(response.get("files", []))
        page_token = response.get("nextPageToken", None)
        if not page_token:
            break

    return files


def download_file_text(service, file_id: str) -> str:
    """
    Download the contents of a Drive file as text (str).
    """
    request = service.files().get_media(fileId=file_id)
    fh = io.BytesIO()
    downloader = MediaIoBaseDownload(fh, request)
    done = False

    while not done:
        status, done = downloader.next_chunk()

    fh.seek(0)
    text = fh.read().decode("utf-8", errors="replace")
    return text