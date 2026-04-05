'use client';

import { motion } from 'framer-motion';
import { Decision } from '@/types';
import { getDecisionColor, formatNumber } from '@/lib/utils';
import { Shield, AlertTriangle, XCircle, CheckCircle } from 'lucide-react';

interface DecisionBannerProps {
  decision: Decision;
  riskScore: number;
  confidence: number;
  invoiceId: string;
}

export default function DecisionBanner({ decision, riskScore, confidence, invoiceId }: DecisionBannerProps) {
  const getIcon = () => {
    switch (decision) {
      case 'APPROVE':
        return <CheckCircle className="w-12 h-12" />;
      case 'HOLD':
        return <AlertTriangle className="w-12 h-12" />;
      case 'BLOCK':
        return <XCircle className="w-12 h-12" />;
    }
  };

  const getMessage = () => {
    switch (decision) {
      case 'APPROVE':
        return 'Clear for Processing';
      case 'HOLD':
        return 'Manual Review Required';
      case 'BLOCK':
        return 'Disbursement Blocked';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-8 ${getDecisionColor(decision)} shadow-2xl`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-white/20 rounded-full">
            {getIcon()}
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-1">{decision}</h1>
            <p className="text-lg opacity-90">{getMessage()}</p>
            <p className="text-sm opacity-75 mt-1">Invoice ID: {invoiceId}</p>
          </div>
        </div>
        
        <div className="flex gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold">{formatNumber(riskScore, 1)}%</div>
            <div className="text-sm opacity-80">Risk Score</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{formatNumber(confidence * 100, 0)}%</div>
            <div className="text-sm opacity-80">Confidence</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
