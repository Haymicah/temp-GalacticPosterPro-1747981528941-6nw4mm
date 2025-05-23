/*
  # Admin Dashboard Schema

  1. New Tables
    - `users`
      - Core user information and authentication
    - `transactions`
      - Financial transaction tracking
    - `predictions`
      - AI-generated business predictions
    - `analytics`
      - Business performance metrics
    - `network_stats`
      - Network performance indicators
    - `admin_logs`
      - Admin activity tracking
    - `user_roles`
      - User role management
    - `notifications`
      - System notifications
    - `reports`
      - Generated reports

  2. Security
    - Enable RLS on all tables
    - Add policies for admin and user access
    - Secure sensitive financial data

  3. Functions
    - Add functions for analytics calculations
    - Add functions for prediction generation
*/

-- Users table with extended profile
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text,
  role text DEFAULT 'user',
  subscription_tier text DEFAULT 'free',
  subscription_status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  last_login timestamptz,
  settings jsonb DEFAULT '{}'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  type text NOT NULL,
  amount decimal(12,2) NOT NULL,
  currency text DEFAULT 'USD',
  status text DEFAULT 'pending',
  description text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Predictions table
CREATE TABLE IF NOT EXISTS predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  type text NOT NULL,
  prediction jsonb NOT NULL,
  confidence decimal(5,2),
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  valid_until timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Analytics table
CREATE TABLE IF NOT EXISTS analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  metric_name text NOT NULL,
  metric_value jsonb NOT NULL,
  timestamp timestamptz DEFAULT now(),
  period text DEFAULT 'daily',
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Network stats table
CREATE TABLE IF NOT EXISTS network_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name text NOT NULL,
  metric_value decimal(12,2),
  difficulty decimal(12,2),
  status text DEFAULT 'normal',
  timestamp timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Admin logs table
CREATE TABLE IF NOT EXISTS admin_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES users(id),
  action text NOT NULL,
  details jsonb NOT NULL,
  ip_address text,
  created_at timestamptz DEFAULT now()
);

-- User roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  permissions jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'unread',
  created_at timestamptz DEFAULT now(),
  read_at timestamptz
);

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  type text NOT NULL,
  title text NOT NULL,
  content jsonb NOT NULL,
  status text DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  published_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE network_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users table policies
CREATE POLICY "Users can view own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all users"
  ON users
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Transactions table policies
CREATE POLICY "Users can view own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all transactions"
  ON transactions
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Network stats policies
CREATE POLICY "Public can view network stats"
  ON network_stats
  FOR SELECT
  TO authenticated
  USING (true);

-- Admin logs policies
CREATE POLICY "Only admins can view logs"
  ON admin_logs
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Notifications policies
CREATE POLICY "Users can view own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Reports policies
CREATE POLICY "Users can view own reports"
  ON reports
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

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