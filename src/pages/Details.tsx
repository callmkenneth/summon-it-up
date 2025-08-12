import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { to12Hour } from "@/lib/utils";
import { SpotCounter } from "@/components/SpotCounter";

const Details = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEventData();
  }, [id]);

  const loadEventData = async () => {
    try {
      const { data: eventData, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setEvent(eventData);
    } catch (error: any) {
      console.error('Error loading event:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const [rsvps, setRsvps] = useState<any>({ yes: [], no: [] });
  const [waitlist, setWaitlist] = useState<any[]>([]);

  useEffect(() => {
    if (event) loadRsvpData();
  }, [event]);

  const loadRsvpData = async () => {
    try {
      const { data: rsvpData, error } = await supabase
        .from('rsvps')
        .select('*')
        .eq('event_id', id);

      if (error) throw error;

      const groupedRsvps = {
        yes: rsvpData?.filter(r => r.status === 'yes') || [],
        no: rsvpData?.filter(r => r.status === 'no') || []
      };
      setRsvps(groupedRsvps);

      // Load waitlist
      const { data: waitlistData, error: waitlistError } = await supabase
        .from('waitlist')
        .select('*')
        .eq('event_id', id)
        .order('created_at', { ascending: true });

      if (waitlistError) throw waitlistError;
      setWaitlist(waitlistData || []);
    } catch (error: any) {
      console.error('Error loading RSVPs:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen page-scrim flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
          <p className="mt-4 text-white/80">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return null;
  }

  const userName = searchParams.get('name') || "Guest"; // Get name from URL params
  const spotsRemaining = event.unlimited_guests 
    ? '∞' 
    : Math.max(0, (event.guest_limit || 0) - rsvps.yes.length);
  
  const timeLeft = event.rsvp_deadline 
    ? Math.ceil((new Date(event.rsvp_deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="min-h-screen page-scrim">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto space-y-2">
          <div className="text-center mb-8">
            <h1 className="text-white mb-4">
              {event?.status === 'cancelled' ? 'Event Cancelled' : `Alright ${userName}, you're in!`}
            </h1>
            <div className="text-6xl mb-4">{event?.status === 'cancelled' ? '❌' : '🎉'}</div>
          </div>

          {/* Event Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-accent">{event?.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {event?.image_url && (
                <div className="aspect-square bg-gradient-hero rounded-lg flex items-center justify-center">
                  <img src={event.image_url} alt={event.title} className="w-full h-full object-cover rounded-lg" />
                </div>
              )}

              <div className="grid gap-2 md:grid-cols-2">
                <div className="text-left">
                  <div className="flex items-center justify-start gap-2 mb-3">
                    <img src="/lovable-uploads/2a28bf9e-ab8c-4ff3-9da2-ef509b9b9aa0.png" alt="Where" className="w-10 h-10" onError={(e) => e.currentTarget.style.display = 'none'} />
                    <h5>WHERE</h5>
                  </div>
                  <p className="text-muted-foreground">{event?.location}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    📍 Save this address for directions
                  </p>
                </div>

                <div className="text-left">
                  <div className="flex items-center justify-start gap-2 mb-3">
                    <img src="/lovable-uploads/01bfb213-3e0c-49f5-8d84-6e6d4c10b80f.png" alt="When" className="w-10 h-10" onError={(e) => e.currentTarget.style.display = 'none'} />
                    <h5>WHEN</h5>
                  </div>
                  <p className="text-muted-foreground">
                    {event?.event_date ? new Date(event.event_date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : ''}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {to12Hour(event?.start_time)} - {to12Hour(event?.end_time)}
                  </p>
                </div>
              </div>

              {/* What section on its own line */}
              <div className="text-left">
                <div className="flex items-center justify-start gap-2 mb-3">
                  <img src="/lovable-uploads/0d84518d-7d5f-481e-9c32-65317c29037b.png" alt="What" className="w-10 h-10" onError={(e) => e.currentTarget.style.display = 'none'} />
                  <h5>WHAT</h5>
                </div>
                <p className="text-muted-foreground text-sm">
                  {event?.description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Event Status */}
          <div className="grid gap-2 md:grid-cols-2">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <img src="/lovable-uploads/03d31a51-1d83-4589-a9d3-899022efdd3e.png" alt="Spots" className="w-12 h-12" onError={(e) => e.currentTarget.style.display = 'none'} />
                  <h5 className="font-semibold text-lg">SPOTS REMAINING</h5>
                </div>
                <div className="text-center">
                  <SpotCounter 
                    spotsClaimed={rsvps.yes.length} 
                    totalSpots={event.unlimited_guests ? null : event.guest_limit} 
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <img src="/lovable-uploads/6453c430-5a5d-46ca-86b5-e46c3ac971ce.png" alt="Confirmed" className="w-12 h-12" onError={(e) => e.currentTarget.style.display = 'none'} />
                  <h5 className="font-semibold text-lg">YOU'RE CONFIRMED!</h5>
                </div>
                <div className="text-center">
                  <div className="bg-light-pink border-2 border-pink rounded-[30px] px-3 py-1 inline-block">
                    <span className="font-bungee text-purple text-4xl">✓</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Who's Coming */}
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">WHO'S COMING SO FAR</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 md:grid-cols-2">
                <div>
                  <Badge variant="default" className="bg-green-100 text-green-800 mb-3">
                    ✅ Yes ({rsvps.yes.length})
                  </Badge>
                  <div className="space-y-2">
                     {rsvps.yes.map((person, index) => (
                        <div 
                          key={index} 
                          className="p-4 bg-green-50 rounded-[30px] flex items-center justify-between"
                        >
                         <span>{person.attendee_name}</span>
                         <Badge variant="secondary" className="text-xs">
                           {person.gender}
                         </Badge>
                       </div>
                     ))}
                  </div>
                </div>

                <div>
                  <Badge variant="secondary" className="bg-red-100 text-red-800 mb-3">
                    ❌ No ({rsvps.no.length})
                  </Badge>
                  <div className="space-y-2">
                     {rsvps.no.map((person, index) => (
                       <div key={index} className="p-4 bg-red-50 rounded-[30px] flex items-center justify-between">
                         <span>{person.attendee_name}</span>
                         <Badge variant="secondary" className="text-xs">
                           {person.gender}
                         </Badge>
                       </div>
                     ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Waitlist */}
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">WAITLIST ({waitlist.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {waitlist.length > 0 ? (
                <div className="space-y-2">
                  {waitlist.map((person: any, index: number) => (
                    <div key={index} className="p-4 bg-muted rounded-[30px] flex items-center justify-between">
                      <span>{person.attendee_name}</span>
                      <Badge variant="secondary" className="text-xs">{person.gender}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No one on the waitlist yet.</p>
              )}
            </CardContent>
          </Card>

          {/* Important Notes */}
          <Card className="bg-light-pink border-pink">
            <CardContent className="pt-6">
              <div className="text-center">
                <h5 className="text-primary mb-3">📝 IMPORTANT NOTES</h5>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Save the event location in your calendar</p>
                  <p>• Contact the host if you need to change your RSVP</p>
                  <p>• Check back here for any event updates</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bottom CTA */}
          <div className="bg-gradient-primary rounded-lg p-6 text-center">
            <h5 className="text-white mb-4">WANT TO MAKE YOUR OWN?</h5>
            <Button variant="secondary" size="lg" onClick={() => navigate('/newevent')}>
              New Event
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Details;