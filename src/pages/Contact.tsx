import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MessageSquare, Clock } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen page-scrim">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-white mb-8 text-center">Get in Touch</h1>
          
          <div className="space-y-6">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-primary flex items-center gap-2">
                  <Mail className="h-6 w-6" />
                  Email Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Have questions, feedback, or need help with your event? We'd love to hear from you!
                </p>
                <div className="bg-gradient-primary rounded-lg p-6 text-center">
                  <h3 className="text-white font-semibold mb-2">Send us an email</h3>
                  <a 
                    href="mailto:callmkenneth@gmail.com"
                    className="inline-flex items-center justify-center bg-white text-primary font-semibold px-6 py-3 rounded-[30px] hover:bg-white/90 transition-colors"
                  >
                    callmkenneth@gmail.com
                  </a>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="text-primary flex items-center gap-2">
                    <MessageSquare className="h-6 w-6" />
                    What we can help with
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Technical support and troubleshooting
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Event planning best practices
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Feature requests and feedback
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Account and billing questions
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Partnership opportunities
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="text-primary flex items-center gap-2">
                    <Clock className="h-6 w-6" />
                    Response Time
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    We typically respond to emails within 24-48 hours during business days.
                  </p>
                  <div className="bg-light-pink rounded-lg p-4">
                    <p className="text-primary font-semibold text-sm">
                      💡 Tip: Include as much detail as possible in your message to help us assist you faster!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-primary">Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">How do I create my first event?</h4>
                  <p className="text-muted-foreground text-sm">
                    Click "New Event" from the homepage and follow our guided setup process. You'll have your event ready to share in minutes!
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Can I edit my event after publishing?</h4>
                  <p className="text-muted-foreground text-sm">
                    Yes! Use your management link to edit event details, manage RSVPs, and even cancel the event if needed.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">What happens when my event is full?</h4>
                  <p className="text-muted-foreground text-sm">
                    New visitors will see a waitlist option instead of RSVP buttons. When someone cancels, the first person on the waitlist is automatically promoted.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;