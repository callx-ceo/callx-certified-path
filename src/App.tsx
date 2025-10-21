import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import TraineeDashboard from "./pages/trainee/TraineeDashboard";
import ModuleView from "./pages/trainee/ModuleView";
import QuizView from "./pages/trainee/QuizView";
import SimulationView from "./pages/trainee/SimulationView";
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
          <Route path="/auth" element={<Auth />} />
          <Route path="/trainee/dashboard" element={<TraineeDashboard />} />
          <Route path="/trainee/module/:moduleId" element={<ModuleView />} />
          <Route path="/trainee/quiz/:lessonId" element={<QuizView />} />
          <Route path="/trainee/simulation/:lessonId" element={<SimulationView />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
