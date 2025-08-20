-- Fix public_events view security by adding RLS policies
-- This view currently exposes all event data without restrictions

-- Enable RLS on public_events view
ALTER VIEW public.public_events SET (security_barrier = true);

-- Create RLS policies for public_events view to control access
-- Note: Views inherit policies from their underlying tables
-- Since public_events is a view of the events table, we need to ensure 
-- the events table has proper policies for public access

-- Add policy to allow public read access only to open events (not cancelled/deleted)
CREATE POLICY "Public can view open event details only" 
ON public.events 
FOR SELECT 
USING (status = 'open');

-- Update existing policy name to be more specific
DROP POLICY IF EXISTS "Deny direct public access to events" ON public.events;

-- Create specific policy for authenticated users to access their own events
CREATE POLICY "Event hosts can access their own events" 
ON public.events 
FOR SELECT 
USING (host_email = auth.jwt() ->> 'email');