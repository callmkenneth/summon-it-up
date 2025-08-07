import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import Index from "./pages/Index";
import NewEvent from "./pages/NewEvent";
import Share from "./pages/Share";
import Manage from "./pages/Manage";
import Invite from "./pages/Invite";
import NameCapture from "./pages/NameCapture";
import Details from "./pages/Details";
import Rejected from "./pages/Rejected";
import WaitlistConfirm from "./pages/WaitlistConfirm";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Cookies from "./pages/Cookies";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-card">
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/newevent" element={<NewEvent />} />
            <Route path="/share" element={<Share />} />
            <Route path="/manage/:id" element={<Manage />} />
            <Route path="/invite/:id" element={<Invite />} />
            <Route path="/name/:id" element={<NameCapture />} />
            <Route path="/details/:id" element={<Details />} />
            <Route path="/rejected/:id" element={<Rejected />} />
            <Route path="/waitlist-confirm/:id" element={<WaitlistConfirm />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/cookies" element={<Cookies />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
