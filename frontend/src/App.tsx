import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AllSpecialists from "@/pages/specialists/AllSpecialists";
import CreateSpecialist from "@/pages/specialists/CreateSpecialist";
import EditSpecialist from "@/pages/specialists/EditSpecialist";
import Marketplace from "@/pages/marketplace/Marketplace";
import SpecialistDetails from "@/pages/marketplace/SpecialistDetails";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AllSpecialists />} />
          <Route path="/specialists/create" element={<CreateSpecialist />} />
          <Route path="/specialists/:id/edit" element={<EditSpecialist />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/marketplace/:id" element={<SpecialistDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
