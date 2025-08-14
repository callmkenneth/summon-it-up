-- Fix RSVP email exposure security vulnerability
-- Remove the overly permissive public read access policy
DROP POLICY IF EXISTS "Public read access for RSVP data" ON public.rsvps;

-- Create a restrictive policy that denies direct public SELECT access to the rsvps table
-- This forces access through security definer functions or views only
CREATE POLICY "Deny direct public access to rsvps" 
ON public.rsvps 
FOR SELECT 
USING (false);

-- The existing security definer functions will continue to work:
-- - get_event_rsvps_for_host: Provides full access to hosts only
-- - get_public_rsvps: Provides non-sensitive data (no emails) for public use

-- Keep the existing INSERT policy unchanged
-- Policy "Public can create RSVPs" remains active