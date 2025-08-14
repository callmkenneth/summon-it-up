-- Fix contact_requests exposure security vulnerability
-- Remove the overly permissive public read access policy
DROP POLICY IF EXISTS "Anyone can view contact requests" ON public.contact_requests;

-- Create a restrictive policy that denies direct public SELECT access to the contact_requests table
-- This protects customer names, emails, and private messages from unauthorized access
CREATE POLICY "Deny public access to contact requests" 
ON public.contact_requests 
FOR SELECT 
USING (false);

-- Keep the existing INSERT policy unchanged to allow contact form submissions
-- Policy "Anyone can create contact requests" remains active

-- Note: Access to contact requests should now only be possible through:
-- 1. Administrative interfaces with proper authentication
-- 2. Security definer functions that verify authorization
-- 3. Direct database access by authorized administrators