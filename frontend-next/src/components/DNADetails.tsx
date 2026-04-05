'use client';

import { motion } from 'framer-motion';
import { DNAResult } from '@/types';
import { 
  Fingerprint, 
  Clock, 
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Building2
} from 'lucide-react';

interface DNADetailsProps {
  dna: DNAResult;
}

export default function DNADetails({ dna }: DNADetailsProps) {
  return (
    <div className="space-y-6">
      {/* Fingerprint Status */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Fingerprint className="w-5 h-5 text-primary-600" />
          </div>
          <h3 className="font-bold text-slate-800">Invoice Fingerprint</h3>
          {dna.status !== 'NEW' ? (
            <XCircle className="w-5 h-5 text-danger ml-auto" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-success ml-auto" />
          )}
        </div>
        
        <div className="bg-slate-50 rounded-lg p-4 font-mono text-sm text-slate-600 break-all">
          {dna.fingerprint}
        </div>
        
        <div className="mt-4 flex items-center gap-2">
          <span className="text-sm text-slate-500">Status:</span>
          <span className={`font-semibold ${
            dna.status === 'NEW' ? 'text-success' : 
            dna.status === 'DUPLICATE' ? 'text-danger' : 'text-warning'
          }`}>
            {dna.status}
          </span>
        </div>
        
        {dna.original_id && (
          <div className="mt-2 p-3 bg-danger-light/50 rounded-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-danger" />
            <span className="text-sm text-danger-dark">
              Duplicate of: {dna.original_id}
            </span>
          </div>
        )}
        
        {dna.similar_ids && dna.similar_ids.length > 0 && (
          <div className="mt-2 p-3 bg-warning-light/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <span className="text-sm text-warning-dark font-medium">Similar invoices found:</span>
            </div>
            <ul className="text-sm text-slate-600 ml-7 space-y-1">
              {dna.similar_ids.map((id, idx) => (
                <li key={idx}>{id}</li>
              ))}
            </ul>
          </div>
        )}
      </motion.div>

      {/* Behavioral Analysis */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Clock className="w-5 h-5 text-primary-600" />
          </div>
          <h3 className="font-bold text-slate-800">Submission Behavior</h3>
          {dna.behavioral.flagged ? (
            <XCircle className="w-5 h-5 text-danger ml-auto" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-success ml-auto" />
          )}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="text-xs text-slate-500">Last Hour</div>
            <div className={`font-semibold text-2xl ${
              dna.behavioral.submissions_last_hour > 10 ? 'text-danger' : 'text-slate-800'
            }`}>
              {dna.behavioral.submissions_last_hour}
            </div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="text-xs text-slate-500">Anomaly Score</div>
            <div className={`font-semibold text-2xl ${
              dna.behavioral.anomaly_score > 0.5 ? 'text-danger' : 'text-slate-800'
            }`}>
              {(dna.behavioral.anomaly_score * 100).toFixed(0)}%
            </div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="text-xs text-slate-500">Status</div>
            <div className={`font-semibold ${
              dna.behavioral.flagged ? 'text-danger' : 'text-success'
            }`}>
              {dna.behavioral.flagged ? 'SUSPICIOUS' : 'NORMAL'}
            </div>
          </div>
        </div>
      </motion.div>

      {/* PSI Cross-Lender */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Building2 className="w-5 h-5 text-primary-600" />
          </div>
          <h3 className="font-bold text-slate-800">Cross-Lender Detection (PSI)</h3>
          {dna.psi.flagged ? (
            <XCircle className="w-5 h-5 text-danger ml-auto" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-success ml-auto" />
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="text-xs text-slate-500">Lenders Affected</div>
            <div className={`font-semibold text-2xl ${
              dna.psi.count > 1 ? 'text-danger' : 'text-slate-800'
            }`}>
              {dna.psi.count}
            </div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="text-xs text-slate-500">Status</div>
            <div className={`font-semibold ${
              dna.psi.flagged ? 'text-danger' : 'text-success'
            }`}>
              {dna.psi.status}
            </div>
          </div>
        </div>
        
        {dna.psi.lenders_affected.length > 0 && (
          <div className="mb-4">
            <div className="text-sm text-slate-500 mb-2">Lenders:</div>
            <div className="flex flex-wrap gap-2">
              {dna.psi.lenders_affected.map((lender, idx) => (
                <span key={idx} className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm">
                  {lender}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {dna.psi.flagged && (
          <div className="p-3 bg-danger-light/50 rounded-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-danger" />
            <span className="text-sm text-danger-dark font-medium">{dna.psi.verdict}</span>
          </div>
        )}
        
        <div className="mt-3 p-3 bg-slate-50 rounded-lg flex items-center gap-2">
          <Shield className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-500">{dna.psi.privacy_note}</span>
        </div>
      </motion.div>
    </div>
  );
}
