import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Copy, Mail, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CountdownTimer } from "@/components/CountdownTimer";
import { Footer } from "@/components/Footer";
const Share = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [event, setEvent] = useState<any>(null);
  const eventId = searchParams.get('id');
  const emailAlreadySent = searchParams.get('emailSent') === 'true';
  
  // Reliable base URL construction with proper environment detection
  const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      console.log('Base URL detected:', origin);
      return origin;
    }
    // Production URL - replace with your actual deployed URL
    const fallbackUrl = 'https://lsbaijtsrkvrnkjyioza.lovableproject.com';
    console.log('Using fallback URL:', fallbackUrl);
    return fallbackUrl;
  };
  
  const inviteLink = eventId ? `${getBaseUrl()}/invite/${eventId}` : '';
  const manageLink = eventId ? `${getBaseUrl()}/manage/${eventId}` : '';
  
  // Validate links
  const validateLink = (link: string) => {
    try {
      new URL(link);
      return link.includes('/invite/') || link.includes('/manage/');
    } catch {
      return false;
    }
  };
  useEffect(() => {
    if (!eventId) {
      toast({
        title: "No event found",
        description: "Please create an event first",
        variant: "destructive"
      });
      navigate('/newevent');
      return;
    }
    const fetchEvent = async () => {
      try {
        console.log('Fetching event with ID:', eventId);
        
        // First try public_events view
        let { data, error } = await supabase
          .from('public_events')
          .select('*')
          .eq('id', eventId)
          .maybeSingle();
        
        // If public_events fails, try direct events table access
        if (error || !data) {
          console.log('public_events failed, trying events table:', error);
          const { data: eventData, error: eventError } = await supabase
            .from('events')
            .select('id, created_at, updated_at, title, description, location, event_date, start_time, end_time, guest_limit, unlimited_guests, male_ratio, female_ratio, use_ratio_control, rsvp_deadline, hide_location_until_rsvp, image_url, status')
            .eq('id', eventId)
            .eq('status', 'open')
            .maybeSingle();
          
          data = eventData;
          error = eventError;
        }
        
        if (error) {
          console.error('Database error fetching event:', error);
          throw new Error(`Database error: ${error.message}`);
        }
        
        if (!data) {
          console.log('No event found with ID:', eventId);
          toast({
            title: "Event not found",
            description: "This event may have been deleted, cancelled, or is not available for sharing",
            variant: "destructive"
          });
          navigate('/');
          return;
        }
        
        console.log('Event loaded successfully:', data);
        setEvent(data);
      } catch (error: any) {
        console.error('Failed to load event details:', error);
        toast({
          title: "Unable to load event",
          description: error.message || "Please check your connection and try again",
          variant: "destructive"
        });
        // Don't navigate away immediately, let user retry
      }
    };
    fetchEvent();
  }, [eventId, navigate, toast]);
  const copyToClipboard = async (text: string, type: string) => {
    // Validate link before copying
    if (!validateLink(text)) {
      toast({
        title: "Invalid link",
        description: "The link appears to be malformed. Please refresh the page.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      toast({
        title: "Copied!",
        description: "Link copied to clipboard"
      });
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(type);
        toast({
          title: "Copied!",
          description: "Link copied to clipboard"
        });
        setTimeout(() => setCopied(null), 2000);
      } catch (fallbackErr) {
        toast({
          title: "Failed to copy",
          description: "Please copy the link manually",
          variant: "destructive"
        });
      }
      document.body.removeChild(textArea);
    }
  };
  const sendEmail = async () => {
    if (!eventId || !email) return;
    try {
      const {
        error
      } = await supabase.functions.invoke('send-event-details', {
        body: {
          eventId,
          email
        }
      });
      if (error) throw error;
      setEmailSent(true);
      toast({
        title: "Email sent!",
        description: "Event details have been sent to your inbox"
      });
    } catch (error: any) {
      toast({
        title: "Failed to send email",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  return <div className="min-h-screen page-scrim">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto text-center space-y-2">
          <h1 className="text-white mb-4">All Set!</h1>
          <h4 className="text-white/80">YOUR EVENT IS READY TO BE SHARED.</h4>
          
          <div className="bg-light-pink border border-pink rounded-[30px] p-6">
            <p className="text-primary font-bold text-lg">Don't close your browser without saving these first!</p>
          </div>

          <div className="grid gap-2 md:grid-cols-2">
            <Card className="">
              <CardHeader>
                <CardTitle className="text-primary flex items-center gap-2">
                  <img src="/lovable-uploads/5ecb635f-dbf8-46d8-bf83-05300c3ac8a1.png" alt="Upload icon" className="w-10 h-10" /> INVITATION PAGE
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">Copy this link and send to attendees</p>
                <div className="flex gap-2">
                  <Input 
                    value={inviteLink} 
                    readOnly 
                    className="flex-1" 
                    style={{ backgroundColor: validateLink(inviteLink) ? undefined : '#fef2f2' }}
                  />
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => copyToClipboard(inviteLink, 'invite')} 
                    className="h-10 w-10 shadow-none border-input"
                    disabled={!validateLink(inviteLink)}
                  >
                    {copied === 'invite' ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" style={{
                    color: '#3D2051'
                  }} />}
                  </Button>
                </div>
                {!validateLink(inviteLink) && (
                  <p className="text-sm text-red-600">⚠️ Link validation failed - please refresh the page</p>
                )}
              </CardContent>
            </Card>

            <Card className="">
              <CardHeader>
                <CardTitle className="text-primary flex items-center gap-2">
                  <img src="/lovable-uploads/ace9dfe7-9ade-4fb1-81e5-720002c00b6c.png" alt="Settings icon" className="w-10 h-10" /> MANAGEMENT PAGE
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">Save this link to view and edit RSVPs</p>
                <div className="flex gap-2">
                  <Input 
                    value={manageLink} 
                    readOnly 
                    className="flex-1"
                    style={{ backgroundColor: validateLink(manageLink) ? undefined : '#fef2f2' }}
                  />
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => copyToClipboard(manageLink, 'manage')} 
                    className="h-10 w-10 shadow-none border-input"
                    disabled={!validateLink(manageLink)}
                  >
                    {copied === 'manage' ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" style={{
                    color: '#3D2051'
                  }} />}
                  </Button>
                </div>
                {!validateLink(manageLink) && (
                  <p className="text-sm text-red-600">⚠️ Link validation failed - please refresh the page</p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="">
            <CardHeader>
              <CardTitle className="text-primary flex items-center gap-2 justify-center"><img src="/lovable-uploads/3047b19b-8477-432b-943b-4302c6f0b908.png" alt="Hourglass icon" className="w-10 h-10" /> RSVP DEADLINE</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              {event?.rsvp_deadline ? <div>
                  <CountdownTimer deadline={event.rsvp_deadline} size="large" />
                  <p className="text-xs text-muted-foreground mt-1">Time left to respond</p>
                  <p className="text-xs text-muted-foreground mt-2">(days, hours, minutes, seconds)</p>
                </div> : <span className="text-muted-foreground">No deadline</span>}
            </CardContent>
          </Card>

          <Card className="">
            <CardHeader>
              <CardTitle className="text-primary flex items-center gap-2 justify-center">
                <img src="/lovable-uploads/b5763a95-016c-48dc-810e-bb5e756a5149.png" alt="Mail icon" className="w-10 h-10" />
                {emailAlreadySent ? "EMAIL SENT TO YOUR INBOX!" : "WANT THESE DETAILS IN YOUR INBOX?"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {emailAlreadySent ? 
                <div className="text-center">
                  <div className="text-green-600 mb-2">✅ Email already sent to your inbox!</div>
                  <p className="text-sm text-muted-foreground">Check your email for the complete event details and links</p>
                  <p className="text-xs text-muted-foreground mt-2">Want to send to another email address?</p>
                  <div className="flex gap-2 max-w-md mx-auto mt-3">
                    <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="another@email.com" className="flex-1" />
                    <Button onClick={sendEmail} variant="outline" disabled={!email} className="rounded-[30px] text-primary">
                      Send
                    </Button>
                  </div>
                </div>
              : (!emailSent ? <>
                  <div className="flex gap-2 max-w-md mx-auto">
                    <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" className="flex-1" />
                    <Button onClick={sendEmail} variant="rsvp" disabled={!email} className="rounded-[30px]">
                      Send
                    </Button>
                  </div>
                </> : <div className="text-center">
                  <div className="text-green-600 mb-2">✅ Email sent successfully!</div>
                  <p className="text-sm text-muted-foreground">Check your inbox for the event details</p>
                </div>)}
            </CardContent>
          </Card>

          <div className="bg-gradient-primary rounded-[30px] p-6">
            <h5 className="text-white mb-4">START PLANNING THE NEXT ONE</h5>
            <Button variant="secondary" size="lg" onClick={() => navigate('/newevent')} className="rounded-[30px]">
              New Event
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>;
};
export default Share;