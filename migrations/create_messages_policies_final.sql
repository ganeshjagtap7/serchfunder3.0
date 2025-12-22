-- First, check if RLS is enabled
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies (just in case)
DROP POLICY IF EXISTS "Users can view their own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
DROP POLICY IF EXISTS "Users can update received messages" ON public.messages;

-- Create SELECT policy: Users can view messages they sent or received
CREATE POLICY "Users can view their own messages"
  ON public.messages
  FOR SELECT
  USING (
    (auth.uid() = sender_id) OR (auth.uid() = receiver_id)
  );

-- Create INSERT policy: Users can send messages as themselves
CREATE POLICY "Users can send messages"
  ON public.messages
  FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
  );

-- Create UPDATE policy: Users can update messages they received (for marking as seen)
CREATE POLICY "Users can update received messages"
  ON public.messages
  FOR UPDATE
  USING (
    auth.uid() = receiver_id
  );

-- Verify the policies were created
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE tablename = 'messages';
