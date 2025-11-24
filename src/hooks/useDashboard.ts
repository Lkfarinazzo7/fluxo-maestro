import { useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { DateRange, filterByDateRange } from '@/lib/dateFilters';
import { Contrato, Entrada, Saida } from '@/types';

export interface DashboardMetrics {
  receitaPeriodo: number;
  receitaPrevista: number;
  despesasPeriodo: number;
  resultadoLiquido: number;
  contratosImplantados: number;
  ticketMedioContratos: number;
  totalVidasPeriodo: number;
  receitaBancaria: number;
  receitaBonificacao: number;
}

export interface ContratosPorOperadora {
  operadora: string;
  quantidade: number;
  ticketMedio: number;
}

export function useDashboard(dateRange: DateRange) {
  const { contratos, entradas, saidas } = useApp();

  const metrics = useMemo(() => {
    // Filtrar contratos implantados no período
    const contratosAtivos = contratos.filter(c => c.status === 'ativo');
    const contratosPeriodo = filterByDateRange(contratosAtivos, 'dataCriacao', dateRange);

    // Filtrar entradas recebidas no período
    const entradasRecebidas = entradas.filter(e => e.status === 'recebido' && e.dataRecebida);
    const entradasRecebidasPeriodo = filterByDateRange(entradasRecebidas, 'dataRecebida', dateRange);
    
    // Filtrar entradas previstas no período
    const entradasPrevistas = entradas.filter(e => e.status === 'previsto');
    const entradasPrevistasPeriodo = filterByDateRange(entradasPrevistas, 'dataPrevista', dateRange);

    // Filtrar saídas pagas no período
    const saidasPagas = saidas.filter(s => s.status === 'pago' && s.dataPaga);
    const saidasPagasPeriodo = filterByDateRange(saidasPagas, 'dataPaga', dateRange);

    // Calcular receita do período (só recebidas)
    const receitaPeriodo = entradasRecebidasPeriodo.reduce((sum, e) => sum + (e.valorRecebido || 0), 0);
    
    // Calcular receita prevista (só previstas)
    const receitaPrevista = entradasPrevistasPeriodo.reduce((sum, e) => sum + e.valorPrevisto, 0);
    
    // Calcular despesas do período
    const despesasPeriodo = saidasPagasPeriodo.reduce((sum, s) => sum + s.valor, 0);
    
    // Resultado líquido
    const resultadoLiquido = receitaPeriodo - despesasPeriodo;

    // Total de vidas no período
    const totalVidasPeriodo = contratosPeriodo.reduce((sum, c) => sum + c.quantidadeVidas, 0);

    // Ticket médio dos contratos do período
    const ticketMedioContratos = contratosPeriodo.length > 0
      ? contratosPeriodo.reduce((sum, c) => sum + c.valorMensalidade, 0) / contratosPeriodo.length
      : 0;

    // Receita bancária e bonificação
    const receitaBancaria = entradasRecebidasPeriodo
      .filter(e => e.tipo === 'bancaria')
      .reduce((sum, e) => sum + (e.valorRecebido || 0), 0);
    
    const receitaBonificacao = entradasRecebidasPeriodo
      .filter(e => e.tipo === 'bonificacao')
      .reduce((sum, e) => sum + (e.valorRecebido || 0), 0);

    const result: DashboardMetrics = {
      receitaPeriodo,
      receitaPrevista,
      despesasPeriodo,
      resultadoLiquido,
      contratosImplantados: contratosPeriodo.length,
      ticketMedioContratos,
      totalVidasPeriodo,
      receitaBancaria,
      receitaBonificacao,
    };

    return result;
  }, [contratos, entradas, saidas, dateRange]);

  const contratosPorOperadora = useMemo(() => {
    const contratosAtivos = contratos.filter(c => c.status === 'ativo');
    const contratosPeriodo = filterByDateRange(contratosAtivos, 'dataCriacao', dateRange);

    const grouped = contratosPeriodo.reduce((acc, contrato) => {
      if (!acc[contrato.operadora]) {
        acc[contrato.operadora] = {
          operadora: contrato.operadora,
          quantidade: 0,
          totalMensalidade: 0,
        };
      }
      acc[contrato.operadora].quantidade += 1;
      acc[contrato.operadora].totalMensalidade += contrato.valorMensalidade;
      return acc;
    }, {} as Record<string, { operadora: string; quantidade: number; totalMensalidade: number }>);

    return Object.values(grouped).map(item => ({
      operadora: item.operadora,
      quantidade: item.quantidade,
      ticketMedio: item.quantidade > 0 ? item.totalMensalidade / item.quantidade : 0,
    }));
  }, [contratos, dateRange]);

  return {
    metrics,
    contratosPorOperadora,
  };
}
