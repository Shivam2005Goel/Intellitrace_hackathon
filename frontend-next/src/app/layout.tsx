import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'IntelliTrace - AI-Powered Invoice Fraud Detection',
  description: 'Advanced fraud detection system using 5-layer analysis with physics validation, network graphs, and AI explanations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#0a0a0f] text-white min-h-screen">
        {/* Global Background Effects */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          {/* Base gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#12121a] to-[#1a1a25]" />
          
          {/* Grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0, 245, 255, 0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 245, 255, 0.5) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }}
          />
          
          {/* Animated orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00f5ff] rounded-full blur-[150px] opacity-10 animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#b829dd] rounded-full blur-[150px] opacity-10 animate-pulse" style={{ animationDelay: '1s' }} />
          
          {/* Scanlines */}
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)',
            }}
          />
        </div>

        {/* Navigation */}
        <Navbar />

        {/* Main Content */}
        <main className="relative z-10 pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}
