'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  AreaChart,
  Area,
  Cell,
  PieChart,
  Pie,
  ScatterChart,
  Scatter,
  ReferenceLine
} from 'recharts';
import {
  Brain,
  Cpu,
  Network,
  Target,
  TrendingUp,
  Zap,
  Database,
  Award,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Microscope,
  ArrowRight,
  Layers,
  Sparkles,
  GitBranch,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';

// --- Data Definitions ---

// 1. Traditional ML Models
const traditionalMLData = [
  { model: 'SVM', accuracy: 0.27, precision: 0.2718, recall: 0.27, f1: 0.2610 },
  { model: 'KNN', accuracy: 0.26, precision: 0.2724, recall: 0.26, f1: 0.2586 },
  { model: 'Decision Tree', accuracy: 0.255, precision: 0.2597, recall: 0.255, f1: 0.2561 },
  { model: 'MLP', accuracy: 0.24, precision: 0.2461, recall: 0.24, f1: 0.2405 },
  { model: 'Logistic Reg', accuracy: 0.225, precision: 0.2359, recall: 0.225, f1: 0.2244 },
  { model: 'Naive Bayes', accuracy: 0.215, precision: 0.2224, recall: 0.215, f1: 0.2165 },
  { model: 'Random Forest', accuracy: 0.215, precision: 0.2141, recall: 0.215, f1: 0.2093 },
];

// 2. Multi-Dataset Evaluation
const multiDatasetData = [
  { dataset: 'Adaptive Blended', model: 'Logistic Regression', accuracy: 1.0, f1: 1.0, r2: 1.0 },
  { dataset: 'Adaptive Blended', model: 'Random Forest', accuracy: 0.925, f1: 0.9187, r2: 0.5288 },
  { dataset: 'Adaptive Blended', model: 'SVM', accuracy: 0.875, f1: 0.8618, r2: 0.267 },
  { dataset: 'Adaptive Blended', model: 'XGBoost', accuracy: 0.925, f1: 0.9242, r2: 0.6859 },
  { dataset: 'Adaptive Learning', model: 'Logistic Regression', accuracy: 0.9837, f1: 0.9837, r2: 0.9349 },
  { dataset: 'Adaptive Learning', model: 'Random Forest', accuracy: 1.0, f1: 1.0, r2: 1.0 },
  { dataset: 'Adaptive Learning', model: 'SVM', accuracy: 0.9675, f1: 0.9675, r2: 0.8698 },
  { dataset: 'Adaptive Learning', model: 'XGBoost', accuracy: 0.9964, f1: 0.9964, r2: 0.9855 },
  { dataset: 'Learning Path', model: 'Logistic Regression', accuracy: 0.1, f1: 0.0818, r2: -1.0595 },
  { dataset: 'Learning Path', model: 'Random Forest', accuracy: 0.14, f1: 0.1411, r2: -0.7069 },
  { dataset: 'Learning Path', model: 'SVM', accuracy: 0.115, f1: 0.1161, r2: -0.7986 },
  { dataset: 'Learning Path', model: 'XGBoost', accuracy: 0.15, f1: 0.1483, r2: -0.8657 },
  { dataset: 'Personalized Learning', model: 'Logistic Regression', accuracy: 0.95, f1: 0.95, r2: 0.9001 },
  { dataset: 'Personalized Learning', model: 'Random Forest', accuracy: 1.0, f1: 1.0, r2: 1.0 },
  { dataset: 'Personalized Learning', model: 'SVM', accuracy: 0.92, f1: 0.9207, r2: 0.8401 },
  { dataset: 'Personalized Learning', model: 'XGBoost', accuracy: 1.0, f1: 1.0, r2: 1.0 },
  { dataset: 'Student Education', model: 'Logistic Regression', accuracy: 0.975, f1: 0.9751, r2: 0.9529 },
  { dataset: 'Student Education', model: 'Random Forest', accuracy: 1.0, f1: 1.0, r2: 1.0 },
  { dataset: 'Student Education', model: 'SVM', accuracy: 0.93, f1: 0.9293, r2: 0.8681 },
  { dataset: 'Student Education', model: 'XGBoost', accuracy: 1.0, f1: 1.0, r2: 1.0 },
];

// 3. Deep Learning LSTM vs GRU
const deepLearningData = [
  { dataset: 'Adaptive Blended Teaching', model: 'LSTM', accuracy: 100, f1: 1.0, status: 'Perfect' },
  { dataset: 'Adaptive Learning Personalization', model: 'LSTM', accuracy: 99.28, f1: 0.9928, status: 'Near-Perfect' },
  { dataset: 'Personalized Educational', model: 'GRU', accuracy: 96.50, f1: 0.9649, status: 'Excellent' },
  { dataset: 'Personalized Learning Interaction', model: 'GRU', accuracy: 93.00, f1: 0.9304, status: 'Excellent' },
  { dataset: 'Personalized Learning Path', model: 'None', accuracy: 6.50, f1: 0.04, status: 'Failure' },
];

// 4. GloVe Hybrid Results
const gloveData = [
  { dataset: 'Adaptive Blended Teaching', lstm: 80, gru: 82.5, impact: -17.5, impactLabel: 'Negative' },
  { dataset: 'Adaptive Learning', lstm: 99.64, gru: 99.64, impact: 0, impactLabel: 'Neutral' },
  { dataset: 'Personalized Educational', lstm: 95, gru: 97, impact: 0.5, impactLabel: 'Slight +' },
  { dataset: 'Learning Interaction', lstm: 93, gru: 97, impact: 4, impactLabel: 'Significant +' },
  { dataset: 'Learning Path', lstm: 9.5, gru: 8, impact: -1.5, impactLabel: 'Still Failure' },
];

// 5. BERT Fine-Tuning Results
const bertData = [
  { dataset: 'Adaptive Learning', target: 'Learning Outcome (0/1)', classes: 2, accuracy: 92.59, loss: 0.35, status: 'Excellent' },
  { dataset: 'Adaptive Blended Teaching', target: 'Predicted Performance', classes: 3, accuracy: 87.50, loss: 0.67, status: 'High' },
  { dataset: 'Personalized Learning', target: 'Learning Outcome (0-2)', classes: 3, accuracy: 48.00, loss: 1.06, status: 'Moderate' },
  { dataset: 'Student Education', target: 'Student Performance', classes: 3, accuracy: 37.50, loss: 1.05, status: 'Low' },
  { dataset: 'Learning Path', target: 'Next Course Rec.', classes: 12, accuracy: 26.50, loss: 2.50, status: 'Critical Failure' },
];

// 6. SLM Fine-Tuning
const slmMetrics = [
  { label: 'Base Model', value: 'Qwen 2.5 (1.5B)', icon: Brain },
  { label: 'Parameters Tuned', value: '~18.4M (1.18%)', icon: Microscope },
  { label: 'Quantization', value: '4-bit NF4', icon: Database },
  { label: 'Training Corpus', value: '5,461 conversations', icon: Layers },
  { label: 'Initial Loss', value: '2.5591', icon: TrendingUp },
  { label: 'Final Loss', value: '1.0571', icon: Target },
  { label: 'Deployment', value: 'GGUF (Edge)', icon: Cpu },
];

// Colors
const colors = {
  cyan: '#4ecbff',
  purple: '#4d7cff',
  pink: '#ff8f6b',
  orange: '#ffb35c',
  green: '#2dd4bf',
  yellow: '#ffc864',
  red: '#ff6b6b',
};

const modelColors: Record<string, string> = {
  'Logistic Regression': colors.cyan,
  'Random Forest': colors.green,
  'SVM': colors.purple,
  'XGBoost': colors.pink,
  'LSTM': colors.cyan,
  'GRU': colors.purple,
};

// --- Components ---

const SectionHeader = ({ title, subtitle, icon: Icon }: { title: string; subtitle: string; icon: any }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="mb-8"
  >
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 rounded-lg bg-gradient-to-br from-[#4ecbff]/20 to-[#4d7cff]/20">
        <Icon className="w-6 h-6 text-[#4ecbff]" />
      </div>
      <h2 className="text-3xl font-bold gradient-text">{title}</h2>
    </div>
    <p className="text-white/60 ml-12">{subtitle}</p>
  </motion.div>
);

const GlassCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`glass-card p-6 ${className}`}>
    {children}
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const getColor = () => {
    if (status.includes('Perfect') || status === 'Excellent' || status === 'High') return colors.green;
    if (status.includes('Near')) return colors.cyan;
    if (status === 'Moderate') return colors.yellow;
    if (status === 'Low') return colors.orange;
    return colors.red;
  };

  return (
    <span
      className="px-3 py-1 rounded-full text-xs font-semibold"
      style={{ background: `${getColor()}20`, color: getColor(), border: `1px solid ${getColor()}40` }}
    >
      {status}
    </span>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="font-semibold mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(4) : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// --- Main Page Component ---

export default function AthenaResultsPage() {
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null);

  const datasets = [...new Set(multiDatasetData.map(d => d.dataset))];
  const filteredData = selectedDataset
    ? multiDatasetData.filter(d => d.dataset === selectedDataset)
    : multiDatasetData.filter(d => d.dataset === 'Adaptive Learning');

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pb-20">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#12121a] to-[#1a1a25]" />
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#4ecbff] rounded-full blur-[200px] opacity-10 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#4d7cff] rounded-full blur-[200px] opacity-10 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-6">
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to Dashboard
          </Link>
          
          <div className="flex items-center justify-center gap-4 mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="p-3 rounded-2xl bg-gradient-to-br from-[#4ecbff]/20 to-[#4d7cff]/20 border border-[#4ecbff]/30"
            >
              <Sparkles className="w-8 h-8 text-[#4ecbff]" />
            </motion.div>
            <h1 className="text-5xl font-bold gradient-text">Athena Project</h1>
          </div>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Complete Results Summary — AI-Powered Personalized Learning Analytics
          </p>
          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="flex items-center gap-2 text-sm text-white/50">
              <Database className="w-4 h-4" />
              <span>1000+ Samples</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/50">
              <GitBranch className="w-4 h-4" />
              <span>7 Model Types</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/50">
              <Layers className="w-4 h-4" />
              <span>5 Datasets</span>
            </div>
          </div>
        </motion.div>

        {/* Section 1: Traditional ML Models */}
        <section className="mb-20">
          <SectionHeader
            title="Traditional ML Models"
            subtitle="Baseline performance on AI_Personalized_Learning.csv (1000 samples, 4 classes)"
            icon={BarChart3}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard>
              <h3 className="text-lg font-semibold mb-4 text-white/80">Model Performance Comparison</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={traditionalMLData} layout="vertical" margin={{ left: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis type="number" domain={[0, 0.3]} stroke="rgba(255,255,255,0.3)" />
                  <YAxis dataKey="model" type="category" stroke="rgba(255,255,255,0.5)" width={100} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="accuracy" name="Accuracy" fill={colors.cyan} radius={[0, 4, 4, 0]} />
                  <Bar dataKey="f1" name="F1-Score" fill={colors.purple} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>

            <GlassCard>
              <h3 className="text-lg font-semibold mb-4 text-white/80">Precision vs Recall Analysis</h3>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis type="number" dataKey="precision" name="Precision" stroke="rgba(255,255,255,0.5)" domain={[0.2, 0.28]} />
                  <YAxis type="number" dataKey="recall" name="Recall" stroke="rgba(255,255,255,0.5)" domain={[0.2, 0.28]} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                  <Scatter name="Models" data={traditionalMLData} fill={colors.pink}>
                    {traditionalMLData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={[colors.cyan, colors.purple, colors.pink, colors.orange, colors.green, colors.yellow, colors.red][index % 7]} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </GlassCard>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {traditionalMLData.slice(0, 4).map((model, idx) => (
              <motion.div
                key={model.model}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card p-4 text-center"
              >
                <p className="text-sm text-white/60 mb-1">{model.model}</p>
                <p className="text-2xl font-bold mono" style={{ color: colors.cyan }}>
                  {(model.accuracy * 100).toFixed(1)}%
                </p>
                <p className="text-xs text-white/40">Accuracy</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Section 2: Multi-Dataset Evaluation */}
        <section className="mb-20">
          <SectionHeader
            title="Multi-Dataset Evaluation"
            subtitle="Cross-dataset performance of LR, RF, SVM, and XGBoost models"
            icon={Layers}
          />

          {/* Dataset Selector */}
          <div className="flex flex-wrap gap-2 mb-6">
            {datasets.map(dataset => (
              <button
                key={dataset}
                onClick={() => setSelectedDataset(dataset === selectedDataset ? null : dataset)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedDataset === dataset || (!selectedDataset && dataset === 'Adaptive Learning')
                    ? 'bg-gradient-to-r from-[#4ecbff] to-[#4d7cff] text-white'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                {dataset}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <GlassCard className="lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4 text-white/80">Accuracy Comparison by Model</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="model" stroke="rgba(255,255,255,0.5)" />
                  <YAxis domain={[0, 1]} stroke="rgba(255,255,255,0.5)" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="accuracy" name="Accuracy" radius={[8, 8, 0, 0]}>
                    {filteredData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={modelColors[entry.model] || colors.cyan} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>

            <GlassCard>
              <h3 className="text-lg font-semibold mb-4 text-white/80">R² Score Comparison</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={filteredData} layout="vertical" margin={{ left: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis type="number" stroke="rgba(255,255,255,0.3)" />
                  <YAxis dataKey="model" type="category" stroke="rgba(255,255,255,0.5)" width={100} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="r2" name="R² Score" radius={[0, 4, 4, 0]}>
                    {filteredData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.r2 < 0 ? colors.red : colors.green} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>
          </div>

          {/* Performance Matrix */}
          <GlassCard className="mt-6">
            <h3 className="text-lg font-semibold mb-4 text-white/80">Complete Performance Matrix</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-white/60 font-medium">Dataset</th>
                    <th className="text-left py-3 px-4 text-white/60 font-medium">Model</th>
                    <th className="text-center py-3 px-4 text-white/60 font-medium">Accuracy</th>
                    <th className="text-center py-3 px-4 text-white/60 font-medium">F1-Score</th>
                    <th className="text-center py-3 px-4 text-white/60 font-medium">R² Score</th>
                  </tr>
                </thead>
                <tbody>
                  {multiDatasetData.map((row, idx) => (
                    <motion.tr
                      key={`${row.dataset}-${row.model}`}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.02 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-3 px-4 text-white/80">{row.dataset}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded text-xs" style={{ background: `${modelColors[row.model]}20`, color: modelColors[row.model] }}>
                          {row.model}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={row.accuracy >= 0.9 ? 'text-[#2dd4bf]' : row.accuracy >= 0.5 ? 'text-[#ffc864]' : 'text-[#ff6b6b]'}>
                          {(row.accuracy * 100).toFixed(2)}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center mono">{row.f1.toFixed(4)}</td>
                      <td className="py-3 px-4 text-center mono">
                        <span className={row.r2 < 0 ? 'text-[#ff6b6b]' : 'text-[#2dd4bf]'}>
                          {row.r2.toFixed(4)}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </section>

        {/* Section 3: Deep Learning LSTM vs GRU */}
        <section className="mb-20">
          <SectionHeader
            title="Deep Learning: LSTM vs GRU"
            subtitle="Standard architecture performance comparison"
            icon={Network}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard>
              <h3 className="text-lg font-semibold mb-4 text-white/80">Accuracy by Dataset</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={deepLearningData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="dataset" stroke="rgba(255,255,255,0.5)" angle={-45} textAnchor="end" height={80} />
                  <YAxis domain={[0, 100]} stroke="rgba(255,255,255,0.5)" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="accuracy" name="Accuracy %" fill={colors.cyan} radius={[8, 8, 0, 0]}>
                    {deepLearningData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.accuracy >= 90 ? colors.green : entry.accuracy >= 50 ? colors.yellow : colors.red} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>

            <GlassCard>
              <h3 className="text-lg font-semibold mb-4 text-white/80">Performance Radar</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={deepLearningData.filter(d => d.accuracy > 10)}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="dataset" stroke="rgba(255,255,255,0.5)" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="rgba(255,255,255,0.3)" />
                  <Radar name="Accuracy" dataKey="accuracy" stroke={colors.cyan} fill={colors.cyan} fillOpacity={0.3} />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </GlassCard>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
            {deepLearningData.map((item, idx) => (
              <motion.div
                key={item.dataset}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`glass-card p-4 ${item.status === 'Failure' ? 'border-red-500/30' : ''}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-white/60">{item.model}</span>
                  <StatusBadge status={item.status} />
                </div>
                <p className="text-sm text-white/80 truncate mb-2">{item.dataset}</p>
                <p className="text-3xl font-bold mono" style={{ color: item.accuracy >= 90 ? colors.green : item.accuracy >= 50 ? colors.yellow : colors.red }}>
                  {item.accuracy}%
                </p>
                <p className="text-xs text-white/40 mt-1">F1: {item.f1.toFixed(4)}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Section 4: GloVe Hybrid */}
        <section className="mb-20">
          <SectionHeader
            title="GloVe Hybrid Architecture"
            subtitle="GloVe + LSTM/GRU performance impact analysis"
            icon={Sparkles}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard>
              <h3 className="text-lg font-semibold mb-4 text-white/80">LSTM vs GRU with GloVe</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={gloveData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="dataset" stroke="rgba(255,255,255,0.5)" angle={-45} textAnchor="end" height={80} />
                  <YAxis domain={[0, 100]} stroke="rgba(255,255,255,0.5)" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="lstm" name="LSTM + GloVe" fill={colors.cyan} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="gru" name="GRU + GloVe" fill={colors.purple} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>

            <GlassCard>
              <h3 className="text-lg font-semibold mb-4 text-white/80">GloVe Impact Analysis</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={gloveData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="dataset" stroke="rgba(255,255,255,0.5)" angle={-45} textAnchor="end" height={80} />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <ReferenceLine y={0} stroke="rgba(255,255,255,0.3)" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="impact" name="Impact %" radius={[4, 4, 0, 0]}>
                    {gloveData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.impact >= 0 ? colors.green : colors.red} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>
          </div>

          {/* Impact Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
            {gloveData.map((item, idx) => (
              <motion.div
                key={item.dataset}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card p-4 text-center"
              >
                <p className="text-xs text-white/60 mb-2 truncate">{item.dataset}</p>
                <div className="flex justify-center gap-2 text-xs mb-2">
                  <span className="text-[#4ecbff]">L: {item.lstm}%</span>
                  <span className="text-white/30">|</span>
                  <span className="text-[#4d7cff]">G: {item.gru}%</span>
                </div>
                <p className={`text-lg font-bold mono ${item.impact >= 0 ? 'text-[#2dd4bf]' : 'text-[#ff6b6b]'}`}>
                  {item.impact > 0 ? '+' : ''}{item.impact}%
                </p>
                <p className="text-xs text-white/40 mt-1">{item.impactLabel}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Section 5: BERT Fine-Tuning */}
        <section className="mb-20">
          <SectionHeader
            title="BERT Fine-Tuning Results"
            subtitle="Transformer model performance across classification tasks"
            icon={Brain}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <GlassCard className="lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4 text-white/80">Accuracy vs Loss Trade-off</h3>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis type="number" dataKey="loss" name="Loss" stroke="rgba(255,255,255,0.5)" />
                  <YAxis type="number" dataKey="accuracy" name="Accuracy" domain={[0, 100]} stroke="rgba(255,255,255,0.5)" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                  <Scatter name="BERT Results" data={bertData}>
                    {bertData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.accuracy >= 80 ? colors.green : entry.accuracy >= 40 ? colors.yellow : colors.red} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </GlassCard>

            <GlassCard>
              <h3 className="text-lg font-semibold mb-4 text-white/80">Class Count Impact</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={bertData}>
                  <defs>
                    <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colors.cyan} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={colors.cyan} stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="classes" stroke="rgba(255,255,255,0.5)" />
                  <YAxis domain={[0, 100]} stroke="rgba(255,255,255,0.5)" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="accuracy" stroke={colors.cyan} fillOpacity={1} fill="url(#colorAccuracy)" />
                </AreaChart>
              </ResponsiveContainer>
            </GlassCard>
          </div>

          {/* BERT Results Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {bertData.map((item, idx) => (
              <motion.div
                key={item.dataset}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-white/90">{item.dataset}</h4>
                  <StatusBadge status={item.status} />
                </div>
                <p className="text-xs text-white/50 mb-4">{item.target}</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-2 rounded-lg bg-white/5">
                    <p className="text-lg font-bold mono" style={{ color: item.accuracy >= 80 ? colors.green : item.accuracy >= 40 ? colors.yellow : colors.red }}>
                      {item.accuracy}%
                    </p>
                    <p className="text-xs text-white/40">Accuracy</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-white/5">
                    <p className="text-lg font-bold mono text-white/80">{item.classes}</p>
                    <p className="text-xs text-white/40">Classes</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-white/5">
                    <p className="text-lg font-bold mono" style={{ color: item.loss < 1 ? colors.green : item.loss < 2 ? colors.yellow : colors.red }}>
                      {item.loss}
                    </p>
                    <p className="text-xs text-white/40">Loss</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Section 6: SLM Fine-Tuning */}
        <section className="mb-20">
          <SectionHeader
            title="SLM Fine-Tuning: Qwen 2.5"
            subtitle="Small Language Model with LoRA adaptation"
            icon={Cpu}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Metrics Grid */}
            <div className="lg:col-span-2 grid grid-cols-2 gap-4">
              {slmMetrics.map((metric, idx) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-card p-5 flex items-center gap-4"
                >
                  <div className="p-3 rounded-xl bg-gradient-to-br from-[#4ecbff]/20 to-[#4d7cff]/20">
                    <metric.icon className="w-6 h-6 text-[#4ecbff]" />
                  </div>
                  <div>
                    <p className="text-sm text-white/60">{metric.label}</p>
                    <p className="text-lg font-semibold text-white/90">{metric.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Loss Chart */}
            <GlassCard>
              <h3 className="text-lg font-semibold mb-4 text-white/80">Training Progress</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={[
                  { stage: 'Initial', loss: 2.5591 },
                  { stage: 'Mid', loss: 1.8 },
                  { stage: 'Final', loss: 1.0571 },
                ]}>
                  <defs>
                    <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colors.purple} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={colors.purple} stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="stage" stroke="rgba(255,255,255,0.5)" />
                  <YAxis domain={[0, 3]} stroke="rgba(255,255,255,0.5)" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="loss" stroke={colors.purple} fillOpacity={1} fill="url(#colorLoss)" />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-between mt-4 p-3 rounded-lg bg-[#2dd4bf]/10 border border-[#2dd4bf]/30">
                <span className="text-sm text-white/70">Loss Reduction</span>
                <span className="text-xl font-bold text-[#2dd4bf]">58.7%</span>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* Section 7: Key Findings */}
        <section className="mb-20">
          <SectionHeader
            title="Key Findings Summary"
            subtitle="Critical insights from the Athena Project analysis"
            icon={Award}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: CheckCircle, title: 'Best Overall Architecture', value: 'LSTM/GRU Deep Learning', color: colors.green, desc: 'Consistently outperforms traditional ML' },
              { icon: Database, title: 'Best Dataset Type', value: 'Adaptive Learning & Blended Teaching', color: colors.cyan, desc: 'Perfect accuracy achievable' },
              { icon: XCircle, title: 'Consistently Failing', value: 'Personalized Learning Path', color: colors.red, desc: 'Synthetic noise suspected' },
              { icon: Sparkles, title: 'GloVe Helps When', value: 'Categorical/Text-heavy Data', color: colors.purple, desc: 'Significant positive impact' },
              { icon: AlertTriangle, title: 'GloVe Hurts When', value: 'Purely Numerical Tasks', color: colors.orange, desc: '-17.5% performance drop' },
              { icon: Target, title: 'BERT Best Use Case', value: 'Binary/3-class Classification', color: colors.pink, desc: 'With descriptive features' },
            ].map((finding, idx) => (
              <motion.div
                key={finding.title}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card p-6 flex items-start gap-4"
              >
                <div className="p-3 rounded-xl" style={{ background: `${finding.color}20` }}>
                  <finding.icon className="w-6 h-6" style={{ color: finding.color }} />
                </div>
                <div>
                  <p className="text-sm text-white/60 mb-1">{finding.title}</p>
                  <p className="text-lg font-semibold text-white/90 mb-1">{finding.value}</p>
                  <p className="text-sm text-white/50">{finding.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center py-12 border-t border-white/10"
        >
          <p className="text-white/40 text-sm">
            Athena Project — AI-Powered Personalized Learning Analytics
          </p>
          <p className="text-white/30 text-xs mt-2">
            Generated with IntelliTrace Visualization Engine
          </p>
        </motion.div>
      </div>
    </div>
  );
}
