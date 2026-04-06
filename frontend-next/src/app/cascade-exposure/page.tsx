'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, TrendingDown, Layers, Zap } from 'lucide-react';

export default function CascadeExposure() {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const simulateAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setResult({
        flagged: true,
        base_amount: 1500000,
        exposure_prevented: 2400000,
        multiplier: 1.6,
        message: "Blocking this invoice would prevent an estimated $2,400,000 in downstream cascading fraud exposure."
      });
      setAnalyzing(false);
    }, 1500);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}}>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-full text-sm font-medium mb-4">
            <Layers className="w-4 h-4" /> Layer 5: Predictive Systemic Impact
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">
            Cascade-Exposure Simulator
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mt-4">
            Evaluates the "Counterfactual Engine". It calculates the systemic savings of blocking a single node, estimating how downstream synthetic loan generation falls apart if this invoice is stopped.
          </p>
        </motion.div>

        <button 
            onClick={simulateAnalysis}
            disabled={analyzing}
            className="bg-yellow-600 outline-none hover:bg-yellow-500 text-slate-900 w-full max-w-md py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_30px_rgba(234,179,8,0.4)] disabled:opacity-50 font-black tracking-wide"
        >
            {analyzing ? <Zap className="w-5 h-5 animate-pulse" /> : <ShieldAlert className="w-5 h-5" />}
            Simulate Counterfactual Drop
        </button>

        {result && (
          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="bg-slate-900/50 rounded-2xl border border-yellow-500/20 p-8 flex flex-col justify-center relative overflow-hidden">
               <div className="absolute top-0 right-0 p-32 bg-yellow-500/5 rounded-full blur-[100px] pointer-events-none" />
               <p className="text-slate-400 font-medium mb-2 uppercase tracking-widest text-sm">Systemic Capital Saved</p>
               <div className="text-6xl font-black text-white drop-shadow-lg flex items-center gap-4">
                  ${(result.exposure_prevented/1000000).toFixed(1)}<span className="text-3xl text-yellow-500 font-bold">M</span>
                  <TrendingDown className="w-10 h-10 text-emerald-400" />
               </div>
               
               <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-800/50 rounded-xl">
                     <p className="text-xs text-slate-500 mb-1">Base Invoice Value</p>
                     <p className="text-xl font-bold">${(result.base_amount/1000).toFixed(0)}K</p>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-xl">
                     <p className="text-xs text-slate-500 mb-1">Network Multiplier</p>
                     <p className="text-xl font-bold text-yellow-400">{result.multiplier}x</p>
                  </div>
               </div>
            </div>

            <div className="space-y-6">
                <div className="bg-amber-950/20 rounded-2xl border border-amber-500/20 p-8 h-full flex flex-col justify-center">
                    <h4 className="text-amber-400 uppercase text-xs font-bold tracking-widest mb-4">Counterfactual Impact</h4>
                    <p className="text-xl leading-relaxed text-amber-100/80 font-medium">
                        "{result.message}"
                    </p>
                </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
