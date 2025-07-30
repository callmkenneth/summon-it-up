-- Create events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location TEXT NOT NULL,
  guest_limit INTEGER,
  unlimited_guests BOOLEAN DEFAULT false,
  male_ratio NUMERIC(3,2) DEFAULT 0.50, -- 0.00 to 1.00 (50% default)
  female_ratio NUMERIC(3,2) DEFAULT 0.50,
  use_ratio_control BOOLEAN DEFAULT false,
  rsvp_deadline TIMESTAMP WITH TIME ZONE,
  host_email TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'full', 'cancelled', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Create policies for events
CREATE POLICY "Events are viewable by everyone" 
ON public.events 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create events" 
ON public.events 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update events" 
ON public.events 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete events" 
ON public.events 
FOR DELETE 
USING (true);

-- Create RSVPs table
CREATE TABLE public.rsvps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  attendee_name TEXT NOT NULL,
  attendee_email TEXT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  status TEXT NOT NULL DEFAULT 'yes' CHECK (status IN ('yes', 'no', 'waitlist')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(event_id, attendee_email)
);

-- Enable RLS for RSVPs
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- Create policies for RSVPs
CREATE POLICY "RSVPs are viewable by everyone" 
ON public.rsvps 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create RSVPs" 
ON public.rsvps 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update RSVPs" 
ON public.rsvps 
FOR UPDATE 
USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_events_updated_at
BEFORE UPDATE ON public.events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to calculate spots remaining
CREATE OR REPLACE FUNCTION public.get_spots_remaining(event_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  event_capacity INTEGER;
  current_rsvps INTEGER;
BEGIN
  -- Get event capacity (null means unlimited)
  SELECT guest_limit INTO event_capacity
  FROM public.events 
  WHERE id = event_uuid;
  
  -- If unlimited guests, return a large number
  IF event_capacity IS NULL THEN
    RETURN 999999;
  END IF;
  
  -- Count current RSVPs with status 'yes'
  SELECT COUNT(*) INTO current_rsvps
  FROM public.rsvps 
  WHERE event_id = event_uuid AND status = 'yes';
  
  -- Return remaining spots
  RETURN GREATEST(0, event_capacity - current_rsvps);
END;
$$ LANGUAGE plpgsql;