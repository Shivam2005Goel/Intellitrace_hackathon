'use client';

import { motion } from 'framer-motion';
import { Decision } from '@/types';
import { formatNumber } from '@/lib/utils';
import { AlertTriangle, CheckCircle2, ShieldAlert, XCircle } from 'lucide-react';
import DecryptedText from './DecryptedText';

interface DecisionBannerProps {
  decision: Decision;
  riskScore: number;
  confidence: number;
  invoiceId: string;
  layersFlagged?: number;
}

const themes = {
  APPROVE: {
    accent: 'var(--accent-green)',
    border: 'border-[rgba(45,212,191,0.28)]',
    background: 'bg-[rgba(45,212,191,0.08)]',
    label: 'Clear to proceed',
    icon: CheckCircle2,
  },
  HOLD: {
    accent: 'var(--accent-orange)',
    border: 'border-[rgba(255,179,92,0.28)]',
    background: 'bg-[rgba(255,179,92,0.08)]',
    label: 'Manual review required',
    icon: AlertTriangle,
  },
  BLOCK: {
    accent: 'var(--accent-red)',
    border: 'border-[rgba(255,107,107,0.28)]',
    background: 'bg-[rgba(255,107,107,0.08)]',
    label: 'Disbursement blocked',
    icon: XCircle,
  },
} as const;

export default function DecisionBanner({ decision, riskScore, confidence, invoiceId, layersFlagged = 0 }: DecisionBannerProps) {
  const theme = themes[decision];
  const StatusIcon = theme.icon;

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`surface overflow-hidden border ${theme.border}`}
    >
      <div className={`absolute inset-x-0 top-0 h-1 ${theme.background}`} />
      <div className="grid gap-6 px-6 py-6 md:grid-cols-[1.1fr,0.9fr] md:px-7">
        <div className="flex gap-4">
          <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border ${theme.border} ${theme.background}`}>
            <StatusIcon className="h-7 w-7" style={{ color: theme.accent }} />
          </div>
          <div>
            <div className="section-kicker">Decision</div>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h2 className="text-3xl font-extrabold tracking-tight text-white">
                <DecryptedText text={decision} animateOn="view" sequential={true} speed={30} />
              </h2>
              <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${theme.border} ${theme.background}`} style={{ color: theme.accent }}>
                {theme.label}
              </span>
            </div>
            <p className="mt-3 text-sm text-[var(--text-secondary)]">
              Invoice reference <span className="mono text-white">{invoiceId}</span>
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="metric-tile">
            <div className="section-kicker">Risk score</div>
            <div className="mt-3 text-3xl font-bold text-white">{formatNumber(riskScore, 1)}%</div>
          </div>
          <div className="metric-tile">
            <div className="section-kicker">Confidence</div>
            <div className="mt-3 text-3xl font-bold text-white">{formatNumber(confidence * 100, 0)}%</div>
          </div>
          <div className="metric-tile">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-[var(--accent-cyan)]" />
              <div className="section-kicker">Escalated layers</div>
            </div>
            <div className="mt-3 text-3xl font-bold text-white">{layersFlagged}</div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
