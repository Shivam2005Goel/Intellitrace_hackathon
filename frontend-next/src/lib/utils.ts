import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number, decimals = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

export function getDecisionColor(decision: 'APPROVE' | 'HOLD' | 'BLOCK'): string {
  switch (decision) {
    case 'APPROVE':
      return 'bg-success text-white';
    case 'HOLD':
      return 'bg-warning text-white';
    case 'BLOCK':
      return 'bg-danger text-white';
    default:
      return 'bg-gray-500 text-white';
  }
}

export function getDecisionBorderColor(decision: 'APPROVE' | 'HOLD' | 'BLOCK'): string {
  switch (decision) {
    case 'APPROVE':
      return 'border-success';
    case 'HOLD':
      return 'border-warning';
    case 'BLOCK':
      return 'border-danger';
    default:
      return 'border-gray-500';
  }
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'CRITICAL':
      return 'text-danger';
    case 'HIGH':
      return 'text-orange-600';
    case 'MEDIUM':
      return 'text-warning';
    case 'LOW':
      return 'text-yellow-500';
    default:
      return 'text-success';
  }
}

export function getRiskColor(score: number): string {
  if (score >= 70) return 'text-danger';
  if (score >= 40) return 'text-warning';
  if (score >= 20) return 'text-yellow-500';
  return 'text-success';
}
