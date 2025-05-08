
import { useMemo, useEffect } from 'react';
import { Product } from '@/lib/supabase/types';

interface PriceRangeResult {
  maxPrice: number;
  minPrice: number;
  defaultPriceRange: [number, number];
}

/**
 * Hook to calculate price range from products
 */
export function usePriceRange(products: Product[]): PriceRangeResult {
  return useMemo(() => {
    if (!products.length) return { 
      maxPrice: 1000, 
      minPrice: 0, 
      defaultPriceRange: [0, 1000] as [number, number] 
    };
    
    const prices = products.map(product => product.price);
    const max = Math.ceil(Math.max(...prices));
    const min = Math.floor(Math.min(...prices));
    
    return { 
      maxPrice: max, 
      minPrice: min,
      defaultPriceRange: [min, max] as [number, number]
    };
  }, [products]);
}
