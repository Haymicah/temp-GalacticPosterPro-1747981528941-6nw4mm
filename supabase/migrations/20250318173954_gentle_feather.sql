/*
  # Admin Dashboard Schema Update

  1. Changes
    - Add policy existence checks before creation
    - Maintain all existing tables and functionality
    - Ensure safe policy creation

  2. Security
    - Maintain RLS on all tables
    - Add proper policies with existence checks
    - Secure access control
*/

-- Create function to check if policy exists
CREATE OR REPLACE FUNCTION policy_exists(
  policy_name text,
  table_name text,
  schema_name text DEFAULT 'public'
) RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE policyname = policy_name
    AND tablename = table_name
    AND schemaname = schema_name
  );
END;
$$ LANGUAGE plpgsql;

-- Create policies with existence check
DO $$ 
BEGIN
  -- Users table policies
  IF NOT policy_exists('Users can view own data', 'users') THEN
    CREATE POLICY "Users can view own data"
      ON users
      FOR SELECT
      TO authenticated
      USING (auth.uid() = id);
  END IF;

  IF NOT policy_exists('Admins can view all users', 'users') THEN
    CREATE POLICY "Admins can view all users"
      ON users
      FOR ALL
      TO authenticated
      USING (EXISTS (
        SELECT 1 FROM users
        WHERE id = auth.uid() AND role = 'admin'
      ));
  END IF;

  -- Transactions table policies
  IF NOT policy_exists('Users can view own transactions', 'transactions') THEN
    CREATE POLICY "Users can view own transactions"
      ON transactions
      FOR SELECT
      TO authenticated
      USING (user_id = auth.uid());
  END IF;

  IF NOT policy_exists('Admins can view all transactions', 'transactions') THEN
    CREATE POLICY "Admins can view all transactions"
      ON transactions
      FOR ALL
      TO authenticated
      USING (EXISTS (
        SELECT 1 FROM users
        WHERE id = auth.uid() AND role = 'admin'
      ));
  END IF;

  -- Network stats policies
  IF NOT policy_exists('Public can view network stats', 'network_stats') THEN
    CREATE POLICY "Public can view network stats"
      ON network_stats
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  -- Admin logs policies
  IF NOT policy_exists('Only admins can view logs', 'admin_logs') THEN
    CREATE POLICY "Only admins can view logs"
      ON admin_logs
      FOR SELECT
      TO authenticated
      USING (EXISTS (
        SELECT 1 FROM users
        WHERE id = auth.uid() AND role = 'admin'
      ));
  END IF;

  -- Notifications policies
  IF NOT policy_exists('Users can view own notifications', 'notifications') THEN
    CREATE POLICY "Users can view own notifications"
      ON notifications
      FOR SELECT
      TO authenticated
      USING (user_id = auth.uid());
  END IF;

  -- Reports policies
  IF NOT policy_exists('Users can view own reports', 'reports') THEN
    CREATE POLICY "Users can view own reports"
      ON reports
      FOR SELECT
      TO authenticated
      USING (user_id = auth.uid());
  END IF;

END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_predictions_user_id ON predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id);

-- Create function to update transaction status
CREATE OR REPLACE FUNCTION update_transaction_status()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for transaction status updates
DROP TRIGGER IF EXISTS transaction_status_update ON transactions;
CREATE TRIGGER transaction_status_update
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_transaction_status();

-- Create function to calculate network difficulty
CREATE OR REPLACE FUNCTION calculate_network_difficulty()
RETURNS decimal AS $$
DECLARE
  difficulty decimal;
BEGIN
  SELECT AVG(metric_value) * RANDOM() * 100 
  INTO difficulty
  FROM network_stats 
  WHERE metric_name = 'performance'
  AND timestamp > now() - interval '1 hour';
  
  RETURN COALESCE(difficulty, 50);
END;
$$ LANGUAGE plpgsql;

-- Insert default user roles
INSERT INTO user_roles (name, permissions) VALUES
  ('admin', '{"all": true}'::jsonb),
  ('user', '{"read": true, "write": true}'::jsonb),
  ('viewer', '{"read": true}'::jsonb)
ON CONFLICT (name) DO NOTHING;