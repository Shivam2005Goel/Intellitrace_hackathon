'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnalysisResult } from '@/types';
import DecisionBanner from './DecisionBanner';
import LayerCard from './LayerCard';
import PhysicsDetails from './PhysicsDetails';
import DNADetails from './DNADetails';
import GraphVisualization from './GraphVisualization';
import AIExplanation from './AIExplanation';
import { 
  ChevronDown, 
  ChevronUp,
  Layers,
  FileJson
} from 'lucide-react';
import { JsonView, allExpanded, defaultStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';

interface ResultsPanelProps {
  result: AnalysisResult | null;
}

export default function ResultsPanel({ result }: ResultsPanelProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'physics' | 'dna' | 'graph' | 'raw'>('overview');

  if (!result) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Layers className="w-12 h-12 text-slate-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-700 mb-2">No Analysis Yet</h3>
        <p className="text-slate-500 max-w-md mx-auto">
          Submit an invoice or use the test buttons to see the fraud detection results.
        </p>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', count: null },
    { id: 'physics', label: 'Physics', count: result.results.physics.routing.flagged || result.results.physics.capacity.flagged || result.results.physics.causality.flagged ? '!' : null },
    { id: 'dna', label: 'DNA', count: result.results.dna.status !== 'NEW' || result.results.dna.behavioral.flagged ? '!' : null },
    { id: 'graph', label: 'Network', count: result.results.graph.flagged ? '!' : null },
    { id: 'raw', label: 'Raw Data', count: null },
  ];

  return (
    <div className="space-y-6">
      {/* Decision Banner */}
      <DecisionBanner
        decision={result.decision}
        riskScore={result.risk_score}
        confidence={result.confidence}
        invoiceId={result.invoice_id}
      />

      {/* AI Explanation */}
      <AIExplanation 
        explanation={result.explanation} 
        decision={result.decision}
      />

      {/* Layer Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <LayerCard
          name="DNA"
          title="Invoice DNA"
          description="Fingerprinting & duplicate detection"
          isFlagged={result.results.dna.status !== 'NEW' || result.results.dna.behavioral.flagged}
          score={result.layer_scores.dna}
          delay={0}
        />
        <LayerCard
          name="PHYSICS"
          title="Physics Engine"
          description="Reality & capacity checks"
          isFlagged={result.layers_flagged.includes('PHYSICS')}
          score={result.layer_scores.physics}
          delay={0.1}
        />
        <LayerCard
          name="GRAPH"
          title="Network Graph"
          description="Fraud ring detection"
          isFlagged={result.results.graph.flagged}
          score={result.layer_scores.graph}
          delay={0.2}
        />
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex border-b border-slate-200 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors relative ${
                activeTab === tab.id
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab.label}
              {tab.count && (
                <span className="ml-2 px-2 py-0.5 bg-danger text-white text-xs rounded-full">
                  {tab.count}
                </span>
              )}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
                />
              )}
            </button>
          ))}
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-50 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-slate-800">{result.processing_time_seconds}s</div>
                    <div className="text-sm text-slate-500">Processing Time</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-slate-800">{result.layers_flagged.length}</div>
                    <div className="text-sm text-slate-500">Layers Flagged</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-slate-800">{result.results.dna.psi.count}</div>
                    <div className="text-sm text-slate-500">Lenders Seen</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-slate-800">{result.results.graph.cycles_found}</div>
                    <div className="text-sm text-slate-500">Fraud Rings</div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-700 mb-2">Analysis Timestamp</h4>
                  <p className="text-slate-600">{new Date(result.timestamp).toLocaleString()}</p>
                </div>
              </motion.div>
            )}

            {activeTab === 'physics' && (
              <motion.div
                key="physics"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <PhysicsDetails physics={result.results.physics} />
              </motion.div>
            )}

            {activeTab === 'dna' && (
              <motion.div
                key="dna"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <DNADetails dna={result.results.dna} />
              </motion.div>
            )}

            {activeTab === 'graph' && (
              <motion.div
                key="graph"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <GraphVisualization graph={result.results.graph} />
              </motion.div>
            )}

            {activeTab === 'raw' && (
              <motion.div
                key="raw"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-slate-50 rounded-lg p-4 overflow-auto"
              >
                <JsonView
                  data={result}
                  shouldExpandNode={allExpanded}
                  style={defaultStyles}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
