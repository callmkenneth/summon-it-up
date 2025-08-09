import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isNewEvent = location.pathname === '/newevent';

  return (
    <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 px-6 py-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div 
            className="cursor-pointer"
            onClick={() => navigate('/')}
          >
            <img src="/Summons-logo.png" alt="Summons logo" className="h-12 w-auto" />
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