-- Add DELETE policy for RSVPs to allow removing guests
CREATE POLICY "Anyone can delete RSVPs" 
ON public.rsvps 
FOR DELETE 
USING (true);