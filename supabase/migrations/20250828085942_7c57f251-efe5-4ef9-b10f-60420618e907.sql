-- Fix security warnings by adding proper search_path to functions

-- Fix search_path for cleanup_typing_indicators function
CREATE OR REPLACE FUNCTION public.cleanup_typing_indicators()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  DELETE FROM public.typing_indicators 
  WHERE updated_at < now() - interval '10 seconds';
END;
$$;

-- Fix search_path for update_user_presence function
CREATE OR REPLACE FUNCTION public.update_user_presence(new_status TEXT DEFAULT 'online')
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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