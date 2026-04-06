'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  status: 'completed' | 'current' | 'pending' | 'failed';
  icon?: string;
}

interface InvoiceTimelineProps {
  events: TimelineEvent[];
}

const statusConfig = {
  completed: { color: '#2dd4bf', icon: CheckCircle2, bgColor: 'rgba(45,212,191,0.12)' },
  current: { color: '#4ecbff', icon: Clock, bgColor: 'rgba(78,203,255,0.12)' },
  pending: { color: 'rgba(255,255,255,0.4)', icon: Clock, bgColor: 'rgba(255,255,255,0.05)' },
  failed: { color: '#ff6b6b', icon: XCircle, bgColor: 'rgba(255,107,107,0.12)' },
};

export default function InvoiceTimeline({ events }: InvoiceTimelineProps) {
  return (
    <div className="relative">
      <div className="absolute bottom-0 left-6 top-0 w-px bg-[linear-gradient(180deg,rgba(45,212,191,0.35),rgba(78,203,255,0.35),rgba(255,107,107,0.3))]" />

      <div className="space-y-5">
        {events.map((event, index) => {
          const config = statusConfig[event.status];
          const Icon = config.icon;

          return (
            <motion.div
              key={event.id}
              className="relative flex items-start gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
            >
              <motion.div
                className="relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border"
                style={{
                  background: config.bgColor,
                  borderColor: config.color,
                }}
                animate={event.status === 'current' ? {
                  boxShadow: [
                    `0 0 0 0 ${config.color}35`,
                    `0 0 0 10px ${config.color}00`,
                    `0 0 0 0 ${config.color}35`,
                  ],
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Icon className="h-5 w-5" style={{ color: config.color }} />
              </motion.div>

              <div className="surface-muted flex-1 p-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <h4 className="font-semibold text-white">{event.title}</h4>
                  <span className="mono text-xs text-[var(--text-muted)]">{event.timestamp}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{event.description}</p>
                <div className="mt-3">
                  <span
                    className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em]"
                    style={{
                      background: config.bgColor,
                      color: config.color,
                    }}
                  >
                    {event.status}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
