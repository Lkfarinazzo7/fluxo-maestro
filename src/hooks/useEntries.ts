import { useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { DateRange, filterByDateRange } from '@/lib/dateFilters';

export function useEntries(dateRange?: DateRange) {
  const { entradas } = useApp();

  const filteredEntradas = useMemo(() => {
    if (!dateRange) return entradas;
    
    // Para entradas recebidas, filtrar por dataRecebida
    const recebidas = entradas
      .filter(e => e.status === 'recebido' && e.dataRecebida)
      .filter(e => filterByDateRange([e], 'dataRecebida', dateRange).length > 0);
    
    // Para entradas previstas, filtrar por dataPrevista
    const previstas = entradas
      .filter(e => e.status === 'previsto')
      .filter(e => filterByDateRange([e], 'dataPrevista', dateRange).length > 0);
    
    return [...recebidas, ...previstas];
  }, [entradas, dateRange]);

  const entradasRecebidas = useMemo(() => {
    return filteredEntradas.filter(e => e.status === 'recebido');
  }, [filteredEntradas]);

  const entradasPrevistas = useMemo(() => {
    return filteredEntradas.filter(e => e.status === 'previsto');
  }, [filteredEntradas]);

  const totalRecebido = useMemo(() => {
    return entradasRecebidas.reduce((sum, e) => sum + (e.valorRecebido || 0), 0);
  }, [entradasRecebidas]);

  const totalPrevisto = useMemo(() => {
    return entradasPrevistas.reduce((sum, e) => sum + e.valorPrevisto, 0);
  }, [entradasPrevistas]);

  return {
    entradas: filteredEntradas,
    entradasRecebidas,
    entradasPrevistas,
    totalRecebido,
    totalPrevisto,
  };
}
