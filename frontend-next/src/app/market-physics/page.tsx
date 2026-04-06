'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Store, Anchor, AlertOctagon, Activity } from 'lucide-react';

export default function MarketPhysics() {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const simulateAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setResult({
        flagged: true,
        score: 8.0,
        violations: [
            "Sea transport from shanghai to rotterdam in 8 days is physically impossible.",
            "Quantity 25000 tons exceeds regional monthly max capacity for steel_coils (20000 tons)."
        ]
      });
      setAnalyzing(false);
    }, 1200);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}}>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-full text-sm font-medium mb-4">
            <Activity className="w-4 h-4" /> Layer 2: Physics Engine
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Market-Physics Validator
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mt-4">
            Checks claims against physical macro constraints. Validates whether transport speeds break the laws of physics, or if commodity volumes exceed entire port capacities.
          </p>
        </motion.div>

        <button 
            onClick={simulateAnalysis}
            disabled={analyzing}
            className="bg-cyan-600 hover:bg-cyan-500 text-white w-full max-w-md py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] disabled:opacity-50"
        >
            {analyzing ? <Store className="w-5 h-5 animate-spin" /> : <Store className="w-5 h-5" />}
            Analyze Physical Constraints Constraints
        </button>

        {result && (
          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="bg-slate-900/50 rounded-2xl border border-cyan-500/20 p-8">
              <h3 className="text-cyan-400 font-medium mb-6 flex items-center gap-2"><Anchor className="w-5 h-5"/> Logistics Constraint Engine</h3>
              
              <div className="space-y-6">
                <div className="p-4 bg-slate-800 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500" />
                    <div className="flex justify-between items-end">
                       <div>
                          <p className="text-xs text-slate-400">Claimed Transit Time</p>
                          <p className="text-2xl font-bold">8 days</p>
                       </div>
                       <div className="text-right">
                          <p className="text-xs text-rose-400">Physical Minimum</p>
                          <p className="text-lg">25 days</p>
                       </div>
                    </div>
                    {/* Progress bar visualizing impossibility */}
                    <div className="mt-4 h-2 bg-slate-700 rounded-full overflow-hidden flex">
                       <div className="w-1/3 bg-rose-500 flex items-center justify-center relative">
                          <span className="absolute -top-6 text-[10px] text-rose-400 font-bold whitespace-nowrap">Teleportation Zone</span>
                       </div>
                       <div className="w-2/3 bg-cyan-500" />
                    </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
                <div className="bg-rose-950/20 rounded-2xl border border-rose-500/20 p-8">
                    <h4 className="text-rose-400 uppercase text-xs font-bold tracking-widest mb-4">Physics Violations</h4>
                    <ul className="space-y-3">
                        {result.violations.map((v:any, i:number) => (
                            <li key={i} className="flex gap-3 text-rose-200 text-sm">
                                <AlertOctagon className="w-5 h-5 shrink-0 text-rose-500" />
                                {v}
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
