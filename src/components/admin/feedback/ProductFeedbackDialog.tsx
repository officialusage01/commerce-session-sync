import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { FeedbackItem } from './types';
import { Badge } from '@/components/ui/badge';

interface ProductFeedbackDialogProps {
  selectedFeedback: FeedbackItem | null;
  setSelectedFeedback: (feedback: FeedbackItem | null) => void;
}

const ProductFeedbackDialog: React.FC<ProductFeedbackDialogProps> = ({
  selectedFeedback,
  setSelectedFeedback,
}) => {
  return (
    <Dialog open={!!selectedFeedback} onOpenChange={() => setSelectedFeedback(null)}>
      <DialogContent className="feedback-dialog sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Product Feedback Details</DialogTitle>
          <DialogDescription>
            {selectedFeedback?.product.name} - {new Date(selectedFeedback?.created_at || '').toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        {selectedFeedback && (
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Rating</h3>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <span
                    key={rating}
                    className={`text-xl ${
                      rating <= selectedFeedback.rating
                        ? 'text-yellow-500'
                        : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Feedback Tags</h3>
              <div className="flex gap-2">
                {selectedFeedback.feedback_tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Message</h3>
              <p className="text-sm feedback-dialog-content">
                {selectedFeedback.message || 'No message provided.'}
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProductFeedbackDialog;
