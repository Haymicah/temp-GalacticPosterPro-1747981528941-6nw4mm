/*
  # Fix RLS policies for users table
  
  1. Changes
    - Remove recursive policy checks that were causing infinite loops
    - Simplify admin access policy
    - Add basic profile management policies
    
  2. Security
    - Users can only view and update their own profiles
    - Admins retain full access but without recursive checks
*/

-- Drop existing policies to start fresh
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Admins have full access" ON users;

-- Create new simplified policies
CREATE POLICY "Enable read access to own profile"
ON users FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Enable update access to own profile"
ON users FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Admin full access"
ON users FOR ALL
TO authenticated
USING (
  role = 'admin'
);

-- Make sure RLS is enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;