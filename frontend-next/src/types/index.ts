export interface InvoiceDates {
  po_date?: string;
  grn_date?: string;
  invoice_date?: string;
  finance_request_date?: string;
  delivery_date?: string;
  payment_date?: string;
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
}

export type Decision = 'APPROVE' | 'HOLD' | 'BLOCK';

export interface DNAResult {
  fingerprint: string;
  status: 'NEW' | 'DUPLICATE' | 'FUZZY_MATCH';
  original_id?: string;
  similar_ids?: string[];
  behavioral: {
    submissions_last_hour: number;
    anomaly_score: number;
    flagged: boolean;
  };
  psi: {
    lenders_affected: string[];
    count: number;
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
  };
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
  };
  results: {
    dna: DNAResult;
    physics: PhysicsResult;
    graph: GraphResult;
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
