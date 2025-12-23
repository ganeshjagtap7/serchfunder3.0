-- Fix DELETE policy for posts table
-- This ensures users can delete their own posts

-- Drop existing policy if it exists to recreate it
DROP POLICY IF EXISTS "Users can delete their own posts" ON public.posts;

-- Recreate the DELETE policy
CREATE POLICY "Users can delete their own posts"
  ON public.posts FOR DELETE
  USING ( auth.uid() = user_id );

-- Verify RLS is enabled
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
