
import { useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FilterOptions } from '@/components/filters/types';

export function useUrlParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse filter values from URL
  const getFiltersFromUrl = useCallback((): FilterOptions => {
    const search = searchParams.get('search') || '';
    const minPrice = Number(searchParams.get('minPrice') || 0);
    const maxPrice = Number(searchParams.get('maxPrice') || 10000);
    const stockStatus = (searchParams.get('stock') || 'all') as 'all' | 'in-stock' | 'out-of-stock';
    const categories = searchParams.get('categories')?.split(',').filter(Boolean) || [];
    const subcategories = searchParams.get('subcategories')?.split(',').filter(Boolean) || [];

    return {
      search,
      priceRange: [minPrice, maxPrice] as [number, number],
      stockStatus,
      categories,
      subcategories
    };
  }, [searchParams]);

  // Update URL with filter values
  const setFiltersToUrl = useCallback((filters: FilterOptions) => {
    const params: Record<string, string> = {};
    
    // Only add parameters that have values
    if (filters.search) params.search = filters.search;
    if (filters.priceRange[0] > 0) params.minPrice = filters.priceRange[0].toString();
    if (filters.priceRange[1] < 10000) params.maxPrice = filters.priceRange[1].toString();
    if (filters.stockStatus !== 'all') params.stock = filters.stockStatus;
    if (filters.categories.length > 0) params.categories = filters.categories.join(',');
    if (filters.subcategories.length > 0) params.subcategories = filters.subcategories.join(',');
    
    setSearchParams(params, { replace: true });
  }, [setSearchParams]);

  return {
    getFiltersFromUrl,
    setFiltersToUrl
  };
}
