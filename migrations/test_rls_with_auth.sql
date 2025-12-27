-- Test if auth.uid() is working correctly
-- This should return your current user ID if you're logged in
SELECT auth.uid() as current_user_id;

-- Check if the RLS policies exist and their definitions
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual as using_expression
FROM pg_policies
WHERE tablename = 'messages'
ORDER BY cmd, policyname;

-- Try to select messages using the policy
-- This simulates what happens when the app makes a query
SELECT COUNT(*) as message_count
FROM messages
WHERE sender_id = auth.uid() OR receiver_id = auth.uid();
