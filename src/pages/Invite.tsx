import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

const Invite = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - in real app this would be fetched from Supabase
  const event = {
    title: "Summer Pool Party",
    description: "Join us for a fun-filled afternoon by the pool! Bring your swimwear and appetite.",
    date: "2024-08-15",
    startTime: "14:00",
    endTime: "18:00",
    location: "123 Pool Lane, Sunshine City",
    capacity: 20,
    rsvpDeadline: "2024-08-13T23:59",
    status: "open" as const
  };

  const rsvps = {
    yes: [
      { name: "Alice Johnson" },
      { name: "Bob Smith" },
      { name: "Carol Davis" },
    ],
    no: [
      { name: "David Wilson" },
    ]
  };

  const spotsRemaining = event.capacity - rsvps.yes.length;
  const timeLeft = Math.ceil((new Date(event.rsvpDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const isFull = spotsRemaining <= 0;

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
            {isFull ? "Event Full" : "You're invited"}
          </h1>

          {/* Event Description Module */}
          <Card className="shadow-primary mb-8">
            <CardHeader>
              <CardTitle className="text-accent">{event.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="aspect-video bg-gradient-hero rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">Event Image</span>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <MapPin className="h-5 w-5 text-accent" />
                    <h5>Where</h5>
                  </div>
                  <p className="text-muted-foreground">
                    {rsvps.yes.some(r => r.name === "Current User") ? event.location : "RSVP to find out"}
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Calendar className="h-5 w-5 text-accent" />
                    <h5>When</h5>
                  </div>
                  <p className="text-muted-foreground">
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {event.startTime} - {event.endTime}
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-xl">🎉</span>
                    <h5>What</h5>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {event.description}
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
                  <Users className="h-6 w-6 mx-auto mb-2 text-accent" />
                  <p className="font-semibold text-primary">
                    {spotsRemaining > 0 ? `${spotsRemaining} spots remaining` : "No spots remaining"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-accent">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Clock className="h-6 w-6 mx-auto mb-2 text-accent" />
                  <p className="font-semibold text-primary">
                    {timeLeft > 0 ? `${timeLeft} days to respond` : "RSVP closed"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-accent">
              <CardContent className="pt-6">
                <div className="text-center">
                  <span className="text-2xl mb-2 block">👥</span>
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
                      <div key={index} className="p-2 bg-green-50 rounded">
                        {person.name}
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
                      <div key={index} className="p-2 bg-red-50 rounded">
                        {person.name}
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
        </div>
      </div>
    </div>
  );
};

export default Invite;