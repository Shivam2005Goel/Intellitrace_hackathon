'use client';
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Stars } from '@react-three/drei';
import { motion } from 'framer-motion';

function AnimatedSphere() {
  const sphereRef = useRef<any>();
  useFrame(({ clock }) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.x = clock.getElapsedTime() * 0.2;
      sphereRef.current.rotation.y = clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={sphereRef} args={[1, 64, 64]} scale={2}>
        <MeshDistortMaterial
          color="#b829dd"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          emissive="#00f5ff"
          emissiveIntensity={0.2}
        />
      </Sphere>
    </Float>
  );
}

export default function Hero3D() {
  return (
    <div className="relative w-full h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-transparent rounded-2xl mb-12 border border-[rgba(0,245,255,0.2)] shadow-[0_0_30px_rgba(0,245,255,0.1)]">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} color="#00f5ff" />
          <directionalLight position={[-10, -10, -5]} intensity={1} color="#ff0080" />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <AnimatedSphere />
        </Canvas>
      </div>
      <div className="relative z-10 text-center px-4 pointer-events-none">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-bold mb-6 text-white text-shadow-md text-glow-cyan"
        >
          Fraud Detection Through <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
            Physical Reality
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto"
        >
          Our 5-layer system checks invoices against delivery feasibility, supplier capacity, 
          timeline consistency, and cross-lender patterns before any money is released.
        </motion.p>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[var(--bg-primary)] to-transparent z-10"></div>
    </div>
  );
}
