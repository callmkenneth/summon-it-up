import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { to12Hour } from "@/lib/utils";

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
    } catch (error: any) {
      console.error('Error loading RSVPs:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-card flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading event details...</p>
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
    <div className="min-h-screen bg-gradient-card">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-primary mb-4">
              {event?.status === 'cancelled' ? 'Event Cancelled' : `Alright ${userName}, you're in!`}
            </h1>
            <div className="text-6xl mb-4">{event?.status === 'cancelled' ? '❌' : '🎉'}</div>
          </div>

          {/* Event Details */}
          <Card className="shadow-primary mb-8">
            <CardHeader>
              <CardTitle className="text-accent">{event?.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="aspect-video bg-gradient-hero rounded-lg flex items-center justify-center">
                {event?.image_url ? (
                  <img src={event.image_url} alt={event.title} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <span className="text-white text-lg">Event Image</span>
                )}
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="h-5 w-5 text-accent" />
                    <h5>Where</h5>
                  </div>
                  <p className="text-muted-foreground">{event?.location}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    📍 Save this address for directions
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="h-5 w-5 text-accent" />
                    <h5>When</h5>
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

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">🎉</span>
                    <h5>What</h5>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {event?.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Event Status */}
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            <Card className="shadow-accent">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Users className="h-6 w-6 mx-auto mb-2 text-accent" />
                  <p className="font-semibold text-primary">
                    {spotsRemaining} spots remaining
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-accent">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Clock className="h-6 w-6 mx-auto mb-2 text-accent" />
                  <p className="font-semibold text-primary">
                    {timeLeft !== null && timeLeft > 0 ? `${timeLeft} days to respond` : "RSVP closed"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-accent">
              <CardContent className="pt-6">
                <div className="text-center">
                  <span className="text-2xl mb-2 block">✅</span>
                  <p className="font-semibold text-green-600">
                    You're confirmed!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Who's Coming */}
          <Card className="shadow-primary mb-8">
            <CardHeader>
              <CardTitle className="text-primary">Who's coming so far</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <Badge variant="default" className="bg-green-100 text-green-800 mb-3">
                    ✅ Yes ({rsvps.yes.length})
                  </Badge>
                  <div className="space-y-2">
                     {rsvps.yes.map((person, index) => (
                       <div 
                         key={index} 
                         className="p-2 bg-green-50 rounded flex items-center justify-between"
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
                       <div key={index} className="p-2 bg-red-50 rounded flex items-center justify-between">
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

          {/* Important Notes */}
          <Card className="shadow-accent mb-8 bg-light-pink border-pink">
            <CardContent className="pt-6">
              <div className="text-center">
                <h5 className="text-primary mb-3">📝 Important Notes</h5>
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
            <h5 className="text-white mb-4">Want to make your own?</h5>
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