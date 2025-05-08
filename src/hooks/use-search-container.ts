
import { useState, useEffect, useRef, useCallback } from 'react';
import { Product } from '@/lib/supabase/types';
import { useProductFilter } from './use-product-filter';
import { useDebounce } from './use-debounce';

export function useSearchContainer(products: Product[], initialProductsLoaded: boolean) {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [visibleCount, setVisibleCount] = useState(12);
  const [loadingMore, setLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  // Use the product filter hook
  const {
    filters,
    setFilters,
    filteredProducts,
    maxPrice,
    minPrice,
    resetFilters,
    loading: filterLoading
  } = useProductFilter(products, {
    search: debouncedSearchTerm,
    priceRange: [0, 50000],
    stockStatus: 'all',
    categories: [],
    subcategories: []
  });
  
  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(12);
  }, [filters]);
  
  // Update search filter when search term changes
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      search: debouncedSearchTerm
    }));
  }, [debouncedSearchTerm, setFilters]);
  
  // Load more products when the user scrolls to the bottom
  const hasMoreProducts = visibleCount < filteredProducts.length;
  
  // Visible products are a slice of filtered products
  const visibleProducts = filteredProducts.slice(0, visibleCount);
  
  // Intersection observer for infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current || !initialProductsLoaded) return;
    
    const observer = new IntersectionObserver(
      entries => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMoreProducts && !loadingMore) {
          setLoadingMore(true);
          setTimeout(() => {
            setVisibleCount(prev => prev + 12);
            setLoadingMore(false);
          }, 500); // Simulated loading time
        }
      },
      { threshold: 1.0 }
    );
    
    observer.observe(loadMoreRef.current);
    
    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasMoreProducts, loadingMore, initialProductsLoaded]);
  
  // Handle search form submission
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled by the effect above
  }, []);
  
  // Clear search
  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);
  
  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, [setFilters]);
  
  // Clear all filters
  const handleClearFilters = useCallback(() => {
    resetFilters();
    setSearchTerm('');
  }, [resetFilters]);
  
  return {
    searchTerm,
    setSearchTerm,
    filters,
    filteredProducts,
    visibleProducts,
    maxPrice,
    minPrice,
    viewMode,
    setViewMode,
    loadingMore,
    hasMoreProducts,
    loadMoreRef,
    handleFilterChange,
    handleClearFilters,
    handleSearch,
    clearSearch,
    filterLoading,
    setFilters
  };
}
