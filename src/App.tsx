import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import { AppLayout } from "./components/Layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Vendas from "./pages/Vendas";
import Produtos from "./pages/Produtos";
import Clientes from "./pages/Clientes";
import Financeiro from "./pages/Financeiro";
import Relatorios from "./pages/Relatorios";
import Configuracoes from "./pages/Configuracoes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
            <Route path="/vendas" element={<AppLayout><Vendas /></AppLayout>} />
            <Route path="/produtos" element={<AppLayout><Produtos /></AppLayout>} />
            <Route path="/clientes" element={<AppLayout><Clientes /></AppLayout>} />
            <Route path="/financeiro" element={<AppLayout><Financeiro /></AppLayout>} />
            <Route path="/relatorios" element={<AppLayout><Relatorios /></AppLayout>} />
            <Route path="/configuracoes" element={<AppLayout><Configuracoes /></AppLayout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
