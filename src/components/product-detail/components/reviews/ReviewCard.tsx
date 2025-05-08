
import React from 'react';
import { Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ProductFeedback } from '@/lib/supabase/product-feedback';

interface ReviewCardProps {
  review: ProductFeedback;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= review.rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            {review.feedback_tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {review.feedback_tags.map((tag) => (
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
            {new Date(review.created_at).toLocaleDateString()}
          </span>
        </div>
        
        {review.message && (
          <p className="text-sm text-muted-foreground mt-2">
            {review.message}
          </p>
        )}
      </div>
    </Card>
  );
};
