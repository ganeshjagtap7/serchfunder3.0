-- Enable RLS on messages table
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

-- Add comments for documentation
COMMENT ON POLICY "Users can view their own messages" ON public.messages IS 'Users can only view messages they sent or received';
COMMENT ON POLICY "Users can send messages" ON public.messages IS 'Users can only send messages as themselves';
COMMENT ON POLICY "Users can update received messages" ON public.messages IS 'Users can update messages they received (e.g., mark as seen)';
