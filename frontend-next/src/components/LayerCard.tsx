'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AlertTriangle, Brain, CheckCircle2, Fingerprint, Globe, Network, ShieldCheck } from 'lucide-react';

interface LayerCardProps {
  name: string;
  title: string;
  description: string;
  isFlagged: boolean;
  score: number;
  delay?: number;
}

const icons: Record<string, React.ReactNode> = {
  DNA: <Fingerprint className="h-5 w-5" />,
  PHYSICS: <Globe className="h-5 w-5" />,
  GRAPH: <Network className="h-5 w-5" />,
  AI: <Brain className="h-5 w-5" />,
  PSI: <ShieldCheck className="h-5 w-5" />,
  SCF: <ShieldCheck className="h-5 w-5" />,
};

const colors: Record<string, string> = {
  DNA: 'var(--accent-cyan)',
  PHYSICS: 'var(--accent-blue)',
  GRAPH: 'var(--accent-orange)',
  AI: 'var(--accent-purple)',
  PSI: 'var(--accent-green)',
  SCF: 'var(--accent-green)',
};

export default function LayerCard({ name, title, description, isFlagged, score, delay = 0 }: LayerCardProps) {
  const accent = colors[name] || 'var(--accent-cyan)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={cn(
        'surface-muted relative overflow-hidden p-5',
        isFlagged && 'border-[rgba(255,107,107,0.22)] bg-[rgba(255,107,107,0.06)]',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3" style={{ color: accent }}>
            {icons[name] || <ShieldCheck className="h-5 w-5" />}
          </div>
          <div>
            <div className="section-kicker">{name}</div>
            <h3 className="mt-1 text-base font-bold text-white">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{description}</p>
          </div>
        </div>

        <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] ${
          isFlagged
            ? 'border-[rgba(255,107,107,0.22)] bg-[rgba(255,107,107,0.08)] text-[var(--accent-red)]'
            : 'border-[rgba(45,212,191,0.22)] bg-[rgba(45,212,191,0.08)] text-[var(--accent-green)]'
        }`}>
          {isFlagged ? <AlertTriangle className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
          {isFlagged ? 'Flagged' : 'Clear'}
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="section-kicker">Risk index</span>
          <span className={cn(
            'rounded-full px-3 py-1 text-xs font-semibold',
            score >= 7
              ? 'bg-[rgba(255,107,107,0.12)] text-[var(--accent-red)]'
              : score >= 4
                ? 'bg-[rgba(255,179,92,0.12)] text-[var(--accent-orange)]'
                : 'bg-[rgba(45,212,191,0.12)] text-[var(--accent-green)]',
          )}>
            {score.toFixed(1)}/10
          </span>
        </div>

        <div className="h-2 rounded-full bg-white/8">
          <div
            className={cn(
              'h-2 rounded-full transition-all duration-700',
              score >= 7
                ? 'bg-[linear-gradient(90deg,#ff8f6b,#ff6b6b)]'
                : score >= 4
                  ? 'bg-[linear-gradient(90deg,#ffb35c,#ff8f6b)]'
                  : 'bg-[linear-gradient(90deg,#2dd4bf,#4ecbff)]',
            )}
            style={{ width: `${Math.min((score / 10) * 100, 100)}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
}
