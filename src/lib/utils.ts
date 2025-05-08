
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number as currency (INR)
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}


export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

export function getActiveFilterCount(filters: {
  search: string;
  priceRange: [number, number];
  stockStatus: 'all' | 'in-stock' | 'out-of-stock';
  categories: string[];
  subcategories: string[];
}, defaultPriceRange: [number, number]): number {
  let count = 0;
  
  if (filters.search.trim()) count++;
  if (filters.stockStatus !== 'all') count++;
  if (filters.priceRange[0] !== defaultPriceRange[0] || 
      filters.priceRange[1] !== defaultPriceRange[1]) count++;
  
  // Categories and subcategories might overlap, so we count them separately
  count += filters.categories.length;
  
  // Only count subcategories that don't belong to selected categories
  const subcategoriesCount = filters.subcategories.length;
  if (subcategoriesCount > 0) count += subcategoriesCount;
  
  return count;
}
