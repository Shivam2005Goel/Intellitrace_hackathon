'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileSearch, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function RealityConsistency() {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const simulateAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setResult({
        flagged: true,
        score: 6.0,
        similarity_matrix: {
           invoice_po: 0.42,
           invoice_grn: 0.91,
           po_grn: 0.38
        },
        violations: [
            "Invoice and Purchase Order text semantics have anomalously low similarity (0.42). Suggests disjoint realities or synthesized documents."
        ]
      });
      setAnalyzing(false);
    }, 2000);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}}>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" /> Layer 4: AI Semantic Engine
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
            Reality-Consistency Embedding
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mt-4">
            Embeds text from the Invoice, PO, and GRN using transformer-based models and computes their cosine similarity in hyper-dimensional space. Exposes disjoint or AI-generated fakes.
          </p>
        </motion.div>

        <button 
            onClick={simulateAnalysis}
            disabled={analyzing}
            className="bg-indigo-600 hover:bg-indigo-500 text-white w-full max-w-md py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_30px_rgba(79,70,229,0.4)] disabled:opacity-50 font-bold tracking-wide"
        >
            {analyzing ? <FileSearch className="w-5 h-5 animate-pulse" /> : <FileSearch className="w-5 h-5" />}
            Compute Cosine Realities
        </button>

        {result && (
          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="bg-slate-900/50 rounded-2xl border border-indigo-500/20 p-8">
              <h3 className="text-indigo-400 font-medium mb-6">Cosine Similarity Matrix</h3>
              
              <div className="space-y-4">
                 <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                    <div className="text-sm font-medium text-slate-300">Invoice ↔ Purchase Order</div>
                    <div className="flex items-center gap-2">
                       <span className="text-2xl font-bold text-rose-500">{result.similarity_matrix.invoice_po}</span>
                       <AlertTriangle className="w-5 h-5 text-rose-500" />
                    </div>
                 </div>
                 
                 <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                    <div className="text-sm font-medium text-slate-300">Invoice ↔ Goods Receipt</div>
                    <div className="flex items-center gap-2">
                       <span className="text-2xl font-bold text-emerald-400">{result.similarity_matrix.invoice_grn}</span>
                       <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    </div>
                 </div>

                 <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                    <div className="text-sm font-medium text-slate-300">PO ↔ Goods Receipt</div>
                    <div className="flex items-center gap-2">
                       <span className="text-2xl font-bold text-rose-500">{result.similarity_matrix.po_grn}</span>
                       <AlertTriangle className="w-5 h-5 text-rose-500" />
                    </div>
                 </div>
              </div>
            </div>

            <div className="space-y-6">
                <div className="bg-rose-950/20 rounded-2xl border border-rose-500/30 p-8 h-full flex flex-col justify-center">
                    <h4 className="text-rose-400 uppercase text-xs font-bold tracking-widest mb-4">Semantic Mismatches</h4>
                    <ul className="space-y-4">
                        {result.violations.map((v:any, i:number) => (
                            <li key={i} className="flex gap-3 text-rose-200">
                                <AlertTriangle className="w-5 h-5 shrink-0 text-rose-500" />
                                <span className="leading-relaxed">{v}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
