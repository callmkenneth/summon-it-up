import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const NewEvent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null as File | null,
    eventDate: '',
    startTime: '',
    endTime: '',
    location: '',
    guestLimit: '',
    unlimited: false,
    rsvpDeadline: '',
    hostEmail: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit to backend when Supabase is connected
    navigate('/share');
  };

  const isFormComplete = formData.title && formData.description && formData.eventDate && 
    formData.startTime && formData.endTime && formData.location && formData.hostEmail;

  return (
    <div className="min-h-screen bg-gradient-card">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-center mb-8 text-primary">Create New Event</h1>
          
          <Card className="shadow-primary border-light-pink">
            <CardHeader>
              <CardTitle className="text-primary text-2xl">Event Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="title">Event Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="mt-2"
                    placeholder="What's the occasion?"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="mt-2"
                    placeholder="Tell guests what to expect..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="image">Event Image</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.files?.[0] || null }))}
                    className="mt-2"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="eventDate">Event Date *</Label>
                    <Input
                      id="eventDate"
                      type="date"
                      value={formData.eventDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, eventDate: e.target.value }))}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="startTime">Start Time *</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime">End Time *</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Location Address *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="mt-2"
                    placeholder="Where will this happen?"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="unlimited"
                    checked={formData.unlimited}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, unlimited: !!checked }))}
                  />
                  <Label htmlFor="unlimited">Unlimited guests</Label>
                </div>

                {!formData.unlimited && (
                  <div>
                    <Label htmlFor="guestLimit">Guest Limit</Label>
                    <Input
                      id="guestLimit"
                      type="number"
                      value={formData.guestLimit}
                      onChange={(e) => setFormData(prev => ({ ...prev, guestLimit: e.target.value }))}
                      className="mt-2"
                      placeholder="Maximum number of guests"
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="rsvpDeadline">RSVP Deadline (Optional)</Label>
                  <Input
                    id="rsvpDeadline"
                    type="datetime-local"
                    value={formData.rsvpDeadline}
                    onChange={(e) => setFormData(prev => ({ ...prev, rsvpDeadline: e.target.value }))}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="hostEmail">Your Email Address *</Label>
                  <Input
                    id="hostEmail"
                    type="email"
                    value={formData.hostEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, hostEmail: e.target.value }))}
                    className="mt-2"
                    placeholder="To receive event details"
                  />
                </div>

                <Button 
                  type="submit" 
                  variant="hero" 
                  size="lg" 
                  className="w-full"
                  disabled={!isFormComplete}
                >
                  Generate Link
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NewEvent;