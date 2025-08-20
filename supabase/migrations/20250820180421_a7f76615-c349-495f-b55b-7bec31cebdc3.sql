-- Fix Function Search Path Mutable warnings by setting search_path for all functions

-- Update get_public_rsvps with search_path set
CREATE OR REPLACE FUNCTION public.get_public_rsvps(event_uuid uuid)
 RETURNS TABLE(id uuid, event_id uuid, attendee_name text, gender text, status text, created_at timestamp with time zone)
 LANGUAGE plpgsql
 STABLE
 SET search_path TO ''
AS $function$
BEGIN
  -- Return only non-sensitive RSVP data (no email addresses)
  -- This function can work without SECURITY DEFINER since it only returns public data
  RETURN QUERY
  SELECT r.id, r.event_id, r.attendee_name, r.gender, r.status, r.created_at
  FROM public.rsvps r
  WHERE r.event_id = event_uuid;
END;
$function$;

-- Update get_spots_remaining with search_path set
CREATE OR REPLACE FUNCTION public.get_spots_remaining(event_uuid uuid)
 RETURNS integer
 LANGUAGE plpgsql
 STABLE
 SET search_path TO ''
AS $function$
DECLARE
  event_capacity INTEGER;
  current_rsvps INTEGER;
BEGIN
  -- Get event capacity from public view (null means unlimited)
  SELECT guest_limit INTO event_capacity
  FROM public.public_events 
  WHERE id = event_uuid;
  
  -- If unlimited guests, return a large number
  IF event_capacity IS NULL THEN
    RETURN 999999;
  END IF;
  
  -- Count current RSVPs with status 'yes' using public function
  SELECT COUNT(*) INTO current_rsvps
  FROM public.get_public_rsvps(event_uuid) 
  WHERE status = 'yes';
  
  -- Return remaining spots
  RETURN GREATEST(0, event_capacity - current_rsvps);
END;
$function$;

-- Update get_gender_spots_remaining with search_path set
CREATE OR REPLACE FUNCTION public.get_gender_spots_remaining(event_uuid uuid, target_gender text)
 RETURNS integer
 LANGUAGE plpgsql
 STABLE
 SET search_path TO ''
AS $function$
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
  -- Get event details from public view
  SELECT guest_limit, male_ratio, female_ratio, use_ratio_control
  INTO event_capacity, event_male_ratio, event_female_ratio, event_use_ratio
  FROM public.public_events 
  WHERE id = event_uuid;
  
  -- If unlimited guests or no ratio control, return large number
  IF event_capacity IS NULL OR event_use_ratio = FALSE THEN
    RETURN 999999;
  END IF;
  
  -- Calculate gender-specific capacities
  male_capacity := FLOOR(event_capacity * event_male_ratio);
  female_capacity := event_capacity - male_capacity;
  
  -- Count current RSVPs by gender using public function
  SELECT 
    COALESCE(SUM(CASE WHEN gender = 'male' THEN 1 ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN gender = 'female' THEN 1 ELSE 0 END), 0)
  INTO current_male_rsvps, current_female_rsvps
  FROM public.get_public_rsvps(event_uuid)
  WHERE status = 'yes';
  
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
$function$;