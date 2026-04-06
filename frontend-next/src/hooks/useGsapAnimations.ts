'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef, useCallback } from 'react';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

// Hook for fade in up animation
export const useFadeInUp = (delay: number = 0) => {
  const ref = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    if (!ref.current) return;
    
    gsap.fromTo(ref.current,
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  }, { scope: ref });
  
  return ref;
};

// Hook for staggered children animation
export const useStaggerChildren = (staggerDelay: number = 0.1) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    if (!containerRef.current) return;
    
    const children = containerRef.current.children;
    
    gsap.fromTo(children,
      { opacity: 0, y: 20, scale: 0.95 },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        duration: 0.6, 
        stagger: staggerDelay,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );
  }, { scope: containerRef });
  
  return containerRef;
};

// Hook for number counter animation
export const useCountUp = (endValue: number, duration: number = 2) => {
  const ref = useRef<HTMLSpanElement>(null);
  
  useGSAP(() => {
    if (!ref.current) return;
    
    const obj = { value: 0 };
    
    gsap.to(obj, {
      value: endValue,
      duration,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      onUpdate: () => {
        if (ref.current) {
          ref.current.textContent = Math.round(obj.value).toLocaleString();
        }
      }
    });
  }, { scope: ref });
  
  return ref;
};

// Hook for scroll reveal
export const useScrollReveal = () => {
  const ref = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    if (!ref.current) return;
    
    gsap.fromTo(ref.current,
      { opacity: 0, scale: 0.9 },
      { 
        opacity: 1, 
        scale: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 75%',
          end: 'bottom 25%',
          toggleActions: 'play reverse play reverse'
        }
      }
    );
  }, { scope: ref });
  
  return ref;
};

// Hook for parallax effect
export const useParallax = (speed: number = 0.5) => {
  const ref = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    if (!ref.current) return;
    
    gsap.to(ref.current, {
      yPercent: speed * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: ref.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  }, { scope: ref });
  
  return ref;
};

// Hook for magnetic button effect
export const useMagneticEffect = () => {
  const ref = useRef<HTMLButtonElement>(null);
  
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    gsap.to(ref.current, {
      x: x * 0.3,
      y: y * 0.3,
      duration: 0.3,
      ease: 'power2.out'
    });
  }, []);
  
  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return;
    
    gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)'
    });
  }, []);
  
  return { ref, handleMouseMove, handleMouseLeave };
};

// Utility to kill all ScrollTriggers
export const killAllScrollTriggers = () => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
};

// Refresh ScrollTrigger
export const refreshScrollTrigger = () => {
  ScrollTrigger.refresh();
};
