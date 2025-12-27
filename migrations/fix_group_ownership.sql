-- This migration fixes group ownership by setting you as the owner
-- Replace 'YOUR_GROUP_ID' with the actual group ID from the URL
-- Replace 'YOUR_USER_ID' with your actual user ID

-- First, let's check the current owner_id of the group
SELECT id, name, owner_id, created_at
FROM groups
WHERE id = '4782f6fc-c429-4553-8b3e-bec728830aa4';

-- If the owner_id doesn't match your user ID (076d5309-b141-43d0-8e70-b85d1d27db9e),
-- uncomment and run this to fix it:

-- UPDATE groups
-- SET owner_id = '076d5309-b141-43d0-8e70-b85d1d27db9e'
-- WHERE id = '4782f6fc-c429-4553-8b3e-bec728830aa4';

-- Then verify it worked:
-- SELECT id, name, owner_id FROM groups WHERE id = '4782f6fc-c429-4553-8b3e-bec728830aa4';
