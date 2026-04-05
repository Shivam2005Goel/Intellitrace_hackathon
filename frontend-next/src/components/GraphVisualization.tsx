'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { GraphResult } from '@/types';
import { Network, AlertTriangle, CheckCircle2, Users } from 'lucide-react';

interface GraphVisualizationProps {
  graph: GraphResult;
}

export default function GraphVisualization({ graph }: GraphVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simple canvas visualization for fraud rings
  useEffect(() => {
    if (!canvasRef.current || graph.fraud_rings.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = 300;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw fraud rings
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 100;

    graph.fraud_rings.slice(0, 3).forEach((ring, ringIndex) => {
      const ringOffset = ringIndex * 30;
      
      // Draw cycle
      ring.forEach((node, i) => {
        const angle = (i / ring.length) * Math.PI * 2 - Math.PI / 2;
        const x = centerX + Math.cos(angle) * (radius - ringOffset);
        const y = centerY + Math.sin(angle) * (radius - ringOffset);

        // Draw node
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fillStyle = '#fee2e2';
        ctx.fill();
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw label
        ctx.fillStyle = '#7f1d1d';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.slice(0, 8), x, y);

        // Draw connection to next node
        const nextAngle = ((i + 1) / ring.length) * Math.PI * 2 - Math.PI / 2;
        const nextX = centerX + Math.cos(nextAngle) * (radius - ringOffset);
        const nextY = centerY + Math.sin(nextAngle) * (radius - ringOffset);

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(nextX, nextY);
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    });
  }, [graph.fraud_rings]);

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <Network className="w-5 h-5 text-primary-600" />
            <span className="text-sm text-slate-500">Cycles Found</span>
          </div>
          <div className={`text-3xl font-bold ${graph.cycles_found > 0 ? 'text-danger' : 'text-success'}`}>
            {graph.cycles_found}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-primary-600" />
            <span className="text-sm text-slate-500">Companies</span>
          </div>
          <div className="text-3xl font-bold text-slate-800">
            {graph.companies_involved}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-primary-600" />
            <span className="text-sm text-slate-500">Risk Score</span>
          </div>
          <div className={`text-3xl font-bold ${
            graph.risk_score >= 10 ? 'text-danger' : 
            graph.risk_score >= 5 ? 'text-warning' : 'text-success'
          }`}>
            {graph.risk_score}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            {graph.flagged ? (
              <AlertTriangle className="w-5 h-5 text-danger" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-success" />
            )}
            <span className="text-sm text-slate-500">Status</span>
          </div>
          <div className={`text-lg font-bold ${graph.flagged ? 'text-danger' : 'text-success'}`}>
            {graph.flagged ? 'FLAGGED' : 'CLEAR'}
          </div>
        </div>
      </motion.div>

      {/* Fraud Rings Visualization */}
      {graph.fraud_rings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
        >
          <h3 className="font-bold text-slate-800 mb-4">Detected Fraud Rings</h3>
          <canvas
            ref={canvasRef}
            className="w-full bg-slate-50 rounded-lg"
            style={{ height: '300px' }}
          />
          <p className="text-sm text-slate-500 mt-2 text-center">
            Visual representation of circular trading patterns
          </p>
        </motion.div>
      )}

      {/* Fraud Rings List */}
      {graph.fraud_rings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
        >
          <h3 className="font-bold text-slate-800 mb-4">Ring Details</h3>
          <div className="space-y-3">
            {graph.fraud_rings.slice(0, 5).map((ring, idx) => (
              <div key={idx} className="p-4 bg-danger-light/30 rounded-lg border border-danger/20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-semibold text-danger">Ring #{idx + 1}</span>
                  <span className="text-xs text-slate-500">({ring.length} companies)</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {ring.map((company, cidx) => (
                    <span key={cidx} className="flex items-center">
                      <span className="px-3 py-1 bg-white rounded-full text-sm text-slate-700 border border-slate-200">
                        {company}
                      </span>
                      {cidx < ring.length - 1 && (
                        <span className="text-slate-400 mx-1">→</span>
                      )}
                    </span>
                  ))}
                  <span className="text-slate-400 mx-1">→</span>
                  <span className="px-3 py-1 bg-white rounded-full text-sm text-slate-700 border border-slate-200">
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
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
        >
          <h3 className="font-bold text-slate-800 mb-4">Suspicious Communities</h3>
          <div className="p-4 bg-warning-light/30 rounded-lg border border-warning/20">
            <div className="flex items-center justify-between">
              <span className="text-slate-700">Detected Communities</span>
              <span className="text-2xl font-bold text-warning">{graph.communities.num_communities}</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-slate-700">Suspicious</span>
              <span className="text-2xl font-bold text-danger">{graph.communities.suspicious_community_count}</span>
            </div>
          </div>
        </motion.div>
      )}

      {!graph.flagged && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-success-light/30 rounded-xl border border-success/20 text-center"
        >
          <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-3" />
          <h3 className="font-bold text-success-dark text-lg">No Fraud Rings Detected</h3>
          <p className="text-slate-600 mt-2">Supply chain network analysis shows no circular trading patterns.</p>
        </motion.div>
      )}
    </div>
  );
}
