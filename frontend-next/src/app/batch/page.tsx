'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileSpreadsheet, 
  AlertCircle, 
  CheckCircle, 
  X,
  Loader2,
  Download,
  ArrowRight,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';
import LayerBarChart from '@/components/charts/LayerBarChart';
import DecisionPieChart from '@/components/charts/DecisionPieChart';

interface BatchResult {
  id: string;
  supplier: string;
  amount: number;
  decision: 'APPROVE' | 'HOLD' | 'BLOCK';
  risk_score: number;
  processing_time: number;
  layers_flagged: string[];
}

const mockBatchResults: BatchResult[] = [
  { id: 'INV-001', supplier: 'Shanghai Steel Co', amount: 470000, decision: 'HOLD', risk_score: 65, processing_time: 2.1, layers_flagged: ['PHYSICS'] },
  { id: 'INV-002', supplier: 'Tech Components Inc', amount: 50000, decision: 'APPROVE', risk_score: 15, processing_time: 1.8, layers_flagged: [] },
  { id: 'INV-003', supplier: 'Global Logistics Ltd', amount: 125000, decision: 'APPROVE', risk_score: 22, processing_time: 2.0, layers_flagged: [] },
  { id: 'INV-004', supplier: 'Rapid Transport', amount: 89000, decision: 'BLOCK', risk_score: 88, processing_time: 2.5, layers_flagged: ['DNA', 'PHYSICS', 'GRAPH'] },
  { id: 'INV-005', supplier: 'Mega Corp Industries', amount: 750000, decision: 'HOLD', risk_score: 58, processing_time: 2.3, layers_flagged: ['GRAPH'] },
];

