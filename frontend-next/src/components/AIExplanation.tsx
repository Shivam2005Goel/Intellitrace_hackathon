'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, Brain, CheckCircle2, ShieldAlert } from 'lucide-react';

interface AIExplanationProps {
  explanation: string;
  decision: 'APPROVE' | 'HOLD' | 'BLOCK';
}

const decisionTone = {
  APPROVE: 'border-[rgba(45,212,191,0.2)] bg-[rgba(45,212,191,0.06)] text-[var(--accent-green)]',
  HOLD: 'border-[rgba(255,179,92,0.2)] bg-[rgba(255,179,92,0.06)] text-[var(--accent-orange)]',
  BLOCK: 'border-[rgba(255,107,107,0.2)] bg-[rgba(255,107,107,0.06)] text-[var(--accent-red)]',
} as const;

export default function AIExplanation({ explanation, decision }: AIExplanationProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="surface-muted p-6"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-[rgba(78,203,255,0.12)] p-3">
            <Brain className="h-5 w-5 text-[var(--accent-cyan)]" />
          </div>
          <div>
            <div className="section-kicker">Decision Narrative</div>
            <h3 className="mt-1 text-lg font-bold text-white">Why the system reached this outcome</h3>
          </div>
        </div>

        <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${decisionTone[decision]}`}>
          <ShieldAlert className="h-4 w-4" />
          {decision}
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-white/8 bg-black/15 p-5">
        <p className="text-sm leading-7 text-[var(--text-secondary)]">{explanation}</p>
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/8 px-3 py-2">
          <CheckCircle2 className="h-3.5 w-3.5 text-[var(--accent-green)]" />
          Analyst-readable summary
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/8 px-3 py-2">
          <AlertTriangle className="h-3.5 w-3.5 text-[var(--accent-orange)]" />
          Backed by graph, physics, DNA, and SCF controls
        </div>
      </div>
    </motion.section>
  );
}
