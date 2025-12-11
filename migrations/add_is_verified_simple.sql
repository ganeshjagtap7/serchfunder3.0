-- Simple migration: Add is_verified column to profiles table
-- Run this in your Supabase SQL Editor

-- Add the column (this will fail gracefully if it already exists)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false;

-- Set default for existing rows (optional, but safe)
UPDATE public.profiles 
SET is_verified = false 
WHERE is_verified IS NULL;

-- Make it NOT NULL after setting defaults
ALTER TABLE public.profiles 
ALTER COLUMN is_verified SET NOT NULL;

-- Verify it was added
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'profiles' 
AND column_name = 'is_verified';
