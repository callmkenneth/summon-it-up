-- Drop trigger first, then function, then recreate with secure search path
DROP TRIGGER IF EXISTS update_events_updated_at ON public.events;
DROP FUNCTION IF EXISTS public.update_updated_at_column();
DROP FUNCTION IF EXISTS public.get_spots_remaining(UUID);

-- Create function to update updated_at timestamp with secure search path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER update_events_updated_at
BEFORE UPDATE ON public.events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to calculate spots remaining with secure search path
CREATE OR REPLACE FUNCTION public.get_spots_remaining(event_uuid UUID)
RETURNS INTEGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  event_capacity INTEGER;
  current_rsvps INTEGER;
BEGIN
  -- Get event capacity (null means unlimited)
  SELECT guest_limit INTO event_capacity
  FROM public.events 
  WHERE id = event_uuid;
  
  -- If unlimited guests, return a large number
  IF event_capacity IS NULL THEN
    RETURN 999999;
  END IF;
  
  -- Count current RSVPs with status 'yes'
  SELECT COUNT(*) INTO current_rsvps
  FROM public.rsvps 
  WHERE event_id = event_uuid AND status = 'yes';
  
  -- Return remaining spots
  RETURN GREATEST(0, event_capacity - current_rsvps);
END;
$$;