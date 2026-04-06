'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, RadioReceiver, AlertOctagon } from 'lucide-react';

export default function FundingFrequency() {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const simulateAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setResult({
        flagged: true,
        dominant_period_days: 14.1,
        score: 8.0,
        violations: [
            "Funding requests cluster perfectly around a 14-day cycle. Synthetic injection highly likely."
        ]
      });
      setAnalyzing(false);
    }, 1500);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}}>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-lime-500/10 border border-lime-500/20 text-lime-400 rounded-full text-sm font-medium mb-4">
            <Activity className="w-4 h-4" /> Layer 1: Behavioral Analytics
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-500">
            Resonance Detector
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mt-4">
            Analyzes submission rhythms (e.g. 7, 14, or 30 days). Identifies synthetic, automated funding injections that perfectly match standard banking rhythms rather than natural business cycles.
          </p>
        </motion.div>

        <button 
            onClick={simulateAnalysis}
            disabled={analyzing}
            className="bg-lime-600 outline-none hover:bg-lime-500 text-white w-full max-w-md py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_30px_rgba(132,204,22,0.4)] disabled:opacity-50 font-bold"
        >
            {analyzing ? <RadioReceiver className="w-5 h-5 animate-pulse" /> : <RadioReceiver className="w-5 h-5" />}
            Scan Spectral Resonance
        </button>

        {result && (
          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="bg-slate-900/50 rounded-2xl border border-lime-500/20 p-8">
              <h3 className="text-lime-400 font-medium mb-6 flex items-center gap-2"><Activity className="w-5 h-5"/> FFT Interval Peaks</h3>
               
               <div className="relative h-48 w-full border-b border-slate-700 flex items-end justify-around pb-0">
                  <div className="flex flex-col items-center w-8 group">
                    <motion.div initial={{height:0}} animate={{height: '20%'}} className="w-full bg-slate-700 rounded-t-sm" />
                    <span className="text-[10px] text-slate-500 mt-2">7d</span>
                  </div>
                  <div className="flex flex-col items-center w-8">
                    <motion.div initial={{height:0}} animate={{height: '95%'}} className="w-full bg-lime-500 shadow-[0_0_15px_rgba(132,204,22,0.6)] rounded-t-sm" />
                    <span className="text-[10px] text-lime-400 font-bold mt-2">14d</span>
                  </div>
                  <div className="flex flex-col items-center w-8">
                    <motion.div initial={{height:0}} animate={{height: '10%'}} className="w-full bg-slate-700 rounded-t-sm" />
                    <span className="text-[10px] text-slate-500 mt-2">21d</span>
                  </div>
                  <div className="flex flex-col items-center w-8">
                    <motion.div initial={{height:0}} animate={{height: '35%'}} className="w-full bg-slate-500 rounded-t-sm" />
                    <span className="text-[10px] text-slate-400 mt-2">30d</span>
                  </div>
               </div>
            </div>

            <div className="space-y-6">
                <div className="bg-lime-950/20 rounded-2xl border border-lime-500/20 p-8 h-full">
                    <h4 className="text-lime-400 uppercase text-xs font-bold tracking-widest mb-4">Resonance Feedback</h4>
                    <ul className="space-y-4">
                        {result.violations.map((v:any, i:number) => (
                            <li key={i} className="flex gap-3 text-lime-200">
                                <AlertOctagon className="w-5 h-5 shrink-0 text-lime-500" />
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
