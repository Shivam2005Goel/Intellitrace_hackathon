"""Layer 2: Temporal causality validation - DAG-based timeline verification."""
from datetime import datetime, timedelta
from typing import Dict, Any, Optional, List


def parse_date(date_str: str) -> Optional[datetime]:
    """Parse date string in various formats."""
    if not date_str:
        return None
    
    formats = [
        "%Y-%m-%d",
        "%Y-%m-%d %H:%M:%S",
        "%d/%m/%Y",
        "%m/%d/%Y",
        "%d-%m-%Y",
        "%m-%d-%Y",
    ]
    
    for fmt in formats:
        try:
            return datetime.strptime(date_str, fmt)
        except ValueError:
            continue
    return None


def check_temporal_causality(events: Dict[str, Any]) -> Dict[str, Any]:
    """
    Validate temporal order of invoice events.
    Expected flow: PO -> GRN -> Invoice -> Finance Request -> Payment
    """
    violations = []
    warnings = []
    paradox_score = 0
    
    # Parse all dates
    dates = {}
    for key, value in events.items():
        if value and isinstance(value, str):
            parsed = parse_date(value)
            if parsed:
                dates[key] = parsed
    
    if not dates:
        return {
            "violations": ["No valid dates provided"],
            "warnings": [],
            "paradox_score": 0,
            "flagged": False,
            "status": "INSUFFICIENT_DATA",
            "verdict": "TIMELINE CANNOT BE VERIFIED - NO DATES"
        }
    
    # Rule 1: PO must come before GRN
    if "po_date" in dates and "grn_date" in dates:
        if dates["grn_date"] < dates["po_date"]:
            violations.append("GRN received BEFORE PO was issued")
            paradox_score += 2
    
    # Rule 2: Invoice must come after GRN (within reasonable window)
    if "grn_date" in dates and "invoice_date" in dates:
        delta = (dates["invoice_date"] - dates["grn_date"]).days
        if delta < 0:
            violations.append("Invoice submitted BEFORE goods received")
            paradox_score += 2
        elif delta > 5:
            violations.append(f"Invoice submitted {delta} days after GRN (expected 0-5)")
            paradox_score += 1
    
    # Rule 3: Finance request must come after invoice
    if "invoice_date" in dates and "finance_request_date" in dates:
        if dates["finance_request_date"] < dates["invoice_date"]:
            violations.append("Finance requested BEFORE invoice was issued")
            paradox_score += 3
    
    # Rule 4: Invoice must not predate PO
    if "po_date" in dates and "invoice_date" in dates:
        if dates["invoice_date"] < dates["po_date"]:
            violations.append("Invoice date is BEFORE Purchase Order date — temporal paradox")
            paradox_score += 3
    
    # Rule 5: Payment must come after invoice/finance (Inverse Causality - Phantom Backward)
    if "payment_date" in dates:
        if "invoice_date" in dates and dates["payment_date"] < dates["invoice_date"]:
            violations.append("Payment made BEFORE invoice issued (Phantom Backward)")
            paradox_score += 4
        if "finance_request_date" in dates and dates["payment_date"] < dates["finance_request_date"]:
            violations.append("Payment made BEFORE finance requested (Phantom Backward)")
            paradox_score += 3
        # Check payment vs PO/GRN for Inverse Causality "Phantom-Backward" chain
        if "po_date" in dates and dates["payment_date"] < dates["po_date"]:
            violations.append("Payment made BEFORE Purchase Order (Phantom Backward Inverse Causality)")
            paradox_score += 5
        if "grn_date" in dates and dates["payment_date"] < dates["grn_date"]:
            violations.append("Payment made BEFORE Goods Receipt (Phantom Backward Inverse Causality)")
            paradox_score += 4
    
    # Rule 6: Delivery date must be after GRN
    if "delivery_date" in dates and "grn_date" in dates:
        if dates["delivery_date"] < dates["grn_date"]:
            violations.append("Delivery date BEFORE goods received note")
            paradox_score += 2
    
    # Rule 7: Check for suspicious rapid sequence
    date_list = sorted(dates.values())
    if len(date_list) >= 2:
        total_span = (date_list[-1] - date_list[0]).days
        if total_span == 0 and len(date_list) > 2:
            violations.append("Multiple critical events on same day - SUSPICIOUS")
            paradox_score += 1
        elif total_span < 0:
            violations.append("Negative timeline span - DATA CORRUPTION")
            paradox_score += 3
    
    # Determine severity
    if paradox_score >= 6:
        severity = "CRITICAL"
    elif paradox_score >= 3:
        severity = "HIGH"
    elif paradox_score >= 1:
        severity = "MEDIUM"
    else:
        severity = "NONE"
    
    # Build timeline for display
    timeline = []
    for key in ["po_date", "grn_date", "invoice_date", "finance_request_date", "delivery_date", "payment_date"]:
        if key in dates:
            timeline.append({
                "event": key.replace("_", " ").title(),
                "date": dates[key].strftime("%Y-%m-%d"),
                "timestamp": dates[key].isoformat()
            })
    timeline.sort(key=lambda x: x["timestamp"])
    
    return {
        "violations": violations,
        "warnings": warnings,
        "timeline": timeline,
        "paradox_score": paradox_score,
        "severity": severity,
        "flagged": paradox_score > 0,
        "status": "PARADOX" if paradox_score > 1 else "OK" if paradox_score == 0 else "WARNING",
        "verdict": "TEMPORAL PARADOX DETECTED" if paradox_score > 1 else "TIMELINE OK"
    }


def validate_event_sequence(events: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Validate a sequence of related invoices/events."""
    all_dates = []
    for event in events:
        parsed = {k: parse_date(v) for k, v in event.items() if v and isinstance(v, str)}
        all_dates.append(parsed)
    
    # Check for date inconsistencies across the sequence
    inconsistencies = []
    
    for i in range(len(all_dates) - 1):
        current = all_dates[i]
        next_event = all_dates[i + 1]
        
        if "invoice_date" in current and "po_date" in next_event:
            if next_event["po_date"] < current["invoice_date"]:
                inconsistencies.append(f"Invoice {i+1} predates PO in sequence")
    
    return {
        "inconsistencies": inconsistencies,
        "flagged": len(inconsistencies) > 0
    }
