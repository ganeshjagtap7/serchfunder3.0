-- Check current policies on messages table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'messages';

-- The issue might be that RLS is enabled but blocking reads
-- Let's check if RLS is enabled
SELECT relname, relrowsecurity
FROM pg_class
WHERE relname = 'messages';

-- If you see the policies exist but queries are still failing,
-- it might be because the auth.uid() is not matching correctly
-- Let's verify by temporarily disabling RLS to test (DON'T USE IN PRODUCTION)
-- ALTER TABLE public.messages DISABLE ROW LEVEL SECURITY;

-- Better solution: Let's make sure the SELECT policy uses OR correctly
DROP POLICY IF EXISTS "Users can view their own messages" ON public.messages;

CREATE POLICY "Users can view their own messages"
  ON public.messages FOR SELECT
  USING (
    auth.uid() = sender_id OR auth.uid() = receiver_id
  );
