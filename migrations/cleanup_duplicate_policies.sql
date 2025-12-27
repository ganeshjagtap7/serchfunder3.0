-- Remove all policies and recreate with correct ones only
DROP POLICY IF EXISTS "Users can read own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can view their own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
DROP POLICY IF EXISTS "Users can update received messages" ON public.messages;

-- Create clean policies
CREATE POLICY "Users can view their own messages"
  ON public.messages
  FOR SELECT
  USING (
    auth.uid() = sender_id OR auth.uid() = receiver_id
  );

CREATE POLICY "Users can send messages"
  ON public.messages
  FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
  );

CREATE POLICY "Users can update received messages"
  ON public.messages
  FOR UPDATE
  USING (
    auth.uid() = receiver_id
  );

-- Verify
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE tablename = 'messages'
ORDER BY cmd, policyname;
