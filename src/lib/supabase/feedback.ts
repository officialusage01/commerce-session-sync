
import { supabase } from './client';

export interface Feedback {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  rating?: number;
  created_at: string; // Making created_at required to match UserFeedback in FeedbackTab.tsx
}

// Field length constraints
export const FEEDBACK_FIELD_LIMITS = {
  name: 100,
  email: 100,
  subject: 200,
  message: 2500,
};

// Sanitize input to prevent XSS/script injection
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/`/g, '&#x60;')
    .replace(/\(/g, '&#40;')
    .replace(/\)/g, '&#41;');
};

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

export const getFeedbackList = async (page: number = 1, perPage: number = 10): Promise<{ data: Feedback[], count: number }> => {
  try {
    // Get total count
    const { count, error: countError } = await supabase
      .from('feedbacks')
      .select('*', { count: 'exact', head: true });
    
    if (countError) throw countError;

    // Get paginated data
    const { data, error } = await supabase
      .from('feedbacks')
      .select('*')
      .range((page - 1) * perPage, page * perPage - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Ensure created_at is always present to match UserFeedback type
    const typedData = (data || []).map(item => ({
      ...item,
      created_at: item.created_at || new Date().toISOString()
    }));
    
    return {
      data: typedData,
      count: count || 0
    };
  } catch (error) {
    console.error('Error fetching feedback list:', error);
    return { data: [], count: 0 };
  }
};

export const getFeedbackStats = async (): Promise<{ averageRating: number; totalCount: number }> => {
  try {
    const { data: stats, error } = await supabase
      .from('feedbacks')
      .select('rating')
      .not('rating', 'is', null);

    if (error) throw error;

    const ratings = stats.map(s => s.rating).filter(r => r !== null) as number[];
    const averageRating = ratings.length > 0 
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length 
      : 0;

    return {
      averageRating,
      totalCount: ratings.length
    };
  } catch (error) {
    console.error('Error fetching feedback stats:', error);
    return { averageRating: 0, totalCount: 0 };
  }
};

// Get detailed rating distribution for insights
export const getRatingDistribution = async (): Promise<Record<number, number>> => {
  try {
    const { data, error } = await supabase
      .from('feedbacks')
      .select('rating')
      .not('rating', 'is', null);

    if (error) throw error;
    
    const distribution: Record<number, number> = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
    data.forEach(item => {
      if (item.rating) {
        distribution[item.rating] = (distribution[item.rating] || 0) + 1;
      }
    });
    
    return distribution;
  } catch (error) {
    console.error('Error fetching rating distribution:', error);
    return {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
  }
};
