import axios from 'axios';
import { Invoice, AnalysisResult, HealthResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

export const healthCheck = async (): Promise<HealthResponse> => {
  const response = await api.get('/health');
  return response.data;
};

export const analyzeInvoice = async (invoice: Invoice): Promise<AnalysisResult> => {
  const response = await api.post('/analyze', invoice);
  return response.data;
};

export const testFraud = async (): Promise<{ test_invoice: Invoice; analysis_result: AnalysisResult; test_passed: boolean }> => {
  const response = await api.post('/test/fraud');
  return response.data;
};

export const testLegitimate = async (): Promise<{ test_invoice: Invoice; analysis_result: AnalysisResult; test_passed: boolean }> => {
  const response = await api.post('/test/legitimate');
  return response.data;
};

export const getCities = async (): Promise<{ cities: string[]; count: number }> => {
  const response = await api.get('/cities');
  return response.data;
};

export const uploadInvoice = async (file: File): Promise<{ extracted: Partial<Invoice> }> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/analyze/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export default api;