export default function BatchPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<BatchResult[] | null>(null);
  const [filter, setFilter] = useState<'all' | 'approve' | 'hold' | 'block'>('all');

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles]);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(prev => [...prev, ...selectedFiles]);
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleProcess = useCallback(async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 4000));
    setResults(mockBatchResults);
    setIsProcessing(false);
  }, []);

  const filteredResults = results?.filter(r => 
    filter === 'all' || r.decision.toLowerCase() === filter
  );

  const chartData = [
    { layer: 'DNA', score: 4, color: '#00f5ff' },
    { layer: 'Physics', score: 7, color: '#b829dd' },
    { layer: 'Graph', score: 5, color: '#ff0080' },
    { layer: 'LLM', score: 3, color: '#ff6b35' },
    { layer: 'PSI', score: 2, color: '#00ff88' },
  ];

  const decisionData = [
    { id: 'Approved', label: 'Approved', value: results?.filter(r => r.decision === 'APPROVE').length || 0, color: '#00ff88' },
    { id: 'Hold', label: 'Hold', value: results?.filter(r => r.decision === 'HOLD').length || 0, color: '#ffcc00' },
    { id: 'Blocked', label: 'Blocked', value: results?.filter(r => r.decision === 'BLOCK').length || 0, color: '#ff3366' },
  ];

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
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#b829dd] rounded-full blur-[150px] opacity-10 animate-pulse" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div className="mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Link href="/" className="text-white/50 hover:text-white transition-colors flex items-center gap-2 mb-2">
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold gradient-text">Batch Analysis</h1>
          <p className="text-white/60 mt-2">Process multiple invoices simultaneously</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div className="lg:col-span-1" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
              className={`glass-card p-8 mb-4 transition-all duration-300 border-2 border-dashed ${isDragging ? 'border-[#00f5ff] bg-[#00f5ff]/5' : 'border-white/10'}`}>
              <input type="file" multiple accept=".pdf,.csv,.xlsx" onChange={handleFileSelect} className="hidden" id="batch-upload" />
              <label htmlFor="batch-upload" className="cursor-pointer block text-center">
                <Upload className="w-12 h-12 mx-auto mb-4 text-[#00f5ff]" />
                <p className="text-white font-medium mb-2">Drop files or click to upload</p>
                <p className="text-white/40 text-sm">PDF, CSV, Excel files supported</p>
              </label>
            </div>

            <AnimatePresence>
              {files.length > 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-2 mb-4">
                  {files.map((file, index) => (
                    <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                      className="glass-card p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileSpreadsheet className="w-5 h-5 text-[#00f5ff]" />
                        <span className="text-sm text-white truncate max-w-[150px]">{file.name}</span>
                      </div>
                      <button onClick={() => removeFile(index)} className="p-1 hover:bg-white/10 rounded transition-colors">
                        <X className="w-4 h-4 text-white/50" />
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {files.length > 0 && !results && (
              <motion.button onClick={handleProcess} disabled={isProcessing}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#00f5ff] to-[#b829dd] text-white font-semibold flex items-center justify-center gap-3 disabled:opacity-50"
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                {isProcessing ? (<><Loader2 className="w-5 h-5 animate-spin" />Processing {files.length} files...</>) : (<><BarChart3 className="w-5 h-5" />Process Batch</>)}
              </motion.button>
            )}
          </motion.div>

          <motion.div className="lg:col-span-2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
            {results ? (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <motion.div className="glass-card p-4 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <div className="text-3xl font-bold text-[#00ff88]">{results.filter(r => r.decision === 'APPROVE').length}</div>
                    <div className="text-sm text-white/60">Approved</div>
                  </motion.div>
                  <motion.div className="glass-card p-4 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <div className="text-3xl font-bold text-[#ffcc00]">{results.filter(r => r.decision === 'HOLD').length}</div>
                    <div className="text-sm text-white/60">On Hold</div>
                  </motion.div>
                  <motion.div className="glass-card p-4 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <div className="text-3xl font-bold text-[#ff3366]">{results.filter(r => r.decision === 'BLOCK').length}</div>
                    <div className="text-sm text-white/60">Blocked</div>
                  </motion.div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <motion.div className="glass-card p-4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
                    <h4 className="text-sm font-medium text-white/60 mb-4">Layer Risk Scores</h4>
                    <LayerBarChart data={chartData} />
                  </motion.div>
                  <motion.div className="glass-card p-4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
                    <h4 className="text-sm font-medium text-white/60 mb-4">Decision Distribution</h4>
                    <DecisionPieChart data={decisionData} />
                  </motion.div>
                </div>

                <motion.div className="glass-card overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                  <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <h3 className="font-semibold">Analysis Results</h3>
                    <select value={filter} onChange={(e) => setFilter(e.target.value as any)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm text-white">
                      <option value="all">All Results</option>
                      <option value="approve">Approved</option>
                      <option value="hold">Hold</option>
                      <option value="block">Blocked</option>
                    </select>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-white/5">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-white/60 uppercase">Invoice ID</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-white/60 uppercase">Supplier</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-white/60 uppercase">Amount</th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-white/60 uppercase">Decision</th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-white/60 uppercase">Risk Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredResults?.map((result, index) => (
                          <motion.tr key={result.id} className="border-b border-white/5 hover:bg-white/5 transition-colors"
                            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 + index * 0.05 }}>
                            <td className="px-4 py-3 text-sm mono text-white/70">{result.id}</td>
                            <td className="px-4 py-3 text-sm text-white">{result.supplier}</td>
                            <td className="px-4 py-3 text-sm text-right mono">${result.amount.toLocaleString()}</td>
                            <td className="px-4 py-3 text-center">
                              <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: `${getDecisionColor(result.decision)}20`, color: getDecisionColor(result.decision) }}>
                                {result.decision}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                                  <div className="h-full rounded-full" style={{ width: `${result.risk_score}%`, background: result.risk_score < 30 ? '#00ff88' : result.risk_score < 70 ? '#ffcc00' : '#ff3366' }} />
                                </div>
                                <span className="text-xs mono">{result.risk_score}%</span>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-12 flex flex-col items-center justify-center text-center min-h-[500px]">
                <FileSpreadsheet className="w-16 h-16 text-white/20 mb-4" />
                <h3 className="text-xl font-semibold text-white/50 mb-2">No Batch Processed</h3>
                <p className="text-white/30 max-w-sm">Upload multiple invoice files to analyze them in batch mode</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
