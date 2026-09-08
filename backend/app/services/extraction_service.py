"""
Plan2Progress — Event Extraction Service.

Extracts structured progress events from unstructured/semi-structured text.
Uses an abstract base interface so ML/LLM extractors can be swapped in seamlessly.
"""

from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
import re
from dataclasses import dataclass, field


@dataclass
class ExtractedEvent:
    description: str
    quantity: Optional[float] = None
    uom: Optional[str] = None
    chainage_start: Optional[str] = None
    chainage_end: Optional[str] = None
    location_desc: Optional[str] = None
    execution_date: Optional[str] = None
    shift: Optional[str] = None
    raw_quote: Optional[str] = None
    confidence: float = 1.0
    extra_metadata: Dict[str, Any] = field(default_factory=dict)


class BaseExtractionService(ABC):
    @abstractmethod
    def extract_events(self, text: str, metadata: Optional[Dict[str, Any]] = None) -> List[ExtractedEvent]:
        """Extract progress events from text content."""
        pass


class DeterministicExtractionService(BaseExtractionService):
    """
    Deterministic rule-based and regex extractor for infrastructure reports.
    Extracts linear chainages, quantities, units, and activity descriptions.
    """

    # Chainage pattern: KP 12+400 or CH 12+400 or Chainage 12+400 to 12+850 or between KP 12+400 and KP 12+850
    CHAINAGE_PATTERN = re.compile(
        r"(?:KP|CH|Chainage)\s*([0-9]+\+[0-9]+)(?:\s*(?:to|and|-|–)\s*(?:KP|CH|Chainage)?\s*([0-9]+\+[0-9]+))?",
        re.IGNORECASE,
    )

    # Quantity pattern: 450m, 180 m³, 32 butt welds, 14 MT, etc.
    QUANTITY_PATTERN = re.compile(
        r"(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:(?:butt|field|fillet|shop)\s+)?(meters?|m³|cum|m3|metric tonnes?|tons?|mt|joints?|welds?|nos?|km|m\b)",
        re.IGNORECASE,
    )

    def extract_events(self, text: str, metadata: Optional[Dict[str, Any]] = None) -> List[ExtractedEvent]:
        events: List[ExtractedEvent] = []
        lines = [line.strip() for line in text.split("\n") if line.strip()]

        for line in lines:
            # Check for quantity match
            qty_match = self.QUANTITY_PATTERN.search(line)
            chainage_match = self.CHAINAGE_PATTERN.search(line)

            if qty_match or chainage_match:
                quantity_val = None
                uom_val = None
                if qty_match:
                    raw_num = qty_match.group(1).replace(",", "")
                    try:
                        quantity_val = float(raw_num)
                    except ValueError:
                        quantity_val = None
                    uom_val = qty_match.group(2).lower()

                chainage_start = None
                chainage_end = None
                location = None
                if chainage_match:
                    chainage_start = chainage_match.group(1)
                    chainage_end = chainage_match.group(2)
                    if chainage_end:
                        location = f"KP {chainage_start} – KP {chainage_end}"
                    else:
                        location = f"KP {chainage_start}"

                events.append(
                    ExtractedEvent(
                        description=line,
                        quantity=quantity_val,
                        uom=uom_val,
                        chainage_start=chainage_start,
                        chainage_end=chainage_end,
                        location_desc=location or (metadata.get("location") if metadata else None),
                        execution_date=metadata.get("execution_date") if metadata else None,
                        shift=metadata.get("shift") if metadata else None,
                        raw_quote=line,
                        confidence=0.92 if (qty_match and chainage_match) else 0.85,
                        extra_metadata=metadata or {},
                    )
                )

        # If no regex matched, treat entire text or non-empty lines as fallback event
        if not events and text.strip():
            events.append(
                ExtractedEvent(
                    description=text.strip()[:300],
                    raw_quote=text.strip()[:300],
                    confidence=0.70,
                    extra_metadata=metadata or {},
                )
            )

        return events
