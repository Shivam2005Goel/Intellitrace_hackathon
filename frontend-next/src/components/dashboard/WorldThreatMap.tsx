'use client';
import { motion } from 'framer-motion';

export const WorldThreatMap = () => {
  const radarPulses = [
    { top: '30%', left: '20%', delay: 0, color: '#ff0080' }, // Americas
    { top: '40%', left: '50%', delay: 1, color: '#00f5ff' }, // Europe
    { top: '45%', left: '75%', delay: 2, color: '#ff6b35' }, // Asia
    { top: '60%', left: '55%', delay: 1.5, color: '#b829dd' }, // Africa
  ];

  return (
    <div className="relative w-full h-[400px] bg-black/40 border border-white/10 rounded-2xl overflow-hidden glass-card">
      <div className="absolute top-4 left-4 z-10 flex items-center gap-3">
        <div className="flex h-3 w-3 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </div>
        <span className="text-sm font-semibold tracking-widest text-white/80">GLOBAL THREAT VECTOR</span>
      </div>

      {/* SVG Map representing global distribution */}
      <div className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 500'%3E%3Cpath fill='%23ffffff' d='M230,120 Q240,110 250,115 T260,130 C270,140 250,150 240,160 Z M480,180 Q500,160 520,170 T540,200 C560,220 500,240 480,210 Z M700,150 C750,130 800,160 810,200 Q820,240 780,260 T700,280 C650,280 680,200 700,150 Z'/%3E%3C/svg%3E")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      {/* Animated Pulses */}
      {radarPulses.map((pulse, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4 rounded-full -ml-2 -mt-2"
          style={{
            top: pulse.top,
            left: pulse.left,
            background: pulse.color,
            boxShadow: `0 0 20px ${pulse.color}`
          }}
          animate={{ scale: [1, 3, 1], opacity: [1, 0, 1] }}
          transition={{ duration: 3, repeat: Infinity, delay: pulse.delay }}
        >
          <motion.div 
            className="absolute inset-0 rounded-full border border-current opacity-50"
            animate={{ scale: [1, 5], opacity: [0.8, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: pulse.delay }}
          />
        </motion.div>
      ))}
      
      {/* Laser Connections */}
      <motion.svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        <motion.path
          d="M 20 30 Q 35 25 50 40 T 75 45"
          fill="transparent"
          stroke="url(#gradientPulse)"
          strokeWidth="0.5"
          strokeDasharray="5"
          initial={{ strokeDashoffset: 100 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        />
        <defs>
          <linearGradient id="gradientPulse" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff0080" stopOpacity="0" />
            <stop offset="50%" stopColor="#00f5ff" stopOpacity="1" />
            <stop offset="100%" stopColor="#ff6b35" stopOpacity="0" />
          </linearGradient>
        </defs>
      </motion.svg>
    </div>
  );
};
