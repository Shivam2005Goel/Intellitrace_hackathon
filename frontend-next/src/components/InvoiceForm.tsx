'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Invoice } from '@/types';
import { uploadInvoice } from '@/lib/api';
import {
  Beaker,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  DatabaseZap,
  Factory,
  FileUp,
  PackageCheck,
  Plane,
  RotateCcw,
  Send,
  Ship,
  Sparkles,
  TrainFront,
  Truck,
  WalletCards,
} from 'lucide-react';

interface InvoiceFormProps {
  onSubmit: (invoice: Invoice) => void;
  onTestFraud?: () => void;
  onPhantomCascade?: () => void;
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
  lender_id: 'bank_main',
  tier_level: 1,
  erp_records: {},
  related_invoices: [],
  cash_flow: {},
  supplier_profile: {},
};

const cities = [
  'shanghai', 'rotterdam', 'mumbai', 'delhi', 'singapore', 'hongkong',
  'tokyo', 'sydney', 'dubai', 'hamburg', 'losangeles', 'newyork',
  'london', 'busan', 'qingdao', 'guangzhou', 'antwerp', 'barcelona',
];

function mergeFormData(seed?: Partial<Invoice>): Invoice {
  return {
    ...initialFormData,
    ...seed,
    items: [...(seed?.items || [])],
    dates: {
      ...initialFormData.dates,
      ...(seed?.dates || {}),
    },
    erp_records: {
      ...initialFormData.erp_records,
      ...(seed?.erp_records || {}),
    },
    related_invoices: [...(seed?.related_invoices || [])],
    cash_flow: {
      ...initialFormData.cash_flow,
      ...(seed?.cash_flow || {}),
    },
    supplier_profile: {
      ...initialFormData.supplier_profile,
      ...(seed?.supplier_profile || {}),
    },
  };
}

function parseRequiredNumber(value: string) {
  return value === '' ? 0 : Number(value);
}

function parseOptionalNumber(value: string) {
  return value === '' ? undefined : Number(value);
}

export default function InvoiceForm({
  onSubmit,
  onTestFraud,
  onPhantomCascade,
  onTestLegitimate,
  isLoading,
  hideUpload,
  initialData,
}: InvoiceFormProps) {
  const [formData, setFormData] = useState<Invoice>(mergeFormData(initialData));
  const [itemsInput, setItemsInput] = useState(initialData?.items?.join(', ') || '');
  const [isUploading, setIsUploading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(
    Boolean(
      initialData?.erp_records ||
      initialData?.cash_flow ||
      initialData?.supplier_profile ||
      initialData?.related_invoices?.length,
    ),
  );

  useEffect(() => {
    if (!initialData) {
      return;
    }

    setFormData(mergeFormData(initialData));
    setItemsInput(initialData.items?.join(', ') || '');
    setShowAdvanced(
      Boolean(
        initialData.erp_records ||
        initialData.cash_flow ||
        initialData.supplier_profile ||
        initialData.related_invoices?.length,
      ),
    );
  }, [initialData]);

  const inputClass =
    'w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent-cyan)] focus:bg-white/[0.07]';

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const response = await uploadInvoice(file);
      const data = response.extracted;
      if (data) {
        setFormData(mergeFormData({
          ...formData,
          ...data,
          dates: { ...formData.dates, ...(data.dates || {}) },
          erp_records: { ...(formData.erp_records || {}), ...(data.erp_records || {}) },
          cash_flow: { ...(formData.cash_flow || {}), ...(data.cash_flow || {}) },
          supplier_profile: { ...(formData.supplier_profile || {}), ...(data.supplier_profile || {}) },
        }));
        if (data.items && data.items.length > 0) {
          setItemsInput(data.items.join(', '));
        }
      }
    } catch (error) {
      console.error('File upload failed:', error);
      alert('Document parsing failed. You can continue by entering the trade details manually.');
    } finally {
      setIsUploading(false);
    }
  };

  const updateField = (field: keyof Invoice, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateDate = (field: keyof Invoice['dates'], value: string) => {
    setFormData((prev) => ({
      ...prev,
      dates: { ...prev.dates, [field]: value },
    }));
  };

  const updateERP = (record: 'po' | 'grn' | 'delivery', field: 'amount' | 'quantity' | 'status' | 'id', value: string | number | undefined) => {
    setFormData((prev) => ({
      ...prev,
      erp_records: {
        ...(prev.erp_records || {}),
        [record]: {
          ...(prev.erp_records?.[record] || {}),
          [field]: value,
        },
      },
    }));
  };

  const updateCashFlow = (field: keyof NonNullable<Invoice['cash_flow']>, value: number | undefined) => {
    setFormData((prev) => ({
      ...prev,
      cash_flow: {
        ...(prev.cash_flow || {}),
        [field]: value,
      },
    }));
  };

  const updateSupplierProfile = (field: keyof NonNullable<Invoice['supplier_profile']>, value: number | undefined) => {
    setFormData((prev) => ({
      ...prev,
      supplier_profile: {
        ...(prev.supplier_profile || {}),
        [field]: value,
      },
    }));
  };

  const attachCascadeChain = () => {
    const invoiceDate = formData.dates.invoice_date || '2026-04-01';
    const financeDate = formData.dates.finance_request_date || invoiceDate;
    const baseAmount = formData.amount || 1000000;

    setFormData((prev) => ({
      ...prev,
      related_invoices: [
        {
          id: `${prev.id || 'INV'}-T3`,
          tier_level: Math.min((prev.tier_level || 1) + 1, 3),
          supplier_id: `${prev.supplier_id || 'SUP'}_RAW`,
          buyer_id: prev.supplier_id || 'SUP_MID',
          amount: Math.round(baseAmount * 0.64),
          lender_id: 'bank_delta',
          invoice_date: invoiceDate,
          finance_request_date: financeDate,
        },
        {
          id: `${prev.id || 'INV'}-T1`,
          tier_level: Math.max((prev.tier_level || 1) - 1, 1),
          supplier_id: prev.supplier_id || 'SUP_MID',
          buyer_id: prev.buyer_id || 'BUYER_TOP',
          amount: Math.round(baseAmount * 0.98),
          lender_id: 'bank_theta',
          invoice_date: invoiceDate,
          finance_request_date: financeDate,
        },
      ],
    }));
  };

  const clearCascadeChain = () => {
    setFormData((prev) => ({ ...prev, related_invoices: [] }));
  };

  const handleReset = () => {
    setFormData(mergeFormData());
    setItemsInput('');
    setShowAdvanced(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const invoice: Invoice = {
      ...formData,
      id: formData.id || `INV-${Date.now()}`,
      items: itemsInput.split(',').map((item) => item.trim()).filter(Boolean),
      cash_flow: {
        ...(formData.cash_flow || {}),
        expected_amount: formData.cash_flow?.expected_amount || formData.amount,
      },
    };

    onSubmit(invoice);
  };

  const transportOptions = [
    { value: 'sea' as const, icon: Ship, label: 'Sea' },
    { value: 'air' as const, icon: Plane, label: 'Air' },
    { value: 'road' as const, icon: Truck, label: 'Road' },
    { value: 'rail' as const, icon: TrainFront, label: 'Rail' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      className="surface h-full overflow-hidden"
    >
      <div className="border-b border-white/10 px-6 py-6">
        <div className="eyebrow">
          <Sparkles className="h-4 w-4" />
          Analyst Workbench
        </div>
        <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-white">Create or enrich an invoice case</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
          Combine invoice metadata with ERP evidence, collections signals, and supplier feasibility inputs to unlock the full
          SCF intelligence layer.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex max-h-[calc(100vh-15rem)] flex-col gap-6 overflow-y-auto p-6 custom-scrollbar">
        {!hideUpload && (
          <label className="surface-muted relative block cursor-pointer overflow-hidden border border-dashed border-[rgba(78,203,255,0.28)] p-5 transition hover:border-[rgba(78,203,255,0.42)] hover:bg-white/[0.05]">
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              onChange={handleFileUpload}
              disabled={isUploading || isLoading}
            />
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-[rgba(78,203,255,0.12)] p-3">
                {isUploading ? (
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-[var(--accent-cyan)]" />
                ) : (
                  <FileUp className="h-6 w-6 text-[var(--accent-cyan)]" />
                )}
              </div>
              <div>
                <div className="text-sm font-semibold text-white">
                  {isUploading ? 'Extracting trade data from document...' : 'Upload invoice or supporting document'}
                </div>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  Parse PDFs or images to pre-fill the workbench before running analysis.
                </p>
              </div>
            </div>
          </label>
        )}

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="section-kicker">Core Transaction</div>
              <h3 className="mt-1 text-lg font-bold text-white">Invoice and counterparty details</h3>
            </div>
            <div className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">
              Manual or file-assisted
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="section-kicker mb-2 block">Invoice ID</label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => updateField('id', e.target.value)}
                placeholder="Auto-generated if blank"
                className={inputClass}
              />
            </div>
            <div>
              <label className="section-kicker mb-2 block">Invoice amount (USD)</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.amount || ''}
                onChange={(e) => updateField('amount', parseRequiredNumber(e.target.value))}
                placeholder="0.00"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="section-kicker mb-2 block">Supplier name</label>
              <input
                type="text"
                required
                value={formData.supplier}
                onChange={(e) => updateField('supplier', e.target.value)}
                placeholder="Tier supplier entity"
                className={inputClass}
              />
            </div>
            <div>
              <label className="section-kicker mb-2 block">Supplier ID</label>
              <input
                type="text"
                required
                value={formData.supplier_id}
                onChange={(e) => updateField('supplier_id', e.target.value)}
                placeholder="SUP-001"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="section-kicker mb-2 block">Buyer name</label>
              <input
                type="text"
                required
                value={formData.buyer}
                onChange={(e) => updateField('buyer', e.target.value)}
                placeholder="Anchor buyer entity"
                className={inputClass}
              />
            </div>
            <div>
              <label className="section-kicker mb-2 block">Buyer ID</label>
              <input
                type="text"
                value={formData.buyer_id || ''}
                onChange={(e) => updateField('buyer_id', e.target.value)}
                placeholder="BUY-001"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="section-kicker mb-2 block">Invoice items</label>
            <textarea
              value={itemsInput}
              onChange={(e) => setItemsInput(e.target.value)}
              rows={3}
              placeholder="IC chipsets, steel coils, packaging film"
              className={`${inputClass} resize-none`}
            />
          </div>
        </section>

        <section className="space-y-4">
          <div className="section-kicker">Trade Route</div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="section-kicker mb-2 block">Origin</label>
              <select
                required
                value={formData.origin}
                onChange={(e) => updateField('origin', e.target.value)}
                className={`${inputClass} bg-[var(--bg-secondary)]`}
              >
                <option value="">Select origin</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="section-kicker mb-2 block">Destination</label>
              <select
                required
                value={formData.destination}
                onChange={(e) => updateField('destination', e.target.value)}
                className={`${inputClass} bg-[var(--bg-secondary)]`}
              >
                <option value="">Select destination</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="section-kicker mb-2 block">Transit claim (days)</label>
              <input
                type="number"
                required
                min="0"
                step="0.1"
                value={formData.claimed_days || ''}
                onChange={(e) => updateField('claimed_days', parseRequiredNumber(e.target.value))}
                placeholder="e.g. 5"
                className={inputClass}
              />
            </div>
            <div>
              <label className="section-kicker mb-2 block">Quantity</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.quantity || ''}
                onChange={(e) => updateField('quantity', parseRequiredNumber(e.target.value))}
                placeholder="e.g. 120"
                className={inputClass}
              />
            </div>
            <div>
              <label className="section-kicker mb-2 block">Tier / lender</label>
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={formData.tier_level || 1}
                  onChange={(e) => updateField('tier_level', Number(e.target.value))}
                  className={`${inputClass} bg-[var(--bg-secondary)]`}
                >
                  <option value={1}>Tier 1</option>
                  <option value={2}>Tier 2</option>
                  <option value={3}>Tier 3</option>
                  <option value={4}>Tier 4</option>
                </select>
                <input
                  type="text"
                  value={formData.lender_id || ''}
                  onChange={(e) => updateField('lender_id', e.target.value)}
                  placeholder="bank_main"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="section-kicker mb-2 block">Transport mode</label>
            <div className="grid grid-cols-4 gap-3">
              {transportOptions.map(({ value, icon: Icon, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => updateField('transport_mode', value)}
                  className={`rounded-2xl border px-3 py-3 transition ${
                    formData.transport_mode === value
                      ? 'border-[rgba(78,203,255,0.35)] bg-[rgba(78,203,255,0.12)] text-white'
                      : 'border-white/10 bg-white/[0.03] text-[var(--text-secondary)] hover:border-white/20'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Icon className="h-5 w-5" />
                    <span className="text-xs font-semibold uppercase tracking-[0.18em]">{label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="surface-muted p-5">
          <div className="mb-4 flex items-center gap-2">
            <PackageCheck className="h-4 w-4 text-[var(--accent-cyan)]" />
            <div className="section-kicker">Timeline Integrity</div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="section-kicker mb-2 block">PO date</label>
              <input
                type="date"
                value={formData.dates.po_date}
                onChange={(e) => updateDate('po_date', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="section-kicker mb-2 block">Invoice date</label>
              <input
                type="date"
                value={formData.dates.invoice_date}
                onChange={(e) => updateDate('invoice_date', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="section-kicker mb-2 block">Finance request date</label>
              <input
                type="date"
                value={formData.dates.finance_request_date}
                onChange={(e) => updateDate('finance_request_date', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="section-kicker mb-2 block">GRN date</label>
              <input
                type="date"
                value={formData.dates.grn_date}
                onChange={(e) => updateDate('grn_date', e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </section>

        <section className="surface-muted p-5">
          <button
            type="button"
            onClick={() => setShowAdvanced((prev) => !prev)}
            className="flex w-full items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[rgba(78,203,255,0.12)] p-2">
                <DatabaseZap className="h-4 w-4 text-[var(--accent-cyan)]" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-white">Advanced SCF evidence inputs</div>
                <div className="text-sm text-[var(--text-secondary)]">
                  ERP reconciliation, dilution, feasibility, and cross-tier chain details
                </div>
              </div>
            </div>
            {showAdvanced ? <ChevronUp className="h-4 w-4 text-[var(--text-secondary)]" /> : <ChevronDown className="h-4 w-4 text-[var(--text-secondary)]" />}
          </button>

          {showAdvanced && (
            <div className="mt-5 space-y-5">
              <div className="grid gap-5 xl:grid-cols-3">
                <div className="rounded-2xl border border-white/8 bg-black/15 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <DatabaseZap className="h-4 w-4 text-[var(--accent-cyan)]" />
                    <div className="section-kicker">ERP Evidence</div>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="number"
                      value={formData.erp_records?.po?.amount || ''}
                      onChange={(e) => updateERP('po', 'amount', parseOptionalNumber(e.target.value))}
                      placeholder="PO amount"
                      className={inputClass}
                    />
                    <input
                      type="number"
                      value={formData.erp_records?.po?.quantity || ''}
                      onChange={(e) => updateERP('po', 'quantity', parseOptionalNumber(e.target.value))}
                      placeholder="PO quantity"
                      className={inputClass}
                    />
                    <input
                      type="number"
                      value={formData.erp_records?.grn?.quantity || ''}
                      onChange={(e) => updateERP('grn', 'quantity', parseOptionalNumber(e.target.value))}
                      placeholder="GRN quantity"
                      className={inputClass}
                    />
                    <input
                      type="number"
                      value={formData.erp_records?.delivery?.quantity || ''}
                      onChange={(e) => updateERP('delivery', 'quantity', parseOptionalNumber(e.target.value))}
                      placeholder="Delivery quantity"
                      className={inputClass}
                    />
                    <select
                      value={formData.erp_records?.delivery?.status || ''}
                      onChange={(e) => updateERP('delivery', 'status', e.target.value)}
                      className={`${inputClass} bg-[var(--bg-secondary)]`}
                    >
                      <option value="">Delivery status</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="partial">Partial</option>
                      <option value="in-transit">In transit</option>
                      <option value="missing">Missing</option>
                    </select>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/8 bg-black/15 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <WalletCards className="h-4 w-4 text-[var(--accent-orange)]" />
                    <div className="section-kicker">Collections / Dilution</div>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="number"
                      value={formData.cash_flow?.collected_amount || ''}
                      onChange={(e) => updateCashFlow('collected_amount', parseOptionalNumber(e.target.value))}
                      placeholder="Collected amount"
                      className={inputClass}
                    />
                    <input
                      type="number"
                      value={formData.cash_flow?.overdue_days || ''}
                      onChange={(e) => updateCashFlow('overdue_days', parseOptionalNumber(e.target.value))}
                      placeholder="Overdue days"
                      className={inputClass}
                    />
                    <input
                      type="number"
                      step="0.01"
                      value={formData.cash_flow?.returns_ratio || ''}
                      onChange={(e) => updateCashFlow('returns_ratio', parseOptionalNumber(e.target.value))}
                      placeholder="Returns ratio (0-1)"
                      className={inputClass}
                    />
                    <input
                      type="number"
                      step="0.01"
                      value={formData.cash_flow?.credit_notes_ratio || ''}
                      onChange={(e) => updateCashFlow('credit_notes_ratio', parseOptionalNumber(e.target.value))}
                      placeholder="Credit notes ratio (0-1)"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-white/8 bg-black/15 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Factory className="h-4 w-4 text-[var(--accent-green)]" />
                    <div className="section-kicker">Supplier Feasibility</div>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="number"
                      value={formData.supplier_profile?.monthly_revenue || ''}
                      onChange={(e) => updateSupplierProfile('monthly_revenue', parseOptionalNumber(e.target.value))}
                      placeholder="Monthly revenue"
                      className={inputClass}
                    />
                    <input
                      type="number"
                      value={formData.supplier_profile?.current_month_financed_volume || ''}
                      onChange={(e) => updateSupplierProfile('current_month_financed_volume', parseOptionalNumber(e.target.value))}
                      placeholder="Current financed volume"
                      className={inputClass}
                    />
                    <input
                      type="number"
                      value={formData.supplier_profile?.employee_count || ''}
                      onChange={(e) => updateSupplierProfile('employee_count', parseOptionalNumber(e.target.value))}
                      placeholder="Employee count"
                      className={inputClass}
                    />
                    <input
                      type="number"
                      value={formData.supplier_profile?.facility_count || ''}
                      onChange={(e) => updateSupplierProfile('facility_count', parseOptionalNumber(e.target.value))}
                      placeholder="Facility count"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/8 bg-black/15 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="section-kicker">Cross-Tier Cascade Chain</div>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">
                      Attach related invoices to simulate repeated financing across lenders and tiers.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button type="button" onClick={attachCascadeChain} className="button-subtle text-sm">
                      Attach chain
                    </button>
                    <button type="button" onClick={clearCascadeChain} className="button-subtle text-sm">
                      Clear chain
                    </button>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-[rgba(78,203,255,0.14)] bg-[rgba(78,203,255,0.05)] px-4 py-3 text-sm text-[var(--text-secondary)]">
                  {formData.related_invoices?.length
                    ? `${formData.related_invoices.length} linked invoices attached for cascade correlation.`
                    : 'No related invoices attached yet.'}
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="space-y-4 border-t border-white/10 pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="button-main w-full text-sm disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/25 border-t-white" />
                Running analysis
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Analyze invoice
              </>
            )}
          </button>

          <div className="grid gap-3 sm:grid-cols-[1fr,auto]">
            <div className="grid gap-3 sm:grid-cols-3">
              <button
                type="button"
                onClick={onPhantomCascade}
                disabled={isLoading}
                className="button-subtle text-sm disabled:opacity-60"
              >
                <FileUp className="h-4 w-4" />
                Phantom demo
              </button>
              <button
                type="button"
                onClick={onTestFraud}
                disabled={isLoading}
                className="button-subtle text-sm disabled:opacity-60"
              >
                <Beaker className="h-4 w-4" />
                Fraud demo
              </button>
              <button
                type="button"
                onClick={onTestLegitimate}
                disabled={isLoading}
                className="button-subtle text-sm disabled:opacity-60"
              >
                <CheckCircle2 className="h-4 w-4" />
                Healthy demo
              </button>
            </div>
            <button type="button" onClick={handleReset} className="button-subtle text-sm">
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          </div>
        </section>
      </form>
    </motion.div>
  );
}
