
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Feedback } from '@/lib/supabase/feedback';

interface UserFeedbackDialogProps {
  selectedFeedback: Feedback | null;
  setSelectedFeedback: (feedback: Feedback | null) => void;
}

const UserFeedbackDialog = ({ selectedFeedback, setSelectedFeedback }: UserFeedbackDialogProps) => {
  return (
    <Dialog open={!!selectedFeedback} onOpenChange={() => setSelectedFeedback(null)}>
      <DialogContent className="feedback-dialog sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-left">User Feedback Details</DialogTitle>
          <DialogDescription className="text-left">
            Submitted on {selectedFeedback && new Date(selectedFeedback.created_at).toLocaleString()}
          </DialogDescription>
        </DialogHeader>
        <AnimatePresence mode="wait">
          {selectedFeedback && (
            <motion.div
              key={selectedFeedback.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="text-left"
            >
              <ScrollArea className="h-[50vh] pr-4">
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-muted-foreground">Contact Information</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="font-medium">Name</span>
                        <span className="text-right feedback-dialog-content">{selectedFeedback.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Email</span>
                        <span className="text-right text-primary feedback-dialog-content">{selectedFeedback.email}</span>
                      </div>
                    </div>
                  </div>
                  {selectedFeedback.subject && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-muted-foreground">Subject</h4>
                      <p className="font-medium feedback-dialog-content">{selectedFeedback.subject}</p>
                    </div>
                  )}
                  {selectedFeedback.rating !== undefined && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-muted-foreground">Rating</h4>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <Star
                            key={rating}
                            className={`h-5 w-5 ${
                              selectedFeedback.rating && selectedFeedback.rating >= rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-muted-foreground">Message</h4>
                    <div className="bg-muted p-4 rounded-md text-sm whitespace-pre-wrap feedback-dialog-content">
                      {selectedFeedback.message}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default UserFeedbackDialog;
