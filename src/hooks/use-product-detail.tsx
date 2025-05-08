
import { useState, useEffect } from 'react';
import { getProductById } from '@/lib/supabase/product-operations';
import { ProductWithRelations } from '@/lib/supabase/product-operations/types';
import { useCart } from '@/lib/cart';
import { useQuery } from '@tanstack/react-query';

export const useProductDetail = (productId: string | undefined) => {
  const [loading, setLoading] = useState<boolean>(true);
  const { items } = useCart();

  // Use React Query to get product details with auto-refresh capability
  const { 
    data: product, 
    isLoading,
    refetch 
  } = useQuery({
    queryKey: ['productDetail', productId],
    queryFn: async () => {
      if (!productId) return null;
      return getProductById(productId);
    },
    enabled: !!productId,
    refetchOnWindowFocus: true, // Refetch when the window regains focus
    staleTime: 30000, // Consider data stale after 30 seconds
  });

  // This effect will run whenever the cart items change
  // which includes after checkout when the cart gets cleared
  useEffect(() => {
    // Only refetch if we already have a product and cart items changed
    if (product && productId) {
      refetch();
    }
  }, [items.length, refetch, product, productId]);

  // Set loading state based on React Query's isLoading
  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  return { 
    product, 
    loading, 
    refetchProduct: refetch 
  };
};

export default useProductDetail;
