"""
Plan2Progress — Unit tests for Deterministic Extraction Service.
"""

from app.services.extraction_service import DeterministicExtractionService


def test_deterministic_extraction_pipeline():
    extractor = DeterministicExtractionService()
    sample_text = """
    Daily Field Log - Section B
    450m of pipeline trench excavation completed between KP 12+400 and KP 12+850 on 5 Sep.
    180 m³ of M35 grade concrete poured for Turbo-Compressor foundation block TB-02.
    32 butt welds completed and 100% radiographic testing (RT) cleared on 24-inch trunkline joints W-104 to W-135.
    14 MT of structural steel pipe rack PR-01 erected.
    """

    events = extractor.extract_events(sample_text)
    assert len(events) >= 4

    # Check first event (linear trenching)
    e1 = events[0]
    assert e1.quantity == 450.0
    assert e1.uom in ["m", "meter", "meters"]
    assert e1.chainage_start == "12+400"
    assert e1.chainage_end == "12+850"

    # Check second event (concrete pour)
    e2 = events[1]
    assert e2.quantity == 180.0
    assert e2.uom in ["m³", "cum", "m3"]

    # Check third event (welding)
    e3 = events[2]
    assert e3.quantity == 32.0

    # Check fourth event (structural steel)
    e4 = events[3]
    assert e4.quantity == 14.0
    assert e4.uom in ["mt", "tons", "ton"]


def test_fallback_extraction():
    extractor = DeterministicExtractionService()
    text = "General site grading and surveying carried out."
    events = extractor.extract_events(text)
    assert len(events) == 1
    assert "grading" in events[0].description
