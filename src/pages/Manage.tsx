import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, AlertTriangle, X, Edit } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CancelEventDialog } from "@/components/CancelEventDialog";
import { EditEventDialog } from "@/components/EditEventDialog";
import { CountdownTimer } from "@/components/CountdownTimer";
import { IconWrapper } from "@/components/IconWrapper";
import { to12Hour } from "@/lib/utils";

const Manage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [event, setEvent] = useState<any>(null);
  const [rsvps, setRsvps] = useState<any>({ yes: [], no: [] });
  const [waitlist, setWaitlist] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [saving, setSaving] = useState(false);

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

      // Load waitlist
      const { data: waitlistData, error: waitlistError } = await supabase
        .from('waitlist')
        .select('*')
        .eq('event_id', id);

      if (waitlistError) throw waitlistError;

      setEvent(eventData);
      
      // Group RSVPs by status
      const groupedRsvps = {
        yes: rsvpData?.filter(r => r.status === 'yes') || [],
        no: rsvpData?.filter(r => r.status === 'no') || []
      };
      setRsvps(groupedRsvps);
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

  const handleCancelEvent = async () => {
    setCancelling(true);
    try {
      const { error } = await supabase
        .from('events')
        .update({ status: 'cancelled' })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Event cancelled",
        description: "Your event has been cancelled successfully.",
      });

      setShowCancelDialog(false);
      setEvent({ ...event, status: 'cancelled' });
    } catch (error: any) {
      toast({
        title: "Error cancelling event",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setCancelling(false);
    }
  };

  const handleSaveEvent = async (data: any) => {
    setSaving(true);
    try {
      const updateData = {
        ...data,
        guest_limit: data.guest_limit ? parseInt(data.guest_limit) : null,
        rsvp_deadline: data.rsvp_deadline ? new Date(data.rsvp_deadline).toISOString() : null
      };

      const { error } = await supabase
        .from('events')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Event updated",
        description: "Your event has been updated successfully.",
      });

      setShowEditDialog(false);
      setEvent({ ...event, ...updateData });
    } catch (error: any) {
      toast({
        title: "Error updating event",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveGuest = async (rsvpId: string) => {
    try {
      const { error } = await supabase
        .from('rsvps')
        .delete()
        .eq('id', rsvpId);

      if (error) throw error;

      // Promote the earliest person from the waitlist, if any
      const { data: nextWaitlist, error: waitlistError } = await supabase
        .from('waitlist')
        .select('*')
        .eq('event_id', id)
        .order('created_at', { ascending: true })
        .limit(1);

      if (waitlistError) throw waitlistError;

      if (nextWaitlist && nextWaitlist.length > 0) {
        const person = nextWaitlist[0];
        const { error: insertError } = await supabase.from('rsvps').insert({
          event_id: id,
          attendee_name: person.attendee_name,
          attendee_email: person.attendee_email || `waitlist-${person.id}@placeholder.com`,
          gender: person.gender,
          status: 'yes',
        });
        if (insertError) throw insertError;

        await supabase.from('waitlist').delete().eq('id', person.id);

        toast({
          title: "Spot filled from waitlist",
          description: `${person.attendee_name} has been moved to the guest list.`,
        });
      } else {
        toast({
          title: "Guest removed",
          description: "The guest has been removed from the event.",
        });
      }

      // Reload data to reflect changes
      loadEventData();
    } catch (error: any) {
      toast({
        title: "Error removing guest",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleRemoveWaitlistGuest = async (waitlistId: string) => {
    try {
      const { error } = await supabase
        .from('waitlist')
        .delete()
        .eq('id', waitlistId);

      if (error) throw error;

      toast({
        title: "Waitlist guest removed",
        description: "The guest has been removed from the waitlist.",
      });

      // Reload data to reflect changes
      loadEventData();
    } catch (error: any) {
      toast({
        title: "Error removing waitlist guest",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-card flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading event data...</p>
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

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-primary mb-8">{event.title}</h1>

          {/* Event Details Module */}
          <Card className="mb-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-primary">Event Details</CardTitle>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowEditDialog(true)}
                  className="flex items-center gap-2"
                >
                  <IconWrapper variant="white" size="sm">
                    <Edit className="h-4 w-4" />
                  </IconWrapper>
                  Edit Event
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => setShowCancelDialog(true)}
                  disabled={event.status === 'cancelled'}
                  className="flex items-center gap-2"
                >
                  <IconWrapper variant="white" size="sm">
                    <AlertTriangle className="h-4 w-4" />
                  </IconWrapper>
                  {event.status === 'cancelled' ? 'Cancelled' : 'Cancel Event'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {event?.image_url && (
                <div className="aspect-video bg-gradient-hero rounded-lg flex items-center justify-center">
                  <img src={event.image_url} alt={event.title} className="w-full h-full object-cover rounded-lg" />
                </div>
              )}
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="flex items-center gap-3">
                  <IconWrapper variant="accent" size="md">
                    <Calendar className="h-5 w-5" />
                  </IconWrapper>
                  <div>
                    <p className="font-semibold">Date</p>
                    <p className="text-muted-foreground">{new Date(event.event_date).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <IconWrapper variant="accent" size="md">
                    <Clock className="h-5 w-5" />
                  </IconWrapper>
                  <div>
                    <p className="font-semibold">Time</p>
                    <p className="text-muted-foreground">{to12Hour(event.start_time)} - {to12Hour(event.end_time)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <IconWrapper variant="accent" size="md">
                    <MapPin className="h-5 w-5" />
                  </IconWrapper>
                  <div>
                    <p className="font-semibold">Location</p>
                    <p className="text-muted-foreground">{event.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <IconWrapper variant="accent" size="md">
                    <Users className="h-5 w-5" />
                  </IconWrapper>
                  <div>
                    <p className="font-semibold">Capacity</p>
                    <p className="text-muted-foreground">
                      {event.unlimited_guests ? 'Unlimited' : `${event.guest_limit} guests`}
                    </p>
                  </div>
                </div>

                {event.use_ratio_control && (
                  <>
                    <div className="flex items-center gap-3">
                      <IconWrapper variant="primary" size="md">
                        <span className="text-sm font-bold">♂</span>
                      </IconWrapper>
                      <div>
                        <p className="font-semibold">Male Spots</p>
                        <p className="text-muted-foreground">
                          {Math.floor((event.guest_limit || 0) * (event.male_ratio || 0.5)) - rsvps.yes.filter((r: any) => r.gender === 'male').length} remaining
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <IconWrapper variant="primary" size="md">
                        <span className="text-sm font-bold">♀</span>
                      </IconWrapper>
                      <div>
                        <p className="font-semibold">Female Spots</p>
                        <p className="text-muted-foreground">
                          {(event.guest_limit || 0) - Math.floor((event.guest_limit || 0) * (event.male_ratio || 0.5)) - rsvps.yes.filter((r: any) => r.gender === 'female').length} remaining
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              <div>
                <p className="font-semibold mb-2">Description</p>
                <p className="text-muted-foreground">{event.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Actions & Indicators */}
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card className="">
              <CardContent className="pt-6">
                <div className="text-center">
                  <IconWrapper variant="accent" size="lg" className="mx-auto mb-2">
                    <Users className="h-6 w-6" />
                  </IconWrapper>
                  <h4 className="text-2xl font-bold text-primary">{spotsRemaining}</h4>
                  <p className="text-muted-foreground">Spots Remaining</p>
                </div>
              </CardContent>
            </Card>

            <Card className="">
              <CardContent className="pt-6">
                <div className="text-center">
                  <IconWrapper variant="accent" size="lg" className="mx-auto mb-2">
                    <Clock className="h-6 w-6" />
                  </IconWrapper>
                  <div className="text-2xl font-bold text-primary">
                    {event.rsvp_deadline ? (
                      <CountdownTimer deadline={event.rsvp_deadline} />
                    ) : (
                      'No deadline'
                    )}
                  </div>
                  <p className="text-muted-foreground">Time to Respond</p>
                </div>
              </CardContent>
            </Card>

            <Card className="">
              <CardContent className="pt-6">
                <div className="text-center">
                  <IconWrapper variant="primary" size="lg" className="mx-auto mb-2">
                    <span className="text-xl">👥</span>
                  </IconWrapper>
                  <h4 className="text-2xl font-bold text-primary">{rsvps.yes.length + rsvps.no.length}</h4>
                  <p className="text-muted-foreground">Total Responses</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Who's Coming */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-primary">Who's coming so far</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      ✅ Yes ({rsvps.yes.length})
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {rsvps.yes.map((person, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
                        <div className="flex items-center gap-2">
                          <span>{person.attendee_name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {person.gender}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveGuest(person.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="secondary" className="bg-red-100 text-red-800">
                      ❌ No ({rsvps.no.length})
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {rsvps.no.map((person, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded">
                        <div className="flex items-center gap-2">
                          <span>{person.attendee_name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {person.gender}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveGuest(person.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Waitlist */}
          {waitlist.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-primary">Waitlist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {waitlist.map((person: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                      <div className="flex items-center gap-2">
                        <span>{person.attendee_name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {person.gender}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveWaitlistGuest(person.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bottom CTA */}
          <div className="bg-gradient-primary rounded-lg p-6 text-center">
            <h5 className="text-white mb-4">Start planning the next one</h5>
            <Button variant="secondary" size="lg" onClick={() => navigate('/newevent')}>
              New Event
            </Button>
          </div>
        </div>
      </div>
      <Footer />

      <CancelEventDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        onConfirm={handleCancelEvent}
        isLoading={cancelling}
      />
      
      <EditEventDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSave={handleSaveEvent}
        event={event}
        isLoading={saving}
      />
    </div>
  );
};

export default Manage;