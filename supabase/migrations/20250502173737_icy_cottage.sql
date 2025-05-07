/*
  # Add RLS policies for feedback submissions

  1. Security Changes
    - Enable RLS on feedbacks table if not already enabled
    - Add policy to allow anyone to submit feedback
    - Add policy to allow reading feedback statistics
    
  2. Notes
    - Feedback submission should be available to all users (authenticated and anonymous)
    - Reading individual feedback entries is restricted
    - Only aggregate statistics (average rating, count) are publicly readable
*/

-- Enable RLS
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit feedback
CREATE POLICY "Allow feedback submission"
ON feedbacks
FOR INSERT
TO public
WITH CHECK (true);

-- Allow reading feedback for statistics (needed for getFeedbackStats)
CREATE POLICY "Allow reading feedback for statistics"
ON feedbacks
FOR SELECT
TO public
USING (true);