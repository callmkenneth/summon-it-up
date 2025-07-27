import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Mail, Check } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Share = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  // Mock event ID - in real app this would come from the creation flow
  const eventId = "sample-event-123";
  const inviteLink = `${window.location.origin}/invite/${eventId}`;
  const manageLink = `${window.location.origin}/manage`;

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      toast({
        title: "Copied!",
        description: "Link copied to clipboard",
      });
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually",
        variant: "destructive",
      });
    }
  };

  const sendEmail = () => {
    // TODO: Implement email sending when Supabase is connected
    setEmailSent(true);
    toast({
      title: "Email sent!",
      description: "Event details have been sent to your inbox",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-card">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-primary mb-4">All Set!</h1>
          <h4 className="text-muted-foreground mb-12">Your Event is Ready to Be Shared</h4>
          
          <div className="bg-light-pink border border-pink rounded-lg p-6 mb-8">
            <p className="text-primary font-bold text-lg">Don't close your browser without saving these first!</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 mb-12">
            <Card className="shadow-primary">
              <CardHeader>
                <CardTitle className="text-accent flex items-center gap-2">
                  <span>📤</span> Invitation Page
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">Copy this link and send to attendees</p>
                <div className="flex gap-2">
                  <Input value={inviteLink} readOnly className="flex-1" />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(inviteLink, 'invite')}
                  >
                    {copied === 'invite' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-primary">
              <CardHeader>
                <CardTitle className="text-primary flex items-center gap-2">
                  <span>⚙️</span> Management Page
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">Save this link to view and edit RSVPs</p>
                <div className="flex gap-2">
                  <Input value={manageLink} readOnly className="flex-1" />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(manageLink, 'manage')}
                  >
                    {copied === 'manage' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-accent mb-8">
            <CardHeader>
              <CardTitle className="text-primary flex items-center gap-2 justify-center">
                <Mail className="h-5 w-5" />
                Want these details in your inbox?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!emailSent ? (
                <>
                  <div className="flex gap-2 max-w-md mx-auto">
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="flex-1"
                    />
                    <Button onClick={sendEmail} variant="rsvp" disabled={!email}>
                      Send
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <div className="text-green-600 mb-2">✅ Email sent successfully!</div>
                  <p className="text-sm text-muted-foreground">Check your inbox for the event details</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="bg-gradient-primary rounded-lg p-6">
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

export default Share;