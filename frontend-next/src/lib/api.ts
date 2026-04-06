import { AnalysisResult, HealthResponse, Invoice } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const isFormData = typeof FormData !== 'undefined' && init.body instanceof FormData;
  const headers = new Headers(init.headers || {});

  if (!isFormData && init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    const detail =
      typeof payload === 'object' && payload !== null && 'detail' in payload
        ? String((payload as { detail?: string }).detail)
        : `Request failed with status ${response.status}`;

    const error: any = new Error(detail);
    error.response = { data: payload };
    error.status = response.status;
    throw error;
  }

  return payload as T;
}

export const healthCheck = async (): Promise<HealthResponse> => apiRequest('/health');

export const analyzeInvoice = async (invoice: Invoice): Promise<AnalysisResult> =>
  apiRequest('/analyze', {
    method: 'POST',
    body: JSON.stringify(invoice),
  });

export const testFraud = async (): Promise<{ test_invoice: Invoice; analysis_result: AnalysisResult; test_passed: boolean }> =>
  apiRequest('/test/fraud', { method: 'POST' });

export const testPhantomCascade = async (): Promise<{ scenario: string; test_invoice: Invoice; analysis_result: AnalysisResult; test_passed: boolean }> =>
  apiRequest('/test/phantom-cascade', { method: 'POST' });

export const testLegitimate = async (): Promise<{ test_invoice: Invoice; analysis_result: AnalysisResult; test_passed: boolean }> =>
  apiRequest('/test/legitimate', { method: 'POST' });

export const getCities = async (): Promise<{ cities: string[]; count: number }> => apiRequest('/cities');

export const uploadInvoice = async (file: File): Promise<{ extracted: Partial<Invoice> }> => {
  const formData = new FormData();
  formData.append('file', file);

  return apiRequest('/analyze/upload', {
    method: 'POST',
    body: formData,
  });
};
