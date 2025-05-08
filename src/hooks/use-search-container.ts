
import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/lib/supabase';
import { FilterOptions } from '@/components/filters/types';
import { useProductFilter } from '@/hooks/use-product-filter';
import { useUrlParams } from '@/hooks/use-url-params';
import { useToast } from '@/hooks/use-toast';
import { useInView } from 'react-intersection-observer';

export function useSearchContainer(allProducts: Product[], initialProductsLoaded: boolean) {
  const { getFiltersFromUrl, setFiltersToUrl } = useUrlParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(
    localStorage.getItem('product-view-mode') as 'grid' | 'list' || 'grid'
  );
  const { toast } = useToast();
  
  // For infinite scroll implementation
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });
  
  // Initialize with URL params if available
  const initialFilters = getFiltersFromUrl();

  // Use our custom filtering hook with optimized performance
  const {
    filters,
    setFilters,
    filteredProducts,
    maxPrice,
    resetFilters,
    loading: filterLoading
  } = useProductFilter(allProducts, initialFilters);

  // Override the pagination to support infinite scroll
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const [currentBatch, setCurrentBatch] = useState(1);
  const batchSize = 12;

  // Set search term from URL params on initial load
  useEffect(() => {
    if (initialFilters.search) {
      setSearchTerm(initialFilters.search);
    }
    
    // Load view mode from localStorage if available
    const savedViewMode = localStorage.getItem('product-view-mode');
    if (savedViewMode === 'grid' || savedViewMode === 'list') {
      setViewMode(savedViewMode as 'grid' | 'list');
    }
  }, [initialFilters.search]);

  // Save view mode preference
  useEffect(() => {
    localStorage.setItem('product-view-mode', viewMode);
  }, [viewMode]);

  // Reset visible products when filters change
  useEffect(() => {
    const initialProducts = filteredProducts.slice(0, batchSize);
    setVisibleProducts(initialProducts);
    setCurrentBatch(1);
    setHasMoreProducts(filteredProducts.length > batchSize);
  }, [filteredProducts]);

  // Load more products when scrolling to the bottom
  useEffect(() => {
    if (inView && hasMoreProducts && !loadingMore && filteredProducts.length > 0) {
      loadMoreProducts();
    }
  }, [inView, hasMoreProducts, loadingMore, filteredProducts.length]);

  // Update URL when filters change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setFiltersToUrl(filters);
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [filters, setFiltersToUrl]);

  // Function to load more products
  const loadMoreProducts = () => {
    if (loadingMore || !hasMoreProducts) return;
    
    setLoadingMore(true);
    
    // Simulate network request with a small delay
    setTimeout(() => {
      const nextBatch = currentBatch + 1;
      const startIndex = currentBatch * batchSize;
      const endIndex = nextBatch * batchSize;
      const nextProducts = filteredProducts.slice(startIndex, endIndex);
      
      setVisibleProducts(prev => [...prev, ...nextProducts]);
      setCurrentBatch(nextBatch);
      setHasMoreProducts(endIndex < filteredProducts.length);
      setLoadingMore(false);
    }, 200);
  };

  const handleFilterChange = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters);
  }, [setFilters]);

  const handleClearFilters = useCallback(() => {
    resetFilters();
    setShowFilterDialog(false);
    setSearchTerm('');
    toast({
      title: "Filters cleared",
      description: "All product filters have been reset",
    });
  }, [resetFilters, toast]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setFilters(prev => ({
        ...prev,
        search: searchTerm
      }));
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setFilters(prev => ({
      ...prev,
      search: ''
    }));
  };

  return {
    searchTerm,
    setSearchTerm,
    filters,
    filteredProducts,
    visibleProducts,
    maxPrice,
    viewMode,
    setViewMode,
    showFilterDialog,
    setShowFilterDialog,
    loadingMore,
    hasMoreProducts,
    loadMoreRef,
    handleFilterChange,
    handleClearFilters,
    handleSearch,
    clearSearch,
    filterLoading,
    setFilters  // Expose setFilters for external control
  };
}
