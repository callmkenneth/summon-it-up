-- Critical Security Fixes: Remove public access to sensitive waitlist data
-- and implement host-only access patterns

-- 1. Remove public read access from waitlist table
DROP POLICY IF EXISTS "Public can view waitlist names only" ON public.waitlist;

-- 2. Create host-only waitlist access policy
CREATE POLICY "Host can view their event waitlist" 
ON public.waitlist 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = waitlist.event_id 
    AND events.host_email = auth.jwt() ->> 'email'
  )
);

-- 3. Allow hosts to delete waitlist entries for their events
CREATE POLICY "Host can delete their event waitlist entries" 
ON public.waitlist 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = waitlist.event_id 
    AND events.host_email = auth.jwt() ->> 'email'
  )
);

-- 4. Allow hosts to update waitlist entries for their events (for promotion to RSVP)
CREATE POLICY "Host can update their event waitlist entries" 
ON public.waitlist 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = waitlist.event_id 
    AND events.host_email = auth.jwt() ->> 'email'
  )
);

-- 5. Add policy for hosts to delete RSVPs for their events
CREATE POLICY "Host can delete RSVPs for their events" 
ON public.rsvps 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = rsvps.event_id 
    AND events.host_email = auth.jwt() ->> 'email'
  )
);

-- 6. Add policy for hosts to update RSVPs for their events
CREATE POLICY "Host can update RSVPs for their events" 
ON public.rsvps 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = rsvps.event_id 
    AND events.host_email = auth.jwt() ->> 'email'
  )
);

-- 7. Create secure function for input validation
CREATE OR REPLACE FUNCTION public.validate_text_input(input_text TEXT, max_length INTEGER DEFAULT 255)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check for null or empty input
  IF input_text IS NULL OR LENGTH(TRIM(input_text)) = 0 THEN
    RETURN FALSE;
  END IF;
  
  -- Check length
  IF LENGTH(input_text) > max_length THEN
    RETURN FALSE;
  END IF;
  
  -- Check for potentially malicious content
  IF input_text ~* '<script|javascript:|data:|vbscript:|on\w+=' THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;