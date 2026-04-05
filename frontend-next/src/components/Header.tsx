'use client';

import { motion } from 'framer-motion';
import { Shield, Zap, Github, Activity } from 'lucide-react';

interface HeaderProps {
  apiStatus: 'healthy' | 'degraded' | 'offline';
}

export default function Header({ apiStatus }: HeaderProps) {
  const getStatusColor = () => {
    switch (apiStatus) {
      case 'healthy':
        return 'bg-success';
      case 'degraded':
        return 'bg-warning';
      case 'offline':
        return 'bg-danger';
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-b border-slate-200 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">
                Invoice <span className="text-primary-600">Physics</span>
              </h1>
              <p className="text-xs text-slate-500">Fraud Detection System</p>
            </div>
          </div>

          {/* Center Stats */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-lg">
              <Zap className="w-4 h-4 text-warning" />
              <span className="text-sm text-slate-600">5-Layer Detection</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-lg">
              <Activity className="w-4 h-4 text-primary-600" />
              <span className="text-sm text-slate-600">Real-time Analysis</span>
            </div>
          </div>

          {/* Status & GitHub */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor()} animate-pulse`} />
              <span className="text-sm text-slate-600 capitalize hidden sm:inline">
                API {apiStatus}
              </span>
            </div>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
