import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/lib/supabase';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { useToast } from '@/hooks/use-toast';
import { getProductRatingStats } from '@/lib/supabase/product-feedback';

interface ProductListItemProps {
  product: Product;
}

const ProductListItem: React.FC<ProductListItemProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalReviews, setTotalReviews] = useState<number>(0);

  useEffect(() => {
    const loadRatingStats = async () => {
      try {
        const stats = await getProductRatingStats(product.id);
        console.log('Product rating stats:', stats); // Debug log
        if (stats) {
          setAverageRating(Number(stats.average_rating) || 0);
          setTotalReviews(Number(stats.total_reviews) || 0);
        }
      } catch (error) {
        console.error('Error loading rating stats:', error);
      }
    };
    
    loadRatingStats();
  }, [product.id]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart(product.id, 1);
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const productUrl = `/product/${product.id}`;
  const imageSrc = product.images?.[0] || '/placeholder.svg';
  
  // Display out of stock badge if stock is 0
  const isOutOfStock = product.stock === 0;
  
  return (
    <div className="flex border rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md bg-card animate-fade-in group">
      <Link to={productUrl} className="flex-shrink-0 w-32 sm:w-48 h-32 relative overflow-hidden">
        <img 
          src={imageSrc} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {isOutOfStock && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            Out of Stock
          </div>
        )}
      </Link>
      
      <div className="flex flex-col flex-1 p-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
          <div>
            <Link to={productUrl} className="font-medium text-lg hover:text-primary transition-colors">
              {product.name}
            </Link>
            
            {totalReviews > 0 && (
              <div className="flex items-center mt-1 gap-2">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Star
                      key={rating}
                      className={`h-4 w-4 ${
                        rating <= Math.round(averageRating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            )}
            
            <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
              {product.description}
            </p>
          </div>
          
          <div className="flex flex-col items-end gap-3">
            <div className="text-lg font-semibold">{formatCurrency(product.price)}</div>
            
            <Button 
              size="sm" 
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className="flex items-center gap-1"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Add to Cart</span>
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-3">
          <p className="text-xs text-muted-foreground">
            {isOutOfStock ? 'Currently unavailable' : `In stock: ${product.stock} units`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductListItem;
