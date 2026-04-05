'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileUp, File, CheckCircle, AlertCircle, Upload } from 'lucide-react';
import { uploadInvoice, analyzeInvoice } from '@/lib/api';
import { Invoice, AnalysisResult } from '@/types';
import ResultsPanel from '@/components/ResultsPanel';
import Header from '@/components/Header';
import InvoiceForm from '@/components/InvoiceForm';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [extractedData, setExtractedData] = useState<Partial<Invoice> | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsUploading(true);
    setError(null);
    setResult(null);

    try {
      const response = await uploadInvoice(selectedFile);
      if (response.extracted) {
        setExtractedData(response.extracted);
      }
    } catch (err: any) {
      console.error(err);
      setError('Failed to extract data from the invoice. You can still enter details manually.');
    } finally {
      setIsUploading(false);
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

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header apiStatus="healthy" />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Upload Invoice</h1>
          <p className="text-slate-600">
            Upload your PDF or image invoice. Our AI will extract the details and prepare it for fraud analysis.
          </p>
        </motion.div>

        {error && (
          <div className="mb-6 p-4 bg-danger-light/50 border border-danger/30 rounded-xl flex items-center gap-3 text-danger-dark">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {!extractedData && !isUploading && (
            <motion.div
              key="upload-zone"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl mx-auto"
            >
              <div className="border-2 border-dashed border-primary-300 bg-white rounded-2xl p-12 text-center hover:bg-primary-50 transition-colors shadow-sm cursor-pointer relative group">
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={handleFileChange}
                />
                <div className="flex flex-col items-center justify-center gap-4 pointer-events-none">
                  <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="w-10 h-10 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-slate-800">
                      Drag & Drop your invoice here
                    </p>
                    <p className="text-slate-500 mt-2">
                      Supports PDF, PNG, JPG files
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {isUploading && (
            <motion.div
              key="loading-zone"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-md mx-auto text-center py-16"
            >
              <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-slate-800">Extracting Invoice Data...</h3>
              <p className="text-slate-500 mt-2">Our AI is reading your document</p>
            </motion.div>
          )}

          {extractedData && !isUploading && (
            <motion.div
              key="results-zone"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              <div className="space-y-6">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-success/20 p-2 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">Extraction Complete</h4>
                      <p className="text-xs text-slate-500">{file?.name}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setExtractedData(null);
                      setFile(null);
                      setResult(null);
                    }}
                    className="text-sm font-medium text-slate-500 hover:text-slate-700 underline"
                  >
                    Upload Another
                  </button>
                </div>

                <InvoiceForm
                  onSubmit={handleAnalyze}
                  isLoading={isLoading}
                  hideUpload={true}
                  initialData={extractedData || undefined}
                />
              </div>

              <div>
                <ResultsPanel result={result} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
