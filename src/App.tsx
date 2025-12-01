import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import { AppLayout } from "./components/Layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Contratos from "./pages/Contratos";
import Financeiro from "./pages/Financeiro";
import Relatorios from "./pages/Relatorios";
import Calculadora from "./pages/Calculadora";
import Configuracoes from "./pages/Configuracoes";
import FluxoCaixa from "./pages/Relatorios/FluxoCaixa";
import DRE from "./pages/Relatorios/DRE";
import ReceitasComparativo from "./pages/Relatorios/ReceitasComparativo";
import DespesasCategoria from "./pages/Relatorios/DespesasCategoria";
import ContratosOperadora from "./pages/Relatorios/ContratosOperadora";
import TicketMedio from "./pages/Relatorios/TicketMedio";
import RelatorioVendedores from "./pages/Relatorios/RelatorioVendedores";
import RelatorioSupervisores from "./pages/Relatorios/RelatorioSupervisores";
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
            <Route path="/contratos" element={<AppLayout><Contratos /></AppLayout>} />
            <Route path="/financeiro" element={<AppLayout><Financeiro /></AppLayout>} />
            <Route path="/relatorios" element={<AppLayout><Relatorios /></AppLayout>} />
            <Route path="/relatorios/fluxo-caixa" element={<AppLayout><FluxoCaixa /></AppLayout>} />
            <Route path="/relatorios/dre" element={<AppLayout><DRE /></AppLayout>} />
            <Route path="/relatorios/receitas-comparativo" element={<AppLayout><ReceitasComparativo /></AppLayout>} />
            <Route path="/relatorios/despesas-categoria" element={<AppLayout><DespesasCategoria /></AppLayout>} />
            <Route path="/relatorios/contratos-operadora" element={<AppLayout><ContratosOperadora /></AppLayout>} />
            <Route path="/relatorios/ticket-medio" element={<AppLayout><TicketMedio /></AppLayout>} />
            <Route path="/relatorios/vendedores" element={<AppLayout><RelatorioVendedores /></AppLayout>} />
            <Route path="/relatorios/supervisores" element={<AppLayout><RelatorioSupervisores /></AppLayout>} />
            <Route path="/calculadora" element={<AppLayout><Calculadora /></AppLayout>} />
            <Route path="/configuracoes" element={<AppLayout><Configuracoes /></AppLayout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
