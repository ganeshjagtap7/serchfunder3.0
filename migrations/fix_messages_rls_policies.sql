-- First, let's see what policies exist (run this to check)
-- SELECT * FROM pg_policies WHERE tablename = 'messages';

-- Drop existing policies if they exist and recreate them correctly
DROP POLICY IF EXISTS "Users can view their own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
DROP POLICY IF EXISTS "Users can update received messages" ON public.messages;

-- Make sure RLS is enabled
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view messages they sent or received
CREATE POLICY "Users can view their own messages"
  ON public.messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Policy: Users can insert messages they are sending
CREATE POLICY "Users can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Policy: Users can update messages they received (for marking as seen)
CREATE POLICY "Users can update received messages"
  ON public.messages FOR UPDATE
  USING (auth.uid() = receiver_id);
