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
import { useInputValidation, commonValidationRules } from "@/hooks/useInputValidation";
import { Alert, AlertDescription } from "@/components/ui/alert";
const NewEvent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { errors, validateForm, validateField, clearFieldError } = useInputValidation();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null as File | null,
    eventDate: '',
    startTime: '',
    endTime: '',
    location: '',
    hideLocationUntilRsvp: false,
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
    
    // Validate form inputs
    const validationData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      location: formData.location.trim(),
      ...(formData.hostEmail ? { hostEmail: formData.hostEmail.trim() } : {})
    };
    
    const validationRules = {
      title: commonValidationRules.eventTitle,
      description: commonValidationRules.eventDescription,
      location: commonValidationRules.location,
      ...(formData.hostEmail ? { hostEmail: commonValidationRules.email } : {})
    };
    
    if (!validateForm(validationData, validationRules)) {
      toast({
        title: "Please fix the errors below",
        description: "Check the highlighted fields and try again.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      let imageUrl = null;
      let imageUploadFailed = false;

      // Upload image if provided
      if (formData.image) {
        console.log('Starting image upload...', formData.image.name, 'Size:', formData.image.size);
        
        // Validate file size (5MB limit)
        if (formData.image.size > 5 * 1024 * 1024) {
          toast({
            title: "Image too large",
            description: "Please select an image smaller than 5MB. Your event will be created without an image.",
            variant: "destructive",
          });
          imageUploadFailed = true;
        } else {
          try {
            const fileExt = formData.image.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            
            console.log('Uploading to storage:', fileName);
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('event-images')
              .upload(fileName, formData.image);
            
            if (uploadError) {
              console.error('Storage upload error:', uploadError);
              throw uploadError;
            }
            
            console.log('Upload successful:', uploadData);

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
              .from('event-images')
              .getPublicUrl(fileName);
            
            imageUrl = publicUrl;
            console.log('Public URL generated:', imageUrl);
          } catch (uploadError: any) {
            console.error('Image upload failed:', uploadError);
            imageUploadFailed = true;
            toast({
              title: "Image upload failed",
              description: "Your event will be created without an image. You can add one later.",
              variant: "destructive",
            });
          }
        }
      }
      const eventData = {
        title: formData.title,
        description: formData.description,
        image_url: imageUrl,
        event_date: formData.eventDate,
        start_time: formData.startTime,
        end_time: formData.endTime,
        location: formData.location,
        hide_location_until_rsvp: formData.hideLocationUntilRsvp,
        guest_limit: formData.unlimited ? null : parseInt(formData.guestLimit),
        unlimited_guests: formData.unlimited,
        use_ratio_control: formData.useRatioControl,
        male_ratio: formData.maleRatio / 100,
        female_ratio: (100 - formData.maleRatio) / 100,
        rsvp_deadline: formData.rsvpDeadline ? new Date(formData.rsvpDeadline).toISOString() : null,
        host_email: formData.hostEmail || null,
        status: 'open'
      };

      const { data, error } = await supabase.from('events').insert(eventData).select().single();
      if (error) throw error;

      // If host email is provided, automatically send event details
      if (formData.hostEmail) {
        try {
          await supabase.functions.invoke('send-event-details', {
            body: {
              eventId: data.id,
              email: formData.hostEmail
            }
          });
          toast({
            title: "Event created successfully!",
            description: imageUploadFailed 
              ? "Your event is ready and details have been sent to your email. Note: Image upload failed but you can add one later."
              : "Your event is ready and details have been sent to your email."
          });
        } catch (emailError) {
          console.error("Failed to send email:", emailError);
          toast({
            title: "Event created successfully!",
            description: imageUploadFailed
              ? "Event created but email failed to send. Note: Image upload also failed but you can add both later from the share page."
              : "Event created but email failed to send. You can send it from the share page."
          });
        }
      } else {
        toast({
          title: "Event created successfully!",
          description: imageUploadFailed
            ? "Your event is ready to be shared. Note: Image upload failed but you can add one later."
            : "Your event is ready to be shared."
        });
      }

      // Navigate to share page with event ID and email status
      navigate(`/share?id=${data.id}&emailSent=${formData.hostEmail ? 'true' : 'false'}`);
    } catch (error: any) {
      toast({
        title: "Error creating event",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  const isFormComplete = formData.title && formData.description && formData.eventDate && formData.startTime && formData.endTime && formData.location;
  return <div className="min-h-screen page-scrim">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="flex items-center gap-2 mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-center mb-8 text-white">Create New Event</h1>
          
          <Card className="shadow-primary border-light-pink">
            <CardHeader>
              <CardTitle className="text-primary text-2xl">EVENT DETAILS</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Event Title * <span className="text-xs text-muted-foreground">(min 3 characters)</span></Label>
                  <Input 
                    id="title" 
                    value={formData.title} 
                    onChange={e => {
                      setFormData(prev => ({...prev, title: e.target.value}));
                      if (errors.title) clearFieldError('title');
                    }}
                    onBlur={e => validateField(e.target.value.trim(), commonValidationRules.eventTitle, 'title')}
                    className={`mt-2 ${errors.title ? 'border-destructive' : ''}`} 
                    placeholder="What's the occasion?" 
                  />
                  {errors.title && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertDescription className="text-sm">{errors.title}</AlertDescription>
                    </Alert>
                  )}
                </div>

                <div>
                  <Label htmlFor="description">Description * <span className="text-xs text-muted-foreground">(min 10 characters)</span></Label>
                  <Textarea 
                    id="description" 
                    value={formData.description} 
                    onChange={e => {
                      setFormData(prev => ({...prev, description: e.target.value}));
                      if (errors.description) clearFieldError('description');
                    }}
                    onBlur={e => validateField(e.target.value.trim(), commonValidationRules.eventDescription, 'description')}
                    className={`mt-2 ${errors.description ? 'border-destructive' : ''}`} 
                    placeholder="Tell guests what to expect..." 
                    rows={4} 
                  />
                  {errors.description && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertDescription className="text-sm">{errors.description}</AlertDescription>
                    </Alert>
                  )}
                </div>

                <div>
                  <Label htmlFor="image">Event Image</Label>
                  <Input id="image" type="file" accept="image/*" onChange={e => {
                  const file = e.target.files?.[0] || null;
                  setFormData(prev => ({
                    ...prev,
                    image: file
                  }));
                  if (file) {
                    const url = URL.createObjectURL(file);
                    setImagePreview(url);
                  } else {
                    setImagePreview(null);
                  }
                }} className="mt-2" />
                  {imagePreview && <div className="mt-3">
                      <div className="aspect-square rounded-lg overflow-hidden border">
                        <img src={imagePreview} alt={formData.title ? `Preview: ${formData.title}` : 'Event image preview'} className="w-full h-full object-cover" loading="lazy" />
                      </div>
                    </div>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="eventDate">Event Date *</Label>
                    <Input id="eventDate" type="date" value={formData.eventDate} onChange={e => setFormData(prev => ({
                    ...prev,
                    eventDate: e.target.value
                  }))} className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="startTime">Start Time *</Label>
                    <Input id="startTime" type="time" value={formData.startTime} onChange={e => setFormData(prev => ({
                    ...prev,
                    startTime: e.target.value
                  }))} className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="endTime">End Time *</Label>
                    <Input id="endTime" type="time" value={formData.endTime} onChange={e => setFormData(prev => ({
                    ...prev,
                    endTime: e.target.value
                  }))} className="mt-2" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Location Address * <span className="text-xs text-muted-foreground">(min 5 characters)</span></Label>
                  <Input 
                    id="location" 
                    value={formData.location} 
                    onChange={e => {
                      setFormData(prev => ({...prev, location: e.target.value}));
                      if (errors.location) clearFieldError('location');
                    }}
                    onBlur={e => validateField(e.target.value.trim(), commonValidationRules.location, 'location')}
                    className={`mt-2 ${errors.location ? 'border-destructive' : ''}`} 
                    placeholder="Where will this happen?" 
                  />
                  {errors.location && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertDescription className="text-sm">{errors.location}</AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="hideLocation" checked={formData.hideLocationUntilRsvp} onCheckedChange={checked => setFormData(prev => ({
                  ...prev,
                  hideLocationUntilRsvp: !!checked
                }))} />
                  <Label htmlFor="hideLocation">Hide location until RSVP</Label>
                  <p className="text-sm text-muted-foreground ml-2">(Only show location to guests who RSVP "yes")</p>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="unlimited" checked={formData.unlimited} onCheckedChange={checked => setFormData(prev => ({
                  ...prev,
                  unlimited: !!checked
                }))} />
                  <Label htmlFor="unlimited">Unlimited guests</Label>
                </div>

                {!formData.unlimited && <div>
                  <Label htmlFor="guestLimit">Guest Limit</Label>
                  <Input id="guestLimit" type="number" min="1" value={formData.guestLimit} onChange={e => setFormData(prev => ({
                  ...prev,
                  guestLimit: e.target.value
                }))} className="mt-2" placeholder="Maximum number of guests" />
                </div>}

                {!formData.unlimited && <div className="flex items-center space-x-2">
                    <Checkbox id="ratioControl" checked={formData.useRatioControl} onCheckedChange={checked => setFormData(prev => ({
                  ...prev,
                  useRatioControl: !!checked
                }))} />
                    <Label htmlFor="ratioControl">Men/Women Ratio Control</Label>
                  </div>}

                {!formData.unlimited && formData.useRatioControl && formData.guestLimit && <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Gender Ratio</Label>
                      <div className="mt-3 space-y-4">
                        <div className="relative">
                          <Slider value={[formData.maleRatio]} onValueChange={([value]) => setFormData(prev => ({
                        ...prev,
                        maleRatio: value
                      }))} max={100} step={1} className="w-full" />
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
                  </div>}

                <div>
                  <Label htmlFor="rsvpDeadline">RSVP Deadline (Optional)</Label>
                  <Input id="rsvpDeadline" type="datetime-local" value={formData.rsvpDeadline} onChange={e => setFormData(prev => ({
                  ...prev,
                  rsvpDeadline: e.target.value
                }))} className="mt-2" />
                </div>

                <div>
                  <Label htmlFor="hostEmail">Your Email Address (Optional)</Label>
                  <Input 
                    id="hostEmail" 
                    type="email" 
                    value={formData.hostEmail} 
                    onChange={e => {
                      setFormData(prev => ({...prev, hostEmail: e.target.value}));
                      if (errors.hostEmail) clearFieldError('hostEmail');
                    }}
                    onBlur={e => {
                      if (e.target.value.trim()) {
                        validateField(e.target.value.trim(), commonValidationRules.email, 'hostEmail');
                      }
                    }}
                    className={`mt-2 ${errors.hostEmail ? 'border-destructive' : ''}`} 
                    placeholder="To receive event details" 
                  />
                  {errors.hostEmail && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertDescription className="text-sm">{errors.hostEmail}</AlertDescription>
                    </Alert>
                  )}
                </div>

                <Button type="submit" variant="hero" size="lg" className="w-full rounded-[50px]" disabled={!isFormComplete}>
                  Generate Link
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>;
};
export default NewEvent;