'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  X,
  Loader2,
  Shield,
  ArrowRight,
  Zap,
  Network,
  Brain,
  Lock
} from 'lucide-react';
import Link from 'next/link';

interface AnalysisResult {
  invoice_id: string;
  decision: 'APPROVE' | 'HOLD' | 'BLOCK';
  confidence: number;
  risk_score: number;
  layers_flagged: string[];
  explanation: string;
  processing_time_seconds: number;
}

const layerIcons: Record<string, React.ReactNode> = {
  DNA: <Shield className="w-4 h-4" />,
  PHYSICS: <Zap className="w-4 h-4" />,
  GRAPH: <Network className="w-4 h-4" />,
  LLM: <Brain className="w-4 h-4" />,
  PSI: <Lock className="w-4 h-4" />,
};

const layerColors: Record<string, string> = {
  DNA: '#00f5ff',
  PHYSICS: '#b829dd',
  GRAPH: '#ff0080',
  LLM: '#ff6b35',
  PSI: '#00ff88',
};

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === 'application/pdf' || droppedFile.type.startsWith('image/'))) {
      setFile(droppedFile);
      setError(null);
    } else {
      setError('Please upload a PDF or image file');
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!file) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock result
    setResult({
      invoice_id: `INV-${Date.now()}`,
      decision: Math.random() > 0.5 ? 'APPROVE' : 'HOLD',
      confidence: 0.89,
      risk_score: Math.floor(Math.random() * 50) + 20,
      layers_flagged: ['PHYSICS'],
      explanation: 'The invoice shows potential routing inconsistencies. The claimed delivery time of 2 days for a sea shipment from Shanghai to Rotterdam is physically impossible. Expected transit time is 20-25 days.',
      processing_time_seconds: 2.34,
    });
    
    setIsAnalyzing(false);
  }, [file]);

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'APPROVE': return '#00ff88';
      case 'HOLD': return '#ffcc00';
      case 'BLOCK': return '#ff3366';
      default: return '#00f5ff';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-6">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#12121a] to-[#1a1a25]" />
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00f5ff] rounded-full blur-[150px] opacity-10 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#b829dd] rounded-full blur-[150px] opacity-10 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-8 flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <Link href="/" className="text-white/50 hover:text-white transition-colors flex items-center gap-2 mb-2">
              <ArrowRight className="w-4 h-4 rotate-180" />
              Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold gradient-text">Invoice Analysis</h1>
            <p className="text-white/60 mt-2">Upload an invoice for AI-powered fraud detection</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative glass-card p-12 cursor-pointer transition-all duration-300
                ${isDragging ? 'border-[#00f5ff] shadow-lg shadow-[#00f5ff]/20 scale-[1.02]' : ''}
                ${file ? 'border-[#00ff88]' : ''}
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              <AnimatePresence mode="wait">
                {file ? (
                  <motion.div
                    key="file-selected"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center"
                  >
                    <motion.div
                      className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-[#00ff88]/20 flex items-center justify-center"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <FileText className="w-10 h-10 text-[#00ff88]" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-white mb-2">{file.name}</h3>
                    <p className="text-white/50 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                        setResult(null);
                      }}
                      className="mt-4 px-4 py-2 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 transition-colors flex items-center gap-2 mx-auto"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <X className="w-4 h-4" />
                      Remove file
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="upload-prompt"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center"
                  >
                    <motion.div
                      className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#00f5ff]/20 to-[#b829dd]/20 flex items-center justify-center"
                      animate={{ 
                        boxShadow: [
                          '0 0 0 0 rgba(0,245,255,0)',
                          '0 0 30px 10px rgba(0,245,255,0.1)',
                          '0 0 0 0 rgba(0,245,255,0)',
                        ]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <Upload className="w-12 h-12 text-[#00f5ff]" />
                    </motion.div>
                    <h3 className="text-2xl font-semibold text-white mb-2">Drop your invoice here</h3>
                    <p className="text-white/50 mb-4">or click to browse</p>
                    <div className="flex items-center justify-center gap-4 text-sm text-white/40">
                      <span className="px-3 py-1 rounded-full bg-white/5">PDF</span>
                      <span className="px-3 py-1 rounded-full bg-white/5">PNG</span>
                      <span className="px-3 py-1 rounded-full bg-white/5">JPG</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Drag overlay */}
              <AnimatePresence>
                {isDragging && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-[#00f5ff]/10 rounded-2xl border-2 border-dashed border-[#00f5ff] flex items-center justify-center"
                  >
                    <span className="text-xl font-semibold text-[#00f5ff]">Drop to upload</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-400"
                >
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Analyze button */}
            {file && !result && (
              <motion.button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="mt-6 w-full py-4 rounded-xl bg-gradient-to-r from-[#00f5ff] to-[#b829dd] text-white font-semibold text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(0,245,255,0.3)' }}
                whileTap={{ scale: 0.98 }}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Analyzing through 5 layers...
                  </>
                ) : (
                  <>
                    <Shield className="w-6 h-6" />
                    Analyze Invoice
                  </>
                )}
              </motion.button>
            )}

            {/* Analysis progress */}
            <AnimatePresence>
              {isAnalyzing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 space-y-3"
                >
                  {['DNA Analysis', 'Physics Validation', 'Graph Analysis', 'LLM Explanation', 'PSI Check'].map((step, i) => (
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.3 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-white/5"
                    >
                      <motion.div
                        className="w-5 h-5 rounded-full border-2 border-[#00f5ff]"
                        animate={{ 
                          backgroundColor: ['transparent', '#00f5ff', '#00f5ff'],
                          scale: [1, 1.2, 1],
                        }}
                        transition={{ 
                          duration: 0.5, 
                          delay: i * 0.3 + 0.2,
                          times: [0, 0.5, 1]
                        }}
                      />
                      <span className="text-sm text-white/70">{step}</span>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-6"
                >
                  {/* Decision Banner */}
                  <motion.div
                    className="glass-card p-6 relative overflow-hidden"
                    style={{ borderColor: getDecisionColor(result.decision) }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div 
                      className="absolute inset-0 opacity-10"
                      style={{ background: `linear-gradient(135deg, ${getDecisionColor(result.decision)}, transparent)` }}
                    />
                    <div className="relative z-10 flex items-center justify-between">
                      <div>
                        <p className="text-white/60 text-sm mb-1">Decision</p>
                        <motion.h2 
                          className="text-4xl font-bold"
                          style={{ color: getDecisionColor(result.decision) }}
                          initial={{ scale: 0.5 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 200 }}
                        >
                          {result.decision}
                        </motion.h2>
                      </div>
                      <motion.div
                        className="w-20 h-20 rounded-full flex items-center justify-center"
                        style={{ 
                          background: `${getDecisionColor(result.decision)}20`,
                          border: `2px solid ${getDecisionColor(result.decision)}`,
                        }}
                        animate={{ 
                          boxShadow: [
                            `0 0 0 0 ${getDecisionColor(result.decision)}40`,
                            `0 0 20px 10px ${getDecisionColor(result.decision)}20`,
                            `0 0 0 0 ${getDecisionColor(result.decision)}40`,
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {result.decision === 'APPROVE' ? (
                          <CheckCircle className="w-10 h-10" style={{ color: getDecisionColor(result.decision) }} />
                        ) : (
                          <AlertCircle className="w-10 h-10" style={{ color: getDecisionColor(result.decision) }} />
                        )}
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Risk Score */}
                  <motion.div
                    className="glass-card p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-white/60">Risk Score</span>
                      <span className="text-2xl font-bold mono" style={{ 
                        color: result.risk_score < 30 ? '#00ff88' : result.risk_score < 70 ? '#ffcc00' : '#ff3366'
                      }}>
                        {result.risk_score}%
                      </span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ 
                          background: `linear-gradient(90deg, #00ff88 0%, #ffcc00 50%, #ff3366 100%)`,
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${result.risk_score}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-white/40">
                      <span>Low Risk</span>
                      <span>Medium</span>
                      <span>High Risk</span>
                    </div>
                  </motion.div>

                  {/* Layers Flagged */}
                  <motion.div
                    className="glass-card p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3 className="text-white/60 text-sm mb-4">Layers Analyzed</h3>
                    <div className="flex flex-wrap gap-3">
                      {['DNA', 'PHYSICS', 'GRAPH', 'LLM', 'PSI'].map((layer, i) => {
                        const isFlagged = result.layers_flagged.includes(layer);
                        return (
                          <motion.div
                            key={layer}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                              isFlagged 
                                ? 'bg-red-500/10 border-red-500/30 text-red-400' 
                                : 'bg-green-500/10 border-green-500/30 text-green-400'
                            }`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                          >
                            {layerIcons[layer]}
                            <span className="text-sm font-medium">{layer}</span>
                            {isFlagged ? (
                              <AlertCircle className="w-4 h-4" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>

                  {/* AI Explanation */}
                  <motion.div
                    className="glass-card p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Brain className="w-5 h-5 text-[#ff6b35]" />
                      <h3 className="font-semibold">AI Analysis</h3>
                    </div>
                    <p className="text-white/70 leading-relaxed">{result.explanation}</p>
                    <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-sm text-white/40">
                      <span>Confidence: {(result.confidence * 100).toFixed(0)}%</span>
                      <span>Processed in {result.processing_time_seconds}s</span>
                    </div>
                  </motion.div>

                  {/* New Analysis Button */}
                  <motion.button
                    onClick={() => {
                      setFile(null);
                      setResult(null);
                    }}
                    className="w-full py-3 rounded-xl border border-white/20 text-white/70 hover:bg-white/5 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Analyze Another Invoice
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-card p-12 flex flex-col items-center justify-center text-center h-full min-h-[400px]"
                >
                  <motion.div
                    className="w-32 h-32 mb-6 rounded-full bg-gradient-to-br from-[#00f5ff]/10 to-[#b829dd]/10 flex items-center justify-center"
                    animate={{ 
                      rotate: [0, 360],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  >
                    <Shield className="w-16 h-16 text-white/20" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-white/50 mb-2">Ready to Analyze</h3>
                  <p className="text-white/30 max-w-sm">
                    Upload an invoice to see the 5-layer fraud detection analysis with AI-powered insights
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
