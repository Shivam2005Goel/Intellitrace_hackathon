'use client';

import { motion } from 'framer-motion';
import { PhysicsResult } from '@/types';
import { formatNumber, getSeverityColor } from '@/lib/utils';
import { 
  Truck, 
  Factory, 
  Calendar, 
  AlertTriangle,
  CheckCircle2,
  XCircle
} from 'lucide-react';

interface PhysicsDetailsProps {
  physics: PhysicsResult;
}

export default function PhysicsDetails({ physics }: PhysicsDetailsProps) {
  const { routing, capacity, causality } = physics;

  return (
    <div className="space-y-6">
      {/* Routing Section */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Truck className="w-5 h-5 text-primary-600" />
          </div>
          <h3 className="font-bold text-slate-800">Delivery Feasibility</h3>
          {routing.flagged ? (
            <XCircle className="w-5 h-5 text-danger ml-auto" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-success ml-auto" />
          )}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="text-xs text-slate-500">Route</div>
            <div className="font-semibold text-slate-800">
              {routing.origin} → {routing.destination}
            </div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="text-xs text-slate-500">Distance</div>
            <div className="font-semibold text-slate-800">{formatNumber(routing.distance_km, 0)} km</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="text-xs text-slate-500">Claimed Time</div>
            <div className="font-semibold text-slate-800">{routing.claimed_days} days</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="text-xs text-slate-500">Minimum Required</div>
            <div className={`font-semibold ${getSeverityColor(routing.severity)}`}>
              {routing.total_minimum_days} days
            </div>
          </div>
        </div>
        
        {routing.flagged && (
          <div className="mt-4 p-3 bg-danger-light/50 rounded-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-danger" />
            <span className="text-sm text-danger-dark font-medium">{routing.verdict}</span>
          </div>
        )}
      </motion.div>

      {/* Capacity Section */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Factory className="w-5 h-5 text-primary-600" />
          </div>
          <h3 className="font-bold text-slate-800">Supplier Capacity</h3>
          {capacity.flagged ? (
            <XCircle className="w-5 h-5 text-danger ml-auto" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-success ml-auto" />
          )}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="text-xs text-slate-500">Supplier ID</div>
            <div className="font-semibold text-slate-800">{capacity.supplier_id}</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="text-xs text-slate-500">Monthly Capacity</div>
            <div className="font-semibold text-slate-800">
              {formatNumber(capacity.max_monthly_capacity, 0)} tons
            </div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="text-xs text-slate-500">Claimed</div>
            <div className={`font-semibold ${capacity.flagged ? 'text-danger' : 'text-slate-800'}`}>
              {formatNumber(capacity.claimed_quantity, 0)} tons
            </div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="text-xs text-slate-500">Excess</div>
            <div className={`font-semibold ${getSeverityColor(capacity.severity)}`}>
              {formatNumber(capacity.excess_percentage, 1)}%
            </div>
          </div>
        </div>
        
        {capacity.flagged && (
          <div className="mt-4 p-3 bg-danger-light/50 rounded-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-danger" />
            <span className="text-sm text-danger-dark font-medium">{capacity.verdict}</span>
          </div>
        )}
      </motion.div>

      {/* Causality Section */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Calendar className="w-5 h-5 text-primary-600" />
          </div>
          <h3 className="font-bold text-slate-800">Timeline Validation</h3>
          {causality.flagged ? (
            <XCircle className="w-5 h-5 text-danger ml-auto" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-success ml-auto" />
          )}
        </div>
        
        {causality.timeline && causality.timeline.length > 0 && (
          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
            {causality.timeline.map((event, idx) => (
              <div key={idx} className="flex items-center gap-2 flex-shrink-0">
                <div className="bg-primary-50 px-3 py-2 rounded-lg text-center">
                  <div className="text-xs text-slate-500">{event.event}</div>
                  <div className="text-sm font-semibold text-slate-800">{event.date}</div>
                </div>
                {idx < causality.timeline.length - 1 && (
                  <div className="text-slate-400">→</div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {causality.violations.length > 0 && (
          <div className="space-y-2">
            {causality.violations.map((violation, idx) => (
              <div key={idx} className="p-3 bg-danger-light/50 rounded-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-danger flex-shrink-0" />
                <span className="text-sm text-danger-dark">{violation}</span>
              </div>
            ))}
          </div>
        )}
        
        {causality.warnings && causality.warnings.length > 0 && (
          <div className="mt-3 space-y-2">
            {causality.warnings.map((warning, idx) => (
              <div key={idx} className="p-3 bg-warning-light/50 rounded-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
                <span className="text-sm text-warning-dark">{warning}</span>
              </div>
            ))}
          </div>
        )}
        
        {!causality.flagged && (
          <div className="p-3 bg-success-light/50 rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-success" />
            <span className="text-sm text-success-dark font-medium">{causality.verdict}</span>
          </div>
        )}
      </motion.div>
    </div>
  );
}
