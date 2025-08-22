-- Update the security definer function to fix the search path warning
CREATE OR REPLACE FUNCTION public.validate_event_data(
  p_title TEXT,
  p_description TEXT,
  p_location TEXT,
  p_event_date DATE,
  p_start_time TIME,
  p_end_time TIME
) RETURNS BOOLEAN AS $$
BEGIN
  -- Validate all required fields
  IF p_title IS NULL OR TRIM(p_title) = '' THEN
    RETURN FALSE;
  END IF;
  
  IF p_description IS NULL OR TRIM(p_description) = '' THEN
    RETURN FALSE;
  END IF;
  
  IF p_location IS NULL OR TRIM(p_location) = '' THEN
    RETURN FALSE;
  END IF;
  
  IF p_event_date IS NULL THEN
    RETURN FALSE;
  END IF;
  
  IF p_start_time IS NULL THEN
    RETURN FALSE;
  END IF;
  
  IF p_end_time IS NULL THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = '';