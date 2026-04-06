'use client';

import { motion } from 'framer-motion';

// ============================================
// GLITCH TEXT EFFECT
// ============================================
export const GlitchText = ({ children, className = '' }: { children: string; className?: string }) => {
  return (
    <motion.span
      className={`relative inline-block ${className}`}
      whileHover="glitch"
      initial="normal"
      variants={{
        normal: { x: 0 },
        glitch: {
          x: [0, -2, 2, -2, 0],
          transition: {
            duration: 0.3,
            repeat: 2,
          }
        }
      }}
    >
      <span className="relative z-10">{children}</span>
      <motion.span
        className="absolute inset-0 text-[#ff0080] opacity-0"
        variants={{
          normal: { opacity: 0, x: 0 },
          glitch: { 
            opacity: [0, 0.8, 0, 0.8, 0],
            x: [0, 2, -2, 2, 0],
            transition: { duration: 0.3, repeat: 2 }
          }
        }}
        aria-hidden
      >
        {children}
      </motion.span>
      <motion.span
        className="absolute inset-0 text-[#00f5ff] opacity-0"
        variants={{
          normal: { opacity: 0, x: 0 },
          glitch: { 
            opacity: [0, 0.8, 0, 0.8, 0],
            x: [0, -2, 2, -2, 0],
            transition: { duration: 0.3, repeat: 2, delay: 0.05 }
          }
        }}
        aria-hidden
      >
        {children}
      </motion.span>
    </motion.span>
  );
};

// ============================================
// NEON BUTTON
// ============================================
export const NeonButton = ({ children, onClick, className = '' }: { 
  children: React.ReactNode; 
  onClick?: () => void;
  className?: string;
}) => {
  return (
    <motion.button
      className={`relative px-8 py-4 font-bold text-white overflow-hidden rounded-lg ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(0,245,255,0.1), rgba(184,41,221,0.1))',
        border: '1px solid rgba(0,245,255,0.3)',
        boxShadow: '0 0 20px rgba(0,245,255,0.2), inset 0 0 20px rgba(0,245,255,0.05)',
      }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: '0 0 40px rgba(0,245,255,0.4), inset 0 0 30px rgba(0,245,255,0.1)',
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      onClick={onClick}
    >
      <motion.span
        className="absolute inset-0 bg-gradient-to-r from-[#00f5ff] to-[#b829dd] opacity-0"
        whileHover={{ opacity: 0.2 }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};
