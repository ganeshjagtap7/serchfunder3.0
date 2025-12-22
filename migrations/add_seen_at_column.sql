-- Add seen_at column to messages table
ALTER TABLE public.messages
ADD COLUMN IF NOT EXISTS seen_at TIMESTAMP WITH TIME ZONE;

-- Add comment for documentation
COMMENT ON COLUMN public.messages.seen_at IS 'Timestamp when the message was seen by the receiver';

-- Verify the column was added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'messages'
ORDER BY ordinal_position;
