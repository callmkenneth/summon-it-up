-- Fix security vulnerability: Restrict public access to email addresses in RSVPs table

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Public can view RSVP names only" ON public.rsvps;

-- Create a new restrictive policy that excludes email addresses from public access
-- This policy allows public viewing of only non-sensitive fields (names, gender, status)
-- Email addresses are excluded to prevent spam harvesting
CREATE POLICY "Public can view RSVP names and basic info only" 
ON public.rsvps 
FOR SELECT 
USING (true);

-- Create a view for public RSVP data that excludes sensitive information
CREATE OR REPLACE VIEW public.rsvps_public AS
SELECT 
  id,
  event_id,
  attendee_name,
  gender,
  status,
  created_at
FROM public.rsvps;

-- Grant public access to the view
GRANT SELECT ON public.rsvps_public TO anon;
GRANT SELECT ON public.rsvps_public TO authenticated;

-- Create RLS policy for the view (though views don't need RLS, this is for completeness)
ALTER VIEW public.rsvps_public SET (security_barrier = true);

-- Update the RLS policy to be more restrictive - only allow non-email fields
DROP POLICY IF EXISTS "Public can view RSVP names and basic info only" ON public.rsvps;

CREATE POLICY "Restrict public RSVP access" 
ON public.rsvps 
FOR SELECT 
USING (
  -- This policy will be used in conjunction with column-level security
  -- The application should use the public view instead of direct table access
  false  -- Deny direct public access to the main table
);

-- Create a separate policy for the host function access
CREATE POLICY "Host can view all RSVP data via function" 
ON public.rsvps 
FOR SELECT 
USING (
  -- This allows the security definer function to access all data
  current_setting('role', true) = 'postgres' OR 
  current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
);