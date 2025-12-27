-- Add joined_at column to group_members table (alias for created_at for clarity)
-- Since created_at already exists and serves the same purpose, we can just use it
-- But if you want a separate column, uncomment below:
-- ALTER TABLE public.group_members ADD COLUMN IF NOT EXISTS joined_at timestamp with time zone default timezone('utc'::text, now()) not null;

-- For now, we'll just ensure created_at works as joined_at in our queries
