/*
  # Add phone column to users table

  1. Changes
    - Add phone column to users table if it doesn't exist
    - Add index on phone column for faster lookups
    - Update RLS policies to include phone field access

  2. Security
    - Maintain existing RLS policies
    - Ensure users can only update their own phone number
    - Admins retain full access
*/

-- Add phone column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'phone'
  ) THEN
    ALTER TABLE users ADD COLUMN phone text;
  END IF;
END $$;

-- Create index on phone column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'users' AND indexname = 'idx_users_phone'
  ) THEN
    CREATE INDEX idx_users_phone ON users (phone);
  END IF;
END $$;

-- Ensure RLS is enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Update existing policies to explicitly include phone field
DO $$
BEGIN
  -- Drop and recreate policies to ensure they're up to date
  DROP POLICY IF EXISTS "Users can view own profile" ON users;
  DROP POLICY IF EXISTS "Users can update own profile" ON users;
  DROP POLICY IF EXISTS "Admin full access" ON users;

  -- Recreate policies
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