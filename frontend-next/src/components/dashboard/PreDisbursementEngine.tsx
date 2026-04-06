'use client';

import { motion } from 'framer-motion';
import { ShieldAlert, AlertOctagon, XCircle, Ban } from 'lucide-react';

export default function PreDisbursementEngine() {
  return (
    <motion.div 
      className="glass-card rounded-xl p-6 border border-[#ff3366]/30 relative overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background Pulse */}
      <div className="absolute inset-0 bg-[#ff3366]/5 animate-pulse rounded-xl" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-[#ff3366]/20 flex items-center justify-center animate-bounce">
              <ShieldAlert className="w-6 h-6 text-[#ff3366]" />
            </div>
            <div>
              <h3 className="text-xl font-black text-[#ff3366] uppercase tracking-widest flex items-center gap-2">
                Pre-Disbursement Interceptor
                <span className="bg-[#ff3366] text-black text-xs px-2 py-0.5 rounded font-bold">ACTIVE</span>
              </h3>
              <p className="text-white/70 mt-1">Stopping high-risk financing before capital release</p>
            </div>
          </div>
        </div>

        <div className="bg-black/40 rounded-lg p-5 border border-[#ff3366]/20 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="text-white/50 font-mono text-sm">Target Batch</div>
            <div className="font-mono text-white text-sm">BAT-340-XYZ</div>
          </div>
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="text-white/50 font-mono text-sm">Requested Financing</div>
            <div className="font-mono text-[#00f5ff] font-bold text-lg">$4,500,000.00</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-white/50 font-mono text-sm">Phantom Risk Score</div>
            <div className="font-mono text-[#ff3366] font-bold text-xl flex items-center gap-2">
              98.5 / 100
              <AlertOctagon className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-3">Interceptor Action</h4>
          <div className="flex gap-3">
            <button className="flex-1 bg-gradient-to-r from-[#ff3366] to-[#b829dd] text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
              <Ban className="w-5 h-5" />
              BLOCK DISBURSEMENT
            </button>
            <button className="flex-1 bg-white/5 border border-white/10 text-white py-3 rounded-lg font-bold hover:bg-white/10 transition-colors">
              ESCALATE TO COMPLIANCE
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
