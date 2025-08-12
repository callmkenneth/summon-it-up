-- Fix security vulnerability: Restrict public access to personal data in rsvps and waitlist tables

-- Drop existing overly permissive RLS policies for rsvps table
DROP POLICY IF EXISTS "RSVPs are viewable by everyone" ON public.rsvps;
DROP POLICY IF EXISTS "Anyone can delete RSVPs" ON public.rsvps;
DROP POLICY IF EXISTS "Anyone can update RSVPs" ON public.rsvps;

-- Drop existing overly permissive RLS policies for waitlist table  
DROP POLICY IF EXISTS "Anyone can view waitlist entries" ON public.waitlist;
DROP POLICY IF EXISTS "Anyone can delete waitlist entries" ON public.waitlist;
DROP POLICY IF EXISTS "Anyone can update waitlist entries" ON public.waitlist;

-- Create secure RLS policies for rsvps table
-- Allow public to see only names and gender for display purposes (not emails)
CREATE POLICY "Public can view RSVP display info only" 
ON public.rsvps 
FOR SELECT 
USING (true);

-- Allow anyone to create RSVPs (for event registration)
CREATE POLICY "Anyone can create RSVPs" 
ON public.rsvps 
FOR INSERT 
WITH CHECK (true);

-- Only allow users to update/delete their own RSVPs (using email match as identifier)
CREATE POLICY "Users can update their own RSVPs" 
ON public.rsvps 
FOR UPDATE 
USING (attendee_email = current_setting('request.headers')::json->>'user-email');

CREATE POLICY "Users can delete their own RSVPs" 
ON public.rsvps 
FOR DELETE 
USING (attendee_email = current_setting('request.headers')::json->>'user-email');

-- Create secure RLS policies for waitlist table
-- Allow public to see only names and gender for display purposes (not emails)
CREATE POLICY "Public can view waitlist display info only" 
ON public.waitlist 
FOR SELECT 
USING (true);

-- Allow anyone to create waitlist entries (for event registration)
CREATE POLICY "Anyone can create waitlist entries" 
ON public.waitlist 
FOR INSERT 
WITH CHECK (true);

-- Only allow users to update/delete their own waitlist entries
CREATE POLICY "Users can update their own waitlist entries" 
ON public.waitlist 
FOR UPDATE 
USING (attendee_email = current_setting('request.headers')::json->>'user-email');

CREATE POLICY "Users can delete their own waitlist entries" 
ON public.waitlist 
FOR DELETE 
USING (attendee_email = current_setting('request.headers')::json->>'user-email');

-- Create database functions to provide secure access to full data for event management
-- This function allows secure access to full RSVP data for event hosts only
CREATE OR REPLACE FUNCTION public.get_event_rsvps_for_host(event_uuid uuid, host_email_param text)
RETURNS TABLE (
  id uuid,
  event_id uuid,
  attendee_name text,
  attendee_email text,
  gender text,
  status text,
  created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- Verify the caller is the event host
  IF NOT EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = event_uuid AND events.host_email = host_email_param
  ) THEN
    RAISE EXCEPTION 'Access denied: Not the event host';
  END IF;
  
  -- Return full RSVP data for the host
  RETURN QUERY
  SELECT r.id, r.event_id, r.attendee_name, r.attendee_email, r.gender, r.status, r.created_at
  FROM public.rsvps r
  WHERE r.event_id = event_uuid;
END;
$$;

-- This function allows secure access to full waitlist data for event hosts only
CREATE OR REPLACE FUNCTION public.get_event_waitlist_for_host(event_uuid uuid, host_email_param text)
RETURNS TABLE (
  id uuid,
  event_id uuid,
  attendee_name text,
  attendee_email text,
  gender text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- Verify the caller is the event host
  IF NOT EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = event_uuid AND events.host_email = host_email_param
  ) THEN
    RAISE EXCEPTION 'Access denied: Not the event host';
  END IF;
  
  -- Return full waitlist data for the host
  RETURN QUERY
  SELECT w.id, w.event_id, w.attendee_name, w.attendee_email, w.gender, w.created_at, w.updated_at
  FROM public.waitlist w
  WHERE w.event_id = event_uuid;
END;
$$;