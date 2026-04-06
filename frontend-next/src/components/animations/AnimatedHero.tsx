'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { GlitchText, NeonButton } from './UIElements';
import { TypingEffect } from './UltimateAnimationLayer';
import { Shield, Zap, Brain, Network, Lock, ChevronDown, Play, Sparkles } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Simple counter animation using requestAnimationFrame
const useAnimatedCounter = (value: number, duration: number = 2000) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(easeOut * value));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);
  
  return displayValue;
};

// ============================================
// 3D CARD TILT EFFECT
// ============================================
const TiltCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  
  const rotateX = useTransform(y, [0, 1], [10, -10]);
  const rotateY = useTransform(x, [0, 1], [-10, 10]);
  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
};

// ============================================
// COUNTER ANIMATION
// ============================================
const AnimatedCounter = ({ value, suffix = '', prefix = '' }: { value: number; suffix?: string; prefix?: string }) => {
  const displayValue = useAnimatedCounter(value);

  return (
    <span className="font-mono font-bold">
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
};

// ============================================
// LAYER ICON WITH ANIMATION
// ============================================
const LayerIcon = ({ icon: Icon, color, delay }: { icon: any; color: string; delay: number }) => {
  return (
    <motion.div
      className="relative"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ 
        type: 'spring',
        stiffness: 260,
        damping: 20,
        delay: delay 
      }}
    >
      <motion.div
        className="w-16 h-16 rounded-2xl flex items-center justify-center relative"
        style={{ 
          background: `linear-gradient(135deg, ${color}20, ${color}05)`,
          border: `1px solid ${color}40`,
        }}
        whileHover={{ 
          scale: 1.2,
          rotate: [0, -10, 10, 0],
          boxShadow: `0 0 30px ${color}50`,
        }}
        transition={{ duration: 0.3 }}
      >
        <Icon className="w-8 h-8" style={{ color }} />
        
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{ background: color }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: delay * 2 }}
        />
      </motion.div>
      
      {/* Orbiting dots */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            background: color,
            originX: '50%',
            originY: '50%',
            x: 32,
            y: 32,
          }}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.3,
            ease: 'linear',
          }}
        />
      ))}
    </motion.div>
  );
};

// ============================================
// MAIN HERO COMPONENT
// ============================================
const AnimatedHero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -100]);

  const layers = [
    { icon: Shield, color: '#00f5ff', name: 'DNA' },
    { icon: Zap, color: '#b829dd', name: 'Physics' },
    { icon: Network, color: '#ff0080', name: 'Graph' },
    { icon: Brain, color: '#ff6b35', name: 'AI' },
    { icon: Lock, color: '#00ff88', name: 'PSI' },
  ];

  return (
    <motion.section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ opacity, scale, y }}
    >
      {/* Background gradient orb */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0,245,255,0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
            style={{
              background: 'linear-gradient(135deg, rgba(0,245,255,0.1), rgba(184,41,221,0.1))',
              border: '1px solid rgba(0,245,255,0.2)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Sparkles className="w-4 h-4 text-[#00f5ff]" />
            <span className="text-sm text-white/80">Next-Gen Fraud Detection</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <GlitchText className="gradient-text">
              IntelliTrace
            </GlitchText>
          </motion.h1>

          {/* Typing Effect Subtitle */}
          <motion.div
            className="text-xl md:text-2xl text-white/70 mb-8 h-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <TypingEffect />
          </motion.div>

          {/* Description */}
          <motion.p
            className="text-lg text-white/50 max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            Five-layer AI-powered fraud detection with physics validation, 
            network graph analysis, and real-time risk scoring.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-wrap justify-center gap-4 mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <NeonButton className="text-lg">
              <Play className="w-5 h-5 mr-2 inline" />
              Start Analysis
            </NeonButton>
            <motion.button
              className="px-8 py-4 font-bold text-white rounded-lg border border-white/20 hover:border-[#00f5ff]/50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Demo
            </motion.button>
          </motion.div>

          {/* Layer Icons */}
          <motion.div
            className="flex justify-center items-center gap-8 mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {layers.map((layer, i) => (
              <div key={layer.name} className="flex flex-col items-center gap-2">
                <LayerIcon icon={layer.icon} color={layer.color} delay={1.2 + i * 0.1} />
                <motion.span
                  className="text-xs text-white/50 uppercase tracking-wider"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 + i * 0.1 }}
                >
                  {layer.name}
                </motion.span>
              </div>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
          >
            {[
              { value: 99.9, suffix: '%', label: 'Accuracy' },
              { value: 50, suffix: 'ms', label: 'Latency' },
              { value: 5, suffix: '', label: 'AI Layers' },
              { value: 24, suffix: '/7', label: 'Monitoring' },
            ].map((stat, i) => (
              <TiltCard key={stat.label} className="glass-card p-6">
                <div className="text-3xl md:text-4xl font-bold gradient-text-cyber mb-2">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-white/50">{stat.label}</div>
              </TiltCard>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <motion.div
          className="flex flex-col items-center gap-2 cursor-pointer"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <span className="text-xs text-white/40 uppercase tracking-widest">Scroll</span>
          <ChevronDown className="w-5 h-5 text-white/40" />
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default AnimatedHero;
