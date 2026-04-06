'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Ghost, Search, AlertOctagon, Network } from 'lucide-react';

export default function ShadowTier() {
  const [supplierId, setSupplierId] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const simulateAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setResult({
        flagged: true,
        score: 7.2,
        shadowEntities: 6,
        violations: ["6 unverified Tier-3 shadow entities are supplying the target node."]
      });
      setAnalyzing(false);
    }, 1500);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full text-sm font-medium mb-4">
            <Network className="w-4 h-4" /> Layer 3: Graph Intelligence
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-br from-white to-slate-500 bg-clip-text text-transparent">
            Shadow-Tier Detector
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Uncovers hidden "ghost companies" (Tier 3+) that act as funnels to inject dirty funds or phantom merchandise into legitimate Tier 1 endpoints. Identifies dense clusters of unknown entities.
          </p>
        </motion.div>

        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay: 0.1}} className="p-1 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20">
          <div className="bg-slate-900 rounded-xl p-8 border border-slate-800 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
            
            <div className="relative z-10 flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="text" 
                  value={supplierId}
                  onChange={e => setSupplierId(e.target.value)}
                  placeholder="Enter Supplier ID to probe deep graph layers..."
                  className="w-full bg-slate-950 border border-slate-700/50 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-mono"
                />
              </div>
              <button 
                onClick={simulateAnalysis}
                disabled={!supplierId || analyzing}
                className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-medium px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]"
              >
                {analyzing ? <Ghost className="w-5 h-5 animate-pulse" /> : <Ghost className="w-5 h-5" />}
                Scan Deep Graph
              </button>
            </div>
          </div>
        </motion.div>

        {result && (
          <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="grid md:grid-cols-2 gap-6">
            
            <div className="bg-slate-900/50 rounded-2xl border border-amber-500/20 p-8 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-yellow-500" />
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-amber-400 font-medium mb-1">Graph Density Score</h3>
                  <div className="text-5xl font-black text-white">{result.score}<span className="text-2xl text-slate-500">/10</span></div>
                </div>
                <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <Ghost className="w-8 h-8 text-amber-500" />
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Shadow Nodes Detected</h4>
                {result.violations.map((v:any, i:number) => (
                  <div key={i} className="p-4 rounded-xl bg-amber-950/30 border border-amber-900/50 text-amber-200 text-sm flex gap-3">
                    <AlertOctagon className="w-5 h-5 text-amber-500 shrink-0" />
                    {v}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-8 flex flex-col justify-center overflow-hidden">
               <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider text-center mb-10">Cascade Topology</h4>
               <div className="relative h-48 w-full flex items-center justify-center">
                  <div className="absolute right-10 w-24 h-24 rounded-full bg-emerald-900/50 border border-emerald-500/50 flex items-center justify-center z-10">
                     <span className="text-xs font-bold text-emerald-300">Target</span>
                  </div>
                  
                  {Array.from({length: result.shadowEntities}).map((_, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="absolute left-10 w-8 h-8 rounded-full bg-amber-900/30 border border-amber-500/30 flex items-center justify-center shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                        style={{
                            top: `${10 + i * 16}%`
                        }}
                    >
                        <Ghost className="w-3 h-3 text-amber-500/50" />
                        <motion.svg className="absolute w-64 h-full pointer-events-none" style={{ left: '32px' }}>
                           <motion.line 
                              x1="0" y1="16" x2="150" y2={96 - i*15} 
                              stroke="rgba(245,158,11,0.2)" strokeWidth="1" strokeDasharray="4 2"
                              animate={{ strokeDashoffset: [-20, 0] }}
                              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                           />
                        </motion.svg>
                    </motion.div>
                  ))}
               </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
