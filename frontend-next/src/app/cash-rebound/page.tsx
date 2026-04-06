'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCcw, Search, AlertOctagon, Network } from 'lucide-react';

export default function CashRebound() {
  const [buyerId, setBuyerId] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const simulateAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setResult({
        flagged: true,
        score: 10,
        loopLen: 3,
        violations: ["Cash rebound loop detected of length 3! Money flows back to the original entity."]
      });
      setAnalyzing(false);
    }, 1800);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-full text-sm font-medium mb-4">
            <Network className="w-4 h-4" /> Layer 3: Graph Intelligence
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-br from-white to-slate-500 bg-clip-text text-transparent">
            Cash-Rebound Detector
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Identifies structural self-funding loops where the buyer and supplier are fundamentally the same entity masking as different companies through a circular chain.
          </p>
        </motion.div>

        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay: 0.1}} className="p-1 rounded-2xl bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20">
          <div className="bg-slate-900 rounded-xl p-8 border border-slate-800 backdrop-blur-sm relative overflow-hidden">
             
            <div className="relative z-10 flex flex-col md:flex-row gap-4">
              <div className="flex-1 flex gap-4">
                <input 
                    type="text" 
                    value={buyerId}
                    onChange={e => setBuyerId(e.target.value)}
                    placeholder="Buyer ID"
                    className="w-1/2 bg-slate-950 border border-slate-700/50 rounded-xl py-4 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
                <input 
                    type="text" 
                    value={supplierId}
                    onChange={e => setSupplierId(e.target.value)}
                    placeholder="Supplier ID"
                    className="w-1/2 bg-slate-950 border border-slate-700/50 rounded-xl py-4 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              </div>
              <button 
                onClick={simulateAnalysis}
                disabled={(!buyerId || !supplierId) || analyzing}
                className="bg-purple-600 hover:bg-purple-500 text-white font-medium px-8 py-4 rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] disabled:opacity-50"
              >
                {analyzing ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <RefreshCcw className="w-5 h-5" />}
                Trace Loop
              </button>
            </div>
          </div>
        </motion.div>

        {result && (
          <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="grid md:grid-cols-2 gap-6">
            
            <div className="bg-slate-900/50 rounded-2xl border border-purple-500/20 p-8 space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-purple-400 font-medium mb-1">Circular Risk Score</h3>
                  <div className="text-5xl font-black text-rose-500">{result.score}<span className="text-2xl text-slate-500">/10</span></div>
                </div>
              </div>
              
              <div className="space-y-3 mt-8">
                {result.violations.map((v:any, i:number) => (
                  <div key={i} className="p-4 rounded-xl bg-purple-950/30 border border-purple-900/50 text-purple-200 text-sm flex gap-3">
                    <AlertOctagon className="w-5 h-5 text-purple-500" />
                    {v}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-8 flex items-center justify-center min-h-[300px]">
               <div className="relative w-48 h-48">
                  <motion.div 
                     animate={{ rotate: 360 }} 
                     transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                     className="absolute inset-0 rounded-full border-2 border-dashed border-purple-500/30"
                  />
                  {[...Array(result.loopLen)].map((_, i) => {
                     const angle = (i * 360) / result.loopLen - 90;
                     const rad = (angle * Math.PI) / 180;
                     const r = 96;
                     return (
                        <motion.div
                           key={i}
                           initial={{ scale: 0 }}
                           animate={{ scale: 1 }}
                           transition={{ delay: i * 0.3 }}
                           className="absolute w-12 h-12 bg-purple-900 border-2 border-purple-400 rounded-full flex items-center justify-center text-xs font-bold"
                           style={{
                              left: `calc(50% + ${Math.cos(rad) * r}px - 24px)`,
                              top: `calc(50% + ${Math.sin(rad) * r}px - 24px)`,
                           }}
                        >
                           T{i+1}
                        </motion.div>
                     )
                  })}
               </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
