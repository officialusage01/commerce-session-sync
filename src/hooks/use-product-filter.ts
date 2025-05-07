
import { useMemo, useState, useCallback, useEffect } from 'react';
import { Product } from '@/lib/supabase/types';
import { ProductFilters } from '@/components/ProductFilter';
import { useDebounce } from '@/hooks/use-debounce';
import { useSessionStorage } from '@/hooks/use-session-storage';

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

export function useProductFilter(
  products: Product[], 
  initialFilters?: Partial<ProductFilters>,
  debounceMs: number = 100
): ProductFilterResult {
  // Use session storage to persist filter state
  const [storedFilters, setStoredFilters] = useSessionStorage<ProductFilters>('product-filters', {
    search: initialFilters?.search || '',
    priceRange: initialFilters?.priceRange || [0, 1000],
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

  // Pagination state - using session storage for persistence
  const [currentPage, setCurrentPage] = useSessionStorage<number>('product-page', 1);
  const [pageSize, setPageSize] = useSessionStorage<number>('product-page-size', 10); // Fixed 10 per page
  
  const [loading, setLoading] = useState(false);
  const debouncedFilters = useDebounce(filters, debounceMs);

  // Calculate price range from all products
  const { maxPrice, minPrice, defaultPriceRange } = useMemo(() => {
    if (!products.length) return { maxPrice: 1000, minPrice: 0, defaultPriceRange: [0, 1000] as [number, number] };
    
    const prices = products.map(product => product.price);
    const max = Math.ceil(Math.max(...prices));
    const min = Math.floor(Math.min(...prices));
    
    return { 
      maxPrice: max, 
      minPrice: min,
      defaultPriceRange: [min, max] as [number, number]
    };
  }, [products]);

  // Update price range if products change
  useEffect(() => {
    if (products.length && 
        (filters.priceRange[0] > minPrice || filters.priceRange[1] < maxPrice)) {
      if (!initialFilters?.priceRange) {
        setFilters(prev => ({
          ...prev,
          priceRange: defaultPriceRange
        }));
      }
    }
  }, [products, minPrice, maxPrice, defaultPriceRange, initialFilters?.priceRange, setFilters]);

  // Apply filters to products
  const filteredProducts = useMemo(() => {
    setLoading(true);
    
    const filtered = products.filter(product => {
      // Filter by search term
      const matchesSearch = !debouncedFilters.search || 
        product.name.toLowerCase().includes(debouncedFilters.search.toLowerCase()) ||
        product.description.toLowerCase().includes(debouncedFilters.search.toLowerCase());

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
        // If we have selected subcategories, check if the product's subcategory is included
        matchesCategory = debouncedFilters.subcategories.includes(product.subcategory_id);
      } else if (debouncedFilters.categories.length > 0) {
        // If only categories are selected (no subcategories), we'd need the category-subcategory mapping
        // This would require additional data. For now, assume it matches if any category is selected
        matchesCategory = debouncedFilters.categories.length > 0;
      }

      return matchesSearch && matchesPrice && matchesStock && matchesCategory;
    });
    
    setLoading(false);
    return filtered;
  }, [products, debouncedFilters]);

  // Apply pagination to filtered products
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredProducts.slice(startIndex, startIndex + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  }, [filteredProducts.length, pageSize]);

  // Make sure current page is valid
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage, setCurrentPage]);

  // Calculate how many filters are active
  const filterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.priceRange[0] > minPrice || filters.priceRange[1] < maxPrice) count++;
    if (filters.stockStatus !== 'all') count++;
    count += filters.categories.length;
    count += filters.subcategories.length;
    return count;
  }, [filters, minPrice, maxPrice]);

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
    setCurrentPage(1);
  }, [defaultPriceRange, setFilters, setCurrentPage]);

  // Return combined filters with count
  const filtersWithCount = useMemo(() => {
    return {
      ...filters,
      filterCount
    };
  }, [filters, filterCount]);

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
    pagination: {
      currentPage,
      totalPages,
      pageSize,
      setCurrentPage,
      setPageSize,
    }
  };
}
