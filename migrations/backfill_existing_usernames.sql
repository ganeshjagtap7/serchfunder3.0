-- Backfill usernames for existing users who don't have one
-- This ensures all existing profiles get a unique username

DO $$
DECLARE
  profile_record RECORD;
  user_email text;
  generated_username text;
BEGIN
  -- Loop through all profiles without a username
  FOR profile_record IN
    SELECT p.id
    FROM public.profiles p
    WHERE p.username IS NULL
  LOOP
    -- Get the email from auth.users
    SELECT email INTO user_email
    FROM auth.users
    WHERE id = profile_record.id;

    -- Generate unique username
    IF user_email IS NOT NULL THEN
      generated_username := public.generate_unique_username(user_email);

      -- Update the profile
      UPDATE public.profiles
      SET username = generated_username
      WHERE id = profile_record.id;

      RAISE NOTICE 'Updated profile % with username: %', profile_record.id, generated_username;
    END IF;
  END LOOP;
END $$;

-- Verify all profiles now have usernames
SELECT
  COUNT(*) as total_profiles,
  COUNT(username) as profiles_with_username,
  COUNT(*) - COUNT(username) as profiles_missing_username
FROM public.profiles;
