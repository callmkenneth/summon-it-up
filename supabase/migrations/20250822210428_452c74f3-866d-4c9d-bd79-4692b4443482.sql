-- Fix event creation RLS error by updating the INSERT policy
DROP POLICY "Anyone can create events" ON public.events;

-- Create a more explicit INSERT policy that validates required fields
CREATE POLICY "Public users can create events" ON public.events
FOR INSERT 
WITH CHECK (
  title IS NOT NULL AND 
  description IS NOT NULL AND 
  event_date IS NOT NULL AND 
  start_time IS NOT NULL AND 
  end_time IS NOT NULL AND 
  location IS NOT NULL
);