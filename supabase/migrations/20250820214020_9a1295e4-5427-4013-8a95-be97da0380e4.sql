-- Fix security warnings by updating function search path
CREATE OR REPLACE FUNCTION public.validate_text_input(input_text TEXT, max_length INTEGER DEFAULT 255)
RETURNS BOOLEAN 
LANGUAGE plpgsql 
STABLE 
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
$$;