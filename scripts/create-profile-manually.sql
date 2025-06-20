-- This script can be used to manually create a profile if the trigger fails
-- Replace the values with actual user data

-- Example: Create a profile for a specific user
-- You can get the user ID from the auth.users table

-- First, let's see what users exist
SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC LIMIT 5;

-- Create profile for a specific user (replace with actual user ID and details)
-- INSERT INTO public.profiles (id, email, full_name, role)
-- VALUES (
--   'ae91ad77-13d6-464b-b3ba-bd5d65d18f83', -- Replace with actual user ID
--   'user@example.com', -- Replace with actual email
--   'User Name', -- Replace with actual name
--   'student' -- Replace with actual role
-- )
-- ON CONFLICT (id) DO UPDATE SET
--   email = EXCLUDED.email,
--   full_name = EXCLUDED.full_name,
--   role = EXCLUDED.role,
--   updated_at = NOW();
