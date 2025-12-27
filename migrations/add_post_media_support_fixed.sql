-- Add media support to posts table
-- This enables image uploads, GIFs, polls, and other rich media in posts

-- 1. Add image_url column for uploaded images
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS image_url text;

-- 2. Add gif_url column for GIF embeds
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS gif_url text;

-- 3. Create storage bucket for post images
INSERT INTO storage.buckets (id, name, public)
VALUES ('post-images', 'post-images', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Enable RLS on storage buckets
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 5. Storage policies for post-images bucket
-- Drop existing policies if they exist, then recreate
DROP POLICY IF EXISTS "Anyone can view post images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload post images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own post images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own post images" ON storage.objects;

-- Anyone can view post images (public read)
CREATE POLICY "Anyone can view post images"
ON storage.objects FOR SELECT
USING (bucket_id = 'post-images');

-- Authenticated users can upload post images
CREATE POLICY "Authenticated users can upload post images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'post-images'
  AND auth.role() = 'authenticated'
);

-- Users can update their own post images
CREATE POLICY "Users can update their own post images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'post-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can delete their own post images
CREATE POLICY "Users can delete their own post images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'post-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 6. Create polls table for poll functionality
CREATE TABLE IF NOT EXISTS public.polls (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL UNIQUE,
  question text NOT NULL,
  options jsonb NOT NULL, -- Array of poll options with vote counts
  total_votes integer DEFAULT 0,
  ends_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Enable RLS on polls table
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;

-- 8. RLS policies for polls
DROP POLICY IF EXISTS "Everyone can view polls" ON public.polls;
DROP POLICY IF EXISTS "Users can create polls for their posts" ON public.polls;

CREATE POLICY "Everyone can view polls"
  ON public.polls FOR SELECT
  USING (true);

CREATE POLICY "Users can create polls for their posts"
  ON public.polls FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.posts
      WHERE id = polls.post_id
      AND user_id = auth.uid()
    )
  );

-- 9. Create poll_votes table to track user votes
CREATE TABLE IF NOT EXISTS public.poll_votes (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  poll_id uuid REFERENCES public.polls(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  option_index integer NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(poll_id, user_id) -- One vote per user per poll
);

-- 10. Enable RLS on poll_votes
ALTER TABLE public.poll_votes ENABLE ROW LEVEL SECURITY;

-- 11. RLS policies for poll_votes
DROP POLICY IF EXISTS "Users can view all poll votes" ON public.poll_votes;
DROP POLICY IF EXISTS "Users can vote on polls" ON public.poll_votes;

CREATE POLICY "Users can view all poll votes"
  ON public.poll_votes FOR SELECT
  USING (true);

CREATE POLICY "Users can vote on polls"
  ON public.poll_votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Verification queries (optional - uncomment to check)
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'posts';
-- SELECT tablename, policyname FROM pg_policies WHERE tablename IN ('polls', 'poll_votes');
