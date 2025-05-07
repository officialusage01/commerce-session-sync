/*
  # Create product feedback system

  1. New Tables
    - `product_feedbacks`
      - `id` (uuid, primary key)
      - `product_id` (uuid, references products)
      - `user_id` (uuid, optional)
      - `rating` (integer, 1-5)
      - `feedback_tags` (text array)
      - `message` (text, optional)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on product_feedbacks table
    - Add policy for public read access
    - Add policy for authenticated users to create feedback
    - Add policy for admin users to manage feedback
*/

-- Create product_feedbacks table
CREATE TABLE IF NOT EXISTS product_feedbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  feedback_tags TEXT[] DEFAULT '{}',
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_product_feedbacks_product_id ON product_feedbacks(product_id);
CREATE INDEX IF NOT EXISTS idx_product_feedbacks_user_id ON product_feedbacks(user_id);
CREATE INDEX IF NOT EXISTS idx_product_feedbacks_rating ON product_feedbacks(rating);

-- Enable RLS
ALTER TABLE product_feedbacks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to product_feedbacks"
  ON product_feedbacks FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated users to create product feedback"
  ON product_feedbacks FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow users to update their own feedback"
  ON product_feedbacks FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Allow admin to manage all feedback"
  ON product_feedbacks FOR ALL
  TO authenticated
  USING (auth.role() = 'admin');

-- Drop existing functions to avoid conflicts
DROP FUNCTION IF EXISTS get_product_rating_stats(UUID);
DROP FUNCTION IF EXISTS get_product_rating_stats(INTEGER);

-- Create a new function with a distinct name for integer IDs
CREATE OR REPLACE FUNCTION get_product_rating_stats_by_id(product_id_param INTEGER)
RETURNS TABLE (
  average_rating NUMERIC,
  total_reviews INTEGER,
  rating_distribution INTEGER[]
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH rating_counts AS (
    SELECT 
      rating,
      COUNT(*)::INTEGER as count
    FROM product_feedbacks
    WHERE product_id = product_id_param::TEXT::UUID
    GROUP BY rating
  ),
  all_ratings AS (
    SELECT 
      r.rating,
      COALESCE(rc.count, 0)::INTEGER as count
    FROM generate_series(1, 5) r(rating)
    LEFT JOIN rating_counts rc ON rc.rating = r.rating
    ORDER BY r.rating ASC
  )
  SELECT 
    COALESCE(ROUND(AVG(pf.rating)::NUMERIC, 1), 0.0) as average_rating,
    COUNT(*)::INTEGER as total_reviews,
    (SELECT ARRAY(
      SELECT count
      FROM all_ratings
    )) as rating_distribution
  FROM product_feedbacks pf
  WHERE product_id = product_id_param::TEXT::UUID
  GROUP BY product_id;
END;
$$;

