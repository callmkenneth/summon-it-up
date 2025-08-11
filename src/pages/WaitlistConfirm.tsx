import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Footer } from "@/components/Footer";

const WaitlistConfirm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const gender = searchParams.get('gender');

  const handleJoinWaitlist = () => {
    navigate(`/name/${id}?response=waitlist&gender=${gender}`);
  };

  const handleGoBack = () => {
    navigate(`/invite/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-card flex flex-col">
      <div className="flex-1 flex items-center justify-center py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">⏳</div>
              <h1 className="text-primary mb-4">No {gender} spots available</h1>
              <p className="text-muted-foreground">
                All {gender} spots have been filled, but you can join the waitlist in case someone cancels.
              </p>
            </div>

            <Card className="shadow-primary">
              <CardHeader>
                <CardTitle className="text-center text-accent">Join the Waitlist?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-4">
                  <p className="text-muted-foreground">
                    We'll notify the host if you join the waitlist. If a spot opens up, they can reach out to you directly.
                  </p>
                  
                  <div className="grid gap-3">
                    <Button 
                      variant="hero" 
                      size="lg" 
                      className="w-full"
                      onClick={handleJoinWaitlist}
                    >
                      Yes, add me to waitlist
                    </Button>
                    <Button 
                      variant="reject" 
                      size="lg" 
                      className="w-full"
                      onClick={handleGoBack}
                    >
                      No thanks
                    </Button>
                  </div>
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

export default WaitlistConfirm;