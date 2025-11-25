import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface DespesaFormData {
  nome: string;
  valor: number;
  categoria: string;
  tipo: 'fixa' | 'variavel';
  fornecedor: string;
  recorrente: boolean;
  frequencia?: 'mensal' | '2meses' | '3meses' | '6meses' | '12meses' | 'vitalicio';
  data_prevista: string;
  data_paga?: string;
  forma_pagamento: string;
  comprovante?: string;
  observacao?: string;
  status: 'previsto' | 'pago';
}

export function useDespesasCRUD() {
  const queryClient = useQueryClient();

  const { data: despesas, isLoading } = useQuery({
    queryKey: ['despesas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('despesas')
        .select('*')
        .order('data_prevista', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: DespesaFormData) => {
      const { data: despesa, error } = await supabase
        .from('despesas')
        .insert([data])
        .select()
        .single();
      
      if (error) throw error;
      return despesa;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['despesas'] });
      toast({
        title: 'Sucesso!',
        description: 'Despesa criada com sucesso.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao criar despesa.',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<DespesaFormData> }) => {
      const { data: despesa, error } = await supabase
        .from('despesas')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return despesa;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['despesas'] });
      toast({
        title: 'Sucesso!',
        description: 'Despesa atualizada com sucesso.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao atualizar despesa.',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('despesas')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['despesas'] });
      toast({
        title: 'Sucesso!',
        description: 'Despesa excluída com sucesso.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao excluir despesa.',
        variant: 'destructive',
      });
    },
  });

  return {
    despesas: despesas || [],
    isLoading,
    createDespesa: createMutation.mutate,
    updateDespesa: updateMutation.mutate,
    deleteDespesa: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
