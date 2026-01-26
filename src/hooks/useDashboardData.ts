import { useMemo } from 'react';
import { useReceitasCRUD } from '@/hooks/useReceitasCRUD';
import { useDespesasCRUD } from '@/hooks/useDespesasCRUD';
import { useContratosCRUD } from '@/hooks/useContratosCRUD';
import { DateRange, isDateInRange } from '@/lib/dateFilters';

export interface DashboardMetrics {
  receitaPeriodo: number;
  receitaPrevista: number;
  despesasPeriodo: number;
  despesasPrevistas: number;
  resultadoLiquido: number;
  contratosNoPeriodo: number;
  valorTotalContratos: number;
  ticketMedioContratos: number;
  totalVidas: number;
  mediaVidasPorContrato: number;
}

export interface ContratosPorOperadora {
  operadora: string;
  quantidade: number;
  ticketMedio: number;
}

export function useDashboardData(dateRange: DateRange) {
  const { receitas, isLoading: loadingReceitas } = useReceitasCRUD();
  const { despesas, isLoading: loadingDespesas } = useDespesasCRUD();
  const { contratos, isLoading: loadingContratos } = useContratosCRUD();

  const metrics = useMemo(() => {
    // Filtrar receitas recebidas no período (pela data_recebida)
    const receitasRecebidas = receitas.filter(r => {
      if (r.status !== 'recebido' || !r.data_recebida) return false;
      return isDateInRange(r.data_recebida, dateRange);
    });

    // Filtrar receitas previstas no período (pela data_prevista)
    const receitasPrevistas = receitas.filter(r => {
      if (r.status !== 'previsto') return false;
      return isDateInRange(r.data_prevista, dateRange);
    });

    // Filtrar despesas pagas no período (pela data_paga)
    const despesasPagas = despesas.filter(d => {
      if (d.status !== 'pago' || !d.data_paga) return false;
      return isDateInRange(d.data_paga, dateRange);
    });

    // Filtrar despesas previstas no período (pela data_prevista)
    const despesasPrevistasNoPeriodo = despesas.filter(d => {
      if (d.status !== 'previsto') return false;
      return isDateInRange(d.data_prevista, dateRange);
    });

    // Filtrar contratos implantados no período (pela data_implantacao)
    const contratosNoPeriodo = contratos.filter(c => {
      return isDateInRange(c.data_implantacao, dateRange);
    });

    // Cálculos
    const receitaPeriodo = receitasRecebidas.reduce((sum, r) => sum + (r.valor_recebido || 0), 0);
    const receitaPrevista = receitasPrevistas.reduce((sum, r) => sum + r.valor_previsto, 0);
    const despesasPeriodoVal = despesasPagas.reduce((sum, d) => sum + d.valor, 0);
    const despesasPrevistasVal = despesasPrevistasNoPeriodo.reduce((sum, d) => sum + d.valor, 0);
    const resultadoLiquido = receitaPeriodo - despesasPeriodoVal;
    
    const valorTotalContratos = contratosNoPeriodo.reduce((sum, c) => sum + c.valor_mensalidade, 0);
    const ticketMedioContratos = contratosNoPeriodo.length > 0 
      ? valorTotalContratos / contratosNoPeriodo.length 
      : 0;
    
    const totalVidas = contratosNoPeriodo.reduce((sum, c) => sum + c.quantidade_vidas, 0);
    const mediaVidasPorContrato = contratosNoPeriodo.length > 0 
      ? totalVidas / contratosNoPeriodo.length 
      : 0;

    return {
      receitaPeriodo,
      receitaPrevista,
      despesasPeriodo: despesasPeriodoVal,
      despesasPrevistas: despesasPrevistasVal,
      resultadoLiquido,
      contratosNoPeriodo: contratosNoPeriodo.length,
      valorTotalContratos,
      ticketMedioContratos,
      totalVidas,
      mediaVidasPorContrato,
    };
  }, [receitas, despesas, contratos, dateRange]);

  const contratosPorOperadora = useMemo(() => {
    const contratosNoPeriodo = contratos.filter(c => {
      return isDateInRange(c.data_implantacao, dateRange);
    });

    const grouped = contratosNoPeriodo.reduce((acc, contrato) => {
      if (!acc[contrato.operadora]) {
        acc[contrato.operadora] = {
          operadora: contrato.operadora,
          quantidade: 0,
          totalMensalidade: 0,
        };
      }
      acc[contrato.operadora].quantidade += 1;
      acc[contrato.operadora].totalMensalidade += contrato.valor_mensalidade;
      return acc;
    }, {} as Record<string, { operadora: string; quantidade: number; totalMensalidade: number }>);

    return Object.values(grouped).map(item => ({
      operadora: item.operadora,
      quantidade: item.quantidade,
      ticketMedio: item.quantidade > 0 ? item.totalMensalidade / item.quantidade : 0,
    }));
  }, [contratos, dateRange]);

  // Próximos recebimentos (receitas previstas futuras)
  const proximosRecebimentos = useMemo(() => {
    const hoje = new Date();
    return receitas
      .filter(r => r.status === 'previsto' && new Date(r.data_prevista) >= hoje)
      .sort((a, b) => new Date(a.data_prevista).getTime() - new Date(b.data_prevista).getTime())
      .slice(0, 8);
  }, [receitas]);

  // Próximas despesas (despesas previstas futuras)
  const proximasDespesas = useMemo(() => {
    const hoje = new Date();
    return despesas
      .filter(d => d.status === 'previsto' && new Date(d.data_prevista) >= hoje)
      .sort((a, b) => new Date(a.data_prevista).getTime() - new Date(b.data_prevista).getTime())
      .slice(0, 8);
  }, [despesas]);

  // Dados para gráfico de fluxo de caixa
  const fluxoCaixaData = useMemo(() => {
    // Group receitas and despesas by month for the period
    const receitasPorMes: Record<string, number> = {};
    const despesasPorMes: Record<string, number> = {};

    receitas.filter(r => r.status === 'recebido' && r.data_recebida).forEach(r => {
      const data = new Date(r.data_recebida!);
      const key = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
      receitasPorMes[key] = (receitasPorMes[key] || 0) + (r.valor_recebido || 0);
    });

    despesas.filter(d => d.status === 'pago' && d.data_paga).forEach(d => {
      const data = new Date(d.data_paga!);
      const key = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
      despesasPorMes[key] = (despesasPorMes[key] || 0) + d.valor;
    });

    const allKeys = new Set([...Object.keys(receitasPorMes), ...Object.keys(despesasPorMes)]);
    const sortedKeys = Array.from(allKeys).sort();

    return sortedKeys.map(key => {
      const [year, month] = key.split('-');
      const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      return {
        periodo: `${monthNames[parseInt(month) - 1]}/${year.slice(2)}`,
        entradas: receitasPorMes[key] || 0,
        saidas: despesasPorMes[key] || 0,
      };
    });
  }, [receitas, despesas]);

  return {
    metrics,
    contratosPorOperadora,
    proximosRecebimentos,
    proximasDespesas,
    fluxoCaixaData,
    isLoading: loadingReceitas || loadingDespesas || loadingContratos,
  };
}
