'use client';

import { motion } from 'framer-motion';
import { Activity, Github, Shield, Sparkles, Workflow } from 'lucide-react';
import DecryptedText from './DecryptedText';

interface HeaderProps {
  apiStatus: 'healthy' | 'degraded' | 'offline';
}

const statusTone = {
  healthy: 'bg-[rgba(45,212,191,0.16)] text-[var(--accent-green)] border-[rgba(45,212,191,0.22)]',
  degraded: 'bg-[rgba(255,179,92,0.16)] text-[var(--accent-orange)] border-[rgba(255,179,92,0.22)]',
  offline: 'bg-[rgba(255,107,107,0.16)] text-[var(--accent-red)] border-[rgba(255,107,107,0.22)]',
} as const;

export default function Header({ apiStatus }: HeaderProps) {
  const links = [
    { label: 'Overview', href: '#overview', icon: Activity },
    { label: 'Scenarios', href: '#scenarios', icon: Sparkles },
    { label: 'Workbench', href: '#workbench', icon: Workflow },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
    >
      <div className="surface flex items-center justify-between gap-4 px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#4ecbff,#4d7cff)] shadow-[0_12px_28px_rgba(77,124,255,0.28)]">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div className="min-w-0">
            <div className="text-lg font-extrabold tracking-tight text-white flex select-none">
              <DecryptedText text="Intelli" animateOn="hover" />
              <span className="text-[var(--accent-cyan)]">
                <DecryptedText text="Trace" animateOn="hover" speed={60} maxIterations={12} characters="ABCD1234!?" />
              </span>
            </div>
            <p className="truncate text-xs text-[var(--text-secondary)]">Multi-tier supply-chain finance fraud intelligence</p>
          </div>
        </div>

        <nav className="hidden items-center gap-1 rounded-full border border-white/8 bg-black/10 p-1 lg:flex">
          {links.map(({ label, href, icon: Icon }) => (
            <a
              key={href}
              href={href}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-[var(--text-secondary)] transition hover:bg-white/[0.05] hover:text-white"
            >
              <Icon className="h-4 w-4" />
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className={`hidden rounded-full border px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] sm:inline-flex ${statusTone[apiStatus]}`}>
            API {apiStatus}
          </div>
          <a
            href="https://github.com/Shivam2005Goel/Intellitrace_hackathon"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/8 bg-black/10 text-[var(--text-secondary)] transition hover:border-white/14 hover:text-white"
          >
            <Github className="h-5 w-5" />
          </a>
        </div>
      </div>
    </motion.header>
  );
}
