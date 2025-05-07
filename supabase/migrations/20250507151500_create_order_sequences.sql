
-- Create order_sequences table to track the latest used sequence number
CREATE TABLE IF NOT EXISTS order_sequences (
  id INTEGER PRIMARY KEY DEFAULT 1,
  current_sequence INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default row
INSERT INTO order_sequences (id, current_sequence)
VALUES (1, 0)
ON CONFLICT (id) DO NOTHING;

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_order_sequences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the function
CREATE TRIGGER update_order_sequences_updated_at
BEFORE UPDATE ON order_sequences
FOR EACH ROW
EXECUTE FUNCTION update_order_sequences_updated_at();

-- Add concurrency protection through a row-level lock function
CREATE OR REPLACE FUNCTION increment_order_sequence()
RETURNS INTEGER AS $$
DECLARE
  next_sequence INTEGER;
BEGIN
  -- Lock the row exclusively
  UPDATE order_sequences 
  SET current_sequence = current_sequence + 1
  WHERE id = 1
  RETURNING current_sequence INTO next_sequence;
  
  RETURN next_sequence;
END;
$$ LANGUAGE plpgsql;
