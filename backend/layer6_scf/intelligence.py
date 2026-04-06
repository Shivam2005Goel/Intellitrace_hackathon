"""Layer 6: Supply-chain finance intelligence for multi-tier fraud detection."""
from __future__ import annotations

from collections import Counter
from datetime import datetime
from typing import Any, Dict, List, Optional

from dateutil.parser import parse as parse_date

from layer3_graph.cycle_detector import analyze_triangle_patterns, calculate_centrality_scores


def _safe_float(value: Any, default: float = 0.0) -> float:
    try:
        if value is None or value == "":
            return default
        return float(value)
    except (TypeError, ValueError):
        return default


def _safe_int(value: Any, default: int = 0) -> int:
    try:
        if value is None or value == "":
            return default
        return int(value)
    except (TypeError, ValueError):
        return default


def _parse_date(value: Optional[str]) -> Optional[datetime]:
    if not value:
        return None
    try:
        return parse_date(value)
    except Exception:
        return None


def _pct_difference(left: float, right: float) -> float:
    base = max(abs(right), 1.0)
    return abs(left - right) / base * 100.0


def _normalize_items(items: Any) -> List[str]:
    if not items:
        return []
    if isinstance(items, str):
        items = [part.strip() for part in items.split(",")]
    return sorted({str(item).strip().lower() for item in items if str(item).strip()})


def _extract_doc(erp_records: Dict[str, Any], *aliases: str) -> Dict[str, Any]:
    for alias in aliases:
        value = erp_records.get(alias)
        if isinstance(value, dict):
            return value
    return {}


def _build_invoice_chain(invoice: Dict[str, Any]) -> List[Dict[str, Any]]:
    related = invoice.get("related_invoices") or []
    chain: List[Dict[str, Any]] = []

    for node in related:
        if not isinstance(node, dict):
            continue
        node_dates = node.get("dates") or {}
        chain.append({
            "id": node.get("id") or node.get("invoice_id") or "related-node",
            "tier_level": _safe_int(node.get("tier_level"), 0),
            "amount": _safe_float(node.get("amount")),
            "supplier_id": node.get("supplier_id") or node.get("supplier"),
            "buyer_id": node.get("buyer_id") or node.get("buyer"),
            "finance_request_date": node.get("finance_request_date") or node_dates.get("finance_request_date"),
            "invoice_date": node.get("invoice_date") or node_dates.get("invoice_date"),
            "lender_id": node.get("lender_id"),
        })

    dates = invoice.get("dates") or {}
    chain.append({
        "id": invoice.get("id") or "current-invoice",
        "tier_level": _safe_int(invoice.get("tier_level"), 1),
        "amount": _safe_float(invoice.get("amount")),
        "supplier_id": invoice.get("supplier_id") or invoice.get("supplier"),
        "buyer_id": invoice.get("buyer_id") or invoice.get("buyer"),
        "finance_request_date": dates.get("finance_request_date"),
        "invoice_date": dates.get("invoice_date"),
        "lender_id": invoice.get("lender_id"),
    })

    return sorted(
        chain,
        key=lambda node: (
            -_safe_int(node.get("tier_level"), 0),
            _parse_date(node.get("finance_request_date")) or datetime.max,
        ),
    )


def validate_erp_reconciliation(invoice: Dict[str, Any]) -> Dict[str, Any]:
    """Validate invoice against ERP evidence such as PO, GRN, and delivery confirmations."""
    erp_records = invoice.get("erp_records") or {}
    po = _extract_doc(erp_records, "po", "purchase_order")
    grn = _extract_doc(erp_records, "grn", "goods_receipt")
    delivery = _extract_doc(erp_records, "delivery", "delivery_confirmation", "pod")

    amount = _safe_float(invoice.get("amount"))
    quantity = _safe_float(invoice.get("quantity"))
    invoice_items = _normalize_items(invoice.get("items"))

    violations: List[str] = []
    warnings: List[str] = []
    matched_documents: List[str] = []
    score = 0.0

    evidence_docs = [("PO", po), ("GRN", grn), ("Delivery", delivery)]
    coverage_ratio = round(sum(1 for _, doc in evidence_docs if doc) / len(evidence_docs), 2)

    if not po:
        warnings.append("Missing purchase order feed for pre-disbursement reconciliation.")
        if amount >= 1_000_000:
            score += 1.5
    else:
        matched_documents.append("PO")
        po_amount = _safe_float(po.get("amount"))
        po_qty = _safe_float(po.get("quantity"))
        po_items = _normalize_items(po.get("items"))
        if po_amount and _pct_difference(amount, po_amount) > 3:
            violations.append(f"Invoice amount deviates from PO by {_pct_difference(amount, po_amount):.1f}%.")
            score += 3
        if po_qty and _pct_difference(quantity, po_qty) > 5:
            violations.append(f"Invoice quantity deviates from PO by {_pct_difference(quantity, po_qty):.1f}%.")
            score += 2
        if po_items and invoice_items and not set(invoice_items).intersection(po_items):
            violations.append("Invoice items do not align with PO line items.")
            score += 2
        if po.get("supplier_id") and po.get("supplier_id") != invoice.get("supplier_id"):
            violations.append("Supplier on invoice does not match supplier in PO feed.")
            score += 3
        if po.get("buyer_id") and invoice.get("buyer_id") and po.get("buyer_id") != invoice.get("buyer_id"):
            violations.append("Buyer on invoice does not match PO counterparty.")
            score += 3

    if not grn:
        warnings.append("Missing GRN evidence; goods receipt cannot be fully reconciled.")
        if quantity > 0:
            score += 1
    else:
        matched_documents.append("GRN")
        grn_qty = _safe_float(grn.get("quantity"))
        if grn_qty and grn_qty < quantity * 0.95:
            violations.append(f"GRN confirms only {grn_qty:,.0f} units against {quantity:,.0f} invoiced.")
            score += 3
        grn_date = _parse_date(grn.get("date"))
        inv_date = _parse_date((invoice.get("dates") or {}).get("invoice_date"))
        if grn_date and inv_date and grn_date > inv_date:
            warnings.append("GRN was posted after the invoice date; hold disbursement until goods receipt is confirmed.")
            score += 1

    if not delivery:
        warnings.append("Missing delivery confirmation / POD evidence.")
        score += 0.5
    else:
        matched_documents.append("Delivery")
        delivered_qty = _safe_float(delivery.get("quantity") or delivery.get("delivered_quantity"))
        if delivered_qty and delivered_qty < quantity * 0.95:
            violations.append(f"Delivery confirmation covers only {delivered_qty:,.0f} units against {quantity:,.0f} billed.")
            score += 3
        status = str(delivery.get("status", "")).strip().lower()
        if status in {"partial", "pending", "returned", "cancelled"}:
            violations.append(f"Delivery status is marked as '{status}', not fully completed.")
            score += 3

    flagged = bool(violations or score >= 3)
    match_quality = max(0.0, 1.0 - min(score, 10) / 10)

    return {
        "flagged": flagged,
        "score": min(round(score, 2), 10),
        "coverage_ratio": coverage_ratio,
        "matched_documents": matched_documents,
        "match_quality": round(match_quality, 2),
        "violations": violations,
        "warnings": warnings,
        "verdict": "ERP RECONCILIATION GAPS DETECTED" if flagged else "ERP records align with invoice",
    }


def detect_relationship_gap(invoice: Dict[str, Any], graph_builder: Optional[Any] = None) -> Dict[str, Any]:
    """Flag new or unsupported buyer-supplier links that lack prior topology support."""
    supplier_id = invoice.get("supplier_id") or invoice.get("supplier")
    buyer_id = invoice.get("buyer_id") or invoice.get("buyer")
    obligation_edges = [tuple(edge) for edge in (invoice.get("obligation_edges") or []) if len(edge) >= 2]

    graph_edges: List[tuple] = []
    if graph_builder:
        try:
            graph_edges = [tuple(edge) for edge in (graph_builder.get_all_edges() or []) if len(edge) >= 2]
        except Exception:
            graph_edges = []

    all_edges = set(graph_edges + obligation_edges)
    direct_relationship = (supplier_id, buyer_id) in all_edges

    supplier_neighbors = {target for source, target in all_edges if source == supplier_id}
    buyer_neighbors = {source for source, target in all_edges if target == buyer_id}
    shared_neighbors = supplier_neighbors.intersection(buyer_neighbors)

    violations: List[str] = []
    score = 0.0

    if not direct_relationship:
        violations.append("Buyer-supplier pair is missing from the known relationship graph.")
        score += 3
    if not supplier_neighbors:
        violations.append("Supplier has no historical outbound trade links in the topology.")
        score += 2
    if not buyer_neighbors:
        violations.append("Buyer has no established upstream supplier links in the topology.")
        score += 2
    if not shared_neighbors and not direct_relationship and len(all_edges) >= 3:
        violations.append("No intermediary path connects the parties across adjacent tiers.")
        score += 2

    tier_level = _safe_int(invoice.get("tier_level"), 1)
    related_invoices = _build_invoice_chain(invoice)
    if tier_level > 1 and len(related_invoices) <= 1:
        violations.append("Mid-tier financing request has no upstream/downstream corroborating invoices.")
        score += 2

    flagged = score >= 3
    return {
        "flagged": flagged,
        "score": min(round(score, 2), 10),
        "direct_relationship": direct_relationship,
        "supplier_degree": len(supplier_neighbors),
        "buyer_degree": len(buyer_neighbors),
        "shared_neighbors": len(shared_neighbors),
        "violations": violations,
        "verdict": "RELATIONSHIP GAP DETECTED" if flagged else "Topology supports the buyer-supplier link",
    }


def monitor_dilution_risk(invoice: Dict[str, Any]) -> Dict[str, Any]:
    """Monitor post-invoice cash collections to detect dilution and repayment weakness."""
    cash_flow = invoice.get("cash_flow") or {}
    expected_amount = _safe_float(cash_flow.get("expected_payments") or cash_flow.get("expected_amount"), _safe_float(invoice.get("amount")))
    realized_amount = _safe_float(cash_flow.get("realized_payments") or cash_flow.get("collected_amount"))
    overdue_days = _safe_int(cash_flow.get("overdue_days"))
    returns_ratio = _safe_float(cash_flow.get("returns_ratio"))
    credit_notes_ratio = _safe_float(cash_flow.get("credit_notes_ratio"))

    dilution_ratio = cash_flow.get("dilution_ratio")
    if dilution_ratio in (None, ""):
        if expected_amount > 0:
            dilution_ratio = max(0.0, 1.0 - (realized_amount / expected_amount))
        else:
            dilution_ratio = 0.0
    dilution_ratio = _safe_float(dilution_ratio)
    collection_gap = max(expected_amount - realized_amount, 0.0)

    violations: List[str] = []
    score = 0.0

    if dilution_ratio >= 0.15:
        violations.append(f"Dilution ratio is {dilution_ratio:.0%}, above the 15% early-warning threshold.")
        score += 4
    if overdue_days >= 45:
        violations.append(f"Cash collections are {overdue_days} days overdue.")
        score += 3
    if returns_ratio >= 0.1:
        violations.append(f"Returns / disputes ratio is elevated at {returns_ratio:.0%}.")
        score += 2
    if credit_notes_ratio >= 0.08:
        violations.append(f"Credit notes ratio is {credit_notes_ratio:.0%}, suggesting dilution or over-billing.")
        score += 2

    flagged = score >= 3
    return {
        "flagged": flagged,
        "score": min(round(score, 2), 10),
        "dilution_ratio": round(dilution_ratio, 3),
        "collection_gap": round(collection_gap, 2),
        "expected_amount": round(expected_amount, 2),
        "realized_amount": round(realized_amount, 2),
        "overdue_days": overdue_days,
        "returns_ratio": round(returns_ratio, 3),
        "credit_notes_ratio": round(credit_notes_ratio, 3),
        "violations": violations,
        "verdict": "DILUTION RISK DETECTED" if flagged else "Collections trend is within expected range",
    }


def evaluate_revenue_feasibility(invoice: Dict[str, Any]) -> Dict[str, Any]:
    """Compare supplier revenue capacity against the invoice and financed volume."""
    profile = invoice.get("supplier_profile") or {}
    annual_revenue = _safe_float(profile.get("annual_revenue"))
    monthly_revenue = _safe_float(profile.get("monthly_revenue"))
    if monthly_revenue <= 0 and annual_revenue > 0:
        monthly_revenue = annual_revenue / 12.0

    current_month_volume = _safe_float(profile.get("current_month_financed_volume"))
    employee_count = _safe_int(profile.get("employee_count"))
    facility_count = _safe_int(profile.get("facility_count"), 1)

    amount = _safe_float(invoice.get("amount"))
    projected_month_volume = current_month_volume + amount
    invoice_to_monthly_revenue = amount / monthly_revenue if monthly_revenue > 0 else 0.0
    volume_to_monthly_revenue = projected_month_volume / monthly_revenue if monthly_revenue > 0 else 0.0
    amount_per_employee = projected_month_volume / max(employee_count, 1) if employee_count > 0 else projected_month_volume

    violations: List[str] = []
    warnings: List[str] = []
    score = 0.0

    if monthly_revenue <= 0:
        warnings.append("Supplier revenue profile missing; feasibility checks are partially inferred.")
    else:
        if invoice_to_monthly_revenue >= 0.6:
            violations.append(f"Single invoice equals {invoice_to_monthly_revenue:.0%} of monthly supplier revenue.")
            score += 4
        if volume_to_monthly_revenue >= 1.2:
            violations.append(f"Projected monthly financed volume reaches {volume_to_monthly_revenue:.0%} of monthly revenue.")
            score += 4

    if employee_count and amount_per_employee > 300_000:
        violations.append(f"Financed volume implies ${amount_per_employee:,.0f} per employee this month.")
        score += 2
    if facility_count and facility_count <= 1 and amount >= 5_000_000:
        violations.append("High-value invoice routed through a single-facility supplier footprint.")
        score += 1.5

    flagged = score >= 3
    phantom_probability = min(round(score / 10.0, 2), 1.0)
    return {
        "flagged": flagged,
        "score": min(round(score, 2), 10),
        "monthly_revenue": round(monthly_revenue, 2),
        "projected_month_volume": round(projected_month_volume, 2),
        "invoice_to_monthly_revenue": round(invoice_to_monthly_revenue, 2),
        "volume_to_monthly_revenue": round(volume_to_monthly_revenue, 2),
        "amount_per_employee": round(amount_per_employee, 2),
        "phantom_probability": phantom_probability,
        "violations": violations,
        "warnings": warnings,
        "verdict": "REVENUE FEASIBILITY BREACH" if flagged else "Supplier scale is broadly consistent with invoice volume",
    }


def detect_tier_velocity_anomalies(invoice: Dict[str, Any]) -> Dict[str, Any]:
    """Detect rapid cross-tier financing bursts and sequencing anomalies."""
    chain = _build_invoice_chain(invoice)
    if len(chain) <= 1:
        return {
            "flagged": False,
            "score": 0,
            "tiers_observed": len({node.get('tier_level') for node in chain if node.get('tier_level')}),
            "chain_depth": len(chain),
            "median_gap_hours": None,
            "rapid_hops": 0,
            "same_day_hops": 0,
            "out_of_order_links": 0,
            "verdict": "No multi-tier sequence available",
        }

    gaps_hours: List[float] = []
    rapid_hops = 0
    same_day_hops = 0
    out_of_order_links = 0

    for previous, current in zip(chain, chain[1:]):
        prev_date = _parse_date(previous.get("finance_request_date"))
        curr_date = _parse_date(current.get("finance_request_date"))
        if not prev_date or not curr_date:
            continue
        gap_hours = abs((curr_date - prev_date).total_seconds()) / 3600.0
        gaps_hours.append(gap_hours)
        if gap_hours <= 72:
            rapid_hops += 1
        if gap_hours <= 24:
            same_day_hops += 1
        if curr_date < prev_date:
            out_of_order_links += 1

    amount_buckets = Counter(round(_safe_float(node.get("amount")) / 10_000) * 10_000 for node in chain if _safe_float(node.get("amount")) > 0)
    repeated_amounts = sum(1 for count in amount_buckets.values() if count > 1)

    score = 0.0
    violations: List[str] = []
    if rapid_hops >= 2:
        violations.append(f"{rapid_hops} tier transitions financed within 72 hours.")
        score += 4
    if same_day_hops >= 1:
        violations.append("At least one tier hop was financed within the same day.")
        score += 2
    if out_of_order_links > 0:
        violations.append("Tier financing sequence is temporally out of order.")
        score += 2
    if repeated_amounts >= 1 and len(chain) >= 3:
        violations.append("Repeated invoice values propagate across multiple tiers.")
        score += 2

    median_gap_hours = None
    if gaps_hours:
        sorted_gaps = sorted(gaps_hours)
        median_gap_hours = sorted_gaps[len(sorted_gaps) // 2]

    return {
        "flagged": score >= 3,
        "score": min(round(score, 2), 10),
        "tiers_observed": len({node.get("tier_level") for node in chain if node.get("tier_level")}),
        "chain_depth": len(chain),
        "median_gap_hours": round(median_gap_hours, 1) if median_gap_hours is not None else None,
        "rapid_hops": rapid_hops,
        "same_day_hops": same_day_hops,
        "out_of_order_links": out_of_order_links,
        "repeated_amount_clusters": repeated_amounts,
        "violations": violations,
        "verdict": "TIER VELOCITY ANOMALY DETECTED" if score >= 3 else "Tier sequence velocity is within normal bounds",
    }


def detect_carousel_trade_risk(invoice: Dict[str, Any], graph_builder: Optional[Any] = None) -> Dict[str, Any]:
    """Use graph analytics to expose carousel-style circular trade structures."""
    obligation_edges = [tuple(edge) for edge in (invoice.get("obligation_edges") or []) if len(edge) >= 2]
    graph_edges: List[tuple] = []
    if graph_builder:
        try:
            graph_edges = [tuple(edge) for edge in (graph_builder.get_all_edges() or []) if len(edge) >= 2]
        except Exception:
            graph_edges = []

    edges = list(dict.fromkeys(obligation_edges + graph_edges))
    if not edges:
        return {
            "flagged": False,
            "score": 0,
            "triangle_count": 0,
            "top_hubs": [],
            "verdict": "No graph edges available for carousel screening",
        }

    triangles = analyze_triangle_patterns(edges)
    centrality = calculate_centrality_scores(edges)
    top_hubs = centrality.get("top_hubs", [])[:3]

    score = 0.0
    violations: List[str] = []
    if triangles.get("count", 0) > 0:
        violations.append(f"{triangles.get('count', 0)} directed trade triangle(s) detected.")
        score += min(triangles.get("count", 0) * 2, 6)
    if top_hubs and top_hubs[0].get("hub_score", 0) >= 0.2:
        violations.append(f"Hub concentration detected around {top_hubs[0].get('node')}.")
        score += 2

    return {
        "flagged": score >= 3,
        "score": min(round(score, 2), 10),
        "triangle_count": triangles.get("count", 0),
        "triangles": triangles.get("triangles", [])[:5],
        "top_hubs": top_hubs,
        "violations": violations,
        "verdict": "CAROUSEL TRADE RISK DETECTED" if score >= 3 else "No strong carousel pattern detected",
    }


def correlate_cross_tier_cascade(invoice: Dict[str, Any]) -> Dict[str, Any]:
    """Correlate related invoices to estimate repeated financing across tiers."""
    chain = _build_invoice_chain(invoice)
    if len(chain) <= 1:
        amount = _safe_float(invoice.get("amount"))
        return {
            "flagged": False,
            "score": 0,
            "chain_depth": 1,
            "total_chain_amount": round(amount, 2),
            "financing_multiplier": 1.0,
            "distinct_lenders": 1 if invoice.get("lender_id") else 0,
            "timeline": [],
            "verdict": "No cross-tier cascade observed",
        }

    current_amount = _safe_float(invoice.get("amount"), 1.0)
    total_chain_amount = sum(_safe_float(node.get("amount")) for node in chain)
    financing_multiplier = total_chain_amount / max(current_amount, 1.0)
    distinct_lenders = len({node.get("lender_id") for node in chain if node.get("lender_id")})
    repeated_counterparties = len({
        (node.get("supplier_id"), node.get("buyer_id"))
        for node in chain
        if node.get("supplier_id") and node.get("buyer_id")
    })

    timeline = []
    for node in chain:
        timeline.append({
            "id": node.get("id"),
            "tier": node.get("tier_level"),
            "amount": round(_safe_float(node.get("amount")), 2),
            "date": node.get("finance_request_date") or node.get("invoice_date") or "unknown",
            "supplier_id": node.get("supplier_id"),
            "buyer_id": node.get("buyer_id"),
        })

    violations: List[str] = []
    score = 0.0
    if len(chain) >= 3:
        violations.append(f"{len(chain)} linked invoices detected across the cascade.")
        score += 2
    if financing_multiplier >= 2:
        violations.append(f"Financing multiplier reaches {financing_multiplier:.2f}x across tiers.")
        score += 4
    if distinct_lenders >= 2:
        violations.append(f"Cascade spans {distinct_lenders} lenders, raising double-financing risk.")
        score += 2
    if repeated_counterparties < len(chain) - 1:
        violations.append("Repeated counterparties suggest recycling through the same relationship chain.")
        score += 1

    return {
        "flagged": score >= 3,
        "score": min(round(score, 2), 10),
        "chain_depth": len(chain),
        "total_chain_amount": round(total_chain_amount, 2),
        "financing_multiplier": round(financing_multiplier, 2),
        "distinct_lenders": distinct_lenders,
        "timeline": timeline,
        "violations": violations,
        "verdict": "CROSS-TIER CASCADE DETECTED" if score >= 3 else "No amplified cascade pattern detected",
    }


def build_pre_disbursement_warning(
    amount: float,
    erp_reconciliation: Dict[str, Any],
    relationship_gap: Dict[str, Any],
    dilution_risk: Dict[str, Any],
    revenue_feasibility: Dict[str, Any],
    tier_velocity: Dict[str, Any],
    carousel_risk: Dict[str, Any],
    cascade_correlation: Dict[str, Any],
) -> Dict[str, Any]:
    """Summarize the strongest red flags into a lender-facing early warning."""
    risk_order = [
        ("ERP mismatch", erp_reconciliation),
        ("Relationship gap", relationship_gap),
        ("Dilution risk", dilution_risk),
        ("Revenue feasibility", revenue_feasibility),
        ("Tier velocity anomaly", tier_velocity),
        ("Carousel risk", carousel_risk),
        ("Cascade correlation", cascade_correlation),
    ]

    red_flags: List[str] = []
    total_score = 0.0
    for label, result in risk_order:
        component_score = _safe_float(result.get("score"))
        total_score += component_score
        if result.get("flagged"):
            detail = ""
            if result.get("violations"):
                detail = str(result["violations"][0])
            red_flags.append(f"{label}: {detail}".strip())

    cascade_multiplier = max(_safe_float(cascade_correlation.get("financing_multiplier")), 1.0)
    estimated_exposure = amount * cascade_multiplier

    if total_score >= 16 or len(red_flags) >= 4:
        recommended_action = "BLOCK"
        urgency = "critical"
    elif total_score >= 8 or len(red_flags) >= 2:
        recommended_action = "HOLD"
        urgency = "high"
    else:
        recommended_action = "APPROVE"
        urgency = "moderate"

    return {
        "red_flags": red_flags[:5],
        "recommended_action": recommended_action,
        "urgency": urgency,
        "estimated_exposure_at_risk": round(estimated_exposure, 2),
        "summary": (
            f"Pre-disbursement warning suggests {recommended_action} with {urgency} urgency. "
            f"Estimated chain exposure at risk is ${estimated_exposure:,.2f}."
        ),
    }


def analyze_scf_intelligence(invoice: Dict[str, Any], graph_builder: Optional[Any] = None) -> Dict[str, Any]:
    """Run SCF-native analytics aligned to multi-tier supply-chain finance fraud."""
    erp_reconciliation = validate_erp_reconciliation(invoice)
    relationship_gap = detect_relationship_gap(invoice, graph_builder)
    dilution_risk = monitor_dilution_risk(invoice)
    revenue_feasibility = evaluate_revenue_feasibility(invoice)
    tier_velocity = detect_tier_velocity_anomalies(invoice)
    carousel_risk = detect_carousel_trade_risk(invoice, graph_builder)
    cascade_correlation = correlate_cross_tier_cascade(invoice)

    total_score = min(
        erp_reconciliation.get("score", 0)
        + relationship_gap.get("score", 0)
        + dilution_risk.get("score", 0)
        + revenue_feasibility.get("score", 0)
        + tier_velocity.get("score", 0)
        + carousel_risk.get("score", 0)
        + cascade_correlation.get("score", 0),
        30,
    )
    normalized_score = round(min(total_score / 3.0, 10), 2)
    flagged = normalized_score >= 3 or any(
        section.get("flagged")
        for section in (
            erp_reconciliation,
            relationship_gap,
            dilution_risk,
            revenue_feasibility,
            tier_velocity,
            carousel_risk,
            cascade_correlation,
        )
    )

    early_warning = build_pre_disbursement_warning(
        amount=_safe_float(invoice.get("amount")),
        erp_reconciliation=erp_reconciliation,
        relationship_gap=relationship_gap,
        dilution_risk=dilution_risk,
        revenue_feasibility=revenue_feasibility,
        tier_velocity=tier_velocity,
        carousel_risk=carousel_risk,
        cascade_correlation=cascade_correlation,
    )

    return {
        "flagged": flagged,
        "score": normalized_score,
        "erp_reconciliation": erp_reconciliation,
        "relationship_gap": relationship_gap,
        "dilution_risk": dilution_risk,
        "revenue_feasibility": revenue_feasibility,
        "tier_velocity": tier_velocity,
        "carousel_risk": carousel_risk,
        "cascade_correlation": cascade_correlation,
        "early_warning": early_warning,
        "verdict": "SCF INTELLIGENCE ALERT" if flagged else "SCF checks clear",
    }
