-- Make host_email optional for events (fixes NOT NULL error when creating event without email)
ALTER TABLE public.events
ALTER COLUMN host_email DROP NOT NULL;