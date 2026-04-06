'use client';

import { useState, useEffect, useRef } from 'react';
import { Terminal, Crosshair, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

const queryLogs = [
  "INITIALIZING Neo4j Driver Connection... [OK]",
  "EXECUTE: MATCH (b:Buyer)-[r:INVOICE]->(s1:Supplier)",
  "          WHERE r.amount > 5000000",
  "          WITH b, r, s1",
  "EXECUTE: MATCH (s1)-[r2:SUBCONTRACT]->(s2:Supplier)",
  "          WHERE s2.incorporation_date >= date() - duration({months: 6})",
  "DETECTED: 14 High-risk sub-tier nodes matching shell-company signature.",
  "CALCULATING PageRank across Tier-3 network cluster...",
  "RESULT: Convergence at 0.86 confidence. Warning!",
  "EXECUTE: CALL gds.louvain.stream('riskNetwork')",
  "YIELD nodeId, communityId",
  "CRITICAL: Fraud Ring 'Community-91X' identified cascading to 3 lenders.",
  "ISOLATING subgraph and pushing alerts to Pre-Disbursement Engine..."
];

export const LiveCypherTerminal = () => {
  const [lines, setLines] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      setLines(prev => {
        if (currentLine >= queryLogs.length) {
          currentLine = 0; // loop
          return [queryLogs[0]];
        }
        return [...prev, queryLogs[currentLine]];
      });
      currentLine++;
      
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      className="fixed bottom-6 left-6 w-96 h-64 bg-black/80 backdrop-blur-md rounded-lg border border-[#00f5ff]/30 z-[100] flex flex-col overflow-hidden shadow-[0_0_20px_rgba(0,245,255,0.1)]"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1 }}
    >
      <div className="bg-[#0f172a] border-b border-white/10 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#00f5ff]" />
          <span className="text-xs font-mono text-white/70">NEO4J CYPHER ENGINE</span>
        </div>
        <div className="flex gap-2">
          <motion.div className="w-2 h-2 rounded-full bg-green-500" animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1, repeat: Infinity }} />
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <div className="w-2 h-2 rounded-full bg-red-500" />
        </div>
      </div>
      
      <div ref={containerRef} className="flex-1 p-4 overflow-y-auto font-mono text-[10px] leading-relaxed scrollbar-hide">
        {lines.map((line, i) => {
          let colorClass = "text-[#00f5ff]/70";
          if (line.includes("DETECTED:") || line.includes("WARNING")) colorClass = "text-yellow-400";
          if (line.includes("CRITICAL:")) colorClass = "text-red-500 font-bold";
          if (line.includes("EXECUTE:")) colorClass = "text-white/90";
          
          return (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-1 ${colorClass}`}
            >
              <span className="opacity-50 mr-2">{'>'}</span>{line}
            </motion.div>
          );
        })}
        <motion.div 
          animate={{ opacity: [1, 0, 1] }} 
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="inline-block w-2 h-3 bg-[#00f5ff] ml-1 align-middle"
        />
      </div>
    </motion.div>
  );
};
