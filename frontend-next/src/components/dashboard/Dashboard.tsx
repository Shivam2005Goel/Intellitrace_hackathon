'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { analyzeInvoice, healthCheck, testFraud, testLegitimate, testPhantomCascade } from '@/lib/api';
import InvoiceForm from '@/components/InvoiceForm';
import ResultsPanel from '@/components/ResultsPanel';
import ScenarioLauncher from '@/components/ScenarioLauncher';
import { AnalysisResult, Invoice } from '@/types';
import { AlertTriangle, ArrowRight, Banknote, Radar, Shield, ShieldCheck, Workflow } from 'lucide-react';

const challengeStats = [
  { label: 'Phantom invoices surfaced', value: '340', tone: 'text-[var(--accent-red)]' },
  { label: 'Exposure prevented', value: '$47M', tone: 'text-[var(--accent-orange)]' },
  { label: 'Supply-chain tiers covered', value: '3+', tone: 'text-[var(--accent-cyan)]' },
  { label: 'Fraud controls orchestrated', value: '9', tone: 'text-[var(--accent-green)]' },
];

const capabilityCards = [
  {
    title: 'Pre-disbursement evidence matching',
    description: 'Validates invoice claims against PO, GRN, and delivery confirmations before lender capital is released.',
    icon: ShieldCheck,
  },
  {
    title: 'Multi-tier exposure correlation',
    description: 'Maps how Tier 1, Tier 2, and Tier 3 transactions can multiply financing exposure across counterparties.',
    icon: Workflow,
  },
  {
    title: 'Collections and dilution monitoring',
    description: 'Brings repayment quality, disputes, returns, and credit notes into the fraud decision loop.',
    icon: Banknote,
  },
  {
    title: 'Lender-ready explainability',
    description: 'Translates graph, physics, DNA, and SCF signals into an analyst brief and action playbook.',
    icon: Radar,
  },
];

const dilutionScenario: Partial<Invoice> = {
  id: 'INV-DIL-2042',
  supplier: 'Harbor Steel Processing',
  supplier_id: 'SUP_T2_HARBOR',
  buyer: 'Vertex Assemblies',
  buyer_id: 'BUY_T1_VERTEX',
  amount: 1850000,
  items: ['rolled steel', 'coated sheets'],
  origin: 'mumbai',
  destination: 'delhi',
  transport_mode: 'road',
  claimed_days: 1.5,
  quantity: 420,
  lender_id: 'bank_east',
  tier_level: 2,
  dates: {
    po_date: '2026-03-01',
    invoice_date: '2026-03-05',
    finance_request_date: '2026-03-06',
    grn_date: '2026-03-16',
  },
  erp_records: {
    po: { id: 'PO-HS-881', amount: 1800000, quantity: 360, status: 'approved' },
    grn: { id: 'GRN-HS-212', quantity: 210, status: 'partial' },
    delivery: { id: 'DEL-HS-900', quantity: 240, status: 'partial' },
  },
  cash_flow: {
    expected_amount: 1850000,
    collected_amount: 920000,
    overdue_days: 41,
    returns_ratio: 0.08,
    credit_notes_ratio: 0.06,
  },
  supplier_profile: {
    monthly_revenue: 2100000,
    current_month_financed_volume: 4900000,
    employee_count: 28,
    facility_count: 1,
  },
  related_invoices: [
    {
      id: 'INV-DIL-2038',
      tier_level: 3,
      supplier_id: 'SUP_T3_ORE',
      buyer_id: 'SUP_T2_HARBOR',
      amount: 1180000,
      lender_id: 'bank_south',
      invoice_date: '2026-03-03',
      finance_request_date: '2026-03-04',
    },
    {
      id: 'INV-DIL-2040',
      tier_level: 1,
      supplier_id: 'SUP_T2_HARBOR',
      buyer_id: 'BUY_T1_VERTEX',
      amount: 1825000,
      lender_id: 'bank_west',
      invoice_date: '2026-03-05',
      finance_request_date: '2026-03-05',
    },
  ],
};

