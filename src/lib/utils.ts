
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { FilterOptions } from "@/components/filters/types";

/**
 * Utility function to merge className values
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculates the active filter count based on filter values
 */
export function getActiveFilterCount(
  filters: FilterOptions,
  defaultPriceRange: [number, number] = [0, 10000]
): number {
  let count = 0;
  if (filters.search?.trim()) count++;
  if (filters.stockStatus !== 'all') count++;
  if (filters.categories?.length > 0) count++;
  if (filters.subcategories?.length > 0) count++;
  
  // Price range is active if it differs from default
  if (
    (filters.priceRange?.[0] !== defaultPriceRange[0] || 
     filters.priceRange?.[1] !== defaultPriceRange[1]) &&
    filters.priceRange?.[0] !== undefined &&
    filters.priceRange?.[1] !== undefined
  ) {
    count++;
  }
  
  return count;
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
