'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Shield, 
  Home, 
  Upload, 
  BarChart3, 
  GitCompare, 
  Menu, 
  X, 
  Activity,
  Zap,
  ChevronDown
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/upload', label: 'Analyze', icon: Upload },
  { href: '/batch', label: 'Batch', icon: BarChart3 },
  { href: '/compare', label: 'Compare', icon: GitCompare },
];

const toolsItems = [
  { href: '/tier-shifting', label: 'Tier Shifting' },
  { href: '/shadow-tier', label: 'Shadow Tier' },
  { href: '/cascade-exposure', label: 'Cascade' },
  { href: '/cash-rebound', label: 'Cash Rebound' },
  { href: '/trust-decay', label: 'Trust Decay' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/10' 
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00f5ff] to-[#b829dd] flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Shield className="w-6 h-6 text-white" />
              </motion.div>
              <div className="hidden sm:block">
                <span className="font-bold text-xl gradient-text">IntelliTrace</span>
                <div className="flex items-center gap-1 text-[10px] text-white/40 uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  System Online
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <Link key={item.href} href={item.href}>
                    <motion.div
                      className={`relative px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                        isActive 
                          ? 'text-white' 
                          : 'text-white/60 hover:text-white'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-[#00f5ff]/20 to-[#b829dd]/20 rounded-lg"
                          layoutId="navActive"
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                      <Icon className="w-4 h-4 relative z-10" />
                      <span className="relative z-10 font-medium text-sm">{item.label}</span>
                    </motion.div>
                  </Link>
                );
              })}

              {/* Tools Dropdown */}
              <div className="relative">
                <motion.button
                  className="px-4 py-2 rounded-lg flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                  onClick={() => setIsToolsOpen(!isToolsOpen)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Zap className="w-4 h-4" />
                  <span className="font-medium text-sm">Tools</span>
                  <motion.div
                    animate={{ rotate: isToolsOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {isToolsOpen && (
                    <>
                      <motion.div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsToolsOpen(false)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                      <motion.div
                        className="absolute top-full right-0 mt-2 w-56 glass-card py-2 z-50"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        {toolsItems.map((item, i) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsToolsOpen(false)}
                          >
                            <motion.div
                              className="px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                            >
                              {item.label}
                            </motion.div>
                          </Link>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              {/* Status Indicator */}
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <Activity className="w-3 h-3 text-[#00f5ff]" />
                <span className="text-xs text-white/60">API Connected</span>
              </div>

              {/* Mobile Menu Button */}
              <motion.button
                className="md:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                whileTap={{ scale: 0.95 }}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu Panel */}
            <motion.div
              className="absolute top-16 left-4 right-4 glass-card p-4"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="space-y-1">
                {navItems.map((item, i) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <motion.div
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive 
                            ? 'bg-gradient-to-r from-[#00f5ff]/20 to-[#b829dd]/20 text-white' 
                            : 'text-white/60 hover:bg-white/5 hover:text-white'
                        }`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </motion.div>
                    </Link>
                  );
                })}
                
                <div className="pt-2 mt-2 border-t border-white/10">
                  <p className="px-4 py-2 text-xs text-white/40 uppercase tracking-wider">Advanced Tools</p>
                  {toolsItems.map((item, i) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <motion.div
                        className="flex items-center gap-3 px-4 py-2 text-white/60 hover:text-white transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (navItems.length + i) * 0.05 }}
                      >
                        <Zap className="w-4 h-4" />
                        <span className="text-sm">{item.label}</span>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
