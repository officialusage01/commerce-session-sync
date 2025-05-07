
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Product, getFeaturedProducts } from '@/lib/supabase';
import ProductCard from './ProductCard';
import { Loader2 } from 'lucide-react';

const FeaturedProducts: React.FC = () => {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: () => getFeaturedProducts(4)
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !products || products.length === 0) {
    return null; // Don't show section if no products
  }

  return (
    <div className="py-12 bg-slate-50">
      <div className="container px-4 max-w-screen-xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">New Arrivals</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
