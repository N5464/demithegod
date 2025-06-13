/*
  # Fix MoneyMap RLS Policies

  1. Security Updates
    - Add missing SELECT policy for demigod_owner on moneymap table
    - Add missing UPDATE policy for demigod_owner on moneymap table  
    - Add missing DELETE policy for demigod_owner on moneymap table
    
  2. Changes
    - The table already has an INSERT policy for demigod_owner
    - Adding the remaining CRUD policies to complete the access control
    - All policies restrict access to user_id = 'demigod_owner'
*/

-- Add SELECT policy for demigod_owner
CREATE POLICY "Allow select for demigod_owner"
  ON moneymap
  FOR SELECT
  TO public
  USING (user_id = 'demigod_owner'::text);

-- Add UPDATE policy for demigod_owner
CREATE POLICY "Allow update for demigod_owner"
  ON moneymap
  FOR UPDATE
  TO public
  USING (user_id = 'demigod_owner'::text)
  WITH CHECK (user_id = 'demigod_owner'::text);

-- Add DELETE policy for demigod_owner
CREATE POLICY "Allow delete for demigod_owner"
  ON moneymap
  FOR DELETE
  TO public
  USING (user_id = 'demigod_owner'::text);