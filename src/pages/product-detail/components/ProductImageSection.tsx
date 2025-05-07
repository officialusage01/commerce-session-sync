
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import ProductImageCarousel from '@/components/product/ProductImageCarousel';
import { ProductWithRelations } from '@/lib/supabase/product-operations';

interface ProductImageSectionProps {
  product: ProductWithRelations;
}

const ProductImageSection = ({ product }: ProductImageSectionProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-2 gap-12'}`}>
      {/* Product Images */}
      <ProductImageCarousel 
        images={product.images}
        productName={product.name}
      />
      
      {/* Product Information */}
      <div className="flex flex-col">
        <ProductInfo
          name={product.name}
          description={product.description}
          price={product.price}
          stock={product.stock}
        />
      </div>
    </div>
  );
};

// Re-export the ProductInfo component from the existing file
import ProductInfo from '@/components/product/ProductInfo';

export default ProductImageSection;
