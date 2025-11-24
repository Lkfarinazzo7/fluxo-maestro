import { useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { DateRange, filterByDateRange } from '@/lib/dateFilters';

export function useContracts(dateRange?: DateRange) {
  const { contratos } = useApp();

  const filteredContratos = useMemo(() => {
    if (!dateRange) return contratos;
    return filterByDateRange(contratos, 'dataCriacao', dateRange);
  }, [contratos, dateRange]);

  const contratosAtivos = useMemo(() => {
    return filteredContratos.filter(c => c.status === 'ativo');
  }, [filteredContratos]);

  const totalVidas = useMemo(() => {
    return contratosAtivos.reduce((sum, c) => sum + c.quantidadeVidas, 0);
  }, [contratosAtivos]);

  const receitaMensalTotal = useMemo(() => {
    return contratosAtivos.reduce((sum, c) => {
      const comissao = c.valorMensalidade * (c.percentualComissao / 100);
      return sum + comissao;
    }, 0);
  }, [contratosAtivos]);

  const ticketMedio = useMemo(() => {
    return contratosAtivos.length > 0 ? receitaMensalTotal / contratosAtivos.length : 0;
  }, [contratosAtivos, receitaMensalTotal]);

  return {
    contratos: filteredContratos,
    contratosAtivos,
    totalVidas,
    receitaMensalTotal,
    ticketMedio,
  };
}
