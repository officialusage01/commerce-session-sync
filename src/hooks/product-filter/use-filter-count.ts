
import { useMemo } from 'react';
import { ProductFilters } from '@/components/filters/types';

/**
 * Hook to calculate the number of active filters
 */
export function useFilterCount(filters: ProductFilters, minPrice: number, maxPrice: number): number {
  return useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.priceRange[0] > minPrice || filters.priceRange[1] < maxPrice) count++;
    if (filters.stockStatus !== 'all') count++;
    count += filters.categories.length;
    count += filters.subcategories.length;
    return count;
  }, [filters, minPrice, maxPrice]);
}
