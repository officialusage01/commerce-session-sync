
import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { FEEDBACK_FIELD_LIMITS } from '@/lib/supabase/feedback';

// Define the form schema with Zod
const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  subject: z.string().optional(),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' }),
});

export type FormValues = z.infer<typeof formSchema>;

export function useFeedbackForm() {
  const [rating, setRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [feedbackTags, setFeedbackTags] = useState<string[]>([]);

  // Initialize react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  // Handle tag selection
  const handleTagToggle = useCallback((tag: string) => {
    setFeedbackTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  }, []);

  // Handle rating selection with immediate update
  const handleRatingChange = useCallback(async (value: number) => {
    setRating(value);
    
    // Store the rating in session storage for persistence
    sessionStorage.setItem('user_rating', value.toString());
    
    // Optionally send an immediate update to the backend
    try {
      const { data: session } = await supabase.auth.getSession();
      const userId = session?.session?.user?.id;
      
      if (userId) {
        // If user is logged in, store their rating preference
        await supabase.from('user_preferences').upsert({
          user_id: userId,
          last_rating: value,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });
      }
    } catch (error) {
      console.error('Error saving rating:', error);
      // Don't show error to user as this is a background operation
    }
  }, []);

  // Submit the form
  const onSubmit = useCallback(async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      const { data: session } = await supabase.auth.getSession();
      const userId = session?.session?.user?.id;
      
      const feedbackData = {
        name: data.name,
        email: data.email,
        subject: data.subject || null,
        message: data.message,
        rating: rating,
        feedback_tags: feedbackTags.length > 0 ? feedbackTags : null,
        user_id: userId || null,
      };
      
      const { error } = await supabase.from('feedback').insert([feedbackData]);
      
      if (error) throw error;
      
      // Clear form and show success message
      form.reset();
      setRating(0);
      setFeedbackTags([]);
      setIsSubmitted(true);
      
      toast.success('Thank you for your feedback!', {
        description: 'We appreciate your input and will review it shortly.',
      });
      
      // Clear session storage
      sessionStorage.removeItem('user_rating');
      
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback', {
        description: 'Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [form, rating, feedbackTags]);

  return {
    form,
    rating,
    isSubmitting,
    isSubmitted,
    feedbackTags,
    handleTagToggle,
    handleRatingChange,
    onSubmit,
    setIsSubmitted,
  };
}
