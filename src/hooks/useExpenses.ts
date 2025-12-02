import { useMemo } from 'react';
import { useDespesasCRUD } from '@/hooks/useDespesasCRUD';
import { DateRange, isDateInRange } from '@/lib/dateFilters';

export function useExpenses(dateRange?: DateRange) {
  const { despesas, isLoading } = useDespesasCRUD();

  const filteredDespesas = useMemo(() => {
    if (!dateRange || !despesas) return despesas || [];
    
    return despesas.filter(despesa => {
      // Para despesas pagas, filtrar por data_paga
      if (despesa.status === 'pago' && despesa.data_paga) {
        return isDateInRange(despesa.data_paga, dateRange);
      }
      
      // Para despesas previstas, filtrar por data_prevista
      if (despesa.status === 'previsto') {
        return isDateInRange(despesa.data_prevista, dateRange);
      }
      
      return false;
    });
  }, [despesas, dateRange]);

  const saidasPagas = useMemo(() => {
    return filteredDespesas.filter(s => s.status === 'pago');
  }, [filteredDespesas]);

  const saidasPrevistas = useMemo(() => {
    return filteredDespesas.filter(s => s.status === 'previsto');
  }, [filteredDespesas]);

  const totalPago = useMemo(() => {
    return saidasPagas.reduce((sum, s) => sum + s.valor, 0);
  }, [saidasPagas]);

  const totalPrevisto = useMemo(() => {
    return saidasPrevistas.reduce((sum, s) => sum + s.valor, 0);
  }, [saidasPrevistas]);

  const porCategoria = useMemo(() => {
    const grouped = filteredDespesas.reduce((acc, saida) => {
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
  }, [filteredDespesas]);

  return {
    despesas: filteredDespesas,
    saidasPagas,
    saidasPrevistas,
    totalPago,
    totalPrevisto,
    porCategoria,
    isLoading,
  };
}
