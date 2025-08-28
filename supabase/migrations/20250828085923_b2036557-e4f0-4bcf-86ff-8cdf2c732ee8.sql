-- Add real-time presence and enhanced message features

-- Add reactions table
CREATE TABLE public.message_reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  emoji VARCHAR(10) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(message_id, user_id, emoji)
);

-- Enable RLS for reactions
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;

-- Create policies for reactions
CREATE POLICY "Users can view all reactions" 
ON public.message_reactions 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own reactions" 
ON public.message_reactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reactions" 
ON public.message_reactions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add typing indicators table
CREATE TABLE public.typing_indicators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  channel_id UUID NOT NULL REFERENCES public.channels(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(channel_id, user_id)
);

-- Enable RLS for typing indicators
ALTER TABLE public.typing_indicators ENABLE ROW LEVEL SECURITY;

-- Create policies for typing indicators
CREATE POLICY "Users can view typing indicators in accessible channels" 
ON public.typing_indicators 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own typing indicators" 
ON public.typing_indicators 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own typing indicators" 
ON public.typing_indicators 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own typing indicators" 
ON public.typing_indicators 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add direct message channels table
CREATE TABLE public.direct_message_channels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user1_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user1_id, user2_id),
  CHECK (user1_id < user2_id) -- Ensure consistent ordering
);

-- Enable RLS for DM channels
ALTER TABLE public.direct_message_channels ENABLE ROW LEVEL SECURITY;

-- Create policies for DM channels
CREATE POLICY "Users can view their own DM channels" 
ON public.direct_message_channels 
FOR SELECT 
USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can create DM channels" 
ON public.direct_message_channels 
FOR INSERT 
WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Add message editing support
ALTER TABLE public.messages 
ADD COLUMN edited_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN is_deleted BOOLEAN DEFAULT false,
ADD COLUMN reply_to_id UUID REFERENCES public.messages(id) ON DELETE SET NULL;

-- Add user presence tracking
CREATE TABLE public.user_presence (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  status VARCHAR(20) DEFAULT 'offline' CHECK (status IN ('online', 'away', 'busy', 'offline')),
  last_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for user presence
ALTER TABLE public.user_presence ENABLE ROW LEVEL SECURITY;

-- Create policies for user presence
CREATE POLICY "Users can view all presence data" 
ON public.user_presence 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own presence" 
ON public.user_presence 
FOR ALL 
USING (auth.uid() = user_id);

-- Function to automatically clean up old typing indicators
CREATE OR REPLACE FUNCTION public.cleanup_typing_indicators()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.typing_indicators 
  WHERE updated_at < now() - interval '10 seconds';
END;
$$;

-- Create function to update user presence
CREATE OR REPLACE FUNCTION public.update_user_presence(new_status TEXT DEFAULT 'online')
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_presence (user_id, status, last_seen, updated_at)
  VALUES (auth.uid(), new_status, now(), now())
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    status = EXCLUDED.status,
    last_seen = now(),
    updated_at = now();
END;
$$;

-- Set up realtime for new tables
ALTER TABLE public.message_reactions REPLICA IDENTITY FULL;
ALTER TABLE public.typing_indicators REPLICA IDENTITY FULL;
ALTER TABLE public.user_presence REPLICA IDENTITY FULL;