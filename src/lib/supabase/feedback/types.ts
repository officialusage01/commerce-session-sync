
export interface Feedback {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  rating?: number;
  created_at: string;
}

// Field length constraints
export const FEEDBACK_FIELD_LIMITS = {
  name: 100,
  email: 100,
  subject: 200,
  message: 2500,
};
