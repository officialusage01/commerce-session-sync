
import React, { useEffect } from 'react';
import { Product } from '@/lib/supabase/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSearchContainer } from '@/hooks/use-search-container';
import SearchBar from './SearchBar';
import ProductGrid from './ProductGrid';
import SearchResultsHeader from './SearchResultsHeader';
import LoadMoreIndicator from './LoadMoreIndicator';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/lib/supabase/product-operations';

interface SearchContainerProps {
  allProducts: Product[];
  loading: boolean;
  initialProductsLoaded: boolean;
}

const SearchContainer: React.FC<SearchContainerProps> = ({
  allProducts: initialProducts,
  loading: initialLoading,
  initialProductsLoaded
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
    filteredProducts,
    visibleProducts,
    viewMode,
    setViewMode,
    loadingMore,
    hasMoreProducts,
    loadMoreRef,
    handleSearch,
    clearSearch
  } = useSearchContainer(allProducts, initialProductsLoaded);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleSearch={handleSearch}
          clearSearch={clearSearch}
        />
      </div>

      <div className="w-full">
        <SearchResultsHeader 
          filteredProductsCount={filteredProducts.length}
          viewMode={viewMode}
          setViewMode={setViewMode}
          loading={loading}
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
    </div>
  );
};

export default SearchContainer;
