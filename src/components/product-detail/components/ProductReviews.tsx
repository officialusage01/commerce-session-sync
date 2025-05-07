import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import {
  ProductFeedback,
  ProductRatingStats,
  getFeedbackTags,
  getProductFeedback,
  getProductRatingStats,
  getPopularTags,
  submitProductFeedback
} from '@/lib/supabase/product-feedback';

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
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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

  const handleRatingSelect = (rating: number) => {
    setSelectedRating(rating);
    setSelectedTags([]);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubmitFeedback = async () => {
    if (!selectedRating) {
      toast.error('Please select a rating before submitting');
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitProductFeedback({
        product_id: productId,
        rating: selectedRating,
        feedback_tags: selectedTags
      });

      if (result) {
        // Show success message
        toast.success('Thank you for your feedback!');
        
        // Reset form state
        setSelectedRating(0);
        setSelectedTags([]);
        
        // Immediately update local state with the new feedback
        setFeedback(prevFeedback => [result, ...prevFeedback]);
        
        // Refresh all data to get updated stats
        await loadFeedbackData();
      } else {
        toast.error('Failed to submit feedback. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate percentage for each star rating
  const calculatePercentage = (rating: number): number => {
    if (!stats.total_reviews || !stats.rating_distribution) {
      return 0;
    }
    
    const ratingCount = stats.rating_distribution[rating - 1] || 0;
    return Number(((ratingCount / stats.total_reviews) * 100).toFixed(1));
  };

  // Helper function to format the rating count
  const getRatingCount = (rating: number): number => {
    if (!stats.rating_distribution || !Array.isArray(stats.rating_distribution)) {
      return 0;
    }
    return Number(stats.rating_distribution[rating - 1]) || 0;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Statistics */}
      <div className="bg-card rounded-lg p-6 border">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Average Rating */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">
                {stats.average_rating.toFixed(1)}
                <span className="text-lg text-muted-foreground">/5</span>
              </h3>
              <p className="text-sm text-muted-foreground">
                Based on {stats.total_reviews} {stats.total_reviews === 1 ? 'review' : 'reviews'}
              </p>
              
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Star
                    key={rating}
                    className={`h-5 w-5 ${
                      stats.average_rating >= rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const percentage = calculatePercentage(rating);
              const count = getRatingCount(rating);
              
              return (
                <div key={rating} className="flex items-center gap-2">
                  <div className="w-10 text-sm font-medium">{rating}★</div>
                  <Progress value={percentage} className="h-2" />
                  <div className="w-24 text-xs text-muted-foreground">
                    {percentage}% ({count})
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Popular Tags */}
        {popularTags.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-2">Top Tags</h4>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <div
                  key={tag}
                  className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium"
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Rating Input */}
      <div className="bg-card rounded-lg p-6 border">
        <h3 className="font-semibold mb-4">Rate this product</h3>
        <div className="flex gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((rating) => (
            <motion.button
              key={rating}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleRatingSelect(rating)}
              className={`h-10 w-10 rounded-full flex items-center justify-center transition-all ${
                selectedRating === rating 
                  ? 'bg-primary text-white shadow-lg' 
                  : 'bg-muted hover:bg-muted/80'
              }`}
              disabled={submitting}
            >
              <Star
                className={`h-5 w-5 ${
                  selectedRating >= rating
                    ? 'fill-current'
                    : ''
                }`}
              />
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {selectedRating > 0 && (
            <motion.div
              key="feedback-form"
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 overflow-hidden"
            >
              <h4 className="text-sm font-medium">Select tags that describe your experience:</h4>
              <div className="flex flex-wrap gap-2">
                {getFeedbackTags(selectedRating).map((tag) => (
                  <motion.div
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                      onClick={() => handleTagToggle(tag)}
                      size="sm"
                      className={`transition-all duration-200 ${
                        selectedTags.includes(tag) 
                          ? 'shadow-md' 
                          : 'hover:shadow-sm'
                      }`}
                      disabled={submitting}
                    >
                      {tag}
                    </Button>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  onClick={handleSubmitFeedback}
                  disabled={submitting}
                  className="w-full mt-4"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Feedback'
                  )}
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Recent Reviews */}
      <div className="space-y-4">
        <h3 className="font-semibold">Recent Reviews</h3>
        {feedback.length > 0 ? (
          <div className="space-y-3">
            {feedback.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-4 hover:shadow-md transition-shadow duration-200">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-1">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= item.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        {item.feedback_tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.feedback_tags.map((tag) => (
                              <span
                                key={tag}
                                className="bg-secondary/50 text-secondary-foreground px-2 py-0.5 rounded-full text-xs font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {item.message && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {item.message}
                      </p>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-muted/10 rounded-lg border border-dashed">
            <p className="text-muted-foreground">
              No reviews yet. Be the first to review this product!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
