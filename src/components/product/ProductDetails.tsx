
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { getProductRatingStats } from '@/lib/supabase/product-feedback';

interface ProductDetailsProps {
  description: string;
  stock: number;
  productId: string;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ 
  description, 
  stock, 
  productId 
}) => {
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [totalReviews, setTotalReviews] = useState<number>(0);

  useEffect(() => {
    const loadRatingStats = async () => {
      const stats = await getProductRatingStats(productId);
      if (stats) {
        setAverageRating(stats.average_rating);
        setTotalReviews(stats.total_reviews);
      }
    };
    
    loadRatingStats();
  }, [productId]);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Product Description</h3>
            <p className="text-muted-foreground">{description}</p>
          </div>
          
          {averageRating !== null && (
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-2">Customer Ratings</h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= Math.round(averageRating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-medium">
                  {averageRating.toFixed(1)}/5 ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            </div>
          )}
          
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">Product Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Availability</h4>
                <p className="font-medium">
                  {stock > 0 
                    ? stock > 10 
                      ? 'In Stock' 
                      : `${stock} in stock` 
                    : 'Out of stock'}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Product ID</h4>
                <p className="font-medium">{productId}</p>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">Shipping Information</h3>
            <p className="text-muted-foreground">
              {stock > 0 
                ? 'This item ships within 1-2 business days. Free shipping on orders over ₹3000.'
                : 'This item is currently out of stock and unavailable for shipping.'}
            </p>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">Return Policy</h3>
            <p className="text-muted-foreground">
              This item can be returned within 30 days of delivery. Please refer to our return policy for more details.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductDetails;
