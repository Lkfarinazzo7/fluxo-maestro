import { useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { DateRange, filterByDateRange } from '@/lib/dateFilters';

export function useExpenses(dateRange?: DateRange) {
  const { saidas } = useApp();

  const filteredSaidas = useMemo(() => {
    if (!dateRange) return saidas;
    
    // Para saídas pagas, filtrar por dataPaga
    const pagas = saidas
      .filter(s => s.status === 'pago' && s.dataPaga)
      .filter(s => filterByDateRange([s], 'dataPaga', dateRange).length > 0);
    
    // Para saídas previstas, filtrar por dataPrevista
    const previstas = saidas
      .filter(s => s.status === 'previsto')
      .filter(s => filterByDateRange([s], 'dataPrevista', dateRange).length > 0);
    
    return [...pagas, ...previstas];
  }, [saidas, dateRange]);

  const saidasPagas = useMemo(() => {
    return filteredSaidas.filter(s => s.status === 'pago');
  }, [filteredSaidas]);

  const saidasPrevistas = useMemo(() => {
    return filteredSaidas.filter(s => s.status === 'previsto');
  }, [filteredSaidas]);

  const totalPago = useMemo(() => {
    return saidasPagas.reduce((sum, s) => sum + s.valor, 0);
  }, [saidasPagas]);

  const totalPrevisto = useMemo(() => {
    return saidasPrevistas.reduce((sum, s) => sum + s.valor, 0);
  }, [saidasPrevistas]);

  const porCategoria = useMemo(() => {
    const grouped = filteredSaidas.reduce((acc, saida) => {
      if (!acc[saida.categoria]) {
        acc[saida.categoria] = {
          categoria: saida.categoria,
          total: 0,
          quantidade: 0,
        };
      }
      acc[saida.categoria].total += saida.valor;
      acc[saida.categoria].quantidade += 1;
      return acc;
    }, {} as Record<string, { categoria: string; total: number; quantidade: number }>);

    return Object.values(grouped);
  }, [filteredSaidas]);

  return {
    saidas: filteredSaidas,
    saidasPagas,
    saidasPrevistas,
    totalPago,
    totalPrevisto,
    porCategoria,
  };
}
