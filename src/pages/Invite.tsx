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
import { SpotCounter } from "@/components/SpotCounter";
import { IconWrapper } from "@/components/IconWrapper";
import { to12Hour } from "@/lib/utils";

const Invite = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { toast } = useToast();
  const [event, setEvent] = useState<any>(null);
  const [rsvps, setRsvps] = useState<any>({ yes: [], no: [] });
  const [loading, setLoading] = useState(true);
  const [waitlist, setWaitlist] = useState<any[]>([]);

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

      // Load Waitlist
      const { data: waitlistData, error: waitlistError } = await supabase
        .from('waitlist')
        .select('*')
        .eq('event_id', id)
        .order('created_at', { ascending: true });

      if (waitlistError) throw waitlistError;
      setWaitlist(waitlistData || []);
      
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
      <div className="min-h-screen page-scrim flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
          <p className="mt-4 text-white/80">Loading event...</p>
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
    <div className="min-h-screen page-scrim">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto space-y-2">
          <h1 className="text-white mb-4 text-center">
            {event?.status === 'cancelled' ? 'Event Cancelled' : (isFull ? "Event Full" : "You're invited")}
          </h1>

          {event?.status === 'cancelled' && (
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">❌</div>
              <p className="text-white/80">This event has been cancelled by the host.</p>
            </div>
          )}

          {event?.status !== 'cancelled' && (
            <>
              {/* Event Description Module */}
              <Card className="">
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
                    <div className="flex items-center justify-start gap-2 mb-2">
                      <IconWrapper variant="accent" size="sm">
                        <MapPin className="h-4 w-4" />
                      </IconWrapper>
                      <h5>Where</h5>
                    </div>
                    <p className="text-muted-foreground">
                      RSVP to find out
                    </p>
                  </div>

                  <div className="text-left">
                    <div className="flex items-center justify-start gap-2 mb-2">
                      <IconWrapper variant="accent" size="sm">
                        <Calendar className="h-4 w-4" />
                      </IconWrapper>
                      <h5>When</h5>
                    </div>
                    <p className="text-muted-foreground">
                      {event?.event_date ? new Date(event.event_date).toLocaleDateString() : ''}
                    </p>
                      <p className="text-sm text-muted-foreground">
                        {to12Hour(event?.start_time)} - {to12Hour(event?.end_time)}
                      </p>
                  </div>
                  </div>

                  {/* What section on its own line */}
                  <div className="text-left">
                    <div className="flex items-center justify-start gap-2 mb-2">
                      <IconWrapper variant="accent" size="sm">
                        <span className="text-lg">🎉</span>
                      </IconWrapper>
                      <h5>What</h5>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {event?.description}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Indicators */}
              <div className="grid gap-2 md:grid-cols-2">
              <Card className="">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <IconWrapper variant="accent" size="md" className="mx-auto mb-2">
                      <Users className="h-5 w-5" />
                    </IconWrapper>
                    <SpotCounter 
                      spotsClaimed={rsvps.yes.length} 
                      totalSpots={event.unlimited_guests ? null : event.guest_limit} 
                    />
                    <p className="text-xs text-muted-foreground mt-1">spots remaining</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="">
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
                    <p className="text-xs text-muted-foreground mt-1">Time left to respond</p>
                    <p className="text-xs text-muted-foreground">(days, hours, minutes, seconds)</p>
                  </div>
                </CardContent>
              </Card>
              </div>

              {/* Who's Coming */}
              <Card className="">
                <CardHeader>
                  <CardTitle className="text-primary">Who's coming so far</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 md:grid-cols-2">
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

              {/* Waitlist */}
              <Card className="">
                <CardHeader>
                  <CardTitle className="text-primary">Waitlist ({waitlist.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {waitlist.length > 0 ? (
                    <div className="space-y-2">
                      {waitlist.map((person: any, index: number) => (
                        <div key={index} className="p-2 bg-muted rounded flex items-center justify-between">
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

              {/* RSVP Buttons */}
              <div className="">
                {!isFull ? (
                  <div className="grid gap-2 md:grid-cols-2">
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