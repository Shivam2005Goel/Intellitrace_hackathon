'use client';

import { motion } from 'framer-motion';
import { PhysicsResult } from '@/types';
import { formatNumber } from '@/lib/utils';
import { AlertTriangle, Calendar, CheckCircle2, Factory, Truck, XCircle } from 'lucide-react';

interface PhysicsDetailsProps {
  physics: PhysicsResult;
}

function panelTone(flagged: boolean) {
  return flagged
    ? 'border-[rgba(255,107,107,0.22)] bg-[rgba(255,107,107,0.06)]'
    : 'border-[rgba(45,212,191,0.22)] bg-[rgba(45,212,191,0.06)]';
}

export default function PhysicsDetails({ physics }: PhysicsDetailsProps) {
  const { routing, capacity, causality } = physics;

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl border p-6 ${panelTone(routing.flagged)}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-white/8 p-3">
              <Truck className="h-5 w-5 text-[var(--accent-cyan)]" />
            </div>
            <div>
              <div className="section-kicker">Delivery Feasibility</div>
              <h3 className="mt-1 text-lg font-bold text-white">{routing.verdict}</h3>
            </div>
          </div>
          {routing.flagged ? <XCircle className="h-5 w-5 text-[var(--accent-red)]" /> : <CheckCircle2 className="h-5 w-5 text-[var(--accent-green)]" />}
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-4">
          <div className="metric-tile">
            <div className="section-kicker">Route</div>
            <div className="mt-3 text-lg font-bold text-white uppercase">{routing.origin} → {routing.destination}</div>
          </div>
          <div className="metric-tile">
            <div className="section-kicker">Distance</div>
            <div className="mt-3 text-2xl font-bold text-white">{formatNumber(routing.distance_km, 0)} km</div>
          </div>
          <div className="metric-tile">
            <div className="section-kicker">Claimed time</div>
            <div className="mt-3 text-2xl font-bold text-white">{routing.claimed_days} days</div>
          </div>
          <div className="metric-tile">
            <div className="section-kicker">Minimum required</div>
            <div className="mt-3 text-2xl font-bold text-white">{routing.total_minimum_days} days</div>
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className={`rounded-2xl border p-6 ${panelTone(capacity.flagged)}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-white/8 p-3">
              <Factory className="h-5 w-5 text-[var(--accent-blue)]" />
            </div>
            <div>
              <div className="section-kicker">Supplier Capacity</div>
              <h3 className="mt-1 text-lg font-bold text-white">{capacity.verdict}</h3>
            </div>
          </div>
          {capacity.flagged ? <AlertTriangle className="h-5 w-5 text-[var(--accent-orange)]" /> : <CheckCircle2 className="h-5 w-5 text-[var(--accent-green)]" />}
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-4">
          <div className="metric-tile">
            <div className="section-kicker">Supplier ID</div>
            <div className="mt-3 text-lg font-bold text-white">{capacity.supplier_id}</div>
          </div>
          <div className="metric-tile">
            <div className="section-kicker">Monthly capacity</div>
            <div className="mt-3 text-2xl font-bold text-white">{formatNumber(capacity.max_monthly_capacity, 0)}</div>
          </div>
          <div className="metric-tile">
            <div className="section-kicker">Claimed quantity</div>
            <div className="mt-3 text-2xl font-bold text-white">{formatNumber(capacity.claimed_quantity, 0)}</div>
          </div>
          <div className="metric-tile">
            <div className="section-kicker">Excess</div>
            <div className="mt-3 text-2xl font-bold text-white">{formatNumber(capacity.excess_percentage, 1)}%</div>
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`rounded-2xl border p-6 ${panelTone(causality.flagged)}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-white/8 p-3">
              <Calendar className="h-5 w-5 text-[var(--accent-green)]" />
            </div>
            <div>
              <div className="section-kicker">Timeline Validation</div>
              <h3 className="mt-1 text-lg font-bold text-white">{causality.verdict}</h3>
            </div>
          </div>
          {causality.flagged ? <XCircle className="h-5 w-5 text-[var(--accent-red)]" /> : <CheckCircle2 className="h-5 w-5 text-[var(--accent-green)]" />}
        </div>

        {causality.timeline && causality.timeline.length > 0 && (
          <div className="mt-5 grid gap-3 md:grid-cols-4">
            {causality.timeline.map((event) => (
              <div key={`${event.event}-${event.date}`} className="metric-tile">
                <div className="section-kicker">{event.event}</div>
                <div className="mt-3 text-sm font-semibold text-white">{event.date}</div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-5 space-y-3">
          {causality.violations.map((violation) => (
            <div key={violation} className="rounded-2xl border border-[rgba(255,107,107,0.2)] bg-[rgba(255,107,107,0.06)] px-4 py-3 text-sm text-[var(--text-secondary)]">
              {violation}
            </div>
          ))}
          {(causality.warnings || []).map((warning) => (
            <div key={warning} className="rounded-2xl border border-[rgba(255,179,92,0.2)] bg-[rgba(255,179,92,0.06)] px-4 py-3 text-sm text-[var(--text-secondary)]">
              {warning}
            </div>
          ))}
          {!causality.flagged && causality.violations.length === 0 && (!causality.warnings || causality.warnings.length === 0) && (
            <div className="rounded-2xl border border-[rgba(45,212,191,0.22)] bg-[rgba(45,212,191,0.06)] px-4 py-3 text-sm text-[var(--text-secondary)]">
              Timeline sequencing appears consistent across the available trade events.
            </div>
          )}
        </div>
      </motion.section>
    </div>
  );
}
