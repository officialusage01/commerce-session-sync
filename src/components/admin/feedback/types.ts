
export interface FeedbackItem {
  id: string;
  product_id: string;
  user_id: string | null;
  rating: number;
  feedback_tags: string[];
  message: string | null;
  created_at: string;
  product: {
    name: string;
  };
}

export interface ProductFeedbackTabProps {
  selectedFeedback: FeedbackItem | null;
  setSelectedFeedback: (feedback: FeedbackItem | null) => void;
  updateFeedbackCount?: (count: number) => void;
}

export interface UserFeedbackTabProps {
  selectedFeedback: any;
  setSelectedFeedback: (feedback: any | null) => void;
  updateTotal: (count: number) => void;
}
