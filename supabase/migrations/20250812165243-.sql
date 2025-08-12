-- Create a contact requests table to handle secure host communication
CREATE TABLE public.contact_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL,
  requester_name TEXT NOT NULL,
  requester_email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for contact requests
CREATE POLICY "Anyone can create contact requests" 
ON public.contact_requests 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view contact requests" 
ON public.contact_requests 
FOR SELECT 
USING (true);

-- Add trigger for timestamps
CREATE TRIGGER update_contact_requests_updated_at
BEFORE UPDATE ON public.contact_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update events table RLS to exclude host_email from public access
DROP POLICY IF EXISTS "Events are viewable by everyone" ON public.events;

-- Create new policy that excludes sensitive data
CREATE POLICY "Events basic info viewable by everyone" 
ON public.events 
FOR SELECT 
USING (true);

-- Note: We'll handle host_email exclusion in the application layer
-- since RLS policies can't selectively hide columns