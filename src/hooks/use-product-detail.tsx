
import { useState, useEffect } from 'react';
import { getProductById } from '@/lib/supabase/product-operations';
import { ProductWithRelations } from '@/lib/supabase/product-operations';
import { useCart } from '@/lib/cart'; // Updated import path

export const useProductDetail = (productId: string | undefined) => {
  const [product, setProduct] = useState<ProductWithRelations | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { items } = useCart();

  // Function to fetch product details that can be called both initially and after checkout
  const fetchProductDetails = async () => {
    if (!productId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching product with ID:', productId);
      const productData = await getProductById(productId);
      console.log('Product data received:', productData);
      setProduct(productData);
    } catch (error) {
      console.error('Error fetching product details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  // This effect will run whenever the cart items change
  // which includes after checkout when the cart gets cleared
  useEffect(() => {
    // Only refetch if we already have a product and cart items changed
    if (product && productId) {
      fetchProductDetails();
    }
  }, [items.length]);

  return { product, loading, refetchProduct: fetchProductDetails };
};
