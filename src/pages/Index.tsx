import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { PageTransition, StaggeredReveal } from "@/components/PageTransition";
import { useNavigate } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";
const Index = () => {
  const navigate = useNavigate();
  useScrollReveal();
  return (
    <PageTransition>
      <div className="min-h-screen page-scrim">
        {/* Hero Section with Video Background */}
        <section className="relative py-20 overflow-hidden">
          {/* Content Overlay */}
          <div className="relative z-10 container mx-auto px-6 text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-white mb-6 drop-shadow-lg animate-fade-in-up">
                The FOMO-Fueled Party Planner
              </h1>
              <p className="text-white/90 mb-12 max-w-2xl mx-auto text-lg leading-relaxed animate-fade-in-up" 
                 style={{ animationDelay: '0.2s' }}>
                Plan events that don't get ghosted. Fuel demand with RSVP timers, capped guest lists, and gender ratio controls.
              </p>
              
              <div className="mb-16">
                <Button 
                  variant="hero" 
                  size="lg" 
                  onClick={() => navigate('/newevent')} 
                  className="text-xl px-12 py-6 border-3 border-white rounded-[30px] bg-[#EF4EB7] hover:bg-[#EF4EB7]/90 magnetic-hover glow floating animate-scale-in-bounce" 
                  style={{ background: '#EF4EB7', animationDelay: '0.4s' }}
                >
                  New Event
                </Button>
              </div>

              {/* Feature Cards */}
              <StaggeredReveal delay={200} className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Card className="shadow-primary hover:shadow-accent hover-lift glow reveal-on-scroll">
                  <CardContent className="pt-8 pb-8 text-center">
                    <img src="/lovable-uploads/9aa0cac8-3d5b-4dfd-b53f-30c71180282e.png" 
                         alt="Ghost icon" 
                         className="w-24 h-24 mx-auto mb-4 floating" />
                    <h5 className="text-primary mb-3">CREATE DEMAND</h5>
                    <p className="text-muted-foreground text-sm">
                      Limited spots make your party the hottest haunt in town.
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-primary hover:shadow-accent hover-lift glow reveal-on-scroll">
                  <CardContent className="pt-8 pb-8 text-center">
                    <img src="/lovable-uploads/4d2aee0a-f125-4fa8-8cc6-e95a81efb42b.png" 
                         alt="Hourglass icon" 
                         className="w-24 h-24 mx-auto mb-4 floating-delayed" />
                    <h5 className="text-primary mb-3">RUN THE CLOCK</h5>
                    <p className="text-muted-foreground text-sm">
                      Give guests a ticking clock so they act fast or miss out.
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-primary hover:shadow-accent hover-lift glow reveal-on-scroll">
                  <CardContent className="pt-8 pb-8 text-center">
                    <img src="/lovable-uploads/718e6376-b7a9-43b1-98d9-745480a8fde5.png" 
                         alt="Gender symbols icon" 
                         className="w-24 h-24 mx-auto mb-4 floating" />
                    <h5 className="text-primary mb-3">CONTROL THE RATIO</h5>
                    <p className="text-muted-foreground text-sm">
                      Fine-tune your guest list for the ideal social dynamic.
                    </p>
                  </CardContent>
                </Card>
              </StaggeredReveal>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};
export default Index;