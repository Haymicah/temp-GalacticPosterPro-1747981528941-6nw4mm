/*
  # Add User Profile Columns

  1. Changes
    - Add avatar_url column to users table
    - Add additional profile fields (website, location, phone, bio)
    - Set default values for new columns
    - Add updated_at trigger

  2. Security
    - Maintain existing RLS policies
    - No changes to security model needed
*/

-- Add new columns to users table
DO $$ 
BEGIN
  -- Add avatar_url if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE users ADD COLUMN avatar_url text;
  END IF;

  -- Add website if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'website'
  ) THEN
    ALTER TABLE users ADD COLUMN website text;
  END IF;

  -- Add location if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'location'
  ) THEN
    ALTER TABLE users ADD COLUMN location text;
  END IF;

  -- Add phone if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'phone'
  ) THEN
    ALTER TABLE users ADD COLUMN phone text;
  END IF;

  -- Add bio if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'bio'
  ) THEN
    ALTER TABLE users ADD COLUMN bio text;
  END IF;
END $$;

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger to users table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_users_updated_at'
  ) THEN
    CREATE TRIGGER update_users_updated_at
      BEFORE UPDATE ON users
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;