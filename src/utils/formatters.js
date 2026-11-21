import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number to Indian Rupees (INR)
 * e.g. 15000000 -> ₹1.50 Cr or standard comma notation
 */
export function formatINR(amount, options = { compact: false }) {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  
  if (options.compact) {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} Lac`;
    }
    if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}k`;
    }
  }

  // Indian number comma format
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats area in sq.ft
 */
export function formatArea(sqft) {
  if (!sqft) return '0 sq.ft';
  return `${new Intl.NumberFormat('en-IN').format(sqft)} sq.ft`;
}

/**
 * Formats rate per sq.ft
 */
export function formatRate(rate) {
  if (!rate) return '₹0 / sq.ft';
  return `₹${new Intl.NumberFormat('en-IN').format(Math.round(rate))} / sq.ft`;
}

/**
 * Debounce helper
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
