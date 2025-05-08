
-- Check if product_feedbacks table exists and create it if it doesn't
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'product_feedbacks') THEN
    -- Create product_feedbacks table
    CREATE TABLE product_feedbacks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
      rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
      feedback_tags TEXT[] DEFAULT '{}',
      message TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    -- Create indexes for better performance
    CREATE INDEX idx_product_feedbacks_product_id ON product_feedbacks(product_id);
    CREATE INDEX idx_product_feedbacks_user_id ON product_feedbacks(user_id);
    CREATE INDEX idx_product_feedbacks_rating ON product_feedbacks(rating);

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
  END IF;

  -- Drop the function if it exists with the wrong name
  DROP FUNCTION IF EXISTS get_product_rating_stats_by_id;

  -- Create or replace the function with the correct name
  CREATE OR REPLACE FUNCTION get_product_rating_stats(product_id_param UUID)
  RETURNS TABLE (
    average_rating NUMERIC,
    total_reviews INTEGER,
    rating_distribution INTEGER[]
  ) 
  LANGUAGE plpgsql
  AS $$
  BEGIN
    RETURN QUERY
    SELECT 
      ROUND(AVG(rating)::numeric, 1) as average_rating,
      COUNT(*)::integer as total_reviews,
      ARRAY_AGG(rating ORDER BY rating) as rating_distribution
    FROM product_feedbacks
    WHERE product_id = product_id_param;
  END;
  $$;
END
$$;
