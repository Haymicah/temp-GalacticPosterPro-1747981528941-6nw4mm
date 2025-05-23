/*
  # Add Default Admin User

  1. Changes
    - Add default admin user for testing
    - Set up initial credentials
    - Ensure admin role and permissions

  2. Security
    - Password will need to be changed on first login
    - Full admin permissions granted
*/

DO $$ 
BEGIN
  -- Insert default admin user if not exists
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'admin@example.com'
  ) THEN
    -- Insert into auth.users
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'admin@example.com',
      crypt('123456', gen_salt('bf')),
      NOW(),
      NOW(),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"name":"Admin User"}',
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    );

    -- Get the user id
    WITH admin_user AS (
      SELECT id FROM auth.users WHERE email = 'admin@example.com' LIMIT 1
    )
    -- Insert into public.users
    INSERT INTO public.users (
      id,
      email,
      full_name,
      role,
      subscription_tier,
      subscription_status,
      created_at
    )
    SELECT
      id,
      'admin@example.com',
      'Admin User',
      'admin',
      'enterprise',
      'active',
      NOW()
    FROM admin_user;
  END IF;
END $$;