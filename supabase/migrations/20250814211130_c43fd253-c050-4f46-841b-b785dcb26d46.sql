-- Add hide_location_until_rsvp column to events table
ALTER TABLE public.events 
ADD COLUMN hide_location_until_rsvp BOOLEAN DEFAULT false;