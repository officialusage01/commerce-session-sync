
-- SQL function to create the profiles table
-- Copy this into your Supabase SQL editor and run it
CREATE OR REPLACE FUNCTION create_profiles_table()
RETURNS void AS $$
BEGIN
  -- Check if table already exists
  IF NOT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' AND tablename = 'profiles'
  ) THEN
    -- Create the profiles table
    CREATE TABLE public.profiles (
      id UUID PRIMARY KEY REFERENCES auth.users(id),
      email TEXT NOT NULL,
      role TEXT DEFAULT 'non-admin',
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );
    
    -- Add comment
    COMMENT ON TABLE public.profiles IS 'User profiles with role information';
  END IF;
END;
$$ LANGUAGE plpgsql;
