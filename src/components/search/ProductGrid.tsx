import React from 'react';
import { Product } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import ProductListItem from '@/components/ProductListItem';

interface ProductGridProps {
  loading: boolean;
  initialProductsLoaded: boolean;
  filteredProducts: Product[];
  visibleProducts: Product[];
  viewMode: 'grid' | 'list';
  showFilters: boolean;
  isMobile: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  loading,
  initialProductsLoaded,
  filteredProducts,
  visibleProducts,
  viewMode,
  showFilters,
  isMobile
}) => {
  if (!initialProductsLoaded || loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-full">
            <div className="aspect-[3/4] relative rounded-lg overflow-hidden">
              <Skeleton className="absolute inset-0" />
            </div>
            <div className="mt-4 space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold mb-2">No products found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search or filters to find what you're looking for.
        </p>
      </div>
    );
  }

  if (viewMode === 'grid') {
    // Calculate grid columns based on filters and screen size
    const gridClasses = showFilters && !isMobile
      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6";

    return (
      <div className="w-full">
        <div className={gridClasses}>
          {visibleProducts.map((product) => (
            <div key={product.id} className="flex flex-col h-full">
              <ProductCard product={product} isMobile={isMobile} />
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    // List view
    return (
      <div className="flex flex-col gap-6">
        {visibleProducts.map((product) => (
          <ProductListItem key={product.id} product={product} />
        ))}
      </div>
    );
  }
};

export default ProductGrid;
