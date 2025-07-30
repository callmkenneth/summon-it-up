import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <nav className="bg-card border-b border-border px-6 py-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          {!isHome && (
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
            className="text-xl font-bold text-primary cursor-pointer"
            onClick={() => navigate('/')}
          >
            EventMaster
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground">
          Create • Manage • Celebrate
        </div>
      </div>
    </nav>
  );
}