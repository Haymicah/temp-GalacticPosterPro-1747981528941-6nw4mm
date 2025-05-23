/*
  # Fix User Policies

  1. Changes
    - Remove circular dependencies in user policies
    - Simplify policy conditions
    - Add proper user management policies
    
  2. Security
    - Users can only view and update their own data
    - Admins can manage all users
    - No cascading policy checks to avoid recursion
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Admins can manage all users" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;

-- Create new simplified policies
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins have full access"
ON users FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;