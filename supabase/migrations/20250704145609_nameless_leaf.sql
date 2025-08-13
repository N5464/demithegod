/*
  # Create CipherVault Table

  1. New Tables
    - `ciphervault`
      - `id` (uuid, primary key)
      - `user_id` (text, references user)
      - `tag` (text, category/label)
      - `title` (text, entry title)
      - `username` (text, encrypted username)
      - `password` (text, encrypted password)
      - `notes` (text, encrypted notes)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `ciphervault` table
    - Add policies for demigod_owner user access
    - All sensitive data is encrypted on frontend before storage
*/

CREATE TABLE IF NOT EXISTS ciphervault (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL DEFAULT 'demigod_owner',
  tag text NOT NULL DEFAULT '',
  title text NOT NULL DEFAULT '',
  username text NOT NULL DEFAULT '',
  password text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ciphervault ENABLE ROW LEVEL SECURITY;

-- Policies for demigod_owner access
CREATE POLICY "Allow demigod_owner select"
  ON ciphervault
  FOR SELECT
  TO public
  USING (user_id = 'demigod_owner'::text);

CREATE POLICY "Allow demigod_owner insert"
  ON ciphervault
  FOR INSERT
  TO public
  WITH CHECK (user_id = 'demigod_owner'::text);

CREATE POLICY "Allow demigod_owner update"
  ON ciphervault
  FOR UPDATE
  TO public
  USING (user_id = 'demigod_owner'::text)
  WITH CHECK (user_id = 'demigod_owner'::text);

CREATE POLICY "Allow demigod_owner delete"
  ON ciphervault
  FOR DELETE
  TO public
  USING (user_id = 'demigod_owner'::text);