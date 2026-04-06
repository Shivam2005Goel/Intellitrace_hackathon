'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserX, Hexagon, Crosshair } from 'lucide-react';

export default function FraudPersona() {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const simulateAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setResult({
        personas: {
           tier_hopping: 0.8,
           cash_rebound: 0.2,
           shadow_tier: 0.6,
           gap_phantom_backward: 0.9,
           temporal_rhythm_fraud: 0.3
        },
        primary: "Gap-Phantom Backward Chain"
      });
      setAnalyzing(false);
    }, 1500);
  }

  // Helper to get radar chart points
  const getRadarPoints = (data: any, size: number) => {
     const keys = Object.keys(data);
     const center = size / 2;
     const radius = center * 0.8;
     
     return keys.map((key, i) => {
        const value = data[key]; // 0 to 1
        const angle = (Math.PI * 2 * i) / keys.length - Math.PI / 2;
        const x = center + Math.cos(angle) * radius * value;
        const y = center + Math.sin(angle) * radius * value;
        return `${x},${y}`;
     }).join(' ');
  };

  const getBackgroundRadarPolygon = (size: number, len: number) => {
    const center = size / 2;
    const radius = center * 0.8;
    return Array.from({length: len}).map((_, i) => {
        const angle = (Math.PI * 2 * i) / len - Math.PI / 2;
        return `${center + Math.cos(angle) * radius},${center + Math.sin(angle) * radius}`;
    }).join(' ');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}}>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 rounded-full text-sm font-medium mb-4">
            <Crosshair className="w-4 h-4" /> Global Orchestrator Classifier
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-pink-600">
            Fraud-Persona Typing
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mt-4">
            Maps raw numerical anomalies from all 5 layers into human-readable archetypes of fraud.
          </p>
        </motion.div>

        <button 
            onClick={simulateAnalysis}
            disabled={analyzing}
            className="bg-fuchsia-600 outline-none hover:bg-fuchsia-500 text-white w-full max-w-md py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_30px_rgba(192,38,211,0.4)] disabled:opacity-50 font-bold"
        >
            {analyzing ? <Hexagon className="w-5 h-5 animate-spin" /> : <UserX className="w-5 h-5" />}
            Generate Typology Profile
        </button>

        {result && (
          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="bg-slate-900/50 rounded-2xl border border-fuchsia-500/30 p-8 flex flex-col items-center justify-center relative">
                <div className="absolute top-4 left-4">
                   <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Primary Match</p>
                   <p className="text-xl font-black text-fuchsia-400 leading-tight w-48">{result.primary}</p>
                </div>

                <div className="mt-12">
                   <svg width="250" height="250" className="overflow-visible">
                      {/* Background Web */}
                      {[0.2, 0.4, 0.6, 0.8, 1].map((scale, i) => (
                         <polygon 
                            key={i}
                            points={getBackgroundRadarPolygon(250, 5)} 
                            fill="none" 
                            stroke="#334155" 
                            strokeWidth="1"
                            transform={`scale(${scale}) truncate`}
                            style={{transformOrigin: '50% 50%'}}
                         />
                      ))}
                      
                      {/* Axis Lines */}
                      {Array.from({length: 5}).map((_, i) => {
                         const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
                         return (
                            <line 
                               key={i}
                               x1="125" y1="125" 
                               x2={125 + Math.cos(angle) * 100} 
                               y2={125 + Math.sin(angle) * 100}
                               stroke="#334155" strokeWidth="1" 
                            />
                         )
                      })}

                      {/* Radar Data */}
                      <motion.polygon 
                         initial={{ scale: 0 }}
                         animate={{ scale: 1 }}
                         transition={{ type: "spring", stiffness: 50 }}
                         points={getRadarPoints(result.personas, 250)}
                         fill="rgba(217, 70, 239, 0.3)"
                         stroke="#d946ef"
                         strokeWidth="3"
                         style={{transformOrigin: '50% 50%'}}
                      />
                   </svg>
                </div>
            </div>

            <div className="space-y-4">
                <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-8 h-full">
                    <h4 className="text-slate-400 uppercase text-xs font-bold tracking-widest mb-6">Typology Distribution</h4>
                    <div className="space-y-6">
                       {Object.entries(result.personas).map(([key, value]: [string, any], i) => (
                           <div key={i}>
                              <div className="flex justify-between text-sm mb-1 text-slate-300">
                                 <span className="capitalize">{key.replace(/_/g, ' ')}</span>
                                 <span className="font-bold">{(value * 100).toFixed(0)}%</span>
                              </div>
                              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                 <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${value * 100}%` }}
                                    transition={{ duration: 1, delay: i * 0.1 }}
                                    className={`h-full ${value > 0.7 ? 'bg-rose-500' : value > 0.4 ? 'bg-amber-500' : 'bg-slate-500'}`}
                                 />
                              </div>
                           </div>
                       ))}
                    </div>
                </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
