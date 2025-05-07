
-- Enable Row Level Security on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy for selecting profiles (everyone can read profiles)
CREATE POLICY "Anyone can view profiles"
  ON public.profiles
  FOR SELECT
  USING (true);

-- Policy for inserting profiles (only authenticated users can insert their own profiles)
CREATE POLICY "Users can insert their own profiles"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Policy for updating profiles (users can update their own profiles, admins can update any profile)
CREATE POLICY "Users can update own profiles, admins can update any profile"
  ON public.profiles
  FOR UPDATE
  USING (
    auth.uid() = id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Policy for deleting profiles (only admins can delete profiles)
CREATE POLICY "Only admins can delete profiles"
  ON public.profiles
  FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
