import { useMemo } from 'react';
import { useReceitasCRUD } from '@/hooks/useReceitasCRUD';
import { DateRange, isDateInRange } from '@/lib/dateFilters';

export function useEntries(dateRange?: DateRange) {
  const { receitas, isLoading } = useReceitasCRUD();

  const filteredReceitas = useMemo(() => {
    if (!dateRange || !receitas) return receitas || [];
    
    return receitas.filter(receita => {
      // Para receitas recebidas, filtrar por data_recebida
      if (receita.status === 'recebido' && receita.data_recebida) {
        return isDateInRange(receita.data_recebida, dateRange);
      }
      
      // Para receitas previstas, filtrar por data_prevista
      if (receita.status === 'previsto') {
        return isDateInRange(receita.data_prevista, dateRange);
      }
      
      return false;
    });
  }, [receitas, dateRange]);

  const entradasRecebidas = useMemo(() => {
    return filteredReceitas.filter(e => e.status === 'recebido');
  }, [filteredReceitas]);

  const entradasPrevistas = useMemo(() => {
    return filteredReceitas.filter(e => e.status === 'previsto');
  }, [filteredReceitas]);

  const totalRecebido = useMemo(() => {
    return entradasRecebidas.reduce((sum, e) => sum + (e.valor_recebido || 0), 0);
  }, [entradasRecebidas]);

  const totalPrevisto = useMemo(() => {
    return entradasPrevistas.reduce((sum, e) => sum + e.valor_previsto, 0);
  }, [entradasPrevistas]);

  return {
    receitas: filteredReceitas,
    entradasRecebidas,
    entradasPrevistas,
    totalRecebido,
    totalPrevisto,
    isLoading,
  };
}