const revenueScenario: Partial<Invoice> = {
  id: 'INV-REV-7781',
  supplier: 'Nova Circuit Components',
  supplier_id: 'SUP_T3_NOVA',
  buyer: 'Apollo Mobility Systems',
  buyer_id: 'BUY_T2_APOLLO',
  amount: 3200000,
  items: ['controller boards', 'sensor modules'],
  origin: 'hongkong',
  destination: 'mumbai',
  transport_mode: 'air',
  claimed_days: 2,
  quantity: 180,
  lender_id: 'bank_core',
  tier_level: 3,
  dates: {
    po_date: '2026-03-10',
    invoice_date: '2026-03-12',
    finance_request_date: '2026-03-12',
    grn_date: '2026-03-14',
  },
  erp_records: {
    po: { id: 'PO-NC-441', amount: 2400000, quantity: 120, status: 'approved' },
    grn: { id: 'GRN-NC-441', quantity: 72, status: 'received-partial' },
    delivery: { id: 'DEL-NC-441', quantity: 80, status: 'in-transit' },
  },
  cash_flow: {
    expected_amount: 3200000,
    collected_amount: 510000,
    overdue_days: 26,
    returns_ratio: 0.02,
    credit_notes_ratio: 0.01,
  },
  supplier_profile: {
    monthly_revenue: 780000,
    current_month_financed_volume: 6400000,
    employee_count: 7,
    facility_count: 1,
  },
  related_invoices: [
    {
      id: 'INV-REV-7778',
      tier_level: 2,
      supplier_id: 'SUP_T3_NOVA',
      buyer_id: 'BUY_T2_APOLLO',
      amount: 2950000,
      lender_id: 'bank_delta',
      invoice_date: '2026-03-11',
      finance_request_date: '2026-03-11',
    },
  ],
};

