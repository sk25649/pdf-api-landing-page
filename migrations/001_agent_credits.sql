-- Migration: Add agent USDC prepaid credits support
-- Run this in the Supabase SQL editor.

ALTER TABLE user_plans
  ADD COLUMN IF NOT EXISTS credits integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS usdc_address text,
  ADD COLUMN IF NOT EXISTS notify_email text,
  ADD COLUMN IF NOT EXISTS low_balance_notified_at timestamptz;

-- Index for fast webhook lookups by wallet address
CREATE INDEX IF NOT EXISTS idx_user_plans_usdc_address ON user_plans (usdc_address);
