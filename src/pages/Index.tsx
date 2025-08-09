import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { useNavigate } from "react-router-dom";
const Index = () => {
  const navigate = useNavigate();
  return <div className="min-h-screen page-scrim">
      {/* Hero Section with Video Background */}
      <section className="relative py-20 overflow-hidden">
        {/* Content Overlay */}
        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-white mb-6 drop-shadow-lg">The FOMO-Fueled Party Planner</h1>
            <p className="text-white/90 mb-12 max-w-2xl mx-auto text-lg leading-relaxed">Haunt your friends with RSVP timers, spot limits, and the perfect party mix — before the night disappears.</p>
            
            <div className="mb-16">
              <Button variant="hero" size="lg" onClick={() => navigate('/newevent')} className="text-xl px-12 py-6">
                New Event
              </Button>
            </div>

            {/* Feature Cards */}
            <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
              <Card className="shadow-primary hover:shadow-accent transition-shadow">
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="text-4xl mb-4">😎</div>
                  <h5 className="text-primary mb-3">Create Demand</h5>
                  <p className="text-muted-foreground text-sm">Limited spots make your party the hottest haunt in town.</p>
                </CardContent>
              </Card>

              <Card className="shadow-primary hover:shadow-accent transition-shadow">
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="text-4xl mb-4">⏳</div>
                  <h5 className="text-primary mb-3">Run the Clock</h5>
                  <p className="text-muted-foreground text-sm">Give guests a ticking clock so they act fast or miss out.

                </p>
                </CardContent>
              </Card>

              <Card className="shadow-primary hover:shadow-accent transition-shadow">
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="text-4xl mb-4">👫</div>
                  <h5 className="text-primary mb-3">Control the Ratio</h5>
                  <p className="text-muted-foreground text-sm">Fine-tune your guest list for the ideal social dynamic.

                </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default Index;