'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HeartCrack, TrendingDown, ShieldAlert, Fingerprint } from 'lucide-react';

export default function TrustDecay() {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const simulateAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setResult({
        flagged: true,
        trust_score: 0.38,
        emerging_risk: 0.62,
        trust_trend: "decreasing",
        message: "Trust decayed by 62% over last 6 months. High emerging risk."
      });
      setAnalyzing(false);
    }, 1200);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}}>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-full text-sm font-medium mb-4">
            <Fingerprint className="w-4 h-4" /> Layer 1: DNA & Behavior
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-500">
            Trust-Decay Engine
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mt-4">
            Tracks historical reputation half-life. If a supplier's historical trust score drops below its current anomaly activity score, it calculates an 'Emerging Risk' delta.
          </p>
        </motion.div>

        <button 
            onClick={simulateAnalysis}
            disabled={analyzing}
            className="bg-rose-600 hover:bg-rose-500 text-white w-full max-w-md py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(225,29,72,0.4)] disabled:opacity-50"
        >
            {analyzing ? <HeartCrack className="w-5 h-5 animate-spin" /> : <HeartCrack className="w-5 h-5" />}
            Analyze Reputational Decay
        </button>

        {result && (
          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="bg-slate-900/50 rounded-2xl border border-rose-500/20 p-8 flex flex-col items-center justify-center">
               <h4 className="text-slate-400 mb-6 font-medium">Reputation Decay Curve</h4>
               
               {/* Simple line chart with SVG */}
               <svg viewBox="0 0 400 200" className="w-full text-rose-500 overflow-visible">
                  <motion.path 
                     initial={{ pathLength: 0 }}
                     animate={{ pathLength: 1 }}
                     transition={{ duration: 1.5, ease: "easeOut" }}
                     fill="none" 
                     stroke="currentColor" 
                     strokeWidth="4"
                     d="M0 10 C 100 10, 200 80, 400 180" 
                  />
                  <circle cx="400" cy="180" r="6" fill="#f43f5e" />
                  
                  {/* Grid lines */}
                  <line x1="0" y1="200" x2="400" y2="200" stroke="#334155" strokeWidth="2" />
                  <line x1="0" y1="0" x2="0" y2="200" stroke="#334155" strokeWidth="2" />
               </svg>
               <div className="flex justify-between w-full mt-4 text-xs text-slate-500 font-mono">
                  <span>T-6 Months</span>
                  <span>Today (Trust: {result.trust_score * 100}%)</span>
               </div>
            </div>

            <div className="space-y-6">
                <div className="bg-orange-950/20 rounded-2xl border border-orange-500/20 p-8">
                    <div className="flex gap-4 items-center">
                        <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center">
                            <ShieldAlert className="w-8 h-8 text-orange-500" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-400 font-medium">Emerging Risk Delta</p>
                            <p className="text-4xl font-black text-rose-400">+{Math.round(result.emerging_risk * 100)}%</p>
                        </div>
                    </div>
                    <p className="mt-6 text-slate-300">{result.message}</p>
                </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
