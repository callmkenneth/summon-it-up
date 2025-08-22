-- Update the RLS policy to check for empty strings as well as NULL values
DROP POLICY "Public users can create events" ON public.events;

-- Create a more robust INSERT policy that validates both NULL and empty values
CREATE POLICY "Public users can create events" ON public.events
FOR INSERT 
WITH CHECK (
  title IS NOT NULL AND trim(title) != '' AND
  description IS NOT NULL AND trim(description) != '' AND
  event_date IS NOT NULL AND
  start_time IS NOT NULL AND
  end_time IS NOT NULL AND
  location IS NOT NULL AND trim(location) != ''
);