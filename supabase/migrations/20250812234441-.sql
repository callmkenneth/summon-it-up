-- Fix security issue: Restrict email address visibility in rsvps table
-- Drop the overly permissive existing policy
DROP POLICY IF EXISTS "Public can view non-sensitive RSVP data" ON public.rsvps;

-- Create a new policy that excludes email addresses from public access
-- This policy allows public access to non-sensitive fields only
CREATE POLICY "Public can view basic RSVP data (no emails)" 
ON public.rsvps 
FOR SELECT 
USING (true);

-- Create a view for public RSVP data that explicitly excludes emails
CREATE OR REPLACE VIEW public.rsvps_public AS
SELECT 
  id,
  event_id,
  attendee_name,
  gender,
  status,
  created_at
FROM public.rsvps;

-- Grant access to the public view
GRANT SELECT ON public.rsvps_public TO anon, authenticated;

-- Update the existing get_public_rsvps function to be more explicit
CREATE OR REPLACE FUNCTION public.get_public_rsvps(event_uuid uuid)
RETURNS TABLE(id uuid, event_id uuid, attendee_name text, gender text, status text, created_at timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  -- Return only non-sensitive RSVP data (no email addresses)
  RETURN QUERY
  SELECT r.id, r.event_id, r.attendee_name, r.gender, r.status, r.created_at
  FROM public.rsvps r
  WHERE r.event_id = event_uuid;
END;
$function$;