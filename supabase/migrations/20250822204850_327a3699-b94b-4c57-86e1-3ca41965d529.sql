-- Add RLS policy to allow public users to view open events
-- This is required for the core functionality where visitors need to see events to RSVP

CREATE POLICY "Public can view open events" 
ON public.events 
FOR SELECT 
USING (status = 'open');