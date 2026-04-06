'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, XCircle, FileSearch } from 'lucide-react';

interface MatchProps {
  label: string;
  poValue: string | number;
  grnValue: string | number;
  invoiceValue: string | number;
  status: 'match' | 'warning' | 'error';
}

const MatchRow = ({ label, poValue, grnValue, invoiceValue, status }: MatchProps) => (
  <div className="grid grid-cols-4 gap-4 p-4 border-b border-white/5 items-center hover:bg-white/5 transition-colors">
    <div className="font-mono text-sm text-white/70">{label}</div>
    <div className="font-mono text-sm">{poValue}</div>
    <div className="font-mono text-sm">{grnValue}</div>
    <div className={`font-mono text-sm flex items-center justify-between ${
      status === 'match' ? 'text-[#00ff88]' : 
      status === 'warning' ? 'text-[#ffcc00]' : 'text-[#ff3366]'
    }`}>
      {invoiceValue}
      {status === 'match' && <CheckCircle2 className="w-4 h-4 ml-2" />}
      {status === 'warning' && <AlertTriangle className="w-4 h-4 ml-2" />}
      {status === 'error' && <XCircle className="w-4 h-4 ml-2" />}
    </div>
  </div>
);

export default function DocumentReconciliation() {
  return (
    <div className="glass-card rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,245,255,0.1)]">
      <div className="p-6 border-b border-white/10 bg-gradient-to-r from-blue-900/20 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#00f5ff]/20 rounded-lg">
              <FileSearch className="w-6 h-6 text-[#00f5ff]" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Document Reconciliation Engine</h3>
              <p className="text-sm text-white/50">3-Way PO / GRN / Invoice Matching (Layer 1)</p>
            </div>
          </div>
          <div className="px-4 py-2 bg-[#ff3366]/20 border border-[#ff3366]/50 rounded-full text-[#ff3366] font-bold text-sm tracking-wider animate-pulse flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            MISMATCH DETECTED
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-4 gap-4 mb-4 px-4 font-semibold text-[#00f5ff] text-sm uppercase tracking-wider">
          <div>Entity Parameter</div>
          <div>Purchase Order</div>
          <div>Goods Receipt (GRN)</div>
          <div>Target Invoice</div>
        </div>
        
        <div className="bg-black/40 rounded-xl border border-white/5">
          <MatchRow label="Document ID" poValue="PO-8829-X" grnValue="GRN-8829-X-A" invoiceValue="INV-340-PHM" status="match" />
          <MatchRow label="Item Quantity" poValue="10,000 Units" grnValue="10,000 Units" invoiceValue="10,000 Units" status="match" />
          <MatchRow label="Total Amount" poValue="$4,500,000" grnValue="Pending" invoiceValue="$4,500,000" status="match" />
          <MatchRow label="Delivery Date" poValue="Oct 12, 2026" grnValue="Oct 14, 2026" invoiceValue="Oct 14, 2026" status="match" />
          <MatchRow label="Supplier ID" poValue="SUP-TIER2-99" grnValue="SUP-TIER2-99" invoiceValue="SUP-TIER1-01" status="error" />
          <MatchRow label="Entity Hash" poValue="0xA72B...9F" grnValue="0xA72B...9F" invoiceValue="0x33BB...2C" status="error" />
        </div>

        <motion.div 
          className="mt-6 p-4 rounded-xl bg-gradient-to-r from-[#ff3366]/20 to-transparent border-l-4 border-[#ff3366]"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h4 className="font-bold text-[#ff3366] mb-2">Reconciliation Analysis Result</h4>
          <p className="text-white/80 text-sm leading-relaxed">
            CRITICAL: Invoice <span className="font-mono text-white">INV-340-PHM</span> successfully matched PO parameters but failed Entity Validation. Supplier ID substituted from Tier 2 origin to Tier 1 aggregator. This indicates potential cascading phantom invoicing across the supply chain tiers.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
