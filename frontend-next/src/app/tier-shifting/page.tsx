'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRightLeft, Search, AlertOctagon, Network, RefreshCcw } from 'lucide-react';

export default function TierShifting() {
  const [supplierId, setSupplierId] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const simulateAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setResult({
        flagged: true,
        score: 8.5,
        buyers: ['Global Motors', 'Bank A', 'Bank B', 'TechSource Ltd'],
        violations: ["Company acts as a supplier to 4 different buyers (Tier-hopping signature)."]
      });
      setAnalyzing(false);
    }, 1500);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-sm font-medium mb-4">
            <Network className="w-4 h-4" /> Layer 3: Graph Intelligence
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-br from-white to-slate-500 bg-clip-text text-transparent">
            Tier-Shifting Detector
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Detects role-hopping and tier-compression by analyzing cross-lender and cross-buyer supply chain structures. Identifies entities that claim to be a primary manufacturer (Tier 1) for one loan, but a sub-supplier (Tier 2/3) for another.
          </p>
        </motion.div>

        {/* Input area */}
        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay: 0.1}} className="p-1 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20">
          <div className="bg-slate-900 rounded-xl p-8 border border-slate-800 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
            
            <div className="relative z-10 flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="text" 
                  value={supplierId}
                  onChange={e => setSupplierId(e.target.value)}
                  placeholder="Enter Supplier ID to analyze cross-tier roles..."
                  className="w-full bg-slate-950 border border-slate-700/50 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-mono"
                />
              </div>
              <button 
                onClick={simulateAnalysis}
                disabled={!supplierId || analyzing}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]"
              >
                {analyzing ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <ArrowRightLeft className="w-5 h-5" />}
                Analyze Roles
              </button>
            </div>
          </div>
        </motion.div>

        {/* Results Area */}
        {result && (
          <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="grid md:grid-cols-2 gap-6">
            
            <div className="bg-slate-900/50 rounded-2xl border border-rose-500/20 p-8 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-orange-500" />
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-rose-400 font-medium mb-1">Anomaly Score</h3>
                  <div className="text-5xl font-black text-white">{result.score}<span className="text-2xl text-slate-500">/10</span></div>
                </div>
                <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center">
                  <AlertOctagon className="w-8 h-8 text-rose-500" />
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Violations Detected</h4>
                {result.violations.map((v:any, i:number) => (
                  <div key={i} className="p-4 rounded-xl bg-rose-950/30 border border-rose-900/50 text-rose-200 text-sm flex gap-3">
                    <AlertOctagon className="w-5 h-5 text-rose-500 shrink-0" />
                    {v}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-8 flex flex-col justify-center">
              <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6 text-center">Interactive Graph Preview</h4>
              <div className="flex-1 flex items-center justify-center relative min-h-[200px]">
                {/* CSS Graph Representation */}
                <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.3}} className="relative w-full h-full max-w-sm mx-auto">
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-rose-600 border-4 border-rose-950 flex flex-col items-center justify-center z-20 shadow-[0_0_30px_rgba(225,29,72,0.4)]">
                        <span className="text-[10px] font-bold text-rose-100">{supplierId.substring(0,6) || "SUPPLY"}</span>
                        <span className="text-[9px] text-rose-300">Target</span>
                    </div>
                    
                    {result.buyers.map((buyer:string, i:number) => {
                      const angle = (i * 360) / result.buyers.length;
                      const rad = (angle * Math.PI) / 180;
                      const r = 100;
                      const x = Math.cos(rad) * r;
                      const y = Math.sin(rad) * r;
                      
                      return (
                        <div key={i}>
                          <motion.div 
                            initial={{width: 0}}
                            animate={{width: 100}}
                            transition={{delay: 0.5 + i*0.2, duration: 0.5}}
                            className="absolute left-1/2 top-1/2 h-0.5 bg-rose-500/40 origin-left"
                            style={{ transform: `rotate(${angle}deg)` }}
                          />
                          <motion.div
                            initial={{opacity: 0, scale:0}}
                            animate={{opacity: 1, scale:1}}
                            transition={{delay: 0.7 + i*0.2}}
                            className="absolute z-10 w-16 h-16 rounded-full bg-slate-800 border-2 border-slate-600 flex flex-col items-center justify-center shadow-lg"
                            style={{
                              left: `calc(50% + ${x}px - 32px)`,
                              top: `calc(50% + ${y}px - 32px)`,
                            }}
                          >
                            <span className="text-[9px] font-semibold text-center leading-tight text-white px-1">{buyer}</span>
                          </motion.div>
                        </div>
                      )
                    })}
                </motion.div>
              </div>
            </div>

          </motion.div>
        )}
      </div>
    </div>
  );
}
