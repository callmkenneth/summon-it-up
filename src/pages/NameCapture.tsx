import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const NameCapture = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const response = searchParams.get('response') as 'yes' | 'no' | 'waitlist';
  
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !gender) return;

    setSubmitting(true);
    try {
      // Check gender-specific spots if event uses ratio control
      if (response === 'yes') {
        const { data: spotsData, error: spotsError } = await supabase
          .rpc('get_gender_spots_remaining', {
            event_uuid: id,
            target_gender: gender
          });

        if (spotsError) throw spotsError;

        if (spotsData <= 0) {
          navigate(`/waitlist-confirm/${id}?gender=${gender}`);
          return;
        }
      }

      if (response === 'waitlist') {
        // Submit to waitlist table
        const { error } = await supabase
          .from('waitlist')
          .insert({
            event_id: id,
            attendee_name: name,
            attendee_email: email || null,
            gender: gender
          });
        
        if (error) throw error;
      } else {
        // Submit RSVP to regular table
        const { error } = await supabase
          .from('rsvps')
          .insert({
            event_id: id,
            attendee_name: name,
            attendee_email: email || '',
            gender: gender,
            status: response
          });
        
        if (error) throw error;
      }

      if (response === 'yes' || response === 'waitlist') {
        navigate(`/details/${id}?name=${encodeURIComponent(name)}`);
      } else {
        navigate(`/rejected/${id}?name=${encodeURIComponent(name)}`);
      }
    } catch (error: any) {
      toast({
        title: "Error submitting RSVP",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const isFormComplete = name.trim() && gender;

  return (
    <div className="min-h-screen bg-gradient-card flex flex-col">
      <div className="flex-1 flex items-center justify-center py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-primary mb-4">What's your name?</h1>
              <p className="text-muted-foreground">so we can tell the host</p>
            </div>

            <Card className="shadow-primary">
              <CardHeader>
                <CardTitle className="text-center text-accent">
                  {response === 'yes' && "Great! You're coming 🎉"}
                  {response === 'no' && "Thanks for letting us know"}
                  {response === 'waitlist' && "Added to waitlist"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Your Name *</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-2"
                      placeholder="Enter your full name"
                      autoFocus
                      disabled={submitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Your Email (optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-2"
                      placeholder="Enter your email address (optional)"
                      disabled={submitting}
                    />
                  </div>

                  <div>
                    <Label className="text-base font-medium">Gender *</Label>
                    <RadioGroup value={gender} onValueChange={setGender} className="mt-3" disabled={submitting}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" disabled={submitting} />
                        <Label htmlFor="male">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" disabled={submitting} />
                        <Label htmlFor="female">Female</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Button 
                    type="submit" 
                    variant="hero" 
                    size="lg" 
                    className="w-full"
                    disabled={!isFormComplete || submitting}
                  >
                    {submitting ? "Submitting..." : "Done"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="text-center mt-8">
              <p className="text-sm text-muted-foreground">
                Your information will only be shared with the event host
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NameCapture;