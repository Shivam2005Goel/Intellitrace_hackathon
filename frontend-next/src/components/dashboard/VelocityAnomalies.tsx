'use client';

import { motion } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, ReferenceLine
} from 'recharts';
import { TrendingUp, AlertTriangle } from 'lucide-react';

const mockVelocityData = [
  { day: 'Day 1', expected: 1200000, requested: 1250000 },
  { day: 'Day 2', expected: 1500000, requested: 1480000 },
  { day: 'Day 3', expected: 1100000, requested: 1150000 },
  { day: 'Day 4', expected: 1300000, requested: 3200000 }, // Anomaly
  { day: 'Day 5', expected: 1200000, requested: 4500000 }, // Anomaly
  { day: 'Day 6', expected: 1400000, requested: 4800000 }, // Anomaly
  { day: 'Day 7', expected: 1600000, requested: 6200000 }, // Anomaly
];

export default function VelocityAnomalies() {
  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#ffcc00]/20 rounded-lg">
            <TrendingUp className="w-5 h-5 text-[#ffcc00]" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Velocity & Sequencing Anomalies</h3>
            <p className="text-sm text-white/50">Tracking abnormal cash requests vs expected drawdowns</p>
          </div>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockVelocityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorExpected" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00f5ff" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#00f5ff" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorRequested" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff3366" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ff3366" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="day" stroke="#ffffff40" tick={{fill: '#ffffff80', fontSize: 12}} />
            <YAxis stroke="#ffffff40" tick={{fill: '#ffffff80', fontSize: 12}} tickFormatter={(val) => `$${val/1000000}M`} />
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(10, 10, 15, 0.9)', border: '1px solid #ffffff20', borderRadius: '8px' }}
              itemStyle={{ fontFamily: 'monospace' }}
              formatter={(val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val)}
            />
            <Legend />
            <Area type="monotone" dataKey="expected" name="Expected Historic Velocity" stroke="#00f5ff" fillOpacity={1} fill="url(#colorExpected)" />
            <Area type="monotone" dataKey="requested" name="Current Requested SCF Velocity" stroke="#ff3366" fillOpacity={1} fill="url(#colorRequested)" strokeWidth={3}/>
            <ReferenceLine x="Day 4" stroke="#ffcc00" strokeDasharray="3 3" label={{ position: 'top', value: 'Velocity Spike Triggered', fill: '#ffcc00', fontSize: 12 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <motion.div 
        className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <AlertTriangle className="w-6 h-6 text-[#ffcc00] flex-shrink-0" />
        <div>
          <h4 className="font-bold text-[#ffcc00]">Velocity Anomaly Detected</h4>
          <p className="text-sm text-white/70 mt-1">Expected SCF cash requirement for Tier 1 shifted from historical average of $1.3M/day to $6.2M/day within a 72-hour window. This acceleration correlates with 340 micro-invoices submitted concurrently.</p>
        </div>
      </motion.div>
    </div>
  );
}
