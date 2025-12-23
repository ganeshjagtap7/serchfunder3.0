-- Create saved_posts table for bookmarking posts
CREATE TABLE IF NOT EXISTS public.saved_posts (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, post_id)
);

-- Enable RLS
ALTER TABLE public.saved_posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for saved_posts
CREATE POLICY "Users can view their own saved posts"
  ON public.saved_posts FOR SELECT
  USING ( auth.uid() = user_id );

CREATE POLICY "Users can save posts"
  ON public.saved_posts FOR INSERT
  WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can unsave their own posts"
  ON public.saved_posts FOR DELETE
  USING ( auth.uid() = user_id );
