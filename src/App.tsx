import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NewEvent from "./pages/NewEvent";
import Share from "./pages/Share";
import Manage from "./pages/Manage";
import Invite from "./pages/Invite";
import NameCapture from "./pages/NameCapture";
import Details from "./pages/Details";
import Rejected from "./pages/Rejected";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/newevent" element={<NewEvent />} />
          <Route path="/share" element={<Share />} />
          <Route path="/manage" element={<Manage />} />
          <Route path="/invite/:id" element={<Invite />} />
          <Route path="/name/:id" element={<NameCapture />} />
          <Route path="/details/:id" element={<Details />} />
          <Route path="/rejected/:id" element={<Rejected />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
