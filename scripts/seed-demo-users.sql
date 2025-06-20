-- Insert demo users (these would be created through the signup process normally)
-- Note: In a real application, users would sign up through the UI

-- Demo admin user
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data
) VALUES (
  '550e8400-e29b-41d4-a716-446655440001',
  'admin@school.edu',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"full_name": "System Administrator", "role": "admin"}'::jsonb
) ON CONFLICT (email) DO NOTHING;

-- Demo teacher user
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data
) VALUES (
  '550e8400-e29b-41d4-a716-446655440002',
  'teacher@school.edu',
  crypt('teacher123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"full_name": "John Teacher", "role": "teacher"}'::jsonb
) ON CONFLICT (email) DO NOTHING;

-- Demo student user
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data
) VALUES (
  '550e8400-e29b-41d4-a716-446655440003',
  'student@school.edu',
  crypt('student123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"full_name": "Jane Student", "role": "student"}'::jsonb
) ON CONFLICT (email) DO NOTHING;

-- Insert demo users directly into auth.users (this should be done via Supabase Auth API in production)
-- For development, we'll create profiles directly

-- First, let's create some demo profiles
-- Note: In production, these should be created through the signup process

INSERT INTO public.profiles (id, email, full_name, role, department) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'admin@school.edu', 'System Administrator', 'admin', 'Administration'),
  ('550e8400-e29b-41d4-a716-446655440002', 'teacher@school.edu', 'John Teacher', 'teacher', 'Mathematics'),
  ('550e8400-e29b-41d4-a716-446655440003', 'student@school.edu', 'Jane Student', 'student', 'Grade 10')
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  department = EXCLUDED.department;

-- Note: To create actual auth users, you need to use Supabase Auth API
-- These profiles are for development purposes only
