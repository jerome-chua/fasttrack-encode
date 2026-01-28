-- Add timezone column with UTC default for existing users
ALTER TABLE users ADD COLUMN timezone TEXT DEFAULT 'UTC';

-- Update onboarding_step constraint to include 'timezone' step
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_onboarding_step_check;
ALTER TABLE users ADD CONSTRAINT users_onboarding_step_check
  CHECK (onboarding_step IN ('weight', 'goal', 'height', 'timezone', 'completed'));
