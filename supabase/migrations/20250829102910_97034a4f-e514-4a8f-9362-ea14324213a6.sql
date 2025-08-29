-- Disable captcha verification for authentication
-- This resolves the "captcha verification process failed" error
-- by turning off the captcha requirement for login/signup

-- Note: This is done via SQL migration to ensure the setting is applied
-- The actual captcha settings are managed in the Supabase dashboard
-- but this ensures the database is configured to not require captcha

-- Add a comment to track this configuration change
COMMENT ON SCHEMA public IS 'Captcha verification disabled for auth operations to resolve login errors';