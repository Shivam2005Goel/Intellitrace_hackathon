'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Fingerprint, 
  Globe, 
  Network, 
  Brain, 
  ShieldCheck,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

interface LayerCardProps {
  name: string;
  title: string;
  description: string;
  isFlagged: boolean;
  score: number;
  delay?: number;
}

const icons: Record<string, React.ReactNode> = {
  'DNA': <Fingerprint className="w-6 h-6" />,
  'PHYSICS': <Globe className="w-6 h-6" />,
  'GRAPH': <Network className="w-6 h-6" />,
  'LLM': <Brain className="w-6 h-6" />,
  'PSI': <ShieldCheck className="w-6 h-6" />,
};

export default function LayerCard({ name, title, description, isFlagged, score, delay = 0 }: LayerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className={cn(
        'rounded-xl p-5 border-2 transition-all duration-300',
        isFlagged 
          ? 'bg-danger-light/30 border-danger hover:bg-danger-light/50' 
          : 'bg-success-light/30 border-success hover:bg-success-light/50'
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={cn(
          'p-3 rounded-lg',
          isFlagged ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'
        )}>
          {icons[name] || <ShieldCheck className="w-6 h-6" />}
        </div>
        <div className="flex items-center gap-2">
          {isFlagged ? (
            <AlertCircle className="w-5 h-5 text-danger" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-success" />
          )}
          <span className={cn(
            'text-sm font-semibold',
            isFlagged ? 'text-danger' : 'text-success'
          )}>
            {isFlagged ? 'FLAGGED' : 'CLEAR'}
          </span>
        </div>
      </div>
      
      <h3 className="font-bold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-600 mb-3">{description}</p>
      
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500">Risk Score</span>
        <span className={cn(
          'text-sm font-bold',
          score >= 7 ? 'text-danger' : score >= 4 ? 'text-warning' : 'text-success'
        )}>
          {score}/10
        </span>
      </div>
      
      <div className="mt-2 h-2 bg-slate-200 rounded-full overflow-hidden">
        <div 
          className={cn(
            'h-full rounded-full transition-all duration-500',
            score >= 7 ? 'bg-danger' : score >= 4 ? 'bg-warning' : 'bg-success'
          )}
          style={{ width: `${(score / 10) * 100}%` }}
        />
      </div>
    </motion.div>
  );
}
