import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-card">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-light-pink">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="font-bungee text-primary">Summons</h2>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-muted-foreground hover:text-primary">About</a>
              <a href="#" className="text-muted-foreground hover:text-primary">Help</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-primary mb-6">
              Create Beautiful Events
            </h1>
            <h3 className="text-muted-foreground mb-12 max-w-2xl mx-auto">
              The easiest way to organize gatherings, collect RSVPs, and manage your guest list with style.
            </h3>
            
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

      {/* Footer */}
      <footer className="bg-dark-purple text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h5 className="font-bungee text-light-pink mb-4">Summons</h5>
              <p className="text-sm text-gray-300">
                Beautiful event management made simple.
              </p>
            </div>
            <div>
              <h5 className="text-light-pink mb-4">Product</h5>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Examples</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-light-pink mb-4">Support</h5>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-light-pink mb-4">Legal</h5>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-purple mt-8 pt-8 text-center text-sm text-gray-300">
            <p>&copy; 2024 Summons. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
