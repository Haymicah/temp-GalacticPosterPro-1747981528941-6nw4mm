/*
  # User Dashboard Schema

  1. New Tables
    - `user_profiles`
      - Extended user profile information
    - `user_campaigns`
      - User campaign settings and schedules
    - `user_reports`
      - Generated reports and analytics
    - `user_preferences`
      - User-specific settings and preferences

  2. Security
    - Enable RLS on all tables
    - Add policies for user access
    - Ensure data isolation between users
*/

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES users(id),
  avatar_url text,
  bio text,
  website text,
  social_links jsonb DEFAULT '{}'::jsonb,
  preferences jsonb DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now()
);

-- User campaigns table
CREATE TABLE IF NOT EXISTS user_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  name text NOT NULL,
  description text,
  settings jsonb NOT NULL,
  schedule jsonb NOT NULL,
  status text DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- User reports table
CREATE TABLE IF NOT EXISTS user_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  campaign_id uuid REFERENCES user_campaigns(id),
  type text NOT NULL,
  data jsonb NOT NULL,
  generated_at timestamptz DEFAULT now(),
  period_start timestamptz,
  period_end timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- User preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY REFERENCES users(id),
  notification_settings jsonb DEFAULT '{
    "email": true,
    "push": true,
    "schedule": true
  }'::jsonb,
  theme_preferences jsonb DEFAULT '{
    "mode": "dark",
    "accent_color": "#00FF00"
  }'::jsonb,
  campaign_defaults jsonb DEFAULT '{
    "post_frequency": "daily",
    "best_times": true,
    "auto_schedule": true
  }'::jsonb,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR ALL
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can manage own campaigns"
  ON user_campaigns
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can view own reports"
  ON user_reports
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage own preferences"
  ON user_preferences
  FOR ALL
  TO authenticated
  USING (id = auth.uid());

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_campaigns_user_id ON user_campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_user_reports_user_id ON user_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_user_reports_campaign_id ON user_reports(campaign_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_campaigns_updated_at
  BEFORE UPDATE ON user_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();