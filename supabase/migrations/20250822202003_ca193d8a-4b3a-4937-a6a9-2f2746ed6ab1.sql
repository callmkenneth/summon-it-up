-- Ensure the public_events view is not using SECURITY DEFINER
-- This addresses the security linter warning about SECURITY DEFINER views

-- Recreate the view without SECURITY DEFINER (which is the default)
DROP VIEW IF EXISTS public.public_events;

CREATE VIEW public.public_events 
SECURITY INVOKER -- Explicitly set to SECURITY INVOKER (not DEFINER)
AS
SELECT 
  id,
  created_at,
  updated_at,
  event_date,
  start_time,
  end_time,
  guest_limit,
  unlimited_guests,
  male_ratio,
  female_ratio,
  use_ratio_control,
  rsvp_deadline,
  hide_location_until_rsvp,
  title,
  description,
  image_url,
  location,
  status
FROM public.events
WHERE status = 'open';

-- Grant access to the public view
GRANT SELECT ON public.public_events TO anon;
GRANT SELECT ON public.public_events TO authenticated;