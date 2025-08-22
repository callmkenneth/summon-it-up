-- Remove the unsafe policy that exposes host emails
DROP POLICY "Public can view open events" ON public.events;

-- Create a secure function that returns only safe event data
CREATE OR REPLACE FUNCTION public.get_public_events()
RETURNS TABLE(
  id uuid,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  event_date date,
  start_time time without time zone,
  end_time time without time zone,
  guest_limit integer,
  unlimited_guests boolean,
  male_ratio numeric,
  female_ratio numeric,
  use_ratio_control boolean,
  rsvp_deadline timestamp with time zone,
  hide_location_until_rsvp boolean,
  title text,
  description text,
  image_url text,
  location text,
  status text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- Return only non-sensitive event data for open events
  RETURN QUERY
  SELECT 
    e.id,
    e.created_at,
    e.updated_at,
    e.event_date,
    e.start_time,
    e.end_time,
    e.guest_limit,
    e.unlimited_guests,
    e.male_ratio,
    e.female_ratio,
    e.use_ratio_control,
    e.rsvp_deadline,
    e.hide_location_until_rsvp,
    e.title,
    e.description,
    e.image_url,
    e.location,
    e.status
  FROM public.events e
  WHERE e.status = 'open';
END;
$$;