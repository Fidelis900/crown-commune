-- Add diverse kingdom channels for different activities and rank levels

-- Public Channels (Rank 0-2)
INSERT INTO public.channels (name, description, type, min_rank_level) VALUES
('Town Square', 'Main gathering place for all citizens', 'public', 0),
('Trading Post', 'Buy, sell, and trade with fellow citizens', 'public', 0),
('Tavern', 'Casual conversations and kingdom gossip', 'public', 1),
('Training Grounds', 'Discuss combat techniques and training', 'public', 1),
('Market Plaza', 'Commerce and business discussions', 'public', 2),
('Guild Hall', 'Form and manage guilds and alliances', 'public', 2);

-- Knight Channels (Rank 3-4) 
INSERT INTO public.channels (name, description, type, min_rank_level) VALUES
('Knights Hall', 'Discussions for knights and warriors', 'knight', 3),
('Quest Board', 'Share and organize kingdom quests', 'knight', 3),
('War Council', 'Strategic military discussions', 'knight', 4),
('Noble Assembly', 'Baron-level governance discussions', 'noble', 4);

-- VIP Channels (Rank 5-6)
INSERT INTO public.channels (name, description, type, min_rank_level) VALUES
('VIP Lounge', 'Exclusive discussions for Earl+ members', 'vip', 5),
('Royal Gardens', 'Refined conversations among nobility', 'vip', 5),
('Treasury Council', 'Economic and financial discussions', 'vip', 6),
('Court of Honor', 'Marquis-level ceremonial matters', 'vip', 6);

-- Exclusive Royal Channels (Rank 7+)
INSERT INTO public.channels (name, description, type, min_rank_level) VALUES
('Inner Circle', 'Duke and above exclusive discussions', 'exclusive', 7),
('Royal Council', 'High-level kingdom governance', 'exclusive', 8),
('Crown Chamber', 'Ultimate authority discussions for royalty', 'exclusive', 9);

-- Special Purpose Channels
INSERT INTO public.channels (name, description, type, min_rank_level) VALUES
('Announcements', 'Official kingdom announcements', 'official', 0),
('Help & Support', 'Get help navigating the kingdom', 'support', 0),
('Events & Festivals', 'Kingdom events and celebrations', 'events', 1),
('Archives', 'Historical records and lore', 'archive', 3),
('Diplomatic Relations', 'External kingdom affairs', 'diplomatic', 5);