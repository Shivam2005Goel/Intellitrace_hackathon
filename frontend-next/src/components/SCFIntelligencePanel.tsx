'use client';

import { motion } from 'framer-motion';
import { AnalysisResult } from '@/types';
import RiskGauge from '@/components/charts/RiskGauge';
import InvoiceTimeline from '@/components/dashboard/InvoiceTimeline';
import { formatCurrency, formatNumber } from '@/lib/utils';
import {
  AlertTriangle,
  Banknote,
  CheckCircle2,
  Clock,
  GitBranch,
  Network,
  Search,
  Shield,
} from 'lucide-react';

interface SCFIntelligencePanelProps {
  result: AnalysisResult;
}

function sectionTone(flagged: boolean) {
  return flagged
    ? 'border-[rgba(255,107,107,0.22)] bg-[rgba(255,107,107,0.06)]'
    : 'border-[rgba(45,212,191,0.22)] bg-[rgba(45,212,191,0.06)]';
}

export default function SCFIntelligencePanel({ result }: SCFIntelligencePanelProps) {
  const scf = result.results.scf;

  if (!scf) {
    return (
      <div className="surface-muted p-6">
        <h3 className="text-lg font-bold text-white">SCF Intelligence</h3>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">Advanced SCF analytics were not available for this run.</p>
      </div>
    );
  }

  const exposure = result.results.exposure;
  const personas = Object.entries(result.results.personas || {})
    .sort(([, left], [, right]) => right - left)
    .slice(0, 5);

  const summaryCards = [
    {
      label: 'Exposure At Risk',
      value: formatCurrency(scf.early_warning.estimated_exposure_at_risk),
      hint: exposure?.message || 'Counterfactual lender exposure',
      icon: Shield,
    },
    {
      label: 'Financing Multiplier',
      value: `${formatNumber(scf.cascade_correlation.financing_multiplier, 2)}x`,
      hint: `${scf.cascade_correlation.chain_depth} linked invoices across tiers`,
      icon: GitBranch,
    },
    {
      label: 'ERP Coverage',
      value: `${Math.round(scf.erp_reconciliation.coverage_ratio * 100)}%`,
      hint: `${scf.erp_reconciliation.matched_documents.length} matched documents`,
      icon: Search,
    },
    {
      label: 'Dilution Ratio',
      value: `${Math.round(scf.dilution_risk.dilution_ratio * 100)}%`,
      hint: `${scf.dilution_risk.overdue_days} overdue days`,
      icon: Banknote,
    },
  ];

  const diagnosticCards = [
    {
      title: 'ERP Reconciliation',
      icon: Search,
      result: scf.erp_reconciliation,
      metrics: [
        `Coverage ${Math.round(scf.erp_reconciliation.coverage_ratio * 100)}%`,
        `Match quality ${Math.round(scf.erp_reconciliation.match_quality * 100)}%`,
      ],
    },
    {
      title: 'Dilution Monitoring',
      icon: Banknote,
      result: scf.dilution_risk,
      metrics: [
        `Collection gap ${formatCurrency(scf.dilution_risk.collection_gap)}`,
        `Returns ${Math.round(scf.dilution_risk.returns_ratio * 100)}%`,
      ],
    },
    {
      title: 'Revenue Feasibility',
      icon: Shield,
      result: scf.revenue_feasibility,
      metrics: [
        `Invoice / revenue ${Math.round(scf.revenue_feasibility.invoice_to_monthly_revenue * 100)}%`,
        `Phantom probability ${Math.round(scf.revenue_feasibility.phantom_probability * 100)}%`,
      ],
    },
    {
      title: 'Tier Velocity',
      icon: Clock,
      result: scf.tier_velocity,
      metrics: [
        `${scf.tier_velocity.rapid_hops} rapid hops`,
        `${scf.tier_velocity.same_day_hops} same-day hops`,
      ],
    },
    {
      title: 'Relationship Gap',
      icon: Network,
      result: scf.relationship_gap,
      metrics: [
        `Supplier degree ${scf.relationship_gap.supplier_degree}`,
        `Buyer degree ${scf.relationship_gap.buyer_degree}`,
      ],
    },
    {
      title: 'Carousel Risk',
      icon: AlertTriangle,
      result: scf.carousel_risk,
      metrics: [
        `${scf.carousel_risk.triangle_count} directed triangles`,
        `${scf.carousel_risk.top_hubs?.[0]?.node || 'No dominant hub'}`,
      ],
    },
  ];

  const timelineEvents = scf.cascade_correlation.timeline.map((node, index, all) => ({
    id: node.id,
    title: `Tier ${node.tier} invoice`,
    description: `${node.supplier_id || 'Unknown supplier'} -> ${node.buyer_id || 'Unknown buyer'} for ${formatCurrency(node.amount)}`,
    timestamp: node.date,
    status: index === all.length - 1 ? 'current' as const : 'completed' as const,
  }));

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[300px,1fr]">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="surface-muted p-6"
        >
          <div className="section-kicker">SCF Control Tower</div>
          <div className="mt-3 flex justify-center">
            <RiskGauge value={Math.min(scf.score * 10, 100)} size={220} label={scf.early_warning.recommended_action} />
          </div>
          <div className="mt-4 rounded-2xl border border-white/8 bg-black/15 p-4">
            <div className="text-sm font-semibold text-white">{scf.early_warning.summary}</div>
            <div className="mt-3 flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              {scf.flagged ? (
                <AlertTriangle className="h-4 w-4 text-[var(--accent-red)]" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-[var(--accent-green)]" />
              )}
              <span>{scf.verdict}</span>
            </div>
          </div>
        </motion.section>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map(({ label, value, hint, icon: Icon }, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="metric-tile"
            >
              <div className="flex items-center justify-between">
                <span className="section-kicker">{label}</span>
                <Icon className="h-4 w-4 text-[var(--accent-cyan)]" />
              </div>
              <div className="mt-3 text-2xl font-bold text-white">{value}</div>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">{hint}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {diagnosticCards.map(({ title, icon: Icon, result: section, metrics }) => (
          <motion.article
            key={title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl border p-5 ${sectionTone(section.flagged)}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-base font-semibold text-white">{title}</div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">{section.verdict}</div>
              </div>
              <div className="rounded-xl bg-white/8 p-2">
                <Icon className={`h-4 w-4 ${section.flagged ? 'text-[var(--accent-red)]' : 'text-[var(--accent-green)]'}`} />
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm text-[var(--text-secondary)]">
              {metrics.map((metric) => (
                <div key={metric}>{metric}</div>
              ))}
            </div>
            {section.violations && section.violations.length > 0 && (
              <div className="mt-4 space-y-2">
                {section.violations.slice(0, 2).map((violation) => (
                  <div key={violation} className="rounded-xl border border-white/8 bg-black/15 px-3 py-2 text-sm text-[var(--text-secondary)]">
                    {violation}
                  </div>
                ))}
              </div>
            )}
          </motion.article>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr,0.85fr]">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="surface-muted p-6"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white">Cascade Timeline</h3>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">Linked financing requests across the trade chain</p>
            </div>
            <div className="rounded-full border border-[rgba(78,203,255,0.16)] bg-[rgba(78,203,255,0.06)] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent-cyan)]">
              {scf.cascade_correlation.distinct_lenders} lenders
            </div>
          </div>

          <div className="mt-5">
            {timelineEvents.length > 0 ? (
              <InvoiceTimeline events={timelineEvents} />
            ) : (
              <div className="rounded-2xl border border-white/8 bg-black/15 p-4 text-sm text-[var(--text-secondary)]">
                No linked cascade invoices were attached to this analysis.
              </div>
            )}
          </div>
        </motion.section>

        <div className="space-y-6">
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="surface-muted p-6"
          >
            <h3 className="text-lg font-bold text-white">Pre-Disbursement Red Flags</h3>
            <div className="mt-4 space-y-3">
              {scf.early_warning.red_flags.length > 0 ? (
                scf.early_warning.red_flags.map((flag) => (
                  <div key={flag} className="rounded-2xl border border-[rgba(255,107,107,0.2)] bg-[rgba(255,107,107,0.06)] px-4 py-3 text-sm text-[var(--text-secondary)]">
                    {flag}
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-[rgba(45,212,191,0.22)] bg-[rgba(45,212,191,0.06)] px-4 py-3 text-sm text-[var(--text-secondary)]">
                  No high-priority SCF red flags were generated for this invoice.
                </div>
              )}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="surface-muted p-6"
          >
            <h3 className="text-lg font-bold text-white">Fraud Typologies</h3>
            <div className="mt-4 space-y-3">
              {personas.length > 0 ? (
                personas.map(([name, score]) => (
                  <div key={name}>
                    <div className="mb-1 flex items-center justify-between text-sm text-white">
                      <span className="capitalize">{name.replace(/_/g, ' ')}</span>
                      <span>{Math.round(score * 100)}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/8">
                      <div
                        className="h-full rounded-full bg-[linear-gradient(90deg,#4ecbff,#ff8f6b)]"
                        style={{ width: `${Math.max(score * 100, 4)}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-[var(--text-secondary)]">No persona scores available.</div>
              )}
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
