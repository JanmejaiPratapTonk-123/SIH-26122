"""
Plan2Progress — API integration smoke tests.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["version"] == "1.0.0"


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "Welcome to Plan2Progress API" in data["message"]


def test_ai_settings_endpoint():
    response = client.get("/api/v1/admin/ai-settings")
    assert response.status_code == 200
    data = response.json()
    assert data["confidenceThreshold"] == 85.0
    assert data["extractionModel"] == "deterministic-v1"


def test_admin_contractors_endpoint():
    response = client.get("/api/v1/admin/contractors")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 3
    assert data[0]["name"] == "Kalpataru Field Ops"
