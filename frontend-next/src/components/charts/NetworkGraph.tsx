'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  type: 'supplier' | 'buyer' | 'invoice';
  tier?: 'buyer' | 'tier1' | 'tier2' | 'tier3';
}

interface Edge {
  source: string;
  target: string;
  value: number;
  color: string;
  isPhantom?: boolean;
}

interface NetworkGraphProps {
  nodes: Node[];
  edges: Edge[];
  width?: number;
  height?: number;
}

const NetworkGraph = ({ nodes: initialNodes, edges, width = 800, height = 400 }: NetworkGraphProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const getTierX = (tier?: string) => {
    switch (tier) {
      case 'buyer': return width * 0.15;
      case 'tier1': return width * 0.4;
      case 'tier2': return width * 0.65;
      case 'tier3': return width * 0.85;
      default: return Math.random() * width;
    }
  };

  const nodesRef = useRef<Node[]>(initialNodes.map(n => ({
    ...n,
    x: n.tier ? getTierX(n.tier) : (n.x || Math.random() * width),
    y: n.y || Math.random() * (height - 100) + 50,
    vx: 0,
    vy: 0,
  })));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw edges
      edges.forEach(edge => {
        const sourceNode = nodesRef.current.find(n => n.id === edge.source);
        const targetNode = nodesRef.current.find(n => n.id === edge.target);
        
        if (sourceNode && targetNode) {
          ctx.beginPath();
          ctx.moveTo(sourceNode.x, sourceNode.y);
          ctx.lineTo(targetNode.x, targetNode.y);
          
          if (edge.isPhantom) {
            ctx.strokeStyle = `rgba(255, 51, 102, ${(Math.sin(Date.now() * 0.005) + 1.5) / 2})`;
            ctx.lineWidth = 3;
            ctx.setLineDash([5, 5]);
          } else {
            ctx.strokeStyle = edge.color || 'rgba(0,245,255,0.3)';
            ctx.lineWidth = Math.max(1, edge.value / 2);
            ctx.setLineDash([]);
          }
          ctx.stroke();
          ctx.setLineDash([]);
          
          // Draw animated particles on edges
          const time = Date.now() * (edge.isPhantom ? 0.003 : 0.001);
          const particleOffset = (time % 1);
          const px = sourceNode.x + (targetNode.x - sourceNode.x) * particleOffset;
          const py = sourceNode.y + (targetNode.y - sourceNode.y) * particleOffset;
          
          ctx.beginPath();
          ctx.arc(px, py, edge.isPhantom ? 4 : 3, 0, Math.PI * 2);
          ctx.fillStyle = edge.isPhantom ? '#ff3366' : '#00f5ff';
          if (edge.isPhantom) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#ff3366';
          }
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });
      
      // Draw nodes
      nodesRef.current.forEach(node => {
        // Glow effect
        const gradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, node.radius * 2
        );
        gradient.addColorStop(0, node.color);
        gradient.addColorStop(0.5, node.color + '80');
        gradient.addColorStop(1, 'transparent');
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Node body
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Label
        ctx.font = '12px Inter';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y + node.radius + 15);
        
        // Apply simple physics
        node.vx *= 0.95;
        node.vy *= 0.95;
        node.x += node.vx;
        node.y += node.vy;
        
        // Boundary constraints
        if (node.x < node.radius) node.x = node.radius;
        if (node.x > width - node.radius) node.x = width - node.radius;
        if (node.y < node.radius) node.y = node.radius;
        if (node.y > height - node.radius) node.y = height - node.radius;
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [edges, width, height]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePos({ x, y });
    
    // Find hovered node
    const hovered = nodesRef.current.find(node => {
      const dx = node.x - x;
      const dy = node.y - y;
      return Math.sqrt(dx * dx + dy * dy) < node.radius * 2;
    });
    
    setHoveredNode(hovered || null);
    canvas.style.cursor = hovered ? 'pointer' : 'default';
  };

  return (
    <motion.div 
      className="relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseMove={handleMouseMove}
        className="rounded-lg"
        style={{ background: 'linear-gradient(135deg, rgba(10,10,15,0.8) 0%, rgba(26,26,37,0.6) 100%)' }}
      />
      
      {hoveredNode && (
        <motion.div
          className="absolute pointer-events-none glass-card p-3 z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            left: mousePos.x + 10,
            top: mousePos.y - 40,
          }}
        >
          <div className="text-sm font-semibold" style={{ color: hoveredNode.color }}>
            {hoveredNode.label}
          </div>
          <div className="text-xs text-white/50 mt-1 capitalize">
            Type: {hoveredNode.type}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default NetworkGraph;
