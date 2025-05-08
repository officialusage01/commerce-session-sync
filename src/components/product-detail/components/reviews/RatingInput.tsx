
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  ProductFeedback,
  getFeedbackTags,
  submitProductFeedback
} from '@/lib/supabase/product-feedback';

interface RatingInputProps {
  productId: string;
  onFeedbackSubmitted: (feedback: ProductFeedback) => void;
}

export const RatingInput: React.FC<RatingInputProps> = ({ productId, onFeedbackSubmitted }) => {
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

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
        
        // Notify parent component
        onFeedbackSubmitted(result);
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

  return (
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
  );
};
