'use client';

import { useEffect, useState } from 'react';
import Header from './Header';
import AICopilot from './AICopilot';
import LiveTicker from './LiveTicker';
import { healthCheck } from '@/lib/api';

export default function GlobalComponents() {
  const [apiStatus, setApiStatus] = useState<'healthy' | 'degraded' | 'offline'>('offline');

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const health = await healthCheck();
        setApiStatus(health.status === 'healthy' ? 'healthy' : 'degraded');
      } catch {
        setApiStatus('offline');
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <LiveTicker />
      <div className="fixed left-0 right-0 top-8 z-[105]">
        <Header apiStatus={apiStatus} />
      </div>
      <AICopilot />
    </>
  );
}
