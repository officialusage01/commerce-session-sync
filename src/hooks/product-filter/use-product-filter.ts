
import { useState, useCallback, useEffect, useMemo } from 'react';
import { Product } from '@/lib/supabase/types';
import { FilterOptions } from '@/components/filters/types';
import { useSessionStorage } from '@/hooks/use-session-storage';
import { useDebounce } from '@/hooks/use-debounce';

/**
 * Main product filter hook that composes filter functionality
 */
export function useProductFilter(
  products: Product[], 
  initialFilters?: Partial<FilterOptions>,
  debounceMs: number = 100
) {
  // Calculate price range
  const maxPrice = useMemo(() => {
    return Math.max(...products.map(product => product.price), 10000);
  }, [products]);
  
  const minPrice = useMemo(() => {
    return Math.min(...products.map(product => product.price), 0);
  }, [products]);
  
  const defaultPriceRange: [number, number] = [
    Math.floor(minPrice), 
    Math.ceil(maxPrice)
  ];
  
  // Use session storage to persist filter state
  const [storedFilters, setStoredFilters] = useSessionStorage<FilterOptions>('product-filters', {
    search: initialFilters?.search || '',
    priceRange: initialFilters?.priceRange || defaultPriceRange,
    stockStatus: initialFilters?.stockStatus || 'all',
    categories: initialFilters?.categories || [],
    subcategories: initialFilters?.subcategories || [],
  });

  // Initialize with stored filters or provided initial filters
  const [filters, setFiltersState] = useState<FilterOptions>(storedFilters);
  const [loading, setLoading] = useState(false);
  
  // Calculate filter count
  const filterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.stockStatus !== 'all') count++;
    if (filters.categories.length > 0) count++;
    if (filters.subcategories.length > 0) count++;
    if (filters.priceRange[0] > minPrice || filters.priceRange[1] < maxPrice) count++;
    return count;
  }, [filters, minPrice, maxPrice]);
  
  // Update stored filters when filters change
  const setFilters = useCallback((newFilters: React.SetStateAction<FilterOptions>) => {
    setFiltersState(prev => {
      const updatedFilters = typeof newFilters === 'function' ? newFilters(prev) : newFilters;
      setStoredFilters(updatedFilters);
      return updatedFilters;
    });
  }, [setStoredFilters]);
  
  // Update price range if products change
  useEffect(() => {
    if (products.length > 0 && 
        !initialFilters?.priceRange && 
        (filters.priceRange[0] !== minPrice || filters.priceRange[1] !== maxPrice)) {
      setFilters(prev => ({
        ...prev,
        priceRange: defaultPriceRange
      }));
    }
  }, [products, minPrice, maxPrice, defaultPriceRange, initialFilters, setFilters]);
  
  // Debounce filters to avoid excessive re-renders
  const debouncedFilters = useDebounce(filters, debounceMs);
  
  // Filter products
  const filteredProducts = useMemo(() => {
    if (products.length > 0) {
      setLoading(true);
    }
    
    const filtered = products.filter(product => {
      // Filter by search term
      const matchesSearch = !debouncedFilters.search || 
        product.name.toLowerCase().includes(debouncedFilters.search.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(debouncedFilters.search.toLowerCase()));

      // Filter by price range
      const matchesPrice = product.price >= debouncedFilters.priceRange[0] && 
                          product.price <= debouncedFilters.priceRange[1];

      // Filter by stock status
      let matchesStock = true;
      if (debouncedFilters.stockStatus === 'in-stock') {
        matchesStock = product.stock > 0;
      } else if (debouncedFilters.stockStatus === 'out-of-stock') {
        matchesStock = product.stock <= 0;
      }

      // Filter by categories and subcategories
      let matchesCategory = true;
      if (debouncedFilters.subcategories.length > 0) {
        matchesCategory = debouncedFilters.subcategories.includes(product.subcategory_id);
      } else if (debouncedFilters.categories.length > 0) {
        // This would require additional logic to check product's category through subcategory relation
        // Will need to enhance this based on how product data is structured
        matchesCategory = true; // Simplified for now
      }

      return matchesSearch && matchesPrice && matchesStock && matchesCategory;
    });
    
    // Small delay to ensure UI updates are visible
    setTimeout(() => {
      setLoading(false);
    }, 150);
    
    return filtered;
  }, [products, debouncedFilters]);

  // Reset all filters to default values
  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      priceRange: defaultPriceRange,
      stockStatus: 'all',
      categories: [],
      subcategories: [],
    });
  }, [defaultPriceRange, setFilters]);

  // Return combined filters with count
  const filtersWithCount = useMemo(() => ({
    ...filters,
    filterCount
  }), [filters, filterCount]);

  return {
    filters: filtersWithCount,
    setFilters,
    filteredProducts,
    maxPrice,
    minPrice,
    resetFilters,
    loading
  };
}
