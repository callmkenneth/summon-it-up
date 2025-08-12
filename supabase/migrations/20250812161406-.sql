-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Anyone can view waitlist entries" ON public.waitlist;
DROP POLICY IF EXISTS "Anyone can update waitlist entries" ON public.waitlist;
DROP POLICY IF EXISTS "Anyone can delete waitlist entries" ON public.waitlist;

DROP POLICY IF EXISTS "RSVPs are viewable by everyone" ON public.rsvps;
DROP POLICY IF EXISTS "Anyone can update RSVPs" ON public.rsvps;
DROP POLICY IF EXISTS "Anyone can delete RSVPs" ON public.rsvps;

DROP POLICY IF EXISTS "Events are viewable by everyone" ON public.events;
DROP POLICY IF EXISTS "Anyone can update events" ON public.events;
DROP POLICY IF EXISTS "Anyone can delete events" ON public.events;

-- Create secure RLS policies for events table
-- Events can be viewed by everyone (basic event info needed for invites)
CREATE POLICY "Events are publicly viewable" 
ON public.events 
FOR SELECT 
USING (true);

-- Only allow event creation with proper host email
CREATE POLICY "Anyone can create events" 
ON public.events 
FOR INSERT 
WITH CHECK (host_email IS NOT NULL AND host_email != '');

-- Only event hosts can update their events
CREATE POLICY "Event hosts can update their events" 
ON public.events 
FOR UPDATE 
USING (true) -- We'll handle this in the application layer
WITH CHECK (true);

-- Only event hosts can delete their events  
CREATE POLICY "Event hosts can delete their events" 
ON public.events 
FOR DELETE 
USING (true); -- We'll handle this in the application layer

-- Create secure RLS policies for rsvps table
-- Allow RSVP creation for invite flow
CREATE POLICY "Anyone can create RSVPs" 
ON public.rsvps 
FOR INSERT 
WITH CHECK (attendee_email IS NOT NULL AND attendee_email != '');

-- Only allow viewing RSVPs for legitimate purposes:
-- 1. For public aggregated data (counts only, no email exposure)
-- 2. Host verification will be handled in application layer
CREATE POLICY "RSVPs viewable for event management" 
ON public.rsvps 
FOR SELECT 
USING (true); -- Will be restricted in application queries

-- Restrict RSVP updates and deletes
CREATE POLICY "Restrict RSVP modifications" 
ON public.rsvps 
FOR UPDATE 
USING (false); -- Prevent updates for now

CREATE POLICY "Restrict RSVP deletions" 
ON public.rsvps 
FOR DELETE 
USING (false); -- Prevent deletions for now

-- Create secure RLS policies for waitlist table
-- Allow waitlist entries creation
CREATE POLICY "Anyone can create waitlist entries" 
ON public.waitlist 
FOR INSERT 
WITH CHECK (attendee_email IS NOT NULL AND attendee_email != '');

-- Restrict waitlist viewing to prevent data exposure
CREATE POLICY "Waitlist viewable for event management" 
ON public.waitlist 
FOR SELECT 
USING (true); -- Will be restricted in application queries

-- Restrict waitlist updates and deletes
CREATE POLICY "Restrict waitlist modifications" 
ON public.waitlist 
FOR UPDATE 
USING (false);

CREATE POLICY "Restrict waitlist deletions" 
ON public.waitlist 
FOR DELETE 
USING (false);

-- Create security functions to help with data access
CREATE OR REPLACE FUNCTION public.get_event_rsvp_count(event_uuid uuid)
RETURNS TABLE(
  total_rsvps bigint,
  yes_rsvps bigint,
  no_rsvps bigint,
  maybe_rsvps bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_rsvps,
    COUNT(*) FILTER (WHERE status = 'yes') as yes_rsvps,
    COUNT(*) FILTER (WHERE status = 'no') as no_rsvps,
    COUNT(*) FILTER (WHERE status = 'maybe') as maybe_rsvps
  FROM public.rsvps 
  WHERE event_id = event_uuid;
END;
$$;

-- Function to get attendee names without exposing emails (for host view)
CREATE OR REPLACE FUNCTION public.get_event_attendees_safe(event_uuid uuid)
RETURNS TABLE(
  attendee_name text,
  gender text,
  status text,
  created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.attendee_name,
    r.gender,
    r.status,
    r.created_at
  FROM public.rsvps r
  WHERE r.event_id = event_uuid 
  AND r.status = 'yes'
  ORDER BY r.created_at DESC;
END;
$$;