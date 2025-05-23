/*
  # Add phone column to user_profiles table

  1. Changes
    - Add phone column to user_profiles table
    - Create index on phone column
    - Update RLS policies to include phone field access

  2. Security
    - Maintain existing RLS policies
    - Ensure proper access control for phone field
*/

-- Add phone column to user_profiles if it doesn't exist
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS phone text;

-- Create index on phone column
CREATE INDEX IF NOT EXISTS idx_user_profiles_phone ON user_profiles (phone);

-- Ensure RLS is enabled
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Update RLS policies
DO $$
BEGIN
  -- Drop existing policies
  DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;

  -- Recreate policies with phone field access
  CREATE POLICY "Users can view own profile"
    ON user_profiles
    FOR ALL
    TO authenticated
    USING (id = auth.uid());
END $$;

-- Migrate existing phone numbers from users table if they exist
DO $$
BEGIN
  UPDATE user_profiles
  SET phone = users.phone
  FROM users
  WHERE user_profiles.id = users.id
  AND users.phone IS NOT NULL;
END $$;