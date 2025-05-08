
import React from 'react';
import { motion } from 'framer-motion';
import { ProductFeedback } from '@/lib/supabase/product-feedback';
import { ReviewCard } from './ReviewCard';

interface ReviewsListProps {
  feedback: ProductFeedback[];
}

export const ReviewsList: React.FC<ReviewsListProps> = ({ feedback }) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Recent Reviews</h3>
      {feedback.length > 0 ? (
        <div className="space-y-3">
          {feedback.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ReviewCard review={item} />
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
  );
};
