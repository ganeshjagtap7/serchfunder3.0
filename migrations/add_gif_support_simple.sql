-- Add GIF support to posts table
-- This is a simplified migration that only adds the gif_url column

-- 1. Add gif_url column for GIF embeds
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS gif_url text;

-- 2. Add image_url column for future image uploads (optional)
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS image_url text;

-- Success message
SELECT 'GIF support columns added successfully!' as status;
