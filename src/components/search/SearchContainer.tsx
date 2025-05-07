import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Product } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useProductFilter } from '@/hooks/use-product-filter';
import { useUrlParams } from '@/hooks/use-url-params';
import { useToast } from '@/hooks/use-toast';
import { useInView } from 'react-intersection-observer';
import FilterDialog from '@/components/mobile/FilterDialog';
import SearchBar from './SearchBar';
import ProductGrid from './ProductGrid';
import SearchResultsHeader from './SearchResultsHeader';
import LoadMoreIndicator from './LoadMoreIndicator';
import { FilterOptions } from '@/components/filters/types';

interface SearchContainerProps {
  allProducts: Product[];
  loading: boolean;
  initialProductsLoaded: boolean;
}

const SearchContainer: React.FC<SearchContainerProps> = ({
  allProducts,
  loading,
  initialProductsLoaded
}) => {
  const { getFiltersFromUrl, setFiltersToUrl } = useUrlParams();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // For infinite scroll implementation
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });
  
  // Initialize with URL params if available
  const initialFilters = getFiltersFromUrl();

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

  // Use our custom filtering hook with optimized performance
  const { 
    filters, 
    setFilters, 
    filteredProducts, 
    maxPrice,
    resetFilters,
  } = useProductFilter(
    allProducts,
    initialFilters
  );

  // Override the pagination to support infinite scroll
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const [currentBatch, setCurrentBatch] = useState(1);
  const batchSize = 10;

  // Reset visible products when filters change
  useEffect(() => {
    const initialProducts = filteredProducts.slice(0, batchSize);
    setVisibleProducts(initialProducts);
    setCurrentBatch(1);
    setHasMoreProducts(filteredProducts.length > batchSize);
  }, [filteredProducts]);

  // Load more products when scrolling to the bottom
  useEffect(() => {
    if (inView && hasMoreProducts && !loadingMore) {
      loadMoreProducts();
    }
  }, [inView, hasMoreProducts, loadingMore]);

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
    }, 300);
  };

  // Update URL when filters change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setFiltersToUrl(filters);
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [filters, setFiltersToUrl]);

  const handleFilterChange = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters);
  }, [setFilters]);

  const handleClearFilters = useCallback(() => {
    resetFilters();
    setShowFilterDialog(false);
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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleSearch={handleSearch}
          clearSearch={clearSearch}
        />
        
        {isMobile ? (
          <FilterDialog 
            maxPrice={maxPrice}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            initialFilters={filters}
            open={showFilterDialog}
            onOpenChange={setShowFilterDialog}
            filterCount={filters.filterCount || 0}
          />
        ) : (
          <Button
            variant="outline"
            className="h-12 bg-white/80 backdrop-blur-sm shadow-sm flex items-center gap-2 shrink-0"
            onClick={() => setShowFilterDialog(true)}
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            {filters && filters.filterCount > 0 && (
              <span className="ml-1 h-5 min-w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center px-1.5">
                {filters.filterCount}
              </span>
            )}
          </Button>
        )}
      </div>

      <div className="w-full">
        <SearchResultsHeader 
          filteredProductsCount={filteredProducts.length}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
        
        <ProductGrid
          loading={loading}
          initialProductsLoaded={initialProductsLoaded}
          filteredProducts={filteredProducts}
          visibleProducts={visibleProducts}
          viewMode={viewMode}
          showFilters={showFilters}
          isMobile={isMobile}
        />
        
        <LoadMoreIndicator
          loadingMore={loadingMore}
          hasMoreProducts={hasMoreProducts}
          loadMoreRef={loadMoreRef}
        />
      </div>

      {!isMobile && (
        <FilterDialog 
          maxPrice={maxPrice}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          initialFilters={filters}
          open={showFilterDialog}
          onOpenChange={setShowFilterDialog}
          filterCount={filters.filterCount || 0}
        />
      )}
    </div>
  );
};

export default SearchContainer;
