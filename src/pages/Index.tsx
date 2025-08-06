import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-card">
      {/* Hero Section with Video Background */}
      <section className="relative py-20 overflow-hidden">
        {/* Pink Video Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink via-light-pink to-secondary opacity-90"></div>
        <div className="absolute inset-0 bg-gradient-primary opacity-70"></div>
        
        {/* Content Overlay */}
        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-white mb-6 drop-shadow-lg">
              Create Beautiful Events
            </h1>
            <p className="text-white/90 mb-12 max-w-2xl mx-auto text-lg leading-relaxed">
              The easiest way to organize gatherings, collect RSVPs, and manage your guest list with style.
            </p>
            
            <div className="mb-16">
              <Button 
                variant="hero" 
                size="lg" 
                onClick={() => navigate('/newevent')}
                className="text-xl px-12 py-6"
              >
                New Event
              </Button>
            </div>

            {/* Feature Cards */}
            <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
              <Card className="shadow-primary hover:shadow-accent transition-shadow">
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="text-4xl mb-4">📝</div>
                  <h5 className="text-primary mb-3">Easy Setup</h5>
                  <p className="text-muted-foreground text-sm">
                    Create your event in minutes with our simple form
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-primary hover:shadow-accent transition-shadow">
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="text-4xl mb-4">🎯</div>
                  <h5 className="text-primary mb-3">Smart RSVPs</h5>
                  <p className="text-muted-foreground text-sm">
                    Track responses, manage capacity, and handle waitlists
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-primary hover:shadow-accent transition-shadow">
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="text-4xl mb-4">📱</div>
                  <h5 className="text-primary mb-3">Share Anywhere</h5>
                  <p className="text-muted-foreground text-sm">
                    Beautiful invitation links that work on any device
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
