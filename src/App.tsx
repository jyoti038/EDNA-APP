import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ParticleBackground } from "@/components/ParticleBackground";
import Index from "./pages/Index";
import DatasetHub from "./pages/DatasetHub";
import SpeciesIdentifier from "./pages/SpeciesIdentifier";
import DNAFusionLab from "./pages/DNAFusionLab";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="relative min-h-screen flex flex-col">
          <ParticleBackground />
          <Navbar />
          <main className="flex-grow relative z-10">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dataset-hub" element={<DatasetHub />} />
              <Route path="/species-identifier" element={<SpeciesIdentifier />} />
              <Route path="/dna-fusion" element={<DNAFusionLab />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
