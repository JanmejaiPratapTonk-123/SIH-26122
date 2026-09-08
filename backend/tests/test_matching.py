"""
Plan2Progress — Unit tests for Deterministic Matching Service.
"""

import uuid
from app.models.models import Activity, ProgressEvent
from app.services.matching_service import DeterministicMatchingService


def test_deterministic_matching_accuracy():
    matcher = DeterministicMatchingService()

    act_pipeline = Activity(
        id=uuid.uuid4(),
        activity_code="L6-PIPE-EXC-042",
        name="Pipeline Trench Excavation",
        work_package="Pipeline → Trench Excavation",
        corridor_start="KP 12+000",
        corridor_finish="KP 13+000",
        planned_quantity=1200.0,
        actual_quantity=700.0,
        uom="m",
    )

    act_concrete = Activity(
        id=uuid.uuid4(),
        activity_code="L4-CIV-COMP-012",
        name="Compressor Foundation Concreting",
        work_package="Civil Works → Compressor Station",
        planned_quantity=320.0,
        actual_quantity=140.0,
        uom="m³",
    )

    activities = [act_pipeline, act_concrete]

    event = ProgressEvent(
        id=uuid.uuid4(),
        description="450m of pipeline trench excavation completed between KP 12+400 and KP 12+850 on 5 Sep.",
        reported_quantity=450.0,
        reported_uom="m",
        location_corridor="KP 12+400 to 12+850",
    )

    candidates = matcher.match_event_to_activities(event, activities, top_k=2)

    assert len(candidates) == 2
    # Top candidate should be the pipeline trench excavation
    top = candidates[0]
    assert top.activity.activity_code == "L6-PIPE-EXC-042"
    assert top.confidence > candidates[1].confidence
    assert "trench" in top.rationale.lower() or "pipeline" in top.rationale.lower() or "corridor" in top.rationale.lower()
