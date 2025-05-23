/*
  # Add phone column to users table

  1. Changes
    - Adds phone column to users table
    - Creates index on phone column
    - Updates RLS policies

  2. Security
    - Maintains RLS enabled
    - Updates policies for proper access control
*/

-- First ensure the column exists
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone text;

-- Now create the index since we know the column exists
CREATE INDEX IF NOT EXISTS idx_users_phone ON users (phone);

-- Ensure RLS is enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Update policies to handle phone field access
DO $$
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can view own profile" ON users;
  DROP POLICY IF EXISTS "Users can update own profile" ON users;
  DROP POLICY IF EXISTS "Admin full access" ON users;

  -- Recreate policies with proper access controls
  CREATE POLICY "Users can view own profile"
    ON users
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

  CREATE POLICY "Users can update own profile"
    ON users
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

  CREATE POLICY "Admin full access"
    ON users
    FOR ALL
    TO authenticated
    USING (role = 'admin');
END $$;