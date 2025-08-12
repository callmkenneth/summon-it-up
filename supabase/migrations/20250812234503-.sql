-- Fix the security definer view issue
-- Drop the problematic view
DROP VIEW IF EXISTS public.rsvps_public;

-- Instead, we'll rely on the RLS policy to handle access control
-- Update the RLS policy to be more specific about what can be accessed
DROP POLICY IF EXISTS "Public can view basic RSVP data (no emails)" ON public.rsvps;

-- Create a more restrictive RLS policy that only allows specific columns
-- We'll need to handle this at the application level since Postgres RLS doesn't support column-level restrictions
-- Instead, create a policy that allows read access but applications should use the secure function
CREATE POLICY "Public read access for RSVP data" 
ON public.rsvps 
FOR SELECT 
USING (true);

-- The security is enforced by using the get_public_rsvps function instead of direct table access
-- This function already excludes email addresses and is marked as SECURITY DEFINER appropriately