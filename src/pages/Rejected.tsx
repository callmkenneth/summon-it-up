import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Footer } from "@/components/Footer";

const Rejected = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const userName = searchParams.get('name') || "Friend";

  return (
    <div className="min-h-screen page-scrim">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto space-y-2 text-center">
          <h1 className="text-primary mb-8">Thanks for the RSVP {userName}</h1>
          
          <div className="text-6xl mb-8">👋</div>
          
          <Card className="shadow-primary mb-8">
            <CardContent className="pt-8 pb-8">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  We appreciate you taking the time to respond. Maybe next time!
                </p>
                <div className="text-4xl">💙</div>
                <p className="text-sm text-muted-foreground">
                  The host will see that you can't make it.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="bg-gradient-primary rounded-lg p-6">
            <h5 className="text-white mb-4">Want to make your own?</h5>
            <Button variant="secondary" size="lg" onClick={() => navigate('/newevent')}>
              New Event
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Rejected;