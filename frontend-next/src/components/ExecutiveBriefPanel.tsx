'use client';

import { motion } from 'framer-motion';
import { AnalysisResult } from '@/types';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { AlertTriangle, ArrowRight, Banknote, CircleDashed, Network, ShieldCheck } from 'lucide-react';

interface ExecutiveBriefPanelProps {
  result: AnalysisResult;
}

function buildHighlights(result: AnalysisResult) {
  const highlights: string[] = [];
  const scf = result.results.scf;
  const physics = result.results.physics;
  const dna = result.results.dna;
  const graph = result.results.graph;

  if (scf?.erp_reconciliation.flagged) {
    highlights.push(
      `ERP evidence is incomplete: only ${Math.round(scf.erp_reconciliation.coverage_ratio * 100)}% of expected PO, GRN, and delivery proof aligned.`,
    );
  }

  if (scf && scf.cascade_correlation.financing_multiplier > 1.2) {
    highlights.push(
      `Cross-tier cascading expands exposure to ${formatNumber(scf.cascade_correlation.financing_multiplier, 2)}x across ${scf.cascade_correlation.distinct_lenders} lenders.`,
    );
  }

  if (scf?.dilution_risk.flagged) {
    highlights.push(
      `Collections quality deteriorated materially with ${Math.round(scf.dilution_risk.dilution_ratio * 100)}% dilution and ${scf.dilution_risk.overdue_days} overdue days.`,
    );
  }

  if (dna.psi.flagged) {
    highlights.push(`Invoice DNA shows cross-lender duplication across ${dna.psi.count} known lenders, indicating repeated financing risk.`);
  }

  if (physics.routing.flagged) {
    highlights.push('Transit feasibility failed: claimed delivery timing is inconsistent with the route and transport mode.');
  }

  if (graph.flagged) {
    highlights.push(`Network analytics detected ${graph.cycles_found} suspicious trade cycles and elevated carousel-trade risk.`);
  }

  return highlights.slice(0, 4);
}

function buildActions(result: AnalysisResult) {
  const actions: string[] = [];
  const scf = result.results.scf;
  const physics = result.results.physics;
  const dna = result.results.dna;
  const graph = result.results.graph;

  actions.push(result.decision === 'APPROVE' ? 'Proceed with standard funding controls and post-disbursement monitoring.' : 'Stop or pause disbursement until documentary, network, and repayment anomalies are resolved.');

  if (scf?.erp_reconciliation.flagged) {
    actions.push('Request buyer-confirmed PO, GRN, and delivery evidence directly from ERP or trusted counterparty channels.');
  }

  if (dna.psi.flagged || (scf && scf.cascade_correlation.distinct_lenders > 1)) {
    actions.push('Coordinate with financing partners to compare invoice fingerprints and prevent duplicate drawdown across lenders.');
  }

  if (scf?.dilution_risk.flagged) {
    actions.push('Review collections, returns, and credit notes before advancing additional limits to the supplier program.');
  }

  if (physics.capacity.flagged || scf?.revenue_feasibility.flagged) {
    actions.push('Validate supplier capacity, staffing, and turnover against the claimed invoice and monthly financed volume.');
  }

  if (graph.flagged) {
    actions.push('Escalate linked entities and hubs for graph-based due diligence to confirm there is no carousel or pass-through trading ring.');
  }

  return Array.from(new Set(actions)).slice(0, 4);
}

export default function ExecutiveBriefPanel({ result }: ExecutiveBriefPanelProps) {
  const scf = result.results.scf;
  const exposureAtRisk = scf?.early_warning.estimated_exposure_at_risk || result.results.exposure?.downstream_exposure_if_blocked || 0;
  const highlights = buildHighlights(result);
  const actions = buildActions(result);

  const headlineMetrics = [
    {
      label: 'Decision',
      value: result.decision,
      icon: ShieldCheck,
      hint: `${result.layers_flagged.length} layers escalated`,
    },
    {
      label: 'Exposure At Risk',
      value: formatCurrency(exposureAtRisk),
      icon: Banknote,
      hint: 'Counterfactual capital preserved',
    },
    {
      label: 'Cascade Multiplier',
      value: scf ? `${formatNumber(scf.cascade_correlation.financing_multiplier, 2)}x` : 'N/A',
      icon: Network,
      hint: scf ? `${scf.cascade_correlation.chain_depth} linked invoices observed` : 'No SCF chain attached',
    },
    {
      label: 'Processing Time',
      value: `${formatNumber(result.processing_time_seconds, 1)}s`,
      icon: CircleDashed,
      hint: 'Real-time pre-disbursement analysis',
    },
  ];

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr,0.85fr]">
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="surface-muted p-6"
      >
        <div className="section-kicker">Executive Brief</div>
        <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-white">What happened, why it matters, and what to do next</h3>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {headlineMetrics.map(({ label, value, hint, icon: Icon }) => (
            <div key={label} className="metric-tile">
              <div className="flex items-center justify-between">
                <span className="section-kicker">{label}</span>
                <Icon className="h-4 w-4 text-[var(--accent-cyan)]" />
              </div>
              <div className="mt-3 text-2xl font-bold text-white">{value}</div>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">{hint}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-black/15 p-5">
          <div className="section-kicker">Risk Narrative</div>
          <div className="mt-3 space-y-3">
            {highlights.length > 0 ? (
              highlights.map((highlight) => (
                <div key={highlight} className="flex gap-3 text-sm leading-6 text-[var(--text-secondary)]">
                  <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--accent-orange)]" />
                  <span>{highlight}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-[var(--text-secondary)]">
                No major anomalies were surfaced. The transaction appears operationally and commercially consistent.
              </p>
            )}
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="surface-muted p-6"
      >
        <div className="section-kicker">Action Playbook</div>
        <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-white">Analyst next steps</h3>
        <div className="mt-5 space-y-3">
          {actions.map((action, index) => (
            <div key={action} className="flex items-start gap-3 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-black/15 px-4 py-4">
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[rgba(78,203,255,0.12)] text-sm font-bold text-[var(--accent-cyan)]">
                {index + 1}
              </div>
              <div className="text-sm leading-6 text-[var(--text-secondary)]">{action}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-[rgba(78,203,255,0.16)] bg-[rgba(78,203,255,0.06)] p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <ArrowRight className="h-4 w-4 text-[var(--accent-cyan)]" />
            Why this is judge-friendly
          </div>
          <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
            The system does not just score fraud. It proves business impact, explains the signal chain, recommends lender action,
            and shows how exposure multiplies across a multi-tier network.
          </p>
        </div>
      </motion.section>
    </div>
  );
}
