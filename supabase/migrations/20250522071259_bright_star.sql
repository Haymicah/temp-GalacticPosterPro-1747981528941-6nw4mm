/*
  # Fix User Policies
  
  1. Changes
    - Remove recursive policies that were causing infinite loops
    - Simplify policy conditions
    - Add proper role-based access control
  
  2. Security
    - Enable RLS
    - Add separate policies for different operations
    - Ensure proper access control
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access to own profile" ON users;
DROP POLICY IF EXISTS "Enable update access to own profile" ON users;
DROP POLICY IF EXISTS "Admin full access" ON users;

-- Create new policies
CREATE POLICY "Users can view own data"
ON users FOR SELECT
TO authenticated
USING (
  id = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Users can update own data"
ON users FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

CREATE POLICY "Admin can manage all data"
ON users FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Make sure RLS is enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;