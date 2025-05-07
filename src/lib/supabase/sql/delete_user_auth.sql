
-- SQL function to delete a user from auth.users
-- This function must be executed with Supabase admin privileges
-- To create this function, run it in the SQL editor in your Supabase dashboard

CREATE OR REPLACE FUNCTION public.delete_user_auth(user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- This function will execute with the privileges of the user that created it
AS $$
BEGIN
  -- Delete from auth.users
  DELETE FROM auth.users WHERE id = user_id;
END;
$$;

-- Set proper permissions for this function
-- Allow only authenticated users to run this function
REVOKE ALL ON FUNCTION public.delete_user_auth(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.delete_user_auth(UUID) TO authenticated;

-- Create a policy to allow only admin users to execute this function
CREATE POLICY "Only admins can execute delete_user_auth"
  ON public.delete_user_auth
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
