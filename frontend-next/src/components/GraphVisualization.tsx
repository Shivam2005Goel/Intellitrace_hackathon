'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { GraphResult } from '@/types';
import { Network, AlertTriangle, CheckCircle2, Users } from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, 
  PieChart, Pie, Cell, Tooltip 
} from 'recharts';

interface GraphVisualizationProps {
  graph: GraphResult;
}

export default function GraphVisualization({ graph }: GraphVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Radar chart data mapping based off risk factors
  const radarData = [
    { subject: 'Cycles', A: graph.cycles_found * 20, fullMark: 100 },
    { subject: 'Risk', A: graph.risk_score * 10, fullMark: 100 },
    { subject: 'Communities', A: graph.communities ? graph.communities.suspicious_community_count * 25 : 0, fullMark: 100 },
    { subject: 'Density', A: graph.companies_involved > 0 ? 50 + (graph.companies_involved * 5) : 10, fullMark: 100 },
    { subject: 'Anomalies', A: graph.flagged ? 90 : 10, fullMark: 100 },
  ];

  // Pie chart data
  const pieData = [
    { name: 'Suspicious Communities', value: graph.communities ? graph.communities.suspicious_community_count : 0 },
    { name: 'Normal Communities', value: graph.communities ? Math.max(0, graph.communities.num_communities - graph.communities.suspicious_community_count) : 1 },
  ];
  
  const PIE_COLORS = ['#ff3366', '#00f5ff'];

  // Background neon particles visualization loop
  useEffect(() => {
    if (!canvasRef.current || graph.fraud_rings.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Fit canvas exactly into parent
    const parent = canvas.parentElement;
    if(parent) {
      canvas.width = parent.clientWidth - 48; // padding adj
      canvas.height = 300;
    } else {
      canvas.width = canvas.offsetWidth;
      canvas.height = 300;
    }

    let animationFrameId: number;
    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      time += 0.01;

      graph.fraud_rings.slice(0, 3).forEach((ring, ringIndex) => {
        const baseRadius = 80 + ringIndex * 40;
        
        ctx.beginPath();
        // Pulsate radius
        const pRadius = baseRadius + Math.sin(time * 2 + ringIndex) * 5;
        ctx.arc(centerX, centerY, pRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 51, 102, 0.1)`;
        ctx.lineWidth = 1;
        ctx.stroke();

        ring.forEach((node, i) => {
          const angle = (i / ring.length) * Math.PI * 2 - Math.PI / 2 + (time * (ringIndex % 2 === 0 ? 0.2 : -0.2));
          const x = centerX + Math.cos(angle) * pRadius;
          const y = centerY + Math.sin(angle) * pRadius;

          // Node glow
          const grd = ctx.createRadialGradient(x, y, 0, x, y, 20);
          grd.addColorStop(0, 'rgba(255, 51, 102, 0.8)');
          grd.addColorStop(1, 'rgba(255, 51, 102, 0)');
          
          ctx.beginPath();
          ctx.arc(x, y, 20, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#fff';
          ctx.fill();

          // Link to next
          const nextAngle = ((i + 1) / ring.length) * Math.PI * 2 - Math.PI / 2 + (time * (ringIndex % 2 === 0 ? 0.2 : -0.2));
          const nextX = centerX + Math.cos(nextAngle) * pRadius;
          const nextY = centerY + Math.sin(nextAngle) * pRadius;

          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(nextX, nextY);
          ctx.strokeStyle = 'rgba(255, 51, 102, 0.5)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        });
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [graph.fraud_rings]);

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="glass-card rounded-xl p-4 shadow-sm border border-[rgba(255,255,255,0.1)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(255,255,255,0.05)] to-transparent pointer-events-none" />
          <div className="flex items-center gap-3 mb-2 relative z-10">
            <Network className="w-5 h-5 text-[#00f5ff]" />
            <span className="text-[10px] uppercase tracking-widest text-[rgba(255,255,255,0.5)]">Cycles Found</span>
          </div>
          <div className={`text-3xl font-mono relative z-10 ${graph.cycles_found > 0 ? 'text-[#ff3366] text-glow-red' : 'text-[#00ff88] text-glow-green'}`}>
            {graph.cycles_found}
          </div>
        </div>

        <div className="glass-card rounded-xl p-4 shadow-sm border border-[rgba(255,255,255,0.1)] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(255,255,255,0.05)] to-transparent pointer-events-none" />
          <div className="flex items-center gap-3 mb-2 relative z-10">
            <Users className="w-5 h-5 text-[#b829dd]" />
            <span className="text-[10px] uppercase tracking-widest text-[rgba(255,255,255,0.5)]">Companies</span>
          </div>
          <div className="text-3xl font-mono text-white relative z-10">
            {graph.companies_involved}
          </div>
        </div>

        <div className="glass-card rounded-xl p-4 shadow-sm border border-[rgba(255,255,255,0.1)] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(255,255,255,0.05)] to-transparent pointer-events-none" />
          <div className="flex items-center gap-3 mb-2 relative z-10">
            <AlertTriangle className="w-5 h-5 text-[#ffcc00]" />
            <span className="text-[10px] uppercase tracking-widest text-[rgba(255,255,255,0.5)]">Risk Score</span>
          </div>
          <div className={`text-3xl font-mono relative z-10 ${
            graph.risk_score >= 10 ? 'text-[#ff3366] text-glow-red' : 
            graph.risk_score >= 5 ? 'text-[#ffcc00] text-glow-yellow' : 'text-[#00ff88] text-glow-green'
          }`}>
            {graph.risk_score}
          </div>
        </div>

        <div className="glass-card rounded-xl p-4 shadow-sm border border-[rgba(255,255,255,0.1)] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(255,255,255,0.05)] to-transparent pointer-events-none" />
          <div className="flex items-center gap-3 mb-2 relative z-10">
            {graph.flagged ? (
              <AlertTriangle className="w-5 h-5 text-[#ff3366]" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-[#00ff88]" />
            )}
            <span className="text-[10px] uppercase tracking-widest text-[rgba(255,255,255,0.5)]">Status</span>
          </div>
          <div className={`text-xl font-bold tracking-widest relative z-10 uppercase ${graph.flagged ? 'text-[#ff3366] text-glow-red' : 'text-[#00ff88] text-glow-green'}`}>
            {graph.flagged ? 'FLAGGED' : 'CLEAR'}
          </div>
        </div>
      </motion.div>

      {/* Recharts Analytics Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Radar Chart Component */}
        <div className="glass-card rounded-xl p-6 shadow-sm border border-[rgba(255,255,255,0.1)] flex flex-col items-center">
          <h3 className="font-bold text-white uppercase tracking-widest text-sm mb-4 w-full text-left">Topology Profile</h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 10, fontFamily: 'monospace' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'transparent' }} axisLine={false} />
                <Radar name="Graph Intel" dataKey="A" stroke="#00f5ff" fill="#00f5ff" fillOpacity={0.2} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(0,245,255,0.3)', borderRadius: '8px' }}
                  itemStyle={{ color: '#00f5ff', fontFamily: 'monospace' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart for communities */}
        <div className="glass-card rounded-xl p-6 shadow-sm border border-[rgba(255,255,255,0.1)] flex flex-col items-center">
          <h3 className="font-bold text-white uppercase tracking-widest text-sm mb-4 w-full text-left">Community Composition</h3>
          <div className="w-full h-64">
            {graph.communities && graph.communities.num_communities > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} className="drop-shadow-lg" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ fontFamily: 'monospace' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[rgba(255,255,255,0.3)]">
                <p className="text-xs uppercase tracking-widest">No communities data</p>
              </div>
            )}
          </div>
          
          <div className="w-full flex justify-center gap-6 mt-2">
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff3366] glow-red" />
                <span className="text-xs text-[rgba(255,255,255,0.7)] uppercase tracking-wider">Suspicious</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#00f5ff] glow-cyan" />
                <span className="text-xs text-[rgba(255,255,255,0.7)] uppercase tracking-wider">Normal</span>
             </div>
          </div>
        </div>
      </motion.div>

      {/* Fraud Rings Dynamic Visualization */}
      {graph.fraud_rings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-xl p-6 shadow-sm border border-[rgba(255,255,255,0.1)] relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,245,255,0.02)_50%)] bg-[length:100%_4px] pointer-events-none" />
          <h3 className="font-bold text-white uppercase tracking-widest text-sm mb-4 relative z-10">Detected Fraud Rings</h3>
          <canvas
            ref={canvasRef}
            className="w-full bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.05)] rounded-lg relative z-10 overflow-hidden"
            style={{ height: '300px' }}
          />
          <p className="text-[10px] uppercase font-mono tracking-widest text-[rgba(255,255,255,0.3)] mt-3 text-center relative z-10">
            Real-time orbital view of synthetic circular trades
          </p>
        </motion.div>
      )}

      {/* Fraud Rings List */}
      {graph.fraud_rings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-xl p-6 shadow-sm border border-[rgba(255,255,255,0.1)] relative overflow-hidden"
        >
          <h3 className="font-bold text-white uppercase tracking-widest text-sm mb-4">Ring Sequences</h3>
          <div className="space-y-3">
            {graph.fraud_rings.slice(0, 5).map((ring, idx) => (
              <div key={idx} className="p-4 bg-[rgba(255,51,102,0.1)] rounded-lg border border-[rgba(255,51,102,0.2)] hover:border-[rgba(255,51,102,0.5)] transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs uppercase font-bold text-[#ff3366] tracking-widest glow-text-red">Sequence {String(idx + 1).padStart(3, '0')}</span>
                  <span className="text-[10px] font-mono text-[rgba(255,255,255,0.5)] bg-[rgba(0,0,0,0.5)] px-2 py-0.5 rounded">[{ring.length} NODES]</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {ring.map((company, cidx) => (
                    <span key={cidx} className="flex items-center">
                      <span className="px-3 py-1 bg-[rgba(0,0,0,0.5)] rounded text-xs font-mono text-[rgba(255,255,255,0.8)] border border-[rgba(255,255,255,0.1)] hover:border-[#00f5ff] transition-colors cursor-default shadow-sm">
                        {company}
                      </span>
                      {cidx < ring.length - 1 && (
                        <span className="text-[#ff3366] mx-2 font-mono text-[10px]">→</span>
                      )}
                    </span>
                  ))}
                  <span className="text-[#ff3366] mx-2 font-mono text-[10px]">→</span>
                  <span className="px-3 py-1 bg-[rgba(255,51,102,0.2)] rounded text-xs font-mono text-white border border-[#ff3366] shadow-[0_0_10px_rgba(255,51,102,0.3)]">
                    {ring[0]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Communities */}
      {graph.communities && graph.communities.suspicious_community_count > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-xl p-6 shadow-sm border border-[rgba(255,255,255,0.1)]"
        >
          <h3 className="font-bold text-white uppercase tracking-widest text-sm mb-4">Community Anomalies</h3>
          <div className="p-4 bg-[rgba(255,204,0,0.1)] rounded-lg border border-[rgba(255,204,0,0.3)] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center justify-between md:flex-col md:items-start md:gap-1 flex-1">
              <span className="text-[10px] uppercase tracking-widest text-[rgba(255,255,255,0.6)]">Total Subnets</span>
              <span className="text-3xl font-mono text-[#ffcc00] text-glow-yellow">{graph.communities.num_communities}</span>
            </div>
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-[rgba(255,255,255,0.2)] to-transparent hidden md:block" />
            <div className="flex items-center justify-between md:flex-col md:items-start md:gap-1 flex-1">
              <span className="text-[10px] uppercase tracking-widest text-[rgba(255,255,255,0.6)]">Anomalous Subnets</span>
              <span className="text-3xl font-mono text-[#ff3366] text-glow-red">{graph.communities.suspicious_community_count}</span>
            </div>
            {graph.communities.isolation_score !== undefined && (
              <>
                <div className="w-px h-12 bg-gradient-to-b from-transparent via-[rgba(255,255,255,0.2)] to-transparent hidden md:block" />
                <div className="flex items-center justify-between md:flex-col md:items-start md:gap-1 flex-1">
                  <span className="text-[10px] uppercase tracking-widest text-[rgba(255,255,255,0.6)]">Isolation Q-Score</span>
                  <span className="text-3xl font-mono text-white">{graph.communities.isolation_score.toFixed(2)}</span>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}

      {!graph.flagged && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 bg-[rgba(0,255,136,0.05)] rounded-xl border border-[rgba(0,255,136,0.3)] text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,255,136,0.05)] to-transparent pointer-events-none" />
          <CheckCircle2 className="w-16 h-16 text-[#00ff88] mx-auto mb-4 glow-green" />
          <h3 className="font-bold text-[#00ff88] uppercase tracking-widest mb-2 glow-text-green">No Network Anomalies Detected</h3>
          <p className="text-[rgba(255,255,255,0.5)] text-sm max-w-lg mx-auto font-mono">
            Supply chain network topology conforms to expected parameters. No circular trading or synthetic fragmentation detected.
          </p>
        </motion.div>
      )}
    </div>
  );
}
