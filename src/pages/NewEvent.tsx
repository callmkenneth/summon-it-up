import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Footer } from "@/components/Footer";

const NewEvent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
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
    useRatioControl: false,
    maleRatio: 50,
    rsvpDeadline: '',
    hostEmail: ''
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let imageUrl = null;
      
      // Upload image if provided
      if (formData.image) {
        const fileExt = formData.image.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('event-images')
          .upload(fileName, formData.image);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('event-images')
          .getPublicUrl(fileName);
        
        imageUrl = publicUrl;
      }

      const eventData = {
        title: formData.title,
        description: formData.description,
        image_url: imageUrl,
        event_date: formData.eventDate,
        start_time: formData.startTime,
        end_time: formData.endTime,
        location: formData.location,
        guest_limit: formData.unlimited ? null : parseInt(formData.guestLimit),
        unlimited_guests: formData.unlimited,
        use_ratio_control: formData.useRatioControl,
        male_ratio: formData.maleRatio / 100,
        female_ratio: (100 - formData.maleRatio) / 100,
        rsvp_deadline: formData.rsvpDeadline ? new Date(formData.rsvpDeadline).toISOString() : null,
        host_email: formData.hostEmail || null,
        status: 'open'
      };

      const { data, error } = await supabase
        .from('events')
        .insert(eventData)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Event created successfully!",
        description: "Your event is ready to be shared.",
      });

      // Navigate to share page with event ID
      navigate(`/share?id=${data.id}`);
    } catch (error: any) {
      toast({
        title: "Error creating event",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const isFormComplete = formData.title && formData.description && formData.eventDate && 
    formData.startTime && formData.endTime && formData.location;

  return (
    <div className="min-h-screen page-scrim">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-center mb-8 text-white">Create New Event</h1>
          
          <Card className="shadow-primary border-light-pink">
            <CardHeader>
              <CardTitle className="text-primary text-2xl">Event Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setFormData(prev => ({ ...prev, image: file }));
                      if (file) {
                        const url = URL.createObjectURL(file);
                        setImagePreview(url);
                      } else {
                        setImagePreview(null);
                      }
                    }}
                    className="mt-2"
                  />
                  {imagePreview && (
                    <div className="mt-3">
                      <div className="aspect-video rounded-lg overflow-hidden border">
                        <img
                          src={imagePreview}
                          alt={formData.title ? `Preview: ${formData.title}` : 'Event image preview'}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  )}
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
                    min="1"
                    value={formData.guestLimit}
                    onChange={(e) => setFormData(prev => ({ ...prev, guestLimit: e.target.value }))}
                    className="mt-2"
                    placeholder="Maximum number of guests"
                  />
                </div>
                )}

                {!formData.unlimited && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="ratioControl"
                      checked={formData.useRatioControl}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, useRatioControl: !!checked }))}
                    />
                    <Label htmlFor="ratioControl">Men/Women Ratio Control</Label>
                  </div>
                )}

                {!formData.unlimited && formData.useRatioControl && formData.guestLimit && (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Gender Ratio</Label>
                      <div className="mt-3 space-y-4">
                        <div className="relative">
                          <Slider
                            value={[formData.maleRatio]}
                            onValueChange={([value]) => setFormData(prev => ({ ...prev, maleRatio: value }))}
                            max={100}
                            step={1}
                            className="w-full"
                          />
                          <div className="flex justify-between mt-2 text-sm">
                            <span className="text-blue-600 font-medium">👨 Men</span>
                            <span className="text-pink-600 font-medium">👩 Women</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="text-sm text-blue-600 font-medium">Male Spots</div>
                            <div className="text-2xl font-bold text-blue-700">
                              {Math.round(parseInt(formData.guestLimit) * (formData.maleRatio / 100))}
                            </div>
                          </div>
                          <div className="p-3 bg-pink-50 rounded-lg border border-pink-200">
                            <div className="text-sm text-pink-600 font-medium">Female Spots</div>
                            <div className="text-2xl font-bold text-pink-700">
                              {Math.round(parseInt(formData.guestLimit) * ((100 - formData.maleRatio) / 100))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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
                  <Label htmlFor="hostEmail">Your Email Address (Optional)</Label>
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
      <Footer />
    </div>
  );
};

export default NewEvent;