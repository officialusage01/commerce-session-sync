import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Product } from '@/lib/supabase/types';
import { formatCurrency } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Check, IndianRupee, Star } from 'lucide-react';
import { toast } from "sonner";
import { useCart } from '@/lib/cart'; 
import { useState, useEffect } from 'react';
import { getProductRatingStats } from '@/lib/supabase/product-feedback';

interface ProductCardProps {
  product: Product;
  isMobile?: boolean;
}

const ProductCard = ({ product, isMobile = false }: ProductCardProps) => {
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadRatingStats = async () => {
      try {
        const stats = await getProductRatingStats(product.id);
        setAverageRating(stats.average_rating);
        setTotalReviews(stats.total_reviews);
      } catch (error) {
        console.error('Error loading rating stats:', error);
      }
    };
    
    loadRatingStats();
  }, [product.id]);

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };
  
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (product.stock <= 0) {
      toast.error("This product is out of stock");
      return;
    }
    
    try {
      setIsAdding(true);
      await addToCart(product.id, 1);
      setJustAdded(true);
      toast.success(`${product.name} added to cart`);
      
      setTimeout(() => {
        setJustAdded(false);
      }, 1500);
    } catch (error) {
      toast.error("Failed to add item to cart");
      console.error("Add to cart error:", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Card 
      className="overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col group cursor-pointer relative"
      onClick={handleClick}
    >
      <div className="relative pt-[100%] overflow-hidden">
        <img
          src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder.svg'}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
        />
        
        {product.stock > 0 && (
          <div className="absolute top-2 left-2 bg-black/70 text-white text-sm font-medium px-2 py-1 rounded-md backdrop-blur-sm shadow-sm">
            {formatCurrency(product.price)}
          </div>
        )}
        
        {product.stock === 0 && (
          <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded">
            Out of Stock
          </div>
        )}
        
        {product.stock > 0 && (
          <div className={`absolute bottom-2 right-2 transition-opacity duration-300 ${isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
            <Button 
              size="sm" 
              className="rounded-full h-10 w-10 shadow-md bg-primary hover:bg-primary/90"
              onClick={handleAddToCart}
              disabled={isAdding || justAdded}
            >
              {isAdding ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
              ) : justAdded ? (
                <Check className="h-4 w-4" />
              ) : (
                <ShoppingCart className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}
      </div>
      
      <CardContent className="py-4 flex-grow">
        <h3 className="font-medium line-clamp-2 mb-1">{product.name}</h3>
        <div className="flex items-center gap-2 mb-2">
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
          {totalReviews > 0 && (
            <span className="text-sm text-muted-foreground">
              ({totalReviews})
            </span>
          )}
        </div>
        <p className="text-muted-foreground text-sm line-clamp-2">
          {product.description}
        </p>
      </CardContent>
      
      <CardFooter className="pt-0 pb-4 flex items-center justify-between">
        <div className="font-semibold text-lg flex items-center">
          <IndianRupee size={16} className="mr-1" />
          {parseInt(product.price.toString()).toLocaleString('en-IN')}
        </div>
        
        {product.stock > 0 && product.stock <= 5 && (
          <div className="text-xs text-amber-600 font-medium bg-amber-50 px-2 py-1 rounded-full">
            Only {product.stock} left
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
