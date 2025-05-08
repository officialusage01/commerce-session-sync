
import { supabase } from '../client';
import { Feedback } from './types';
import { sanitizeInput } from './validation';

export const submitFeedback = async (feedback: Omit<Feedback, 'id' | 'created_at'>): Promise<Feedback | null> => {
  try {
    // Sanitize all text inputs
    const sanitizedFeedback = {
      name: sanitizeInput(feedback.name),
      email: sanitizeInput(feedback.email),
      subject: feedback.subject ? sanitizeInput(feedback.subject) : undefined,
      message: sanitizeInput(feedback.message),
      rating: feedback.rating,
    };

    const { data, error } = await supabase
      .from('feedbacks')
      .insert([sanitizedFeedback])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return null;
  }
};
