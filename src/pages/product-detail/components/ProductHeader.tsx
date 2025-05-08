
import React from 'react';
import { ProductWithRelations } from '@/lib/supabase/product-operations/types';

interface ProductHeaderProps {
  product: ProductWithRelations;
}

const ProductHeader = ({ product }: ProductHeaderProps) => {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
      <p className="text-muted-foreground mt-2">{product.description.substring(0, 120)}...</p>
    </div>
  );
};

export default ProductHeader;
