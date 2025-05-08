
import { useState, useCallback, useEffect, useMemo } from 'react';
import { Product } from '@/lib/supabase/types';
import { ProductFilters } from '@/components/filters/types';
import { useSessionStorage } from '@/hooks/use-session-storage';
import { usePriceRange } from './use-price-range';
import { useFilterCount } from './use-filter-count';
import { useFilterProducts } from './use-filter-products';
import { usePagination } from './use-pagination';

interface ProductFilterResult {
  filters: ProductFilters & { filterCount: number };
  setFilters: React.Dispatch<React.SetStateAction<ProductFilters>>;
  updatePriceRange: (range: [number, number]) => void;
  filteredProducts: Product[];
  paginatedProducts: Product[];
  maxPrice: number;
  minPrice: number;
  priceRange: [number, number];
  filterCount: number;
  resetFilters: () => void;
  loading: boolean;
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    setCurrentPage: (page: number) => void;
    setPageSize: (size: number) => void;
  };
}

/**
 * Main product filter hook that composes other specialized hooks
 */
export function useProductFilter(
  products: Product[], 
  initialFilters?: Partial<ProductFilters>,
  debounceMs: number = 100
): ProductFilterResult {
  // Calculate price range
  const { maxPrice, minPrice, defaultPriceRange } = usePriceRange(products);
  
  // Use session storage to persist filter state
  const [storedFilters, setStoredFilters] = useSessionStorage<ProductFilters>('product-filters', {
    search: initialFilters?.search || '',
    priceRange: initialFilters?.priceRange || defaultPriceRange,
    stockStatus: initialFilters?.stockStatus || 'all',
    categories: initialFilters?.categories || [],
    subcategories: initialFilters?.subcategories || [],
  });

  // Initialize with stored filters or provided initial filters
  const [filters, setFiltersState] = useState<ProductFilters>(storedFilters);
  
  // Update stored filters when filters change
  const setFilters = useCallback((newFilters: React.SetStateAction<ProductFilters>) => {
    setFiltersState(prev => {
      const updatedFilters = typeof newFilters === 'function' ? newFilters(prev) : newFilters;
      setStoredFilters(updatedFilters);
      return updatedFilters;
    });
  }, [setStoredFilters]);
  
  // Update price range if products change
  useEffect(() => {
    if (products.length > 0 && 
        (filters.priceRange[0] !== minPrice || filters.priceRange[1] !== maxPrice)) {
      if (!initialFilters?.priceRange) {
        setFilters(prev => ({
          ...prev,
          priceRange: defaultPriceRange
        }));
      }
    }
  }, [products, minPrice, maxPrice, defaultPriceRange, initialFilters?.priceRange, setFilters]);
  
  // Filter products
  const { filteredProducts, loading } = useFilterProducts(products, filters, debounceMs);
  
  // Calculate filter count
  const filterCount = useFilterCount(filters, minPrice, maxPrice);
  
  // Apply pagination
  const { paginatedProducts, pagination } = usePagination(filteredProducts);
  
  // Convenient method to update just the price range
  const updatePriceRange = useCallback((range: [number, number]) => {
    setFilters(prev => ({
      ...prev,
      priceRange: range
    }));
  }, [setFilters]);

  // Reset all filters to default values
  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      priceRange: defaultPriceRange,
      stockStatus: 'all',
      categories: [],
      subcategories: [],
    });
    pagination.setCurrentPage(1);
  }, [defaultPriceRange, setFilters, pagination]);

  // Return combined filters with count
  const filtersWithCount = useMemo(() => ({
    ...filters,
    filterCount
  }), [filters, filterCount]);

  return {
    filters: filtersWithCount,
    setFilters,
    updatePriceRange,
    filteredProducts,
    paginatedProducts,
    maxPrice,
    minPrice,
    priceRange: filters.priceRange,
    filterCount,
    resetFilters,
    loading,
    pagination
  };
}
