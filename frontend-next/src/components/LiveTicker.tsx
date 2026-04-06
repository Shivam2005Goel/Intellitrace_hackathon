'use client';

import { motion } from 'framer-motion';

const messages = [
  'Phantom cascade scenario ready for live demo.',
  'ERP reconciliation checks PO, GRN, and delivery evidence before disbursement.',
  'Cross-lender invoice fingerprints identify repeated financing attempts.',
  'Dilution monitoring tracks collections, returns, and credit notes in real time.',
  'Graph analytics highlight carousel trades and suspicious trade rings.',
];

export default function LiveTicker() {
  return (
    <div className="fixed left-0 right-0 top-0 z-[110] flex h-8 items-center overflow-hidden border-b border-white/8 bg-[rgba(6,16,29,0.92)] backdrop-blur-xl">
      <div className="flex h-full shrink-0 items-center border-r border-white/8 bg-[rgba(78,203,255,0.12)] px-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--accent-cyan)]">
        Live Feed
      </div>
      <div className="relative flex-1 overflow-hidden">
        <motion.div
          className="flex whitespace-nowrap gap-12 px-6 text-xs text-[var(--text-secondary)]"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 34, ease: 'linear', repeat: Infinity }}
        >
          {[...messages, ...messages].map((message, index) => (
            <span key={`${message}-${index}`}>{message}</span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
