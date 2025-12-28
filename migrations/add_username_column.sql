-- Add username column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username text UNIQUE;

-- Create index for faster username lookups
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- Create function to generate unique username from email
CREATE OR REPLACE FUNCTION public.generate_unique_username(email text)
RETURNS text AS $$
DECLARE
  base_username text;
  final_username text;
  counter int := 1;
BEGIN
  -- Generate base username from email
  base_username := regexp_replace(
    lower(split_part(email, '@', 1)),
    '[^a-z0-9_]',
    '',
    'g'
  );

  -- Limit to 15 characters
  base_username := substring(base_username, 1, 15);

  -- Fallback if empty
  IF base_username = '' THEN
    base_username := 'user';
  END IF;

  -- Try base username first
  final_username := base_username;

  -- Keep incrementing until we find a unique username
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = final_username) LOOP
    final_username := base_username || counter;
    counter := counter + 1;
  END LOOP;

  RETURN final_username;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the handle_new_user trigger function to include username
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  generated_username text;
BEGIN
  -- Generate unique username from email
  generated_username := public.generate_unique_username(new.email);

  -- Insert profile with username
  INSERT INTO public.profiles (id, full_name, role, username)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    (new.raw_user_meta_data->>'role')::user_role,
    generated_username
  );

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
