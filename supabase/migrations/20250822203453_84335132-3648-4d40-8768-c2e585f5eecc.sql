-- Create a test to see if we can isolate the exact cause
-- Let's check if creating a properly formatted view resolves the issue

-- First, let's verify our public_events view is not the issue by recreating it explicitly as SECURITY INVOKER
CREATE OR REPLACE VIEW public.public_events AS
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