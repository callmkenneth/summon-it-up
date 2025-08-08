import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isNewEvent = location.pathname === '/newevent';

  return (
    <nav className="bg-card border-b border-border px-6 py-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          {!isHome && isNewEvent && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          )}
          <div 
            className="cursor-pointer"
            onClick={() => navigate('/')}
          >
            <img src="/lovable-uploads/adc7fe20-2149-40b1-bfdc-9d78a8c60316.png" alt="Summons logo" className="h-8 w-auto" />
          </div>
        </div>
        
        <Button 
          variant="default" 
          onClick={() => navigate('/newevent')}
          className="text-sm"
        >
          New Event
        </Button>
      </div>
    </nav>
  );
}