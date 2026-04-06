'use client';

import { motion } from 'framer-motion';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  PieChart, Pie, Cell, Tooltip as RechartsTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend
} from 'recharts';
import { PieChart as PieIcon, BarChart3, Target } from 'lucide-react';

const radarData = [
  { subject: 'Velocity Risk', A: 95, fullMark: 100 },
  { subject: 'Entity Forgery', A: 85, fullMark: 100 },
  { subject: 'Topology Drift', A: 60, fullMark: 100 },
  { subject: 'Duplicate Hashes', A: 90, fullMark: 100 },
  { subject: 'Volume Spike', A: 75, fullMark: 100 },
];

const pieData = [
  { name: 'Tier 1 Assembly', value: 400 },
  { name: 'Tier 2 Material', value: 300 },
  { name: 'Tier 3 Raw Ore', value: 300 },
  { name: 'Unknown Subs', value: 200 },
];
const COLORS = ['#00f5ff', '#00ff88', '#ffcc00', '#ff3366'];

const barData = [
  { name: 'Jan', 'T1 Draw': 4000, 'T2 Draw': 2400 },
  { name: 'Feb', 'T1 Draw': 3000, 'T2 Draw': 1398 },
  { name: 'Mar', 'T1 Draw': 2000, 'T2 Draw': 9800 },
  { name: 'Apr', 'T1 Draw': 2780, 'T2 Draw': 3908 },
  { name: 'May', 'T1 Draw': 1890, 'T2 Draw': 4800 },
  { name: 'Jun', 'T1 Draw': 2390, 'T2 Draw': 3800 },
];

export default function MetricsOverview() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full mt-6 mb-6">
      
      {/* Spiderweb / Radar Chart */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        className="glass-card p-6 border border-[#ff3366]/20 bg-gradient-to-br from-[#ff3366]/5 to-transparent"
      >
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
          <Target className="w-5 h-5 text-[#ff3366]" />
          Phantom Threat Matrix
        </h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="Threat Level" dataKey="A" stroke="#ff3366" fill="#ff3366" fillOpacity={0.4} />
              <RechartsTooltip contentStyle={{ backgroundColor: '#12121a', borderColor: '#ff3366', color: '#fff' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Pie Chart */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 border border-[#00f5ff]/20 bg-gradient-to-br from-[#00f5ff]/5 to-transparent"
      >
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
          <PieIcon className="w-5 h-5 text-[#00f5ff]" />
          Entity Tier Distribution
        </h3>
        <div className="h-[250px] w-full">
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
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip contentStyle={{ backgroundColor: '#12121a', borderColor: '#00f5ff', color: '#fff' }} />
              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Bar Chart */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6 border border-[#00ff88]/20 bg-gradient-to-br from-[#00ff88]/5 to-transparent lg:col-span-1"
      >
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
          <BarChart3 className="w-5 h-5 text-[#00ff88]" />
          Historical Drawdown Vol
        </h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
              <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
              <RechartsTooltip cursor={{fill: 'rgba(255,255,255,0.02)'}} contentStyle={{ backgroundColor: '#12121a', borderColor: '#00ff88', color: '#fff' }} />
              <Bar dataKey="T1 Draw" stackId="a" fill="#00f5ff" radius={[0, 0, 4, 4]} />
              <Bar dataKey="T2 Draw" stackId="a" fill="#00ff88" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

    </div>
  );
}
