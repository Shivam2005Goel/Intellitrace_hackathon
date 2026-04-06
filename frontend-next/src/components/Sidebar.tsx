'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, UploadCloud, FileText, 
  ArrowRightLeft, Ghost, RefreshCcw, 
  History, Store, HeartCrack, Activity, 
  FileSearch, ShieldAlert, UserX 
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Upload Invoice', href: '/upload', icon: UploadCloud },
    { name: 'Tier-Shifting', href: '/tier-shifting', icon: ArrowRightLeft },
    { name: 'Shadow-Tier', href: '/shadow-tier', icon: Ghost },
    { name: 'Cash-Rebound', href: '/cash-rebound', icon: RefreshCcw },
    { name: 'Inverse-Causality', href: '/inverse-causality', icon: History },
    { name: 'Market-Physics', href: '/market-physics', icon: Store },
    { name: 'Trust-Decay', href: '/trust-decay', icon: HeartCrack },
    { name: 'Funding-Frequency', href: '/funding-frequency', icon: Activity },
    { name: 'Reality-Consistency', href: '/reality-consistency', icon: FileSearch },
    { name: 'Cascade-Exposure', href: '/cascade-exposure', icon: ShieldAlert },
    { name: 'Fraud-Persona', href: '/fraud-persona', icon: UserX },
  ];

  return (
    <div className="w-64 bg-slate-900 min-h-screen text-slate-300 flex flex-col hidden md:flex border-r border-slate-800">
      <div className="flex items-center gap-3 p-6 mb-4">
        <div className="bg-primary-600 p-2 rounded-lg text-white">
          <FileText className="w-6 h-6" />
        </div>
        <span className="text-xl font-bold text-white tracking-tight">Invoice Physics</span>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <Link key={link.name} href={link.href}>
              <div
                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-primary-600/20 rounded-xl border border-primary-500/30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
                <Icon className={`w-5 h-5 relative z-10 ${isActive ? 'text-primary-400' : 'group-hover:text-primary-400'}`} />
                <span className="font-medium relative z-10">{link.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 text-xs text-slate-600 text-center border-t border-slate-800">
        &copy; {new Date().getFullYear()} Invoice Physics
      </div>
    </div>
  );
}
