'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { History, Activity, AlertOctagon } from 'lucide-react';

export default function InverseCausality() {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const simulateAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setResult({
        flagged: true,
        score: 9.0,
        timeline: [
            { event: "Payment Received", date: "2024-03-01", isViolation: true },
            { event: "Purchase Order Initialized", date: "2024-03-10", isViolation: false },
            { event: "Goods Receipt Note", date: "2024-03-15", isViolation: false },
        ],
        violations: [
            "Payment made BEFORE Purchase Order (Phantom Backward Inverse Causality)",
            "Payment made BEFORE Goods Receipt (Phantom Backward Inverse Causality)"
        ]
      });
      setAnalyzing(false);
    }, 1500);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}}>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/10 border border-teal-500/20 text-teal-400 rounded-full text-sm font-medium mb-4">
            <Activity className="w-4 h-4" /> Layer 2: Physics Engine
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-600">
            Inverse-Causality Inspector
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mt-4">
            Checks for 'Phantom-Backward-Chains' where causality flows in reverse. If a payment was issued before a PO was created, it constitutes a critical temporal paradox.
          </p>
        </motion.div>

        <button 
            onClick={simulateAnalysis}
            disabled={analyzing}
            className="bg-teal-600 hover:bg-teal-500 text-white w-full max-w-md py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(20,184,166,0.4)] disabled:opacity-50"
        >
            {analyzing ? <History className="w-5 h-5 animate-spin" /> : <History className="w-5 h-5" />}
            Analyze Causality Chain API
        </button>

        {result && (
          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="bg-slate-900/50 rounded-2xl border border-teal-500/20 p-8">
              <h3 className="text-teal-400 font-medium mb-6 flex items-center gap-2"><History className="w-5 h-5"/> Temporal Paradox Timeline</h3>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
                  {result.timeline.map((item:any, index:number) => (
                      <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-900  ${item.isViolation ? 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.6)]' : 'bg-slate-700'} shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2`}>
                             {item.isViolation && <AlertOctagon className="w-4 h-4 text-white" />}
                          </div>
                          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-800 bg-slate-900/80 shadow">
                              <time className={`text-sm font-semibold ${item.isViolation ? 'text-rose-400' : 'text-teal-400'}`}>{item.date}</time>
                              <div className="text-slate-200 mt-1 font-medium">{item.event}</div>
                          </div>
                      </div>
                  ))}
              </div>
            </div>

            <div className="space-y-6">
                <div className="bg-rose-950/20 rounded-2xl border border-rose-500/20 p-8">
                    <h4 className="text-rose-400 uppercase text-xs font-bold tracking-widest mb-4">Paradox Violations</h4>
                    <ul className="space-y-3">
                        {result.violations.map((v:any, i:number) => (
                            <li key={i} className="flex gap-3 text-rose-200">
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
