-- This script should be run AFTER you've created your first user account through the signup process
-- Replace 'your-email@example.com' with the email you used to sign up

-- Update an existing user to admin role
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'your-email@example.com';

-- Or if you want to check what users exist first:
-- SELECT id, email, name, role FROM public.users;
