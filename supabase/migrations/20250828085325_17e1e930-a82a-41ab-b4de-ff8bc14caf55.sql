-- Add some sample messages to make channels feel alive
-- First, let's create a system user for announcements
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
VALUES (
  'system-0000-0000-0000-000000000000',
  'system@kingdom.com',
  '$2a$10$abc123def456ghi789jkl012',
  now(),
  now(),
  now(),
  '{"username": "Kingdom Herald"}'::jsonb
);

-- Create system profile
INSERT INTO public.profiles (user_id, username, rank, xp, is_vip, remaining_decrees) VALUES
('system-0000-0000-0000-000000000000', 'Kingdom Herald', 'King', 999999, true, 999);

-- Get channel IDs for sample messages
DO $$
DECLARE
    town_square_id uuid;
    general_chat_id uuid;
    announcements_id uuid;
    tavern_id uuid;
    trading_post_id uuid;
    help_support_id uuid;
BEGIN
    -- Get channel IDs
    SELECT id INTO town_square_id FROM channels WHERE name = 'Town Square';
    SELECT id INTO general_chat_id FROM channels WHERE name = 'General Chat';
    SELECT id INTO announcements_id FROM channels WHERE name = 'Announcements';
    SELECT id INTO tavern_id FROM channels WHERE name = 'Tavern';
    SELECT id INTO trading_post_id FROM channels WHERE name = 'Trading Post';
    SELECT id INTO help_support_id FROM channels WHERE name = 'Help & Support';

    -- Add welcome messages
    IF announcements_id IS NOT NULL THEN
        INSERT INTO public.messages (channel_id, user_id, content, is_decree) VALUES
        (announcements_id, 'system-0000-0000-0000-000000000000', 'Welcome to the Kingdom! 👑 Your adventure begins here. Explore different channels, gain XP, and rise through the ranks!', true),
        (announcements_id, 'system-0000-0000-0000-000000000000', 'New citizens: Start in Town Square and Trading Post. Advance to unlock Knight Halls and VIP Chambers!', false);
    END IF;

    IF town_square_id IS NOT NULL THEN
        INSERT INTO public.messages (channel_id, user_id, content, is_decree) VALUES
        (town_square_id, 'system-0000-0000-0000-000000000000', 'Welcome to the main gathering place! This is where all citizens can chat and get to know each other.', false),
        (town_square_id, 'system-0000-0000-0000-000000000000', 'Feel free to introduce yourself and ask questions. The kingdom thrives on community!', false);
    END IF;

    IF general_chat_id IS NOT NULL THEN
        INSERT INTO public.messages (channel_id, user_id, content, is_decree) VALUES
        (general_chat_id, 'system-0000-0000-0000-000000000000', 'General discussions happen here. Share your thoughts, ideas, and experiences!', false);
    END IF;

    IF tavern_id IS NOT NULL THEN
        INSERT INTO public.messages (channel_id, user_id, content, is_decree) VALUES
        (tavern_id, 'system-0000-0000-0000-000000000000', '🍺 Welcome to the Tavern! Grab a drink and enjoy casual conversations with fellow citizens.', false),
        (tavern_id, 'system-0000-0000-0000-000000000000', 'This is the perfect place for light-hearted chats and kingdom gossip!', false);
    END IF;

    IF trading_post_id IS NOT NULL THEN
        INSERT INTO public.messages (channel_id, user_id, content, is_decree) VALUES
        (trading_post_id, 'system-0000-0000-0000-000000000000', '💰 Welcome to the Trading Post! Buy, sell, and trade with fellow citizens here.', false),
        (trading_post_id, 'system-0000-0000-0000-000000000000', 'Looking for something specific? Post your trade requests and offers!', false);
    END IF;

    IF help_support_id IS NOT NULL THEN
        INSERT INTO public.messages (channel_id, user_id, content, is_decree) VALUES
        (help_support_id, 'system-0000-0000-0000-000000000000', '❓ Need help navigating the kingdom? Ask your questions here!', false),
        (help_support_id, 'system-0000-0000-0000-000000000000', 'Tips: Gain XP by chatting, reach Earl rank for VIP status, and explore different channels as you advance!', false);
    END IF;
END $$;