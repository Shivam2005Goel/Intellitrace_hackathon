export interface InvoiceDates {
  po_date?: string;
  grn_date?: string;
  invoice_date?: string;
  finance_request_date?: string;
  delivery_date?: string;
  payment_date?: string;
  buyer_payment_date?: string;
}

export interface ERPDocumentRecord {
  id?: string;
  supplier_id?: string;
  buyer_id?: string;
  amount?: number;
  quantity?: number;
  items?: string[];
  date?: string;
  status?: string;
}

export interface ERPRecords {
  po?: ERPDocumentRecord;
  purchase_order?: ERPDocumentRecord;
  grn?: ERPDocumentRecord;
  goods_receipt?: ERPDocumentRecord;
  delivery?: ERPDocumentRecord;
  delivery_confirmation?: ERPDocumentRecord;
  pod?: ERPDocumentRecord;
}

export interface RelatedInvoice {
  id: string;
  tier_level: number;
  supplier_id?: string;
  buyer_id?: string;
  amount: number;
  finance_request_date?: string;
  invoice_date?: string;
  lender_id?: string;
}

export interface CashFlowProfile {
  expected_amount?: number;
  collected_amount?: number;
  expected_payments?: number;
  realized_payments?: number;
  overdue_days?: number;
  returns_ratio?: number;
  credit_notes_ratio?: number;
  dilution_ratio?: number;
}

export interface SupplierProfile {
  annual_revenue?: number;
  monthly_revenue?: number;
  current_month_financed_volume?: number;
  employee_count?: number;
  facility_count?: number;
}

export interface Invoice {
  id: string;
  supplier: string;
  supplier_id: string;
  buyer: string;
  buyer_id?: string;
  amount: number;
  items: string[];
  origin: string;
  destination: string;
  transport_mode: 'sea' | 'air' | 'road' | 'rail';
  claimed_days: number;
  quantity: number;
  dates: InvoiceDates;
  obligation_edges?: [string, string][];
  industry?: string;
  lender_id?: string;
  tier_level?: number;
  erp_records?: ERPRecords;
  related_invoices?: RelatedInvoice[];
  cash_flow?: CashFlowProfile;
  supplier_profile?: SupplierProfile;
  po_text?: string;
  grn_text?: string;
  bol_text?: string;
  invoice_text?: string;
}

export type Decision = 'APPROVE' | 'HOLD' | 'BLOCK';

export interface DNAResult {
  fingerprint: string;
  status: 'NEW' | 'DUPLICATE' | 'FUZZY_MATCH';
  original_id?: string;
  similar_ids?: string[];
  behavioral: {
    submissions_last_hour: number;
    submissions_last_24h?: number;
    anomaly_score: number;
    trust_score?: number;
    emerging_risk?: number;
    flagged: boolean;
    resonance_score?: number;
    dominant_period_days?: number | null;
  };
  psi: {
    lenders_affected: string[];
    count: number;
    other_count?: number;
    flagged: boolean;
    verdict: string;
  };
}

export interface RoutingResult {
  origin: string;
  destination: string;
  transport_mode: string;
  distance_km: number;
  total_minimum_days: number;
  claimed_days: number;
  physically_possible: boolean;
  flagged: boolean;
  severity: 'NONE' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  verdict: string;
}

export interface CapacityResult {
  supplier_id: string;
  max_monthly_capacity: number;
  claimed_quantity: number;
  excess_percentage: number;
  flagged: boolean;
  severity: string;
  verdict: string;
}

export interface CausalityResult {
  violations: string[];
  warnings?: string[];
  timeline?: Array<{ event: string; date: string }>;
  paradox_score: number;
  severity: string;
  flagged: boolean;
  verdict: string;
}

export interface PhysicsResult {
  routing: RoutingResult;
  capacity: CapacityResult;
  causality: CausalityResult;
  market_physics?: {
    flagged: boolean;
    violations: string[];
    market_physics_score: number;
  };
}

export interface GraphResult {
  cycles_found: number;
  fraud_rings: string[][];
  companies_involved: number;
  risk_score: number;
  severity: string;
  flagged: boolean;
  verdict: string;
  communities?: {
    num_communities: number;
    suspicious_community_count: number;
    isolation_score?: number;
  };
  tier_shifting?: {
    flagged: boolean;
    tier_shifting_score: number;
    violations: string[];
  };
  shadow_tier?: {
    flagged: boolean;
    shadow_tier_score: number;
    shadow_suppliers: number;
  };
  cash_rebound?: {
    flagged: boolean;
    cash_rebound_score: number;
    violations: string[];
  };
}

export interface SCFSection {
  flagged: boolean;
  score: number;
  verdict: string;
  violations?: string[];
  warnings?: string[];
}

export interface ERPReconciliationResult extends SCFSection {
  coverage_ratio: number;
  matched_documents: string[];
  match_quality: number;
}

export interface RelationshipGapResult extends SCFSection {
  direct_relationship: boolean;
  supplier_degree: number;
  buyer_degree: number;
  shared_neighbors: number;
}

export interface DilutionRiskResult extends SCFSection {
  dilution_ratio: number;
  collection_gap: number;
  expected_amount: number;
  realized_amount: number;
  overdue_days: number;
  returns_ratio: number;
  credit_notes_ratio: number;
}

export interface RevenueFeasibilityResult extends SCFSection {
  monthly_revenue: number;
  projected_month_volume: number;
  invoice_to_monthly_revenue: number;
  volume_to_monthly_revenue: number;
  amount_per_employee: number;
  phantom_probability: number;
}

export interface TierVelocityResult extends SCFSection {
  tiers_observed: number;
  chain_depth: number;
  median_gap_hours: number | null;
  rapid_hops: number;
  same_day_hops: number;
  out_of_order_links: number;
  repeated_amount_clusters?: number;
}

export interface CarouselRiskResult extends SCFSection {
  triangle_count: number;
  triangles?: string[][];
  top_hubs?: Array<{
    node: string;
    hub_score: number;
    pagerank: number;
    betweenness: number;
    in_degree: number;
    out_degree: number;
  }>;
}

export interface CascadeNode {
  id: string;
  tier: number;
  amount: number;
  date: string;
  supplier_id?: string;
  buyer_id?: string;
}

export interface CascadeCorrelationResult extends SCFSection {
  chain_depth: number;
  total_chain_amount: number;
  financing_multiplier: number;
  distinct_lenders: number;
  timeline: CascadeNode[];
}

export interface EarlyWarningResult {
  red_flags: string[];
  recommended_action: Decision;
  urgency: 'critical' | 'high' | 'moderate';
  estimated_exposure_at_risk: number;
  summary: string;
}

export interface SCFResult {
  flagged: boolean;
  score: number;
  verdict: string;
  erp_reconciliation: ERPReconciliationResult;
  relationship_gap: RelationshipGapResult;
  dilution_risk: DilutionRiskResult;
  revenue_feasibility: RevenueFeasibilityResult;
  tier_velocity: TierVelocityResult;
  carousel_risk: CarouselRiskResult;
  cascade_correlation: CascadeCorrelationResult;
  early_warning: EarlyWarningResult;
}

export interface AnalysisResult {
  invoice_id: string;
  decision: Decision;
  confidence: number;
  risk_score: number;
  layers_flagged: string[];
  layer_scores: {
    dna: number;
    physics: number;
    graph: number;
    scf?: number;
    llm?: number;
  };
  results: {
    dna: DNAResult;
    physics: PhysicsResult;
    graph: GraphResult;
    scf?: SCFResult;
    exposure?: {
      downstream_exposure_if_blocked: number;
      cascade_multiplier?: number;
      related_invoice_count?: number;
      message: string;
    };
    personas?: Record<string, number>;
    consistency?: {
      flagged: boolean;
      consistency_score: number;
      violations: string[];
    };
    explanation: string;
  };
  explanation: string;
  processing_time_seconds: number;
  timestamp: string;
}

export interface HealthResponse {
  status: string;
  version: string;
  timestamp: string;
  services: {
    api: boolean;
    neo4j: boolean;
    redis: boolean;
  };
}
