
import React from 'react';
import { motion } from 'framer-motion';
import {
  Form,
} from "@/components/ui/form";
import { useFeedbackForm } from './hooks/useFeedbackForm';
import { 
  NameField,
  EmailField,
  SubjectField, 
  MessageField 
} from './components/FormFields';
import RatingSelector from './components/RatingSelector';
import { SubmitButton } from './components/SubmitButton';
import { FEEDBACK_FIELD_LIMITS } from '@/lib/supabase/feedback';

const FeedbackForm = () => {
  const formAnimationRef = React.useRef(null);
  const { 
    form, 
    rating,
    isSubmitting, 
    handleRatingChange, 
    onSubmit,
  } = useFeedbackForm();

  return (
    <motion.div
      ref={formAnimationRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <NameField 
            form={form} 
            currentCount={form.watch('name')?.length || 0} 
            maxCount={FEEDBACK_FIELD_LIMITS.name}
          />

          <EmailField 
            form={form} 
            currentCount={form.watch('email')?.length || 0} 
            maxCount={FEEDBACK_FIELD_LIMITS.email}
          />

          <SubjectField 
            form={form} 
            currentCount={form.watch('subject')?.length || 0} 
            maxCount={FEEDBACK_FIELD_LIMITS.subject}
          />

          <MessageField 
            form={form} 
            currentCount={form.watch('message')?.length || 0} 
            maxCount={FEEDBACK_FIELD_LIMITS.message}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Rating</label>
            <RatingSelector 
              rating={rating} 
              setRating={handleRatingChange} 
            />
          </div>

          <SubmitButton isSubmitting={isSubmitting} />
        </form>
      </Form>
    </motion.div>
  );
};

export default FeedbackForm;
