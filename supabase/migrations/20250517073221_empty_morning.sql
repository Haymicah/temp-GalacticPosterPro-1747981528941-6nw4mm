/*
  # Fix Admin User Creation

  1. Changes
    - Fix variable declaration issue
    - Use CTE for cleaner ID handling
    - Ensure proper role assignment
    - Add proper metadata

  2. Security
    - Maintain password encryption
    - Set proper role claims
    - Initialize security settings
*/

DO $$ 
DECLARE
  admin_user_id uuid;
BEGIN
  -- Create admin user if not exists
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'admin@example.com'
  ) THEN
    -- Insert into auth.users and get the ID
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
      jsonb_build_object(
        'provider', 'email',
        'providers', ARRAY['email'],
        'role', 'admin'
      ),
      jsonb_build_object(
        'name', 'Admin User',
        'role', 'admin'
      ),
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    )
    RETURNING id INTO admin_user_id;

    -- Insert into public.users
    INSERT INTO public.users (
      id,
      email,
      full_name,
      role,
      subscription_tier,
      subscription_status,
      created_at,
      settings,
      metadata
    ) VALUES (
      admin_user_id,
      'admin@example.com',
      'Admin User',
      'admin',
      'enterprise',
      'active',
      NOW(),
      jsonb_build_object(
        'theme', 'dark',
        'notifications', true,
        'twoFactorEnabled', false
      ),
      jsonb_build_object(
        'lastPasswordChange', NOW(),
        'loginCount', 0,
        'isFirstLogin', true
      )
    );

    RAISE NOTICE 'Created admin user with ID: %', admin_user_id;
  END IF;
END $$;