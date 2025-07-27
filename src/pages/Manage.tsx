import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Manage = () => {
  const navigate = useNavigate();

  // Mock data - in real app this would come from Supabase
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
      { name: "Alice Johnson", gender: "female" },
      { name: "Bob Smith", gender: "male" },
      { name: "Carol Davis", gender: "female" },
    ],
    no: [
      { name: "David Wilson", gender: "male" },
    ]
  };

  const spotsRemaining = event.capacity - rsvps.yes.length;
  const timeLeft = Math.ceil((new Date(event.rsvpDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-gradient-card">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-primary mb-8">{event.title}</h1>

          {/* Event Details Module */}
          <Card className="shadow-primary mb-8">
            <CardHeader>
              <CardTitle className="text-primary">Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="aspect-video bg-gradient-hero rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">Event Image</span>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-accent" />
                  <div>
                    <p className="font-semibold">Date</p>
                    <p className="text-muted-foreground">{new Date(event.date).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-accent" />
                  <div>
                    <p className="font-semibold">Time</p>
                    <p className="text-muted-foreground">{event.startTime} - {event.endTime}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-accent" />
                  <div>
                    <p className="font-semibold">Location</p>
                    <p className="text-muted-foreground">{event.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-accent" />
                  <div>
                    <p className="font-semibold">Capacity</p>
                    <p className="text-muted-foreground">{event.capacity} guests</p>
                  </div>
                </div>
              </div>
              
              <div>
                <p className="font-semibold mb-2">Description</p>
                <p className="text-muted-foreground">{event.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Actions & Indicators */}
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card className="shadow-accent">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Users className="h-8 w-8 mx-auto mb-2 text-accent" />
                  <h4 className="text-2xl font-bold text-primary">{spotsRemaining}</h4>
                  <p className="text-muted-foreground">Spots Remaining</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-accent">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-accent" />
                  <h4 className="text-2xl font-bold text-primary">{timeLeft}</h4>
                  <p className="text-muted-foreground">Days to Respond</p>
                  <Button variant="ghost" size="sm" className="mt-2">Edit</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-accent">
              <CardContent className="pt-6">
                <div className="text-center">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-destructive" />
                  <Button variant="destructive" size="sm" className="mt-2">
                    Cancel Event
                  </Button>
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
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      ✅ Yes ({rsvps.yes.length})
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {rsvps.yes.map((person, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
                        <span>{person.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {person.gender}
                        </Badge>
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
                        <span>{person.name}</span>
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

          {/* Bottom CTA */}
          <div className="bg-gradient-primary rounded-lg p-6 text-center">
            <h5 className="text-white mb-4">Start planning the next one</h5>
            <Button variant="secondary" size="lg" onClick={() => navigate('/newevent')}>
              New Event
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manage;