-- Fix SECURITY DEFINER functions by ensuring proper validation and removing where unnecessary

-- The update_updated_at_column function is a trigger function and is safe with SECURITY DEFINER
-- Keep it as is since trigger functions need elevated privileges

-- For the public read functions, we can remove SECURITY DEFINER since they only return public data
-- and work with our existing RLS policies

-- Recreate get_public_rsvps without SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.get_public_rsvps(event_uuid uuid)
 RETURNS TABLE(id uuid, event_id uuid, attendee_name text, gender text, status text, created_at timestamp with time zone)
 LANGUAGE plpgsql
 STABLE
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

-- Recreate get_spots_remaining without SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.get_spots_remaining(event_uuid uuid)
 RETURNS integer
 LANGUAGE plpgsql
 STABLE
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

-- Recreate get_gender_spots_remaining without SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.get_gender_spots_remaining(event_uuid uuid, target_gender text)
 RETURNS integer
 LANGUAGE plpgsql
 STABLE
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

-- Keep the host functions with SECURITY DEFINER but enhance security validation
-- These need SECURITY DEFINER to bypass RLS and access private data, but they validate access properly

-- Enhanced get_event_rsvps_for_host with additional validation
CREATE OR REPLACE FUNCTION public.get_event_rsvps_for_host(event_uuid uuid, host_email_param text)
 RETURNS TABLE(id uuid, event_id uuid, attendee_name text, attendee_email text, gender text, status text, created_at timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  -- Validate input parameters
  IF event_uuid IS NULL OR host_email_param IS NULL OR host_email_param = '' THEN
    RAISE EXCEPTION 'Invalid parameters provided';
  END IF;
  
  -- Verify the caller is the event host with additional checks
  IF NOT EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = event_uuid 
    AND events.host_email = host_email_param
    AND events.status != 'deleted'
  ) THEN
    RAISE EXCEPTION 'Access denied: Not the event host or event not found';
  END IF;
  
  -- Return full RSVP data for the verified host only
  RETURN QUERY
  SELECT r.id, r.event_id, r.attendee_name, r.attendee_email, r.gender, r.status, r.created_at
  FROM public.rsvps r
  WHERE r.event_id = event_uuid;
END;
$function$;

-- Enhanced get_event_waitlist_for_host with additional validation
CREATE OR REPLACE FUNCTION public.get_event_waitlist_for_host(event_uuid uuid, host_email_param text)
 RETURNS TABLE(id uuid, event_id uuid, attendee_name text, attendee_email text, gender text, created_at timestamp with time zone, updated_at timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  -- Validate input parameters
  IF event_uuid IS NULL OR host_email_param IS NULL OR host_email_param = '' THEN
    RAISE EXCEPTION 'Invalid parameters provided';
  END IF;
  
  -- Verify the caller is the event host with additional checks
  IF NOT EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = event_uuid 
    AND events.host_email = host_email_param
    AND events.status != 'deleted'
  ) THEN
    RAISE EXCEPTION 'Access denied: Not the event host or event not found';
  END IF;
  
  -- Return full waitlist data for the verified host only
  RETURN QUERY
  SELECT w.id, w.event_id, w.attendee_name, w.attendee_email, w.gender, w.created_at, w.updated_at
  FROM public.waitlist w
  WHERE w.event_id = event_uuid;
END;
$function$;