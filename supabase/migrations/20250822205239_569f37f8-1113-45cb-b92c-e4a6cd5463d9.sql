-- Remove the unsafe policy that exposes host emails
DROP POLICY "Public can view open events" ON public.events;

-- Create RLS policy for the public_events view instead
-- The public_events view already excludes sensitive host_email information
CREATE POLICY "Public can view events through safe view" 
ON public.public_events 
FOR SELECT 
USING (true);