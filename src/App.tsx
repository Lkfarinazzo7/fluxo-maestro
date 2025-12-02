import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import { AuthProvider } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AppLayout } from "./components/Layout/AppLayout";
import { ErrorBoundary } from "./components/ErrorBoundary";
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
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <AppProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
                <Route path="/contratos" element={<ProtectedRoute><AppLayout><Contratos /></AppLayout></ProtectedRoute>} />
                <Route path="/financeiro" element={<ProtectedRoute><AppLayout><Financeiro /></AppLayout></ProtectedRoute>} />
                <Route path="/relatorios" element={<ProtectedRoute><AppLayout><Relatorios /></AppLayout></ProtectedRoute>} />
                <Route path="/relatorios/fluxo-caixa" element={<ProtectedRoute><AppLayout><FluxoCaixa /></AppLayout></ProtectedRoute>} />
                <Route path="/relatorios/dre" element={<ProtectedRoute><AppLayout><DRE /></AppLayout></ProtectedRoute>} />
                <Route path="/relatorios/receitas-comparativo" element={<ProtectedRoute><AppLayout><ReceitasComparativo /></AppLayout></ProtectedRoute>} />
                <Route path="/relatorios/despesas-categoria" element={<ProtectedRoute><AppLayout><DespesasCategoria /></AppLayout></ProtectedRoute>} />
                <Route path="/relatorios/contratos-operadora" element={<ProtectedRoute><AppLayout><ContratosOperadora /></AppLayout></ProtectedRoute>} />
                <Route path="/relatorios/ticket-medio" element={<ProtectedRoute><AppLayout><TicketMedio /></AppLayout></ProtectedRoute>} />
                <Route path="/relatorios/vendedores" element={<ProtectedRoute><AppLayout><RelatorioVendedores /></AppLayout></ProtectedRoute>} />
                <Route path="/relatorios/supervisores" element={<ProtectedRoute><AppLayout><RelatorioSupervisores /></AppLayout></ProtectedRoute>} />
                <Route path="/calculadora" element={<ProtectedRoute><AppLayout><Calculadora /></AppLayout></ProtectedRoute>} />
                <Route path="/configuracoes" element={<ProtectedRoute><AppLayout><Configuracoes /></AppLayout></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AppProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
