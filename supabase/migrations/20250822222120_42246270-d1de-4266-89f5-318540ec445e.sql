-- Fix the get_public_rsvps function to work in unauthenticated contexts
-- by adding SECURITY DEFINER so it can bypass RLS policies

CREATE OR REPLACE FUNCTION public.get_public_rsvps(event_uuid uuid)
 RETURNS TABLE(id uuid, event_id uuid, attendee_name text, gender text, status text, created_at timestamp with time zone)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  -- Return only non-sensitive RSVP data (no email addresses)
  -- SECURITY DEFINER allows this function to bypass RLS policies
  RETURN QUERY
  SELECT r.id, r.event_id, r.attendee_name, r.gender, r.status, r.created_at
  FROM public.rsvps r
  WHERE r.event_id = event_uuid;
END;
$function$;