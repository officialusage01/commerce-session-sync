
import { useMemo, useState } from 'react';
import { Product } from '@/lib/supabase/types';
import { ProductFilters } from '@/components/filters/types';
import { useDebounce } from '@/hooks/use-debounce';

/**
 * Hook to filter products based on filters
 */
export function useFilterProducts(
  products: Product[], 
  filters: ProductFilters,
  debounceMs: number = 100
): { filteredProducts: Product[], loading: boolean } {
  const [loading, setLoading] = useState(false);
  const debouncedFilters = useDebounce(filters, debounceMs);
  
  const filteredProducts = useMemo(() => {
    // Only show loading state if we have products
    if (products.length > 0) {
      setLoading(true);
    }
    
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
        // If only categories are selected (no subcategories), we'll need to get
        // the product's category indirectly through the related ProductWithRelations data
        // Since the basic Product type doesn't include the category
        matchesCategory = false; // Default to false for basic Product objects
        
        // We can only filter by category if we have category data from the ProductWithRelations
        // This is handled appropriately in the SearchContainer which should fetch products with relations
      }

      return matchesSearch && matchesPrice && matchesStock && matchesCategory;
    });
    
    // Small delay to ensure UI updates are visible
    setTimeout(() => {
      setLoading(false);
    }, 150);
    
    return filtered;
  }, [products, debouncedFilters]);

  return { filteredProducts, loading };
}
