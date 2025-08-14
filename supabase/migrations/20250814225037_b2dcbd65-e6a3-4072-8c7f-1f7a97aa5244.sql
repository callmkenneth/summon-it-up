-- Fix events table host email exposure security vulnerability
-- Remove the overly permissive public read access policy
DROP POLICY IF EXISTS "Events basic info viewable by everyone" ON public.events;

-- Create a restrictive policy that denies direct public SELECT access to the events table
CREATE POLICY "Deny direct public access to events" 
ON public.events 
FOR SELECT 
USING (false);

-- Create a public view that exposes only non-sensitive event information
CREATE OR REPLACE VIEW public.public_events AS
SELECT 
  id,
  created_at,
  updated_at,
  title,
  description,
  image_url,
  -- Conditionally hide location if hide_location_until_rsvp is true
  CASE 
    WHEN hide_location_until_rsvp = true THEN 'Location will be shared after RSVP'
    ELSE location 
  END as location,
  event_date,
  start_time,
  end_time,
  guest_limit,
  unlimited_guests,
  male_ratio,
  female_ratio,
  use_ratio_control,
  rsvp_deadline,
  status,
  hide_location_until_rsvp
  -- Explicitly exclude host_email from public view
FROM public.events;

-- Grant SELECT access to the public view for anonymous and authenticated users
GRANT SELECT ON public.public_events TO anon, authenticated;

-- Keep existing INSERT, UPDATE, DELETE policies unchanged as they may be needed for event management
-- The host email will still be accessible through these operations for authorized management