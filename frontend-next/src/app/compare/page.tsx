'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GitCompare, 
  Plus, 
  X,
  ArrowRight,
  Shield,
  Zap,
  Network,
  Brain,
  Lock,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import RiskRadarChart from '@/components/charts/RiskRadarChart';
import RiskGauge from '@/components/charts/RiskGauge';

interface Invoice {
  id: string;
  supplier: string;
  amount: number;
  decision: 'APPROVE' | 'HOLD' | 'BLOCK';
  risk_score: number;
  layer_scores: { layer: string; score: number }[];
}

const mockInvoices: Invoice[] = [
  {
    id: 'INV-001',
    supplier: 'Shanghai Steel Co',
    amount: 470000,
    decision: 'HOLD',
    risk_score: 65,
    layer_scores: [
      { layer: 'DNA', score: 2 },
      { layer: 'Physics', score: 8 },
      { layer: 'Graph', score: 3 },
      { layer: 'LLM', score: 4 },
      { layer: 'PSI', score: 1 },
    ],
  },
  {
    id: 'INV-002',
    supplier: 'Tech Components Inc',
    amount: 50000,
    decision: 'APPROVE',
    risk_score: 15,
    layer_scores: [
      { layer: 'DNA', score: 1 },
      { layer: 'Physics', score: 2 },
      { layer: 'Graph', score: 1 },
      { layer: 'LLM', score: 1 },
      { layer: 'PSI', score: 0 },
    ],
  },
  {
    id: 'INV-003',
    supplier: 'Rapid Transport Ltd',
    amount: 89000,
    decision: 'BLOCK',
    risk_score: 88,
    layer_scores: [
      { layer: 'DNA', score: 7 },
      { layer: 'Physics', score: 9 },
      { layer: 'Graph', score: 8 },
      { layer: 'LLM', score: 6 },
      { layer: 'PSI', score: 5 },
    ],
  },
];

const layerIcons: Record<string, React.ReactNode> = {
  DNA: <Shield className="w-4 h-4" />,
  Physics: <Zap className="w-4 h-4" />,
  Graph: <Network className="w-4 h-4" />,
  LLM: <Brain className="w-4 h-4" />,
  PSI: <Lock className="w-4 h-4" />,
};

const layerColors: Record<string, string> = {
  DNA: '#00f5ff',
  Physics: '#b829dd',
  Graph: '#ff0080',
  LLM: '#ff6b35',
  PSI: '#00ff88',
};

export default function ComparePage() {
  const [selectedInvoices, setSelectedInvoices] = useState<Invoice[]>([mockInvoices[0], mockInvoices[1]]);
  const [showAddModal, setShowAddModal] = useState(false);

  const addInvoice = (invoice: Invoice) => {
    if (selectedInvoices.length < 3) {
      setSelectedInvoices([...selectedInvoices, invoice]);
      setShowAddModal(false);
    }
  };

  const removeInvoice = (index: number) => {
    setSelectedInvoices(selectedInvoices.filter((_, i) => i !== index));
  };

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'APPROVE': return '#00ff88';
      case 'HOLD': return '#ffcc00';
      case 'BLOCK': return '#ff3366';
      default: return '#00f5ff';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-6">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#12121a] to-[#1a1a25]" />
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#ff0080] rounded-full blur-[150px] opacity-10 animate-pulse" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div className="mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Link href="/" className="text-white/50 hover:text-white transition-colors flex items-center gap-2 mb-2">
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold gradient-text">Compare Invoices</h1>
            <GitCompare className="w-8 h-8 text-[#00f5ff]" />
          </div>
          <p className="text-white/60 mt-2">Side-by-side analysis of multiple invoices</p>
        </motion.div>

        {/* Comparison Grid */}
        <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${selectedInvoices.length}, 1fr) 80px` }}>
          {selectedInvoices.map((invoice, index) => (
            <motion.div
              key={invoice.id}
              className="space-y-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Invoice Header */}
              <div className="glass-card p-6 relative">
                <button
                  onClick={() => removeInvoice(index)}
                  className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-white/50" />
                </button>
                <h3 className="text-xl font-bold text-white mb-1">{invoice.id}</h3>
                <p className="text-white/60 text-sm">{invoice.supplier}</p>
                <p className="text-2xl font-bold mono mt-4" style={{ color: getDecisionColor(invoice.decision) }}>
                  ${invoice.amount.toLocaleString()}
                </p>
              </div>

              {/* Decision */}
              <div className="glass-card p-6 text-center">
                <p className="text-white/60 text-sm mb-2">Decision</p>
                <motion.div
                  className="text-3xl font-bold"
                  style={{ color: getDecisionColor(invoice.decision) }}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.3 + index * 0.1 }}
                >
                  {invoice.decision}
                </motion.div>
              </div>

              {/* Risk Gauge */}
              <div className="glass-card p-6 flex flex-col items-center">
                <RiskGauge value={invoice.risk_score} size={160} />
              </div>

              {/* Radar Chart */}
              <div className="glass-card p-6">
                <h4 className="text-sm font-medium text-white/60 mb-4">Layer Analysis</h4>
                <RiskRadarChart data={invoice.layer_scores} />
              </div>

              {/* Layer Scores */}
              <div className="glass-card p-6 space-y-3">
                <h4 className="text-sm font-medium text-white/60 mb-4">Detailed Scores</h4>
                {invoice.layer_scores.map((layer, i) => (
                  <motion.div
                    key={layer.layer}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.05 + index * 0.1 }}
                  >
                    <div className="flex items-center gap-3">
                      <div style={{ color: layerColors[layer.layer] }}>
                        {layerIcons[layer.layer]}
                      </div>
                      <span className="text-sm text-white/70">{layer.layer}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: layerColors[layer.layer] }}
                          initial={{ width: 0 }}
                          animate={{ width: `${(layer.score / 10) * 100}%` }}
                          transition={{ duration: 0.8, delay: 0.6 + i * 0.05 + index * 0.1 }}
                        />
                      </div>
                      <span className="text-sm mono w-6">{layer.score}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Add Button Column */}
          <motion.div
            className="flex items-start justify-center pt-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {selectedInvoices.length < 3 && (
              <motion.button
                onClick={() => setShowAddModal(true)}
                className="w-16 h-16 rounded-full bg-gradient-to-r from-[#00f5ff] to-[#b829dd] flex items-center justify-center"
                whileHover={{ scale: 1.1, boxShadow: '0 0 30px rgba(0,245,255,0.3)' }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-8 h-8" />
              </motion.button>
            )}
          </motion.div>
        </div>

        {/* Add Modal */}
        <AnimatePresence>
          {showAddModal && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
            >
              <motion.div
                className="glass-card p-6 max-w-md w-full"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold mb-4">Select Invoice to Compare</h3>
                <div className="space-y-2">
                  {mockInvoices.filter(inv => !selectedInvoices.find(s => s.id === inv.id)).map((invoice, i) => (
                    <motion.button
                      key={invoice.id}
                      onClick={() => addInvoice(invoice)}
                      className="w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left flex items-center justify-between"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <div>
                        <p className="font-medium">{invoice.id}</p>
                        <p className="text-sm text-white/50">{invoice.supplier}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold mono">${invoice.amount.toLocaleString()}</p>
                        <span
                          className="text-xs px-2 py-1 rounded-full"
                          style={{
                            background: `${getDecisionColor(invoice.decision)}20`,
                            color: getDecisionColor(invoice.decision),
                          }}
                        >
                          {invoice.decision}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
