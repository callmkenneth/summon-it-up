import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CountdownTimer } from "@/components/CountdownTimer";
import { IconWrapper } from "@/components/IconWrapper";

const Invite = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { toast } = useToast();
  const [event, setEvent] = useState<any>(null);
  const [rsvps, setRsvps] = useState<any>({ yes: [], no: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      toast({
        title: "No event found",
        description: "Invalid event link",
        variant: "destructive",
      });
      navigate('/');
      return;
    }
    loadEventData();
  }, [id]);

  const loadEventData = async () => {
    try {
      // Load event data
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (eventError) throw eventError;

      // Load RSVPs
      const { data: rsvpData, error: rsvpError } = await supabase
        .from('rsvps')
        .select('*')
        .eq('event_id', id);

      if (rsvpError) throw rsvpError;

      setEvent(eventData);
      
      // Group RSVPs by status
      const groupedRsvps = {
        yes: rsvpData?.filter(r => r.status === 'yes') || [],
        no: rsvpData?.filter(r => r.status === 'no') || []
      };
      setRsvps(groupedRsvps);
      
    } catch (error: any) {
      toast({
        title: "Error loading event",
        description: error.message,
        variant: "destructive",
      });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-card flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading event...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return null;
  }

  const spotsRemaining = event.unlimited_guests 
    ? '∞' 
    : Math.max(0, (event.guest_limit || 0) - rsvps.yes.length);
    
  const timeLeft = event.rsvp_deadline 
    ? Math.ceil((new Date(event.rsvp_deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;
    
  const isFull = !event.unlimited_guests && typeof spotsRemaining === 'number' && spotsRemaining <= 0;

  const handleRSVP = (response: 'yes' | 'no') => {
    navigate(`/name/${id}?response=${response}`);
  };

  const handleWaitlist = () => {
    navigate(`/name/${id}?response=waitlist`);
  };

  return (
    <div className="min-h-screen bg-gradient-card">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-primary mb-8 text-center">
            {event?.status === 'cancelled' ? 'Event Cancelled' : (isFull ? "Event Full" : "You're invited")}
          </h1>

          {event?.status === 'cancelled' && (
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">❌</div>
              <p className="text-muted-foreground">This event has been cancelled by the host.</p>
            </div>
          )}

          {event?.status !== 'cancelled' && (
            <>
              {/* Event Description Module */}
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
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <IconWrapper variant="accent" size="sm">
                        <MapPin className="h-4 w-4" />
                      </IconWrapper>
                      <h5>Where</h5>
                    </div>
                    <p className="text-muted-foreground">
                      RSVP to find out
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <IconWrapper variant="accent" size="sm">
                        <Calendar className="h-4 w-4" />
                      </IconWrapper>
                      <h5>When</h5>
                    </div>
                    <p className="text-muted-foreground">
                      {event?.event_date ? new Date(event.event_date).toLocaleDateString() : ''}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {event?.start_time} - {event?.end_time}
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <IconWrapper variant="accent" size="sm">
                        <span className="text-lg">🎉</span>
                      </IconWrapper>
                      <h5>What</h5>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {event?.description}
                    </p>
                  </div>
                  </div>
                </CardContent>
              </Card>

              {/* Indicators */}
              <div className="grid gap-4 md:grid-cols-3 mb-8">
              <Card className="shadow-accent">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <IconWrapper variant="accent" size="md" className="mx-auto mb-2">
                      <Users className="h-5 w-5" />
                    </IconWrapper>
                    <p className="font-semibold text-primary">
                      {typeof spotsRemaining === 'string' ? 'Unlimited spots' : spotsRemaining > 0 ? `${spotsRemaining} spots remaining` : "No spots remaining"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-accent">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <IconWrapper variant="accent" size="md" className="mx-auto mb-2">
                      <Clock className="h-5 w-5" />
                    </IconWrapper>
                    <div className="font-semibold text-primary">
                      {event.rsvp_deadline ? (
                        <CountdownTimer deadline={event.rsvp_deadline} />
                      ) : (
                        'No deadline'
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-accent">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <IconWrapper variant="primary" size="md" className="mx-auto mb-2">
                      <span className="text-lg">👥</span>
                    </IconWrapper>
                    <p className="font-semibold text-primary">
                      {rsvps.yes.length + rsvps.no.length} responses
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
                           <div key={index} className="p-2 bg-green-50 rounded flex items-center justify-between">
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

              {/* RSVP Buttons */}
              <div className="space-y-4">
                {!isFull ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    <Button 
                      variant="rsvp" 
                      size="lg" 
                      className="w-full"
                      onClick={() => handleRSVP('yes')}
                    >
                      I'm in
                    </Button>
                    <Button 
                      variant="reject" 
                      size="lg" 
                      className="w-full"
                      onClick={() => handleRSVP('no')}
                    >
                      Not this time
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="w-full md:w-auto"
                      onClick={handleWaitlist}
                    >
                      Add me to waitlist
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Invite;