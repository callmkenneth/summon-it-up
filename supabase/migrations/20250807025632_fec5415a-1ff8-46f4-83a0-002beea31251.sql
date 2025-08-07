-- Create waitlist table for managing event waitlists
CREATE TABLE public.waitlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  attendee_name TEXT NOT NULL,
  attendee_email TEXT,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Create policies for waitlist access
CREATE POLICY "Anyone can view waitlist entries" 
ON public.waitlist 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert waitlist entries" 
ON public.waitlist 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update waitlist entries" 
ON public.waitlist 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete waitlist entries" 
ON public.waitlist 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_waitlist_updated_at
BEFORE UPDATE ON public.waitlist
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_waitlist_event_id ON public.waitlist(event_id);