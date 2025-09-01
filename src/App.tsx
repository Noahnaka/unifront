import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Fights from "./pages/Fights";
import Betting from "./pages/Betting";
import Leaderboard from "./pages/Leaderboard";
import NotFound from "./pages/NotFound";
import Aposta from "./pages/Aposta";
import Admin from "./pages/Admin";
import AdminDashboard from "./pages/AdminDashboard";
import Premium from "./pages/Premium";
import AnaliseAvancada from "./pages/AnaliseAvancada";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin' || location.pathname === '/admin/dashboard';

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950">
      {!isAdminPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/fights" element={<Fights />} />
        <Route path="/betting" element={<Betting />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/aposta" element={<Aposta />} />
        <Route path="/premium" element={<Premium />} />
        <Route path="/analise-avancada" element={<AnaliseAvancada />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
