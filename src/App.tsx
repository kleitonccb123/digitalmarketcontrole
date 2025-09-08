import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Layout } from "@/components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Orcamentos from "./pages/Orcamentos";
import Leads from "./pages/Leads";
import Briefings from "./pages/Briefings";
import RoiRoas from "./pages/RoiRoas";
import MetaAnalyzer from "./pages/MetaAnalyzer";
import Criativos from "./pages/Criativos";
import Planner from "./pages/Planner";
import Auditorias from "./pages/Auditorias";
import UTMs from "./pages/UTMs";
import Eventos from "./pages/Eventos";
import Templates from "./pages/Templates";
import Configuracoes from "./pages/Configuracoes";
import NotFound from "./pages/NotFound";
import { useState, useEffect } from 'react';

// Inicializar QueryClient fora do componente para evitar problemas de reinitialization
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Pequeno delay para garantir que o React está completamente inicializado
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  return (
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
};

const AppContent = () => {
  const { isAuthenticated, isLoading, initialize } = useAuthStore();

  useEffect(() => {
    // Inicializar o store de autenticação de forma segura
    initialize();
  }, [initialize]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/orcamentos" element={<Orcamentos />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/briefings" element={<Briefings />} />
        <Route path="/roi-roas" element={<RoiRoas />} />
        <Route path="/meta-analyzer" element={<MetaAnalyzer />} />
        <Route path="/criativos" element={<Criativos />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/auditorias" element={<Auditorias />} />
        <Route path="/utms" element={<UTMs />} />
        <Route path="/eventos" element={<Eventos />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
};

export default App;
