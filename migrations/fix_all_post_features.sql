-- Comprehensive fix for post delete, edit, and save features
-- Run this in Supabase SQL Editor

-- 1. Fix DELETE policy for posts table
DROP POLICY IF EXISTS "Users can delete their own posts" ON public.posts;

CREATE POLICY "Users can delete their own posts"
  ON public.posts FOR DELETE
  USING ( auth.uid() = user_id );

-- 2. Verify UPDATE policy exists for posts table
DROP POLICY IF EXISTS "Users can update their own posts" ON public.posts;

CREATE POLICY "Users can update their own posts"
  ON public.posts FOR UPDATE
  USING ( auth.uid() = user_id );

-- 3. Create saved_posts table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.saved_posts (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, post_id)
);

-- 4. Enable RLS on saved_posts
ALTER TABLE public.saved_posts ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies for saved_posts
DROP POLICY IF EXISTS "Users can view their own saved posts" ON public.saved_posts;
DROP POLICY IF EXISTS "Users can save posts" ON public.saved_posts;
DROP POLICY IF EXISTS "Users can unsave their own posts" ON public.saved_posts;

CREATE POLICY "Users can view their own saved posts"
  ON public.saved_posts FOR SELECT
  USING ( auth.uid() = user_id );

CREATE POLICY "Users can save posts"
  ON public.saved_posts FOR INSERT
  WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can unsave their own posts"
  ON public.saved_posts FOR DELETE
  USING ( auth.uid() = user_id );

-- 6. Ensure RLS is enabled on posts table
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Verification queries (optional - uncomment to check)
-- SELECT tablename, policyname, cmd, qual FROM pg_policies WHERE tablename = 'posts';
-- SELECT tablename, policyname, cmd, qual FROM pg_policies WHERE tablename = 'saved_posts';
