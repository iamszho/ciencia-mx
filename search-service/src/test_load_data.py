"""
Unit tests for load_data.py normalization functions.
Run with: python test_load_data.py
"""
import sys
from unittest.mock import MagicMock

# Mock external dependencies before importing load_data to avoid import errors
sys.modules["meilisearch"] = MagicMock()
sys.modules["slugify"] = MagicMock()

# Create a simple slugify function for testing
def mock_slugify(text):
    """Simple slugify implementation for testing."""
    return text.lower().replace(' ', '-')

sys.modules["slugify"].slugify = mock_slugify

# Try relative import first (for package), then absolute (for direct execution)
try:
    from .load_data import normalize_document, normalize_creator, normalize_date
except ImportError:
    from load_data import normalize_document, normalize_creator, normalize_date


def test_normalize_document_complete():
    """Test normalize_document with a complete real-world document."""
    doc = {
        "id": "oai:repositorio.uppuebla.edu.mx:123456789/55",
        "repository": "Universidad Politécnica de Puebla / UPPue",
        "identifier": [
            "http://repositorio.uppuebla.edu.mx:8080/xmlui/handle/123456789/55"
        ],
        "datestamp": "2018-08-30T12:09:20Z",
        "setSpec": [
            "com_123456789_24",
            "col_123456789_26"
        ],
        "title": "Spline wavelet transform for face recognition",
        "creator": [
            "LUIS IÑAQUI GARCÍA GALICIA",
            "García Galicia, Luis Iñaqui"
        ],
        "date": [
            {
                "full": "2014-09-30",
                "year": "2014"
            }
        ],
        "description": "Estudiantes",
        "subject": [
            "RECONOCIMIENTO DE ROSTROS",
            "INGENIERÍA Y TECNOLOGÍA"
        ],
        "rights": [
            "Acceso Abierto",
            "http://creativecommons.org/licenses/by-nc-nd/4.0"
        ],
        "format": [
            "pdf"
        ],
        "type": "Póster de congreso",
        "language": "Inglés"
    }
    
    normalized_doc = normalize_document(doc)

    print(normalized_doc)
    
    # Assertions to validate the normalized output
    assert normalized_doc["id"] == "oai_repositorio_uppuebla_edu_mx_123456789_55", "ID should be the new incremental ID"
    assert normalized_doc["original_id"] == "oai:repositorio.uppuebla.edu.mx:123456789/55"
    assert normalized_doc["repository"] == "Universidad Politécnica de Puebla / UPPue"
    assert normalized_doc["title"] == "Spline wavelet transform for face recognition"
    assert normalized_doc["creator"] == ["LUIS IÑAQUI GARCÍA GALICIA","García Galicia, Luis Iñaqui"]
    assert normalized_doc["date"] == "2014", "Should extract year from date object"
    assert normalized_doc["datestamp"] == "2018-08-30T12:09:20Z"
    assert normalized_doc["description"] == "Estudiantes"
    assert normalized_doc["subject"] == ["RECONOCIMIENTO DE ROSTROS", "INGENIERÍA Y TECNOLOGÍA"]
    assert normalized_doc["rights"] == ["Acceso Abierto", "http://creativecommons.org/licenses/by-nc-nd/4.0"]
    assert normalized_doc["format"] == ["pdf"]
    assert normalized_doc["identifier"] == ["http://repositorio.uppuebla.edu.mx:8080/xmlui/handle/123456789/55"]
    assert normalized_doc["type"] == "Póster de congreso"
    assert normalized_doc["language"] == "Inglés"
    assert normalized_doc["slug"] == "spline-wavelet-transform-for-face-recognition"
    
    print("✓ test_normalize_document_complete passed!")


def test_normalize_document_title_as_list():
    """Test that title as list is normalized to string."""
    doc = {
        "id": "test-123",
        "title": ["First Title", "Second Title"],
        "datestamp": "2020-01-01T00:00:00Z"
    }
    
    normalized_doc = normalize_document(doc, 2)
    
    assert normalized_doc["title"] == "First Title", "Should take first title from list"
    assert normalized_doc["slug"] == "first-title"
    print("✓ test_normalize_document_title_as_list passed!")


