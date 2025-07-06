/*
  # Remove CipherVault Tables

  1. Security
    - Drop all policies for cipher_vault table
    - Drop cipher_vault table completely
    
  2. Cleanup
    - Remove all traces of cipher vault functionality
    - Clean database of related data
*/

-- Drop all policies first
DROP POLICY IF EXISTS "Allow demigod_owner select" ON cipher_vault;
DROP POLICY IF EXISTS "Allow demigod_owner insert" ON cipher_vault;
DROP POLICY IF EXISTS "Allow demigod_owner update" ON cipher_vault;
DROP POLICY IF EXISTS "Allow demigod_owner delete" ON cipher_vault;

-- Drop the table completely
DROP TABLE IF EXISTS cipher_vault;