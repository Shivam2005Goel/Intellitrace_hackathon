'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import anime from 'animejs';
import ScrollReveal from 'scrollreveal';
import Typed from 'typed.js';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ============================================
// PARTICLE SYSTEM with Three.js
// ============================================
const ParticleField = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 800;
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 100;
      posArray[i + 1] = (Math.random() - 0.5) * 100;
      posArray[i + 2] = (Math.random() - 0.5) * 50;

      const colorChoice = Math.random();
      if (colorChoice < 0.33) {
        colorArray[i] = 0; colorArray[i + 1] = 0.96; colorArray[i + 2] = 1;
      } else if (colorChoice < 0.66) {
        colorArray[i] = 0.72; colorArray[i + 1] = 0.16; colorArray[i + 2] = 0.87;
      } else {
        colorArray[i] = 1; colorArray[i + 1] = 0; colorArray[i + 2] = 0.5;
      }
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    let hoverY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      hoverY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let time = 0;
    let frameId: number;
    const animate = () => {
      time += 0.001;
      particles.rotation.y = time * 0.1;
      particles.rotation.x = hoverY * 0.2;
      const positions = particlesGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        positions[i3 + 1] += Math.sin(time * 2 + positions[i3] * 0.1) * 0.02;
      }
      particlesGeometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
    };
  }, []);

  return (
    <div ref={mountRef} className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 0%, #0a0a0f 70%)' }} />
  );
};

// ============================================
// TYPING EFFECT
// ============================================
export const TypingEffect = () => {
  const elRef = useRef<HTMLSpanElement>(null);
  const typedRef = useRef<Typed | null>(null);

  useEffect(() => {
    if (!elRef.current) return;
    typedRef.current = new Typed(elRef.current, {
      strings: [
        'AI-Powered Fraud Detection',
        'Real-time Risk Analysis',
        'Blockchain-Verified Trust',
        'Neural Network Security',
        'Quantum-Resistant Encryption'
      ],
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 2000,
      startDelay: 500,
      loop: true,
      showCursor: true,
      cursorChar: '▋',
    });
    return () => typedRef.current?.destroy();
  }, []);

  return <span ref={elRef} className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f5ff] via-[#b829dd] to-[#ff0080] font-bold" />;
};

// ============================================
// FLOATING ORBS
// ============================================
const FloatingOrbs = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!containerRef.current) return;
    const orbs = containerRef.current.querySelectorAll('.orb');
    orbs.forEach((orb, i) => {
      anime({
        targets: orb,
        translateY: [{ value: -30, duration: 2000, easing: 'easeInOutSine' }, { value: 30, duration: 2000, easing: 'easeInOutSine' }],
        translateX: [{ value: 20, duration: 3000, easing: 'easeInOutQuad' }, { value: -20, duration: 3000, easing: 'easeInOutQuad' }],
        scale: [{ value: 1.1, duration: 4000, easing: 'easeInOutSine' }, { value: 0.9, duration: 4000, easing: 'easeInOutSine' }],
        opacity: [{ value: 0.3, duration: 2500 }, { value: 0.6, duration: 2500 }],
        delay: i * 200,
        loop: true,
        direction: 'alternate',
      });
    });
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div className="orb absolute top-1/4 left-1/4 w-96 h-96 bg-[#00f5ff] rounded-full blur-[120px] opacity-20" />
      <div className="orb absolute top-1/2 right-1/4 w-80 h-80 bg-[#b829dd] rounded-full blur-[100px] opacity-20" />
      <div className="orb absolute bottom-1/4 left-1/3 w-72 h-72 bg-[#ff0080] rounded-full blur-[90px] opacity-15" />
      <div className="orb absolute top-1/3 right-1/3 w-64 h-64 bg-[#ff6b35] rounded-full blur-[80px] opacity-15" />
    </div>
  );
};

// ============================================
// ANIMATED GRID
// ============================================
const AnimatedGrid = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!gridRef.current || typeof window === 'undefined') return;
    const lines = gridRef.current.querySelectorAll('.grid-line');
    gsap.fromTo(lines, 
      { scaleX: 0, opacity: 0 },
      {
        scaleX: 1, opacity: 1, duration: 1.5,
        stagger: { each: 0.05, from: 'random' },
        ease: 'power3.out',
        scrollTrigger: {
          trigger: gridRef.current, start: 'top 80%', toggleActions: 'play none none reverse'
        }
      }
    );
  }, []);

  return (
    <div ref={gridRef} className="fixed inset-0 z-0 pointer-events-none opacity-20">
      {[...Array(20)].map((_, i) => (
        <div key={`h-${i}`} className="grid-line absolute w-full h-px bg-gradient-to-r from-transparent via-[#00f5ff] to-transparent" style={{ top: `${(i + 1) * 5}%` }} />
      ))}
      {[...Array(20)].map((_, i) => (
        <div key={`v-${i}`} className="grid-line absolute w-px h-full bg-gradient-to-b from-transparent via-[#b829dd] to-transparent" style={{ left: `${(i + 1) * 5}%` }} />
      ))}
    </div>
  );
};

// ============================================
// SCANLINES
// ============================================
const Scanlines = () => (
  <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.03]">
    <div className="w-full h-full" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)' }} />
  </div>
);

// ============================================
// REVEAL ON SCROLL
// ============================================
export const RevealOnScroll = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current || typeof window === 'undefined') return;
    const sr = ScrollReveal({
      origin: 'bottom', distance: '60px', duration: 1000, delay: delay, easing: 'cubic-bezier(0.5, 0, 0, 1)', reset: false,
    });
    sr.reveal(ref.current);
    return () => sr.destroy();
  }, [delay]);
  return <div ref={ref}>{children}</div>;
};

// ============================================
// GLITCH TEXT
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
          transition: { duration: 0.3, repeat: 2 }
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

// ============================================
// MAIN EXPORT
// ============================================
const UltimateAnimationLayer = () => {
  return (
    <>
      <ParticleField />
      <FloatingOrbs />
      <AnimatedGrid />
      <Scanlines />
      <div className="fixed inset-0 z-[60] pointer-events-none opacity-[0.015]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }}
      />
    </>
  );
};

export default UltimateAnimationLayer;
