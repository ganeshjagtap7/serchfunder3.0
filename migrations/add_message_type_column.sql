-- Add message_type column to messages table
-- Create enum type for message types if it doesn't exist
DO $$ BEGIN
    CREATE TYPE message_type AS ENUM ('text', 'post', 'image');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add the message_type column with default value 'text'
ALTER TABLE public.messages
ADD COLUMN IF NOT EXISTS message_type message_type DEFAULT 'text' NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.messages.message_type IS 'Type of message: text, post, or image';
