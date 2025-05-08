
import React from 'react';
import { Star } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { ProductRatingStats } from '@/lib/supabase/product-feedback';
import { PopularTags } from './PopularTags';

interface RatingStatsProps {
  stats: ProductRatingStats;
  popularTags: string[];
}

export const RatingStats: React.FC<RatingStatsProps> = ({ stats, popularTags }) => {
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

  return (
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
      {popularTags.length > 0 && <PopularTags tags={popularTags} />}
    </div>
  );
};
