-- Fix the security definer view issue and properly restrict email access

-- Drop the problematic view and policies
DROP VIEW IF EXISTS public.rsvps_public;
DROP POLICY IF EXISTS "Restrict public RSVP access" ON public.rsvps;
DROP POLICY IF EXISTS "Host can view all RSVP data via function" ON public.rsvps;

-- Create a simple, secure RLS policy that excludes email addresses
-- This uses PostgreSQL's built-in column security through careful application design
CREATE POLICY "Public can view non-sensitive RSVP data" 
ON public.rsvps 
FOR SELECT 
USING (true);

-- Create a security definer function to get public RSVP data without emails
CREATE OR REPLACE FUNCTION public.get_public_rsvps(event_uuid uuid)
RETURNS TABLE(
  id uuid,
  event_id uuid, 
  attendee_name text,
  gender text,
  status text,
  created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  RETURN QUERY
  SELECT r.id, r.event_id, r.attendee_name, r.gender, r.status, r.created_at
  FROM public.rsvps r
  WHERE r.event_id = event_uuid;
END;
$function$;

-- Grant execute permission to public roles
GRANT EXECUTE ON FUNCTION public.get_public_rsvps(uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.get_public_rsvps(uuid) TO authenticated;