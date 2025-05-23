/*
  # Update User Password

  1. Changes
    - Reset password for specified user
    - Ensure proper password encryption
*/

DO $$ 
BEGIN
  -- Update password in auth.users table
  UPDATE auth.users
  SET encrypted_password = crypt('123456', gen_salt('bf'))
  WHERE email = 'admin@zigiai.com';
END $$;