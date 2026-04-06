'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  trend?: number;
  trendLabel?: string;
  icon: React.ReactNode;
  color: string;
  delay?: number;
  isPercentage?: boolean;
}

const StatCard = ({ 
  title, 
  value, 
  prefix = '', 
  suffix = '', 
  trend, 
  trendLabel,
  icon, 
  color,
  delay = 0,
  isPercentage = false
}: StatCardProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  const formatValue = (val: number) => {
    if (isPercentage) return `${val.toFixed(1)}%`;
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
    return Math.round(val).toString();
  };

  const getTrendIcon = () => {
    if (!trend) return <Minus className="w-4 h-4" />;
    if (trend > 0) return <TrendingUp className="w-4 h-4" />;
    return <TrendingDown className="w-4 h-4" />;
  };

  const getTrendColor = () => {
    if (!trend) return 'text-gray-400';
    if (trend > 0) return 'text-green-400';
    return 'text-red-400';
  };

  return (
    <motion.div
      className="glass-card glass-card-hover p-6 relative overflow-hidden cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Background glow */}
      <motion.div
        className="absolute inset-0 opacity-0"
        animate={{ opacity: isHovered ? 0.1 : 0 }}
        style={{ background: `radial-gradient(circle at 50% 50%, ${color}, transparent 70%)` }}
      />
      
      {/* Animated border */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{ 
          border: `1px solid ${color}`,
          opacity: isHovered ? 0.5 : 0,
        }}
        animate={{ opacity: isHovered ? 0.5 : 0 }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div 
            className="p-3 rounded-xl"
            style={{ background: `${color}20`, color }}
          >
            {icon}
          </div>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 text-sm ${getTrendColor()}`}>
              {getTrendIcon()}
              <span>{Math.abs(trend)}%</span>
              {trendLabel && <span className="text-white/40 ml-1">{trendLabel}</span>}
            </div>
          )}
        </div>

        {/* Value */}
        <div className="mb-1">
          <span className="text-3xl font-bold mono text-white">
            {prefix}{formatValue(displayValue)}{suffix}
          </span>
        </div>

        {/* Title */}
        <p className="text-sm text-white/60 font-medium">{title}</p>
      </div>

      {/* Decorative elements */}
      <div 
        className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-20 blur-2xl"
        style={{ background: color }}
      />
    </motion.div>
  );
};

export default StatCard;
