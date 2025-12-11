-- Migration: Add is_verified column to profiles table
-- Run this in your Supabase SQL Editor if the column doesn't exist

-- Check if column exists, if not add it
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'is_verified'
    ) THEN
        ALTER TABLE public.profiles 
        ADD COLUMN is_verified boolean DEFAULT false NOT NULL;
        
        RAISE NOTICE 'Column is_verified added to profiles table';
    ELSE
        RAISE NOTICE 'Column is_verified already exists';
    END IF;
END $$;

-- Verify the column was added
SELECT 
    column_name, 
    data_type, 
    column_default, 
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'profiles' 
AND column_name = 'is_verified';
