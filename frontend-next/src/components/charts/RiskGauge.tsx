'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface RiskGaugeProps {
  value: number; // 0-100
  size?: number;
  label?: string;
}

const RiskGauge = ({ value, size = 200, label }: RiskGaugeProps) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength - (animatedValue / 100) * arcLength;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value);
    }, 300);
    return () => clearTimeout(timer);
  }, [value]);

  const getColor = (val: number) => {
    if (val < 30) return '#00ff88';
    if (val < 70) return '#ffcc00';
    return '#ff3366';
  };

  const color = getColor(value);

  return (
    <motion.div 
      className="relative flex flex-col items-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'backOut' }}
    >
      <div className="relative" style={{ width: size, height: size * 0.75 }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: 'rotate(135deg)', transformOrigin: 'center' }}
        >
          <defs>
            <linearGradient id={`gaugeGradient-${value}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00ff88" />
              <stop offset="50%" stopColor="#ffcc00" />
              <stop offset="100%" stopColor="#ff3366" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          {/* Background arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={strokeWidth}
            strokeDasharray={arcLength}
            strokeDashoffset={0}
            strokeLinecap="round"
          />
          
          {/* Progress arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={arcLength}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            filter="url(#glow)"
            initial={{ strokeDashoffset: arcLength }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </svg>
        
        {/* Center value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ top: '15%' }}>
          <motion.span 
            className="text-4xl font-bold mono"
            style={{ color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {Math.round(animatedValue)}
          </motion.span>
          <span className="text-xs text-white/50 mt-1">RISK SCORE</span>
        </div>
      </div>
      
      {label && (
        <motion.span 
          className="text-sm font-medium text-white/70 mt-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {label}
        </motion.span>
      )}
    </motion.div>
  );
};

export default RiskGauge;
