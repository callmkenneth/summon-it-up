-- Fix RLS policy conflicts for event creation
-- The issue is that SELECT policies are too restrictive for unauthenticated users creating events

-- Drop the conflicting policies
DROP POLICY IF EXISTS "Public can view open event details only" ON public.events;
DROP POLICY IF EXISTS "Event hosts can access their own events" ON public.events;

-- Create a unified policy that handles both cases properly
-- This policy allows:
-- 1. Public access to open events (status = 'open')
-- 2. Host access to their own events when authenticated
-- 3. Prevents infinite recursion by not referencing the same table
CREATE POLICY "Public and host event access" 
ON public.events 
FOR SELECT 
USING (
  status = 'open' OR 
  (auth.jwt() ->> 'email' IS NOT NULL AND host_email = auth.jwt() ->> 'email')
);

-- Ensure INSERT policy allows unauthenticated users to create events
-- This should already exist but let's make sure it's correct
DROP POLICY IF EXISTS "Anyone can create events" ON public.events;
CREATE POLICY "Anyone can create events" 
ON public.events 
FOR INSERT 
WITH CHECK (true);