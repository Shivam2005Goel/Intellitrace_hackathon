'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Invoice } from '@/types';
import { 
  Send, 
  RotateCcw, 
  AlertCircle,
  Ship,
  Plane,
  Truck,
  TrainFront,
  Beaker,
  CheckCircle,
  FileUp,
  Upload
} from 'lucide-react';
import axios from 'axios';

interface InvoiceFormProps {
  onSubmit: (invoice: Invoice) => void;
  onTestFraud?: () => void;
  onTestLegitimate?: () => void;
  isLoading: boolean;
  hideUpload?: boolean;
  initialData?: Partial<Invoice>;
}

const initialFormData: Invoice = {
  id: '',
  supplier: '',
  supplier_id: '',
  buyer: '',
  buyer_id: '',
  amount: 0,
  items: [],
  origin: '',
  destination: '',
  transport_mode: 'sea',
  claimed_days: 0,
  quantity: 0,
  dates: {
    po_date: '',
    grn_date: '',
    invoice_date: '',
    finance_request_date: '',
  },
};

const cities = [
  'shanghai', 'rotterdam', 'mumbai', 'delhi', 'singapore', 'hongkong',
  'tokyo', 'sydney', 'dubai', 'hamburg', 'losangeles', 'newyork',
  'london', 'busan', 'qingdao', 'guangzhou', 'antwerp', 'barcelona'
];

export default function InvoiceForm({ onSubmit, onTestFraud, onTestLegitimate, isLoading, hideUpload, initialData }: InvoiceFormProps) {
  const [formData, setFormData] = useState<Invoice>(initialData ? { ...initialFormData, ...initialData, dates: { ...initialFormData.dates, ...initialData.dates } } as Invoice : initialFormData);
  const [itemsInput, setItemsInput] = useState(initialData?.items?.join(', ') || '');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formPayload = new FormData();
    formPayload.append('file', file);

    try {
      // Assuming backend is running on localhost:8000
      const response = await axios.post('http://localhost:8000/analyze/upload', formPayload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const data = response.data.extracted;
      if (data) {
        setFormData(prev => ({
          ...prev,
          ...data,
          dates: { ...prev.dates, ...data.dates }
        }));
        if (data.items && data.items.length > 0) {
          setItemsInput(data.items.join(', '));
        }
      }
    } catch (error) {
      console.error('File upload failed:', error);
      alert('Failed to parse file. Please enter details manually.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const invoice: Invoice = {
      ...formData,
      id: formData.id || `INV-${Date.now()}`,
      items: itemsInput.split(',').map(i => i.trim()).filter(Boolean),
    };
    onSubmit(invoice);
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setItemsInput('');
  };

  const updateField = (field: keyof Invoice, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateDate = (field: keyof Invoice['dates'], value: string) => {
    setFormData(prev => ({
      ...prev,
      dates: { ...prev.dates, [field]: value }
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden"
    >
      <div className="bg-gradient-to-r from-primary-600 to-primary-500 p-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Send className="w-5 h-5" />
          Submit Invoice for Analysis
        </h2>
        <p className="text-primary-100 text-sm mt-1">
          Enter invoice details to run through all 5 detection layers
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        
        {/* File Upload Zone */}
        {!hideUpload && (
          <div className="border-2 border-dashed border-primary-200 bg-primary-50 rounded-xl p-6 text-center hover:bg-primary-100 transition-colors cursor-pointer relative">
            <input 
              type="file" 
              accept=".pdf,.png,.jpg,.jpeg" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              onChange={handleFileUpload}
              disabled={isUploading || isLoading}
            />
            <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
              {isUploading ? (
                 <div className="w-8 h-8 border-4 border-primary-300 border-t-primary-600 rounded-full animate-spin" />
              ) : (
                 <FileUp className="w-8 h-8 text-primary-500" />
              )}
              <p className="text-sm font-medium text-primary-700">
                {isUploading ? "Extracting text with AI..." : "Drag & Drop Invoice File (PDF, Image)"}
              </p>
              <p className="text-xs text-primary-500">
                Auto-fills the form below using Layer 0 Ingestion
              </p>
            </div>
          </div>
        )}

        {/* Invoice ID */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Invoice ID
          </label>
          <input
            type="text"
            value={formData.id}
            onChange={(e) => updateField('id', e.target.value)}
            placeholder="INV-001 (auto-generated if empty)"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
          />
        </div>

        {/* Supplier & Buyer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Supplier Name *
            </label>
            <input
              type="text"
              required
              value={formData.supplier}
              onChange={(e) => updateField('supplier', e.target.value)}
              placeholder="e.g., Shanghai Steel Co"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-ellipsis"
              title={formData.supplier}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Supplier ID *
            </label>
            <input
              type="text"
              required
              value={formData.supplier_id}
              onChange={(e) => updateField('supplier_id', e.target.value)}
              placeholder="e.g., SUP001"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Buyer Name *
            </label>
            <input
              type="text"
              required
              value={formData.buyer}
              onChange={(e) => updateField('buyer', e.target.value)}
              placeholder="e.g., Rotterdam Imports"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-ellipsis"
              title={formData.buyer}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Amount (USD) *
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.amount || ''}
              onChange={(e) => updateField('amount', parseFloat(e.target.value))}
              placeholder="0.00"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Items */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Items (comma-separated)
          </label>
          <input
            type="text"
            value={itemsInput}
            onChange={(e) => setItemsInput(e.target.value)}
            placeholder="e.g., steel coils, iron plates"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-ellipsis"
            title={itemsInput}
          />
        </div>

        {/* Route */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Origin City *
            </label>
            <select
              required
              value={formData.origin}
              onChange={(e) => updateField('origin', e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
            >
              <option value="">Select origin</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Destination City *
            </label>
            <select
              required
              value={formData.destination}
              onChange={(e) => updateField('destination', e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
            >
              <option value="">Select destination</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Transport Mode *
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: 'sea', icon: Ship },
                { value: 'air', icon: Plane },
                { value: 'road', icon: Truck },
                { value: 'rail', icon: TrainFront },
              ].map(({ value, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => updateField('transport_mode', value)}
                  className={`p-2 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${
                    formData.transport_mode === value
                      ? 'border-primary-500 bg-primary-50 text-primary-600'
                      : 'border-slate-200 hover:border-slate-300 text-slate-500'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs capitalize">{value}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Delivery & Quantity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Claimed Delivery Days *
            </label>
            <input
              type="number"
              required
              min="0.1"
              step="0.1"
              value={formData.claimed_days || ''}
              onChange={(e) => updateField('claimed_days', parseFloat(e.target.value))}
              placeholder="e.g., 20"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Quantity (tons) *
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.quantity || ''}
              onChange={(e) => updateField('quantity', parseFloat(e.target.value))}
              placeholder="e.g., 100"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Dates */}
        <div className="bg-slate-50 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Timeline Dates
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">PO Date</label>
              <input
                type="date"
                value={formData.dates.po_date}
                onChange={(e) => updateDate('po_date', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Invoice Date</label>
              <input
                type="date"
                value={formData.dates.invoice_date}
                onChange={(e) => updateDate('invoice_date', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Finance Request Date</label>
              <input
                type="date"
                value={formData.dates.finance_request_date}
                onChange={(e) => updateDate('finance_request_date', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">GRN Date</label>
              <input
                type="date"
                value={formData.dates.grn_date}
                onChange={(e) => updateDate('grn_date', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Analyze Invoice
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>
        </div>

        {/* Test Buttons */}
        <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-200">
          <button
            type="button"
            onClick={onTestFraud}
            disabled={isLoading}
            className="flex-1 bg-danger/10 text-danger border border-danger/30 py-2 px-4 rounded-lg font-medium hover:bg-danger/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <Beaker className="w-4 h-4" />
            Test Fraud
          </button>
          
          <button
            type="button"
            onClick={onTestLegitimate}
            disabled={isLoading}
            className="flex-1 bg-success/10 text-success border border-success/30 py-2 px-4 rounded-lg font-medium hover:bg-success/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Test Legitimate
          </button>
        </div>
      </form>
    </motion.div>
  );
}
