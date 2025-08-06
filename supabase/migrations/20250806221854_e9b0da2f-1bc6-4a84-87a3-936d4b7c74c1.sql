-- Add gender-based spot checking function
CREATE OR REPLACE FUNCTION public.get_gender_spots_remaining(event_uuid uuid, target_gender text)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  event_capacity INTEGER;
  event_male_ratio NUMERIC;
  event_female_ratio NUMERIC;
  event_use_ratio BOOLEAN;
  current_male_rsvps INTEGER;
  current_female_rsvps INTEGER;
  male_capacity INTEGER;
  female_capacity INTEGER;
BEGIN
  -- Get event details
  SELECT guest_limit, male_ratio, female_ratio, use_ratio_control, unlimited_guests
  INTO event_capacity, event_male_ratio, event_female_ratio, event_use_ratio
  FROM public.events 
  WHERE id = event_uuid;
  
  -- If unlimited guests or no ratio control, return large number
  IF event_capacity IS NULL OR event_use_ratio = FALSE THEN
    RETURN 999999;
  END IF;
  
  -- Calculate gender-specific capacities
  male_capacity := FLOOR(event_capacity * event_male_ratio);
  female_capacity := event_capacity - male_capacity;
  
  -- Count current RSVPs by gender
  SELECT 
    COALESCE(SUM(CASE WHEN gender = 'male' THEN 1 ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN gender = 'female' THEN 1 ELSE 0 END), 0)
  INTO current_male_rsvps, current_female_rsvps
  FROM public.rsvps 
  WHERE event_id = event_uuid AND status = 'yes';
  
  -- Return remaining spots for target gender
  IF target_gender = 'male' THEN
    RETURN GREATEST(0, male_capacity - current_male_rsvps);
  ELSIF target_gender = 'female' THEN
    RETURN GREATEST(0, female_capacity - current_female_rsvps);
  ELSE
    -- For other genders, return general spots remaining
    RETURN GREATEST(0, event_capacity - current_male_rsvps - current_female_rsvps);
  END IF;
END;
$$;