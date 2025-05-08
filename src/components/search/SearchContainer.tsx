
import React, { useEffect } from 'react';
import { Product } from '@/lib/supabase/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSearchContainer } from '@/hooks/use-search-container';
import FilterDialog from '@/components/mobile/FilterDialog';
import SearchBar from './SearchBar';
import ProductGrid from './ProductGrid';
import SearchResultsHeader from './SearchResultsHeader';
import LoadMoreIndicator from './LoadMoreIndicator';
import ProductFilter from '@/components/ProductFilter';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/lib/supabase/product-operations';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';

interface SearchContainerProps {
  allProducts: Product[];
  loading: boolean;
  initialProductsLoaded: boolean;
  useSidebarFilter?: boolean; // Whether the left sidebar filter is being used
  sidebarFilters?: {
    search: string;
    priceRange: [number, number];
    stockStatus: 'all' | 'in-stock' | 'out-of-stock';
    categories: string[];
    subcategories: string[];
  }; // Filters from the sidebar
  showMobileFilters?: boolean;
  setShowMobileFilters?: (show: boolean) => void;
}

const SearchContainer: React.FC<SearchContainerProps> = ({
  allProducts: initialProducts,
  loading: initialLoading,
  initialProductsLoaded,
  useSidebarFilter = false,
  sidebarFilters = {
    search: '',
    priceRange: [0, 10000],
    stockStatus: 'all',
    categories: [],
    subcategories: []
  },
  showMobileFilters = false,
  setShowMobileFilters = () => {}
}) => {
  const isMobile = useIsMobile();
  
  // Use React Query to get fresh products data
  const { data: freshProducts, isLoading } = useQuery({
    queryKey: ['allProducts'],
    queryFn: async () => {
      // This will fetch all products across all subcategories
      return getProducts();
    },
    initialData: initialProducts,
    refetchInterval: 30000, // Refetch every 30 seconds
    enabled: initialProductsLoaded // Only enable once initial products are loaded
  });
  
  // Use the freshest data available
  const allProducts = freshProducts || initialProducts;
  const loading = isLoading || initialLoading;
  
  const {
    searchTerm,
    setSearchTerm,
    filters,
    filteredProducts,
    visibleProducts,
    maxPrice,
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
  } = useSearchContainer(allProducts, initialProductsLoaded);
  
  // Apply sidebar filters when they change (only if sidebar is being used)
  useEffect(() => {
    if (useSidebarFilter) {
      setFilters({
        ...sidebarFilters,
        // Keep track of filter count for UI indicators
        filterCount: 
          (sidebarFilters.search ? 1 : 0) +
          (sidebarFilters.stockStatus !== 'all' ? 1 : 0) +
          sidebarFilters.categories.length +
          sidebarFilters.subcategories.length +
          (sidebarFilters.priceRange[0] > 0 || sidebarFilters.priceRange[1] < maxPrice ? 1 : 0)
      });
    }
  }, [useSidebarFilter, sidebarFilters, setFilters, maxPrice]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleSearch={handleSearch}
          clearSearch={clearSearch}
        />
        
        {/* Only show filter toggle button on mobile */}
        {isMobile && (
          <Button
            variant="outline"
            className="h-12 bg-white/80 backdrop-blur-sm shadow-sm flex items-center gap-2 shrink-0 transition-all hover:bg-white"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            {filters.filterCount > 0 && (
              <div className="ml-1 h-5 min-w-5 rounded-full text-xs flex items-center justify-center px-1.5 bg-primary text-white">
                {filters.filterCount}
              </div>
            )}
          </Button>
        )}
      </div>

      <div className="w-full">
        <SearchResultsHeader 
          filteredProductsCount={filteredProducts.length}
          viewMode={viewMode}
          setViewMode={setViewMode}
          loading={filterLoading}
        />
        
        <ProductGrid
          loading={loading}
          initialProductsLoaded={initialProductsLoaded}
          filteredProducts={filteredProducts}
          visibleProducts={visibleProducts}
          viewMode={viewMode}
          showFilters={false}
          isMobile={isMobile}
        />
        
        <LoadMoreIndicator
          loadingMore={loadingMore}
          hasMoreProducts={hasMoreProducts}
          loadMoreRef={loadMoreRef}
        />
      </div>

      {/* Mobile filter dialog only shown when needed */}
      {isMobile && (
        <FilterDialog 
          maxPrice={maxPrice}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          initialFilters={filters}
          open={showMobileFilters}
          onOpenChange={setShowMobileFilters}
          filterCount={filters.filterCount || 0}
        />
      )}
    </div>
  );
};

export default SearchContainer;