export default function Dashboard() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<'healthy' | 'degraded' | 'offline'>('offline');
  const [error, setError] = useState<string | null>(null);
  const [formSeed, setFormSeed] = useState<Partial<Invoice> | undefined>(undefined);
  const [selectedScenarioLabel, setSelectedScenarioLabel] = useState<string>('Manual underwriting workspace');

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkHealth = async () => {
    try {
      const health = await healthCheck();
      setApiStatus(health.status === 'healthy' ? 'healthy' : 'degraded');
      setError(null);
    } catch {
      setApiStatus('offline');
      setError('Backend API is not responding on port 8000. Start the FastAPI service to run live analysis.');
    }
  };

  const runAction = async (label: string, action: () => Promise<AnalysisResult>) => {
    setIsLoading(true);
    setError(null);
    try {
      setSelectedScenarioLabel(label);
      setResult(await action());
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Analysis failed. Please retry once the backend is available.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyze = async (invoice: Invoice) => {
    await runAction(invoice.id || 'Custom analysis', () => analyzeInvoice(invoice));
  };

  const handleTestFraud = async () => {
    await runAction('Cross-lender duplicate demo', async () => (await testFraud()).analysis_result);
  };

  const handlePhantomCascade = async () => {
    await runAction('Phantom cascade demo', async () => (await testPhantomCascade()).analysis_result);
  };

  const handleTestLegitimate = async () => {
    await runAction('Healthy baseline demo', async () => (await testLegitimate()).analysis_result);
  };

  const loadScenario = (label: string, seed: Partial<Invoice>) => {
    setFormSeed({
      ...seed,
      items: [...(seed.items || [])],
      dates: { ...(seed.dates || {}) },
      erp_records: { ...(seed.erp_records || {}) },
      related_invoices: [...(seed.related_invoices || [])],
      cash_flow: { ...(seed.cash_flow || {}) },
      supplier_profile: { ...(seed.supplier_profile || {}) },
    });
    setSelectedScenarioLabel(`${label} loaded into form`);
    setError(null);
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-20" />

      <main className="relative z-10 mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 rounded-2xl border border-[rgba(255,107,107,0.3)] bg-[rgba(255,107,107,0.08)] px-5 py-4"
          >
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--accent-red)]" />
            <p className="text-sm text-[var(--text-secondary)]">{error}</p>
          </motion.div>
        )}

        <section id="overview" className="grid items-start gap-8 scroll-mt-32 pt-2 xl:grid-cols-[1.12fr,0.88fr]">
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
              <div className="eyebrow">
                <Shield className="h-4 w-4" />
                Multi-Tier SCF Fraud Command Center
              </div>
              <h1 className="mt-5 text-4xl font-extrabold leading-[1.02] tracking-tight md:text-6xl">
                Turn fragmented trade signals into a
                <span className="mt-2 block gradient-text">lender-grade early warning system</span>
              </h1>
              <p className="mt-5 max-w-3xl text-lg text-[var(--text-secondary)]">
                IntelliTrace helps lenders detect phantom invoices, repeated financing, dilution, over-invoicing,
                and carousel trades across Tier 1, Tier 2, and Tier 3 relationships. It validates ERP evidence,
                maps topology risk, quantifies exposure, and produces a clear pre-disbursement action.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#scenarios" className="button-main">
                  Launch scenarios
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a href="#workbench" className="button-subtle">
                  Open analyst workbench
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 gap-4 md:grid-cols-4"
            >
              {challengeStats.map((stat) => (
                <div key={stat.label} className="metric-tile">
                  <div className={`text-3xl font-black ${stat.tone}`}>{stat.value}</div>
                  <div className="mt-2 text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="surface px-6 py-6 md:px-7 md:py-7"
          >
            <div className="section-kicker">Pitch Narrative</div>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white">Why this feels like a category winner</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
              The product story is not just “fraud score.” It is evidence-backed prevention, network-aware financing intelligence,
              and a workflow lenders can act on before money leaves the door.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {capabilityCards.map(({ title, description, icon: Icon }) => (
                <div key={title} className="surface-muted p-4">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="rounded-xl bg-[rgba(78,203,255,0.12)] p-2">
                      <Icon className="h-4 w-4 text-[var(--accent-cyan)]" />
                    </div>
                    <h3 className="font-semibold text-white">{title}</h3>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">{description}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-[rgba(45,212,191,0.14)] bg-[rgba(45,212,191,0.06)] p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="section-kicker">Current Workspace</div>
                  <div className="mt-1 text-lg font-bold text-white">{selectedScenarioLabel}</div>
                </div>
                <div className="rounded-full border border-[rgba(255,255,255,0.08)] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                  API {apiStatus}
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                Use the scenario launcher for the fastest live demo, or enrich the invoice manually with ERP, cash-flow, and supplier
                feasibility signals in the analyst workbench below.
              </p>
            </div>
          </motion.div>
        </section>

        <ScenarioLauncher
          isLoading={isLoading}
          onRunPhantomCascade={handlePhantomCascade}
          onRunFraud={handleTestFraud}
          onRunLegitimate={handleTestLegitimate}
          onLoadDilutionScenario={() => loadScenario('Dilution stress scenario', dilutionScenario)}
          onLoadRevenueScenario={() => loadScenario('Revenue feasibility scenario', revenueScenario)}
        />

        <section id="workbench" className="grid grid-cols-1 gap-8 scroll-mt-32 xl:grid-cols-12">
          <div className="xl:col-span-4">
            <InvoiceForm
              onSubmit={handleAnalyze}
              onTestFraud={handleTestFraud}
              onPhantomCascade={handlePhantomCascade}
              onTestLegitimate={handleTestLegitimate}
              isLoading={isLoading}
              initialData={formSeed}
            />
          </div>
          <div className="xl:col-span-8">
            <ResultsPanel result={result} />
          </div>
        </section>
      </main>
    </div>
  );
}
