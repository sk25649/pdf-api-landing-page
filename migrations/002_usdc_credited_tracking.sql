-- Migration: Track credited USDC balance to prevent double-crediting in sweep cron
-- Run this in the Supabase SQL editor.

ALTER TABLE user_plans
  ADD COLUMN IF NOT EXISTS usdc_credited_atomic bigint NOT NULL DEFAULT 0;

-- usdc_credited_atomic stores the on-chain USDC balance (in atomic units, 6 decimals)
-- at the time of the last credit top-up. The sweep cron uses this to compute the delta:
--   credits_to_add = floor((current_balance - usdc_credited_atomic) / 1e6 * 50)
-- After crediting, usdc_credited_atomic is updated to current_balance.
-- If the sweep succeeds (balance goes to 0), usdc_credited_atomic resets via the
-- next cron run finding a delta of 0 (since balance and credited are both 0).
