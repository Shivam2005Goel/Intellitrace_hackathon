'use client';

import { motion } from 'framer-motion';
import { DNAResult } from '@/types';
import { AlertTriangle, Building2, CheckCircle2, Clock, Fingerprint, Shield, XCircle } from 'lucide-react';

interface DNADetailsProps {
  dna: DNAResult;
}

function tone(flagged: boolean) {
  return flagged
    ? 'border-[rgba(255,107,107,0.22)] bg-[rgba(255,107,107,0.06)]'
    : 'border-[rgba(45,212,191,0.22)] bg-[rgba(45,212,191,0.06)]';
}

export default function DNADetails({ dna }: DNADetailsProps) {
  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl border p-6 ${tone(dna.status !== 'NEW')}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-white/8 p-3">
              <Fingerprint className="h-5 w-5 text-[var(--accent-cyan)]" />
            </div>
            <div>
              <div className="section-kicker">Invoice Fingerprint</div>
              <h3 className="mt-1 text-lg font-bold text-white">{dna.status}</h3>
            </div>
          </div>
          {dna.status !== 'NEW' ? (
            <XCircle className="h-5 w-5 text-[var(--accent-red)]" />
          ) : (
            <CheckCircle2 className="h-5 w-5 text-[var(--accent-green)]" />
          )}
        </div>

        <div className="mt-5 rounded-2xl border border-white/8 bg-black/20 p-4">
          <div className="mono break-all text-sm text-[var(--text-secondary)]">{dna.fingerprint}</div>
        </div>

        {dna.original_id && (
          <div className="mt-4 rounded-2xl border border-[rgba(255,107,107,0.2)] bg-[rgba(255,107,107,0.06)] px-4 py-3 text-sm text-[var(--text-secondary)]">
            Original invoice reference: <span className="mono text-white">{dna.original_id}</span>
          </div>
        )}

        {dna.similar_ids && dna.similar_ids.length > 0 && (
          <div className="mt-4 rounded-2xl border border-white/8 bg-black/20 p-4">
            <div className="section-kicker">Similar invoices</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {dna.similar_ids.map((id) => (
                <span key={id} className="rounded-full border border-white/10 px-3 py-1 text-xs text-[var(--text-secondary)]">
                  {id}
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.section>

      <div className="grid gap-6 xl:grid-cols-2">
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className={`rounded-2xl border p-6 ${tone(dna.behavioral.flagged)}`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-white/8 p-3">
                <Clock className="h-5 w-5 text-[var(--accent-orange)]" />
              </div>
              <div>
                <div className="section-kicker">Submission Behavior</div>
                <h3 className="mt-1 text-lg font-bold text-white">
                  {dna.behavioral.flagged ? 'Suspicious velocity' : 'Normal activity'}
                </h3>
              </div>
            </div>
            {dna.behavioral.flagged ? (
              <AlertTriangle className="h-5 w-5 text-[var(--accent-orange)]" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-[var(--accent-green)]" />
            )}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="metric-tile">
              <div className="section-kicker">Last hour</div>
              <div className="mt-3 text-3xl font-bold text-white">{dna.behavioral.submissions_last_hour}</div>
            </div>
            <div className="metric-tile">
              <div className="section-kicker">Anomaly score</div>
              <div className="mt-3 text-3xl font-bold text-white">{Math.round(dna.behavioral.anomaly_score * 100)}%</div>
            </div>
            <div className="metric-tile">
              <div className="section-kicker">Trust posture</div>
              <div className="mt-3 text-lg font-bold text-white">{dna.behavioral.flagged ? 'Escalate' : 'Stable'}</div>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`rounded-2xl border p-6 ${tone(dna.psi.flagged)}`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-white/8 p-3">
                <Building2 className="h-5 w-5 text-[var(--accent-blue)]" />
              </div>
              <div>
                <div className="section-kicker">Cross-Lender Detection</div>
                <h3 className="mt-1 text-lg font-bold text-white">{dna.psi.verdict || (dna.psi.flagged ? 'Flagged' : 'Clear')}</h3>
              </div>
            </div>
            {dna.psi.flagged ? (
              <XCircle className="h-5 w-5 text-[var(--accent-red)]" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-[var(--accent-green)]" />
            )}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="metric-tile">
              <div className="section-kicker">Lenders affected</div>
              <div className="mt-3 text-3xl font-bold text-white">{dna.psi.count}</div>
            </div>
            <div className="metric-tile">
              <div className="section-kicker">Status</div>
              <div className="mt-3 text-lg font-bold text-white">{dna.psi.flagged ? 'Repeated financing risk' : 'No collision observed'}</div>
            </div>
          </div>

          {dna.psi.lenders_affected.length > 0 && (
            <div className="mt-4 rounded-2xl border border-white/8 bg-black/20 p-4">
              <div className="section-kicker">Observed lenders</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {dna.psi.lenders_affected.map((lender) => (
                  <span key={lender} className="rounded-full border border-white/10 px-3 py-1 text-xs text-[var(--text-secondary)]">
                    {lender}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
            <Shield className="h-4 w-4 text-[var(--accent-cyan)]" />
            PSI data remains anonymized and encrypted
          </div>
        </motion.section>
      </div>
    </div>
  );
}
