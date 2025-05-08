
import { supabase } from './client';

export interface ProductFeedback {
  id: string;
  product_id: string;
  user_id?: string;
  rating: number;
  feedback_tags: string[];
  message?: string;
  created_at: string;
  // We won't include user information directly in this interface
}

export interface ProductRatingStats {
  average_rating: number;
  total_reviews: number;
  rating_distribution: number[];
}

// Tags by rating for insight cards
export const RATING_INSIGHT_TAGS = {
  5: ['Value for Money', 'Excellent Quality', 'Highly Recommended', 'Perfect Fit', 'Fast Shipping'],
  4: ['Good Build', 'Price Slightly High', 'Worth the Price', 'Recommended', 'Quick Delivery'],
  3: ['Average Quality', 'Fair Price', 'Meets Expectations', 'Standard Shipping', 'Okay Product'],
  2: ['Below Average', 'Overpriced', 'Room for Improvement', 'Slow Shipping', 'Not as Described'],
  1: ['Poor Quality', 'Not Worth It', 'Disappointed', 'Shipping Issues', 'Damaged Product']
};

export const submitProductFeedback = async (feedback: Omit<ProductFeedback, 'id' | 'created_at'>): Promise<ProductFeedback | null> => {
  try {
    console.log('Submitting product feedback:', feedback);
    
    const { data, error } = await supabase
      .from('product_feedbacks')
      .insert([feedback])
      .select()
      .single();

    if (error) {
      console.error('Supabase error submitting feedback:', error);
      throw error;
    }
    
    console.log('Feedback submitted successfully:', data);
    return data;
  } catch (error) {
    console.error('Error submitting product feedback:', error);
    return null;
  }
};

export const getProductFeedback = async (productId: string): Promise<ProductFeedback[]> => {
  try {
    // Remove the joined user field to avoid foreign key issues
    const { data, error } = await supabase
      .from('product_feedbacks')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching product feedback:', error);
    return [];
  }
};

export const getProductRatingStats = async (productId: string | number): Promise<ProductRatingStats> => {
  try {
    // Convert productId to string if it's a number
    const productIdStr = typeof productId === 'number' ? String(productId) : productId;
    
    if (!productIdStr) {
      console.error('Invalid product ID:', productId);
      return {
        average_rating: 0,
        total_reviews: 0,
        rating_distribution: [0, 0, 0, 0, 0]
      };
    }

    // Use direct SQL query instead of RPC to avoid the function overload issue
    const { data, error } = await supabase
      .from('product_feedbacks')
      .select('rating')
      .eq('product_id', productIdStr);

    if (error) {
      console.error('Error in getProductRatingStats:', error);
      throw error;
    }
    
    // Calculate stats manually
    if (!data || data.length === 0) {
      return {
        average_rating: 0,
        total_reviews: 0,
        rating_distribution: [0, 0, 0, 0, 0]
      };
    }
    
    // Calculate average rating
    const sum = data.reduce((acc, item) => acc + item.rating, 0);
    const average = sum / data.length;
    
    // Calculate rating distribution
    const distribution = [0, 0, 0, 0, 0];
    data.forEach(item => {
      if (item.rating >= 1 && item.rating <= 5) {
        distribution[item.rating - 1]++;
      }
    });
    
    const stats: ProductRatingStats = {
      average_rating: Number(average.toFixed(1)),
      total_reviews: data.length,
      rating_distribution: distribution
    };
    
    console.log('Calculated stats:', stats); // Debug log
    return stats;
  } catch (error) {
    console.error('Error fetching product rating stats:', error);
    return {
      average_rating: 0,
      total_reviews: 0,
      rating_distribution: [0, 0, 0, 0, 0]
    };
  }
};

// Get most popular tags for a product
export const getPopularTags = async (productId: string): Promise<string[]> => {
  try {
    const feedbacks = await getProductFeedback(productId);
    
    // Count tag occurrences
    const tagCounts: Record<string, number> = {};
    
    feedbacks.forEach(feedback => {
      feedback.feedback_tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    
    // Sort tags by count and return top 3
    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(entry => entry[0]);
      
  } catch (error) {
    console.error('Error getting popular tags:', error);
    return [];
  }
};

export const getFeedbackTags = (rating: number): string[] => {
  return RATING_INSIGHT_TAGS[rating as keyof typeof RATING_INSIGHT_TAGS] || [];
};
