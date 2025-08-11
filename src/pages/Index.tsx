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
              <Button variant="hero" size="lg" onClick={() => navigate('/newevent')} className="text-xl px-12 py-6 border-3 border-white rounded-[30px] bg-[#EF4EB7] hover:bg-[#EF4EB7]/90" style={{
              background: '#EF4EB7'
            }}>
                New Event
              </Button>
            </div>

            {/* Feature Cards */}
            <div className="grid gap-2 md:grid-cols-3 max-w-4xl mx-auto">
              <Card className="shadow-primary hover:shadow-accent transition-shadow">
                <CardContent className="pt-8 pb-8 text-center">
                  <img src="/lovable-uploads/9aa0cac8-3d5b-4dfd-b53f-30c71180282e.png" alt="Ghost icon" className="w-16 h-16 mx-auto mb-4" />
                  <h5 className="text-primary mb-3">CREATE DEMAND</h5>
                  <p className="text-muted-foreground text-sm">Limited spots make your party the hottest haunt in town.</p>
                </CardContent>
              </Card>

              <Card className="shadow-primary hover:shadow-accent transition-shadow">
                <CardContent className="pt-8 pb-8 text-center">
                  <img src="/lovable-uploads/4d2aee0a-f125-4fa8-8cc6-e95a81efb42b.png" alt="Hourglass icon" className="w-16 h-16 mx-auto mb-4" />
                  <h5 className="text-primary mb-3">RUN THE CLOCK</h5>
                  <p className="text-muted-foreground text-sm">Give guests a ticking clock so they act fast or miss out.

                </p>
                </CardContent>
              </Card>

              <Card className="shadow-primary hover:shadow-accent transition-shadow">
                <CardContent className="pt-8 pb-8 text-center">
                  <img src="/lovable-uploads/718e6376-b7a9-43b1-98d9-745480a8fde5.png" alt="Gender symbols icon" className="w-16 h-16 mx-auto mb-4" />
                  <h5 className="text-primary mb-3">CONTROL THE RATIO</h5>
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