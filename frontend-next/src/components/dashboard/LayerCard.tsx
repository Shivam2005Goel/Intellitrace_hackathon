'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Shield, Zap, Network, Brain, Lock } from 'lucide-react';

interface LayerCardProps {
  layer: {
    id: string;
    name: string;
    description: string;
    score: number;
    status: 'passed' | 'warning' | 'flagged';
    details: Record<string, any>;
    color: string;
    icon: string;
  };
  delay?: number;
}

const iconMap: Record<string, React.ReactNode> = {
  dna: <Shield className="w-6 h-6" />,
  physics: <Zap className="w-6 h-6" />,
  graph: <Network className="w-6 h-6" />,
  llm: <Brain className="w-6 h-6" />,
  psi: <Lock className="w-6 h-6" />,
};

const LayerCard = ({ layer, delay = 0 }: LayerCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return '#00ff88';
      case 'warning': return '#ffcc00';
      case 'flagged': return '#ff3366';
      default: return '#00f5ff';
    }
  };

  const statusColor = getStatusColor(layer.status);

  return (
    <motion.div
      className="glass-card overflow-hidden"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    >
      {/* Header */}
      <motion.div
        className="p-5 cursor-pointer flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
      >
        <div className="flex items-center gap-4">
          <motion.div
            className="p-3 rounded-xl"
            style={{ background: `${layer.color}20`, color: layer.color }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            {iconMap[layer.icon] || iconMap.dna}
          </motion.div>
          
          <div>
            <h3 className="font-semibold text-white text-lg">{layer.name}</h3>
            <p className="text-sm text-white/50">{layer.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Score */}
          <div className="text-right">
            <div className="text-2xl font-bold mono" style={{ color: layer.color }}>
              {layer.score}/10
            </div>
            <div className="text-xs text-white/40 uppercase tracking-wider">Risk Score</div>
          </div>

          {/* Status indicator */}
          <motion.div
            className="w-3 h-3 rounded-full"
            style={{ background: statusColor, boxShadow: `0 0 10px ${statusColor}` }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Expand icon */}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-5 h-5 text-white/50" />
          </motion.div>
        </div>
      </motion.div>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="border-t border-white/10"
          >
            <div className="p-5 grid grid-cols-2 gap-4">
              {Object.entries(layer.details).map(([key, value], index) => (
                <motion.div
                  key={key}
                  className="glass-card p-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="text-xs text-white/40 uppercase tracking-wider mb-1">
                    {key.replace(/_/g, ' ')}
                  </div>
                  <div className="text-sm text-white font-medium">
                    {typeof value === 'boolean' ? (
                      <span className={value ? 'text-green-400' : 'text-red-400'}>
                        {value ? '✓ Yes' : '✗ No'}
                      </span>
                    ) : (
                      value
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LayerCard;
