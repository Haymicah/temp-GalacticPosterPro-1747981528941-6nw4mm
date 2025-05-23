/*
  # Add Default Admin User

  1. Changes
    - Add default admin user for testing
    - Set up initial credentials
    - Configure admin role and permissions

  2. Security
    - Password will need to be changed on first login
    - Admin role with full permissions
*/

DO $$ 
DECLARE
  admin_user_id uuid;
BEGIN
  -- Create admin user if not exists
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
      jsonb_build_object(
        'provider', 'email',
        'providers', ARRAY['email']
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

    -- Set admin role claim
    UPDATE auth.users 
    SET raw_app_meta_data = raw_app_meta_data || jsonb_build_object('role', 'admin')
    WHERE id = admin_user_id;
  END IF;
END $$;