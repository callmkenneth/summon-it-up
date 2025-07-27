import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";

const NameCapture = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const response = searchParams.get('response') as 'yes' | 'no' | 'waitlist';
  
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !gender) return;

    // TODO: Submit RSVP to Supabase when connected
    
    if (response === 'yes' || response === 'waitlist') {
      navigate(`/details/${id}`);
    } else {
      navigate(`/rejected/${id}`);
    }
  };

  const isFormComplete = name.trim() && gender;

  return (
    <div className="min-h-screen bg-gradient-card flex items-center justify-center">
      <div className="container mx-auto px-6 py-12">
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
                  />
                </div>

                <div>
                  <Label className="text-base font-medium">Gender *</Label>
                  <RadioGroup value={gender} onValueChange={setGender} className="mt-3">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button 
                  type="submit" 
                  variant="hero" 
                  size="lg" 
                  className="w-full"
                  disabled={!isFormComplete}
                >
                  Done
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
  );
};

export default NameCapture;