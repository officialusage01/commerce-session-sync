
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/lib/supabase/product-operations';
import ProductCard from './ProductCard';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

// This component will display products sorted by popularity
const TopSellingProducts: React.FC = () => {
  // In a real application, we would have an API endpoint specifically for top selling products
  // For now, we'll simulate this by fetching all products from the first subcategory
  // and limiting the results
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['topSellingProducts'],
    queryFn: async () => {
      // Fetch from the first subcategory (id: "1")
      // In a real app, you would have a dedicated endpoint for top selling products
      const allProducts = await getProducts("1"); // Using string ID
      // Sort by some criteria (here we're just simulating by sorting by price)
      return allProducts
        .sort((a, b) => b.price - a.price)
        .slice(0, 4);
    }
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
    <div className="py-12">
      <div className="container px-4 max-w-screen-xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Top Selling Products</h2>
          <Button asChild variant="outline">
            <Link to="/search">View All</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopSellingProducts;