def test_normalize_document_minimal():
    """Test normalize_document with minimal required fields."""
    doc = {
        "id": "minimal-doc",
        "title": "Minimal Document"
    }
    
    normalized_doc = normalize_document(doc, 3)
    
    assert normalized_doc["id"] == 3
    assert normalized_doc["original_id"] == "minimal-doc"
    assert normalized_doc["title"] == "Minimal Document"
    assert normalized_doc["slug"] == "minimal-document"
    assert normalized_doc["creator"] is None
    assert normalized_doc["subject"] == []
    assert normalized_doc["rights"] == []
    assert normalized_doc["format"] == []
    assert normalized_doc["identifier"] == []
    print("✓ test_normalize_document_minimal passed!")


def test_normalize_creator_string():
    """Test normalize_creator with string input."""
    result = normalize_creator("John Doe")
    assert result == "John Doe"
    print("✓ test_normalize_creator_string passed!")


def test_normalize_creator_list():
    """Test normalize_creator with list input."""
    result = normalize_creator(["Author One", "Author Two"])
    assert result == "Author One", "Should return first author"
    print("✓ test_normalize_creator_list passed!")


def test_normalize_creator_dict():
    """Test normalize_creator with dict input."""
    result = normalize_creator({"#text": "Jane Smith"})
    assert result == "Jane Smith"
    print("✓ test_normalize_creator_dict passed!")


def test_normalize_date_dict():
    """Test normalize_date with dict containing year."""
    result = normalize_date({"year": "2020", "full": "2020-05-15"})
    assert result == "2020"
    print("✓ test_normalize_date_dict passed!")


def test_normalize_date_list():
    """Test normalize_date with list of date objects."""
    result = normalize_date([{"year": "2019", "full": "2019-03-10"}])
    assert result == "2019"
    print("✓ test_normalize_date_list passed!")


def test_normalize_date_string():
    """Test normalize_date with string input."""
    result = normalize_date("2021-06-20")
    assert result == "2021", "Should extract year from date string"
    print("✓ test_normalize_date_string passed!")


def test_normalize_date_fallback_to_datestamp():
    """Test normalize_date falls back to datestamp when date is missing."""
    result = normalize_date(None, "2022-01-15T10:30:00Z")
    assert result == "2022", "Should extract year from datestamp"
    print("✓ test_normalize_date_fallback_to_datestamp passed!")

def test_normalize_creator_list():
    """Test normalize_creator with list input."""
    result = normalize_creator([])
    assert result == []
    print("✓ test_normalize_creator_list passed!")


if __name__ == "__main__":
    # Run all tests
    print("Running tests for normalize_document...\n")
    test_normalize_document_complete()
    #test_normalize_creator_list()
    # test_normalize_document_title_as_list()
    # test_normalize_document_minimal()
    # test_normalize_creator_string()
    # test_normalize_creator_list()
    # test_normalize_creator_dict()
    # test_normalize_date_dict()
    # test_normalize_date_list()
    # test_normalize_date_string()
    # test_normalize_date_fallback_to_datestamp()
    # print("\n✓ All tests passed!")


    ["Sociología", "Salud"]
    ["Sociología;Salud"]

    subject = ["Migración Interna;Tzotziles;Tzeltales;Aspectos Culturales;Sociología"]
    caracteres_especiales = [";"]

    def normalize_subject(subject, caracteres_especiales)

    ["Migración Interna", "Tzotziles", "Tzeltales", "Aspectos Culturales", "Sociología"]

    ["Migración", "Interna", "Tzotziles", "Tzeltales", "Aspectos", "Culturales", "Sociología"]

    [" Migración internacional y colonización", "Sociología y antropología", "Derecho laboral, social, educativo y cultural"]

    