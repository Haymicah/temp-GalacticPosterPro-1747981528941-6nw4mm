/*
  # Add Prompt History Table

  1. New Tables
    - `prompt_history`
      - Store user-specific prompt history
      - Track content generation history per user

  2. Security
    - Enable RLS
    - Add policies for user access
    - Ensure data isolation between users
*/

-- Create prompt history table
CREATE TABLE IF NOT EXISTS prompt_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  prompt text NOT NULL,
  type text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE prompt_history ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own prompt history"
  ON prompt_history
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own prompt history"
  ON prompt_history
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_prompt_history_user_id ON prompt_history(user_id);
CREATE INDEX IF NOT EXISTS idx_prompt_history_timestamp ON prompt_history(timestamp DESC);