'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnalysisResult } from '@/types';
import DecisionBanner from './DecisionBanner';
import LayerCard from './LayerCard';
import PhysicsDetails from './PhysicsDetails';
import DNADetails from './DNADetails';
import GraphVisualization from './GraphVisualization';
import AIExplanation from './AIExplanation';
import SCFIntelligencePanel from './SCFIntelligencePanel';
import ExecutiveBriefPanel from './ExecutiveBriefPanel';
import { Layers, Sparkles } from 'lucide-react';
import { JsonView, allExpanded, defaultStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';

interface ResultsPanelProps {
  result: AnalysisResult | null;
}

export default function ResultsPanel({ result }: ResultsPanelProps) {
  const [activeTab, setActiveTab] = useState<'brief' | 'overview' | 'physics' | 'dna' | 'graph' | 'scf' | 'raw'>('brief');

  if (!result) {
    return (
      <div className="surface flex min-h-[720px] flex-col items-center justify-center px-8 py-12 text-center">
        <div className="rounded-full bg-white/[0.04] p-6">
          <Layers className="h-12 w-12 text-[var(--text-muted)]" />
        </div>
        <h3 className="mt-6 text-2xl font-bold text-white">Analysis workspace is ready</h3>
        <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--text-secondary)]">
          Run a demo scenario or submit an enriched invoice to open the executive brief, SCF control panel, graph intelligence,
          and fraud-layer diagnostics.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/8 px-4 py-2 text-sm text-[var(--text-secondary)]">
            <Sparkles className="h-4 w-4 text-[var(--accent-cyan)]" />
            Best first run: Phantom Cascade
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/8 px-4 py-2 text-sm text-[var(--text-secondary)]">
            ERP, cash-flow, and supplier inputs unlock deeper SCF insights
          </div>
        </div>
      </div>
    );
  }

  const scf = result.results.scf;
  const exposure = result.results.exposure;

  const tabs = [
    { id: 'brief', label: 'Executive Brief', badge: null },
    { id: 'overview', label: 'Signal Summary', badge: result.layers_flagged.length ? String(result.layers_flagged.length) : null },
    {
      id: 'physics',
      label: 'Physics',
      badge: result.results.physics.routing.flagged || result.results.physics.capacity.flagged || result.results.physics.causality.flagged ? '!' : null,
    },
    {
      id: 'dna',
      label: 'DNA',
      badge: result.results.dna.status !== 'NEW' || result.results.dna.behavioral.flagged ? '!' : null,
    },
    { id: 'graph', label: 'Network', badge: result.results.graph.flagged ? '!' : null },
    { id: 'scf', label: 'SCF Control', badge: scf?.flagged ? '!' : null },
    { id: 'raw', label: 'Raw Intel', badge: null },
  ];

  const signalDigest = [
    scf?.early_warning.summary,
    scf?.erp_reconciliation.flagged
      ? `ERP coverage is only ${Math.round(scf.erp_reconciliation.coverage_ratio * 100)}%.`
      : null,
    scf?.dilution_risk.flagged
      ? `Dilution ratio is ${Math.round(scf.dilution_risk.dilution_ratio * 100)}% with ${scf.dilution_risk.overdue_days} overdue days.`
      : null,
    result.results.dna.psi.flagged
      ? `Cross-lender duplicate financing exposure detected across ${result.results.dna.psi.count} lenders.`
      : null,
    result.results.graph.flagged
      ? `${result.results.graph.cycles_found} suspicious trade cycles were detected in the counterparty network.`
      : null,
    result.results.physics.routing.flagged ? result.results.physics.routing.verdict : null,
  ].filter(Boolean) as string[];

  return (
    <div className="space-y-6">
      <DecisionBanner
        decision={result.decision}
        riskScore={result.risk_score}
        confidence={result.confidence}
        invoiceId={result.invoice_id}
        layersFlagged={result.layers_flagged.length}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <LayerCard
          name="DNA"
          title="Invoice DNA"
          description="Fingerprint collisions and repeated financing patterns"
          isFlagged={result.results.dna.status !== 'NEW' || result.results.dna.behavioral.flagged}
          score={result.layer_scores.dna}
          delay={0}
        />
        <LayerCard
          name="PHYSICS"
          title="Trade Reality"
          description="Route feasibility, timing, and supplier capacity validation"
          isFlagged={result.layers_flagged.includes('PHYSICS')}
          score={result.layer_scores.physics}
          delay={0.05}
        />
        <LayerCard
          name="GRAPH"
          title="Network Graph"
          description="Carousel trades, communities, and suspicious topology"
          isFlagged={result.results.graph.flagged}
          score={result.layer_scores.graph}
          delay={0.1}
        />
        <LayerCard
          name="SCF"
          title="SCF Control Tower"
          description="ERP evidence, dilution, feasibility, and cascade correlation"
          isFlagged={Boolean(scf?.flagged)}
          score={result.layer_scores.scf || 0}
          delay={0.15}
        />
      </div>

      <div className="surface overflow-hidden">
        <div className="flex overflow-x-auto border-b border-white/8 bg-black/10 custom-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`relative whitespace-nowrap px-5 py-4 text-sm font-semibold transition ${
                activeTab === tab.id
                  ? 'text-white'
                  : 'text-[var(--text-secondary)] hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="ml-2 rounded-full bg-[rgba(255,107,107,0.12)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--accent-red)]">
                  {tab.badge}
                </span>
              )}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="results-tab"
                  className="absolute inset-x-4 bottom-0 h-0.5 rounded-full bg-[linear-gradient(90deg,#4ecbff,#4d7cff)]"
                />
              )}
            </button>
          ))}
        </div>

        <div className="p-6 md:p-7">
          <AnimatePresence mode="wait">
            {activeTab === 'brief' && (
              <motion.div key="brief" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-6">
                <ExecutiveBriefPanel result={result} />
                <AIExplanation explanation={result.explanation} decision={result.decision} />
              </motion.div>
            )}

            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                  <div className="metric-tile">
                    <div className="section-kicker">Processing time</div>
                    <div className="mt-3 text-3xl font-bold text-white">{result.processing_time_seconds.toFixed(1)}s</div>
                  </div>
                  <div className="metric-tile">
                    <div className="section-kicker">Layers flagged</div>
                    <div className="mt-3 text-3xl font-bold text-white">{result.layers_flagged.length}</div>
                  </div>
                  <div className="metric-tile">
                    <div className="section-kicker">Duplicate lenders</div>
                    <div className="mt-3 text-3xl font-bold text-white">{result.results.dna.psi.count}</div>
                  </div>
                  <div className="metric-tile">
                    <div className="section-kicker">Trade cycles</div>
                    <div className="mt-3 text-3xl font-bold text-white">{result.results.graph.cycles_found}</div>
                  </div>
                  <div className="metric-tile">
                    <div className="section-kicker">Exposure at risk</div>
                    <div className="mt-3 text-3xl font-bold text-white">
                      ${(((exposure?.downstream_exposure_if_blocked || scf?.early_warning.estimated_exposure_at_risk || 0) / 1_000_000) || 0).toFixed(1)}M
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.05fr,0.95fr]">
                  <div className="surface-muted p-5">
                    <div className="section-kicker">Top Signals</div>
                    <div className="mt-4 space-y-3">
                      {signalDigest.length > 0 ? (
                        signalDigest.map((signal) => (
                          <div key={signal} className="rounded-2xl border border-white/8 bg-black/15 px-4 py-3 text-sm leading-6 text-[var(--text-secondary)]">
                            {signal}
                          </div>
                        ))
                      ) : (
                        <div className="rounded-2xl border border-[rgba(45,212,191,0.22)] bg-[rgba(45,212,191,0.08)] px-4 py-3 text-sm text-[var(--text-secondary)]">
                          No high-severity anomalies were detected for this invoice.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="surface-muted p-5">
                    <div className="section-kicker">Telemetry</div>
                    <div className="mt-4 grid gap-3">
                      <div className="rounded-2xl border border-white/8 bg-black/15 px-4 py-4">
                        <div className="section-kicker">Recommended action</div>
                        <div className="mt-2 text-xl font-bold text-white">{scf?.early_warning.recommended_action || result.decision}</div>
                        <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                          {scf?.early_warning.summary || result.explanation}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-white/8 bg-black/15 px-4 py-4">
                        <div className="section-kicker">Timestamp</div>
                        <div className="mt-2 text-sm font-semibold text-white">{new Date(result.timestamp).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'physics' && (
              <motion.div key="physics" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <PhysicsDetails physics={result.results.physics} />
              </motion.div>
            )}

            {activeTab === 'dna' && (
              <motion.div key="dna" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <DNADetails dna={result.results.dna} />
              </motion.div>
            )}

            {activeTab === 'graph' && (
              <motion.div key="graph" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <GraphVisualization graph={result.results.graph} />
              </motion.div>
            )}

            {activeTab === 'scf' && (
              <motion.div key="scf" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <SCFIntelligencePanel result={result} />
              </motion.div>
            )}

            {activeTab === 'raw' && (
              <motion.div
                key="raw"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="rounded-2xl border border-white/8 bg-black/20 p-4"
              >
                <JsonView data={result} shouldExpandNode={allExpanded} style={defaultStyles} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
