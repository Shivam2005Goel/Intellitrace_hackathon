'use client';

import { motion } from 'framer-motion';
import {
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  FileStack,
  Sparkles,
  WalletCards,
} from 'lucide-react';

interface ScenarioLauncherProps {
  isLoading: boolean;
  onRunPhantomCascade: () => void;
  onRunFraud: () => void;
  onRunLegitimate: () => void;
  onLoadDilutionScenario: () => void;
  onLoadRevenueScenario: () => void;
}

const toneStyles = {
  critical: {
    badge: 'bg-[rgba(255,107,107,0.12)] text-[var(--accent-red)] border-[rgba(255,107,107,0.2)]',
    icon: 'text-[var(--accent-red)]',
    button: 'button-main',
  },
  high: {
    badge: 'bg-[rgba(255,179,92,0.12)] text-[var(--accent-orange)] border-[rgba(255,179,92,0.22)]',
    icon: 'text-[var(--accent-orange)]',
    button: 'button-subtle',
  },
  safe: {
    badge: 'bg-[rgba(45,212,191,0.12)] text-[var(--accent-green)] border-[rgba(45,212,191,0.22)]',
    icon: 'text-[var(--accent-green)]',
    button: 'button-subtle',
  },
} as const;

const cards = [
  {
    title: 'Phantom Cascade',
    description: 'Show how individually plausible invoices multiply exposure across Tier 1, Tier 2, and Tier 3 financing chains.',
    signal: '340 phantom invoices / $47M referenced exposure',
    action: 'Run live demo',
    tone: 'critical' as const,
    icon: FileStack,
    handler: 'phantom' as const,
  },
  {
    title: 'Cross-Lender Duplicate',
    description: 'Demonstrate invoice fingerprint collisions and repeated financing attempts across lender ecosystems.',
    signal: 'Duplicate DNA + duplicate financing flow',
    action: 'Run live demo',
    tone: 'high' as const,
    icon: AlertTriangle,
    handler: 'fraud' as const,
  },
  {
    title: 'Dilution Stress',
    description: 'Load a collections deterioration case with partial delivery evidence, overdue cash, returns, and credit notes.',
    signal: 'Dilution monitoring + ERP mismatches',
    action: 'Load into form',
    tone: 'high' as const,
    icon: WalletCards,
    handler: 'dilution' as const,
  },
  {
    title: 'Revenue Feasibility',
    description: 'Load a supplier whose financed invoice volume outstrips business reality and points to phantom activity.',
    signal: 'Feasibility metrics + phantom probability',
    action: 'Load into form',
    tone: 'high' as const,
    icon: DollarSign,
    handler: 'revenue' as const,
  },
  {
    title: 'Healthy Baseline',
    description: 'Show that legitimate invoices still clear quickly when documents, network topology, and payment behavior align.',
    signal: 'Controls stay strong without false positives',
    action: 'Run live demo',
    tone: 'safe' as const,
    icon: CheckCircle2,
    handler: 'legit' as const,
  },
];

export default function ScenarioLauncher({
  isLoading,
  onRunPhantomCascade,
  onRunFraud,
  onRunLegitimate,
  onLoadDilutionScenario,
  onLoadRevenueScenario,
}: ScenarioLauncherProps) {
  const execute = (handler: (typeof cards)[number]['handler']) => {
    if (handler === 'phantom') {
      onRunPhantomCascade();
      return;
    }
    if (handler === 'fraud') {
      onRunFraud();
      return;
    }
    if (handler === 'legit') {
      onRunLegitimate();
      return;
    }
    if (handler === 'dilution') {
      onLoadDilutionScenario();
      return;
    }
    onLoadRevenueScenario();
  };

  return (
    <section id="scenarios" className="surface scroll-mt-32 px-6 py-6 md:px-8 md:py-7">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <div className="eyebrow">
            <Sparkles className="h-4 w-4" />
            Scenario Launcher
          </div>
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
              Demo the full fraud story in under two minutes
            </h2>
            <p className="mt-2 max-w-3xl text-sm text-[var(--text-secondary)] md:text-base">
              Each scenario showcases a different judging angle: network-level fraud discovery, pre-disbursement controls,
              reduced false positives, and business impact quantification.
            </p>
          </div>
        </div>

        <div className="surface-muted px-4 py-3 text-sm text-[var(--text-secondary)]">
          Best live flow: run <span className="font-semibold text-white">Phantom Cascade</span>, open the SCF tab, then show the
          executive brief and lender action playbook.
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {cards.map(({ title, description, signal, action, tone, icon: Icon, handler }, index) => (
          <motion.article
            key={title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="surface-muted flex h-full flex-col p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className={`rounded-2xl border p-3 ${toneStyles[tone].badge}`}>
                <Icon className={`h-5 w-5 ${toneStyles[tone].icon}`} />
              </div>
              <span className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] ${toneStyles[tone].badge}`}>
                {tone === 'critical' ? 'Flagship' : tone === 'safe' ? 'Baseline' : 'Analyst'}
              </span>
            </div>

            <div className="mt-5 flex-1">
              <h3 className="text-lg font-bold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{description}</p>
            </div>

            <div className="mt-5 rounded-2xl bg-black/20 px-4 py-3 text-sm text-[var(--text-secondary)]">
              <div className="section-kicker mb-1">Signal Focus</div>
              {signal}
            </div>

            <button
              type="button"
              disabled={isLoading}
              onClick={() => execute(handler)}
              className={`${toneStyles[tone].button} mt-5 w-full text-sm disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {action}
            </button>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
