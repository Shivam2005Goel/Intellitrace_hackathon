'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import InvoiceForm from '@/components/InvoiceForm';
import ResultsPanel from '@/components/ResultsPanel';
import { analyzeInvoice, testFraud, testLegitimate, healthCheck } from '@/lib/api';
import { Invoice, AnalysisResult } from '@/types';
import { AlertCircle } from 'lucide-react';

export default function Home() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<'healthy' | 'degraded' | 'offline'>('offline');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkHealth = async () => {
    try {
      const health = await healthCheck();
      if (health.status === 'healthy') {
        setApiStatus('healthy');
      } else {
        setApiStatus('degraded');
      }
      setError(null);
    } catch (err) {
      setApiStatus('offline');
      setError('Backend API is not responding. Please make sure the server is running on port 8000.');
    }
  };

  const handleAnalyze = async (invoice: Invoice) => {
    setIsLoading(true);
    setError(null);
    try {
      const analysisResult = await analyzeInvoice(invoice);
      setResult(analysisResult);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to analyze invoice. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestFraud = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const testResult = await testFraud();
      setResult(testResult.analysis_result);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to run fraud test.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestLegitimate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const testResult = await testLegitimate();
      setResult(testResult.analysis_result);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to run legitimate test.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header apiStatus={apiStatus} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-danger-light/50 border border-danger/30 rounded-xl flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-danger flex-shrink-0" />
            <p className="text-danger-dark">{error}</p>
          </motion.div>
        )}

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Fraud Detection Through{' '}
            <span className="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              Physical Reality
            </span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Our 5-layer system checks invoices against delivery feasibility, supplier capacity, 
            timeline consistency, and cross-lender patterns before any money is released.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-5">
            <InvoiceForm
              onSubmit={handleAnalyze}
              onTestFraud={handleTestFraud}
              onTestLegitimate={handleTestLegitimate}
              isLoading={isLoading}
            />
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-7">
            <ResultsPanel result={result} />
          </div>
        </div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-5 gap-4"
        >
          {[
            { 
              title: 'Layer 1: DNA', 
              desc: 'Fingerprinting & duplicate detection',
              icon: '🔍'
            },
            { 
              title: 'Layer 2: Physics', 
              desc: 'Delivery feasibility & capacity checks',
              icon: '🌍'
            },
            { 
              title: 'Layer 3: Graph', 
              desc: 'Fraud ring detection',
              icon: '🕸️'
            },
            { 
              title: 'Layer 4: AI', 
              desc: 'Natural language explanations',
              icon: '🤖'
            },
            { 
              title: 'Layer 5: PSI', 
              desc: 'Cross-lender detection',
              icon: '🔐'
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="font-bold text-slate-800 mb-1">{feature.title}</h3>
              <p className="text-sm text-slate-500">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              Invoice Physics - Open Source Fraud Detection System
            </p>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span>v1.0.0</span>
              <span>•</span>
              <span>FastAPI + Next.js</span>
              <span>•</span>
              <span>100% Open Source</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
