-- Fix Security Definer View warning by removing SECURITY DEFINER from trigger function
-- Trigger functions can work without SECURITY DEFINER in most cases

-- Update trigger function to remove SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;