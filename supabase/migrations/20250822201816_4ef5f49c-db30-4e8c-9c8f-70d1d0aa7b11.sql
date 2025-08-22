-- Fix security issue: Remove public access to host email addresses

-- Drop ALL existing RLS policies for events table
DROP POLICY IF EXISTS "Public and host event access" ON public.events;
DROP POLICY IF EXISTS "Anyone can create events" ON public.events;
DROP POLICY IF EXISTS "Anyone can delete events" ON public.events;
DROP POLICY IF EXISTS "Anyone can update events" ON public.events;
DROP POLICY IF EXISTS "Host can view their own events" ON public.events;
DROP POLICY IF EXISTS "Host can update their own events" ON public.events;
DROP POLICY IF EXISTS "Host can delete their own events" ON public.events;

-- Create new secure RLS policies for events table
-- Policy 1: Only hosts can view their own events (with sensitive data like host_email)
CREATE POLICY "Host can view their own events" 
ON public.events 
FOR SELECT 
USING (host_email = (auth.jwt() ->> 'email'::text));

-- Policy 2: Anyone can create events (needed for event creation)
CREATE POLICY "Anyone can create events" 
ON public.events 
FOR INSERT 
WITH CHECK (true);

-- Policy 3: Only hosts can update their own events
CREATE POLICY "Host can update their own events" 
ON public.events 
FOR UPDATE 
USING (host_email = (auth.jwt() ->> 'email'::text));

-- Policy 4: Only hosts can delete their own events
CREATE POLICY "Host can delete their own events" 
ON public.events 
FOR DELETE 
USING (host_email = (auth.jwt() ->> 'email'::text));

-- Recreate the public_events view to exclude sensitive data (host_email)
DROP VIEW IF EXISTS public.public_events;

CREATE VIEW public.public_events AS
SELECT 
  id,
  created_at,
  updated_at,
  event_date,
  start_time,
  end_time,
  guest_limit,
  unlimited_guests,
  male_ratio,
  female_ratio,
  use_ratio_control,
  rsvp_deadline,
  hide_location_until_rsvp,
  title,
  description,
  image_url,
  location,
  status
FROM public.events
WHERE status = 'open';

-- Grant access to the public view for both anonymous and authenticated users
GRANT SELECT ON public.public_events TO anon;
GRANT SELECT ON public.public_events TO authenticated;