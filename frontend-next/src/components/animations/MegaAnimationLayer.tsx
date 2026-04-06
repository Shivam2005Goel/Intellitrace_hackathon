'use client';

import { useEffect, useRef } from 'react';
import Typed from 'typed.js';
import ScrollReveal from 'scrollreveal';
import { motion } from 'framer-motion';

export default function MegaAnimationLayer() {
  const typedEl = useRef(null);

  useEffect(() => {
    // Typed.js initialization
    const typed = new Typed(typedEl.current, {
      strings: [
        'AI-Powered Fraud Detection.',
        'Real-time Network Analysis.',
        'Intelligent Analytics Engine.',
        'Cyberpunk Security Protocol.'
      ],
      typeSpeed: 40,
      backSpeed: 30,
      loop: true,
      showCursor: true,
      cursorChar: '▋'
    });

    // Animate background particles without relying on a deep anime.js import path.
    const particleAnimations = Array.from(document.querySelectorAll<HTMLElement>('.anime-particle')).map((particle, index) =>
      particle.animate(
        [
          { transform: 'translate3d(0px, 0px, 0) scale(1)', opacity: 0.2 },
          {
            transform: `translate3d(${(index % 5) * 8 - 12}px, ${((index + 2) % 6) * -6 + 12}px, 0) scale(${1 + (index % 3) * 0.1})`,
            opacity: 0.8,
          },
          { transform: 'translate3d(0px, 0px, 0) scale(1)', opacity: 0.2 },
        ],
        {
          duration: 2200 + index * 140,
          direction: 'alternate',
          iterations: Infinity,
          easing: 'ease-in-out',
        }
      )
    );

    // ScrollReveal initialization for dynamic reveal
    ScrollReveal().reveal('.reveal-item', { 
      delay: 200, 
      distance: '30px', 
      origin: 'bottom',
      interval: 100,
      opacity: 0
    });

    return () => {
      typed.destroy();
      particleAnimations.forEach((animation) => animation.cancel());
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center">
      {/* Anime.js Particles */}
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="anime-particle absolute rounded-full bg-[#00f5ff]/20 blur-[2px]"
          style={{
            width: Math.random() * 8 + 4 + 'px',
            height: Math.random() * 8 + 4 + 'px',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
          }}
        />
      ))}
      {[...Array(10)].map((_, i) => (
        <div
          key={`pink-${i}`}
          className="anime-particle absolute rounded-full bg-[#ff0080]/20 blur-[2px]"
          style={{
            width: Math.random() * 8 + 4 + 'px',
            height: Math.random() * 8 + 4 + 'px',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
          }}
        />
      ))}

      {/* Popmotion / GSAP / Mo.js / Kute.js / others can be represented as well, but this is a solid start */}
      
      {/* Typed.js Container - Positioned to the absolute top for the header to see, or we just render it here absolutely positioned. Overlap with Header might be weird. Instead, we won't show the Typed text inside the background. We will just expose the MegaAnimationLayer as a background. Wait, let's keep the Typed.js text as a subtle watermark background! */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 2 }}
        className="absolute bottom-10 right-10 text-4xl md:text-8xl font-black font-mono tracking-tighter text-[#00f5ff] mix-blend-overlay"
      >
        <span ref={typedEl}></span>
      </motion.div>
    </div>
  );
}
