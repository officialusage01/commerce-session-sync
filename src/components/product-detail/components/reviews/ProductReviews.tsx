
import React, { useCallback, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ProductFeedback, ProductRatingStats, getProductFeedback, getProductRatingStats, getPopularTags } from '@/lib/supabase/product-feedback';
import { RatingStats } from './RatingStats';
import { RatingInput } from './RatingInput';
import { ReviewsList } from './ReviewsList';

interface ProductReviewsProps {
  productId: string;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const [feedback, setFeedback] = useState<ProductFeedback[]>([]);
  const [stats, setStats] = useState<ProductRatingStats>({
    average_rating: 0,
    total_reviews: 0,
    rating_distribution: [0, 0, 0, 0, 0]
  });
  const [popularTags, setPopularTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Create a memoized function to load feedback data
  const loadFeedbackData = useCallback(async () => {
    try {
      setLoading(true);
      const [feedbackData, statsData, tagsData] = await Promise.all([
        getProductFeedback(productId),
        getProductRatingStats(productId),
        getPopularTags(productId)
      ]);

      if (statsData) {
        console.log('Received stats:', statsData); // Debug log
        setStats({
          average_rating: Number(statsData.average_rating) || 0,
          total_reviews: statsData.total_reviews || 0,
          rating_distribution: Array.isArray(statsData.rating_distribution) 
            ? statsData.rating_distribution.map(count => Number(count) || 0)
            : [0, 0, 0, 0, 0]
        });
      }
      
      if (Array.isArray(feedbackData)) {
        console.log('Received feedback:', feedbackData); // Debug log
        setFeedback(feedbackData);
      }
      
      if (Array.isArray(tagsData)) {
        setPopularTags(tagsData);
      }
    } catch (error) {
      console.error('Error loading feedback:', error);
      toast.error('Failed to load product reviews');
    } finally {
      setLoading(false);
    }
  }, [productId]);

  // Initial load and refresh handling
  useEffect(() => {
    loadFeedbackData();
  }, [loadFeedbackData, refreshKey]);

  // Handle feedback submission success
  const handleFeedbackSubmitted = (newFeedback: ProductFeedback) => {
    // Update local state with the new feedback
    setFeedback(prevFeedback => [newFeedback, ...prevFeedback]);
    // Refresh all data to get updated stats
    loadFeedbackData();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      {/* Rating Statistics */}
      <RatingStats stats={stats} popularTags={popularTags} />
      
      {/* Rating Input */}
      <RatingInput 
        productId={productId} 
        onFeedbackSubmitted={handleFeedbackSubmitted}
      />

      {/* Recent Reviews */}
      <ReviewsList feedback={feedback} />
    </div>
  );
};

export default ProductReviews;
