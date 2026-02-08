import { useMemo } from 'react';
import { useReceitasCRUD } from '@/hooks/useReceitasCRUD';
import { useDespesasCRUD } from '@/hooks/useDespesasCRUD';
import { useContratosCRUD } from '@/hooks/useContratosCRUD';
import { DateRange, isDateInRange } from '@/lib/dateFilters';
import { differenceInDays, format, parseISO, startOfDay, startOfWeek, startOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
  proporcaoMediaContrato: number;
}

export interface PfVsPjData {
  quantidadePF: number;
  quantidadePJ: number;
  valorTotalPF: number;
  valorTotalPJ: number;
  percentualQuantidadePF: number;
  percentualQuantidadePJ: number;
  percentualValorPF: number;
  percentualValorPJ: number;
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

    // Proporção média do contrato = média(receita_total / valor_mensalidade)
    const proporcaoMediaContrato = contratosNoPeriodo.length > 0
      ? contratosNoPeriodo.reduce((sum, c) => {
          const receitaBancaria = c.valor_mensalidade * (c.percentual_comissao / 100);
          const bonificacaoTotal = c.bonificacao_por_vida * c.quantidade_vidas;
          const receitaTotal = receitaBancaria + bonificacaoTotal;
          return sum + (c.valor_mensalidade > 0 ? receitaTotal / c.valor_mensalidade : 0);
        }, 0) / contratosNoPeriodo.length
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
      proporcaoMediaContrato,
    };
  }, [receitas, despesas, contratos, dateRange]);

  // Dados PF vs PJ
  const pfVsPjData = useMemo(() => {
    const contratosNoPeriodo = contratos.filter(c => {
      return isDateInRange(c.data_implantacao, dateRange);
    });

    const contratosPF = contratosNoPeriodo.filter(c => c.tipo_contrato === 'PF');
    const contratosPJ = contratosNoPeriodo.filter(c => c.tipo_contrato === 'PJ');

    const quantidadePF = contratosPF.length;
    const quantidadePJ = contratosPJ.length;
    const totalQuantidade = quantidadePF + quantidadePJ;

    const valorTotalPF = contratosPF.reduce((sum, c) => sum + c.valor_mensalidade, 0);
    const valorTotalPJ = contratosPJ.reduce((sum, c) => sum + c.valor_mensalidade, 0);
    const totalValor = valorTotalPF + valorTotalPJ;

    return {
      quantidadePF,
      quantidadePJ,
      valorTotalPF,
      valorTotalPJ,
      percentualQuantidadePF: totalQuantidade > 0 ? (quantidadePF / totalQuantidade) * 100 : 0,
      percentualQuantidadePJ: totalQuantidade > 0 ? (quantidadePJ / totalQuantidade) * 100 : 0,
      percentualValorPF: totalValor > 0 ? (valorTotalPF / totalValor) * 100 : 0,
      percentualValorPJ: totalValor > 0 ? (valorTotalPJ / totalValor) * 100 : 0,
    };
  }, [contratos, dateRange]);

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

  // Dados para gráfico de fluxo de caixa com granularidade dinâmica
  const fluxoCaixaData = useMemo(() => {
    const days = differenceInDays(dateRange.end, dateRange.start);
    
    // Determinar granularidade e formato
    let groupFn: (date: Date) => string;
    let formatFn: (key: string) => string;
    
    if (days <= 31) {
      // Granularidade diária
      groupFn = (date) => format(date, 'yyyy-MM-dd');
      formatFn = (key) => format(parseISO(key), 'dd/MM', { locale: ptBR });
    } else if (days <= 90) {
      // Granularidade semanal
      groupFn = (date) => format(startOfWeek(date, { weekStartsOn: 0 }), 'yyyy-MM-dd');
      formatFn = (key) => `Sem ${format(parseISO(key), 'dd/MM', { locale: ptBR })}`;
    } else {
      // Granularidade mensal
      groupFn = (date) => format(startOfMonth(date), 'yyyy-MM');
      formatFn = (key) => {
        const [year, month] = key.split('-');
        const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        return `${monthNames[parseInt(month) - 1]}/${year.slice(2)}`;
      };
    }

    const receitasPorPeriodo: Record<string, number> = {};
    const despesasPorPeriodo: Record<string, number> = {};

    receitas.filter(r => r.status === 'recebido' && r.data_recebida).forEach(r => {
      const data = new Date(r.data_recebida!);
      const key = groupFn(data);
      receitasPorPeriodo[key] = (receitasPorPeriodo[key] || 0) + (r.valor_recebido || 0);
    });

    despesas.filter(d => d.status === 'pago' && d.data_paga).forEach(d => {
      const data = new Date(d.data_paga!);
      const key = groupFn(data);
      despesasPorPeriodo[key] = (despesasPorPeriodo[key] || 0) + d.valor;
    });

    const allKeys = new Set([...Object.keys(receitasPorPeriodo), ...Object.keys(despesasPorPeriodo)]);
    const sortedKeys = Array.from(allKeys).sort();

    let saldoAcumulado = 0;
    return sortedKeys.map(key => {
      const entradas = receitasPorPeriodo[key] || 0;
      const saidas = despesasPorPeriodo[key] || 0;
      saldoAcumulado += entradas - saidas;
      
      return {
        periodo: formatFn(key),
        entradas,
        saidas,
        saldoAcumulado,
      };
    });
  }, [receitas, despesas, dateRange]);

  return {
    metrics,
    contratosPorOperadora,
    proximosRecebimentos,
    proximasDespesas,
    fluxoCaixaData,
    pfVsPjData,
    isLoading: loadingReceitas || loadingDespesas || loadingContratos,
  };
}