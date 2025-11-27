import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface ReceitaFormData {
  tipo: 'bancaria' | 'bonificacao' | 'avulsa';
  contrato_id?: string;
  contrato_nome?: string;
  valor_previsto: number;
  valor_recebido?: number;
  data_prevista: string;
  data_recebida?: string;
  categoria: string;
  forma_recebimento: string;
  recorrencia: 'sem' | 'mensal' | '2meses' | '3meses' | '6meses' | '12meses' | 'vitalicio';
  observacao?: string;
  status: 'previsto' | 'recebido';
}

export function useReceitasCRUD() {
  const queryClient = useQueryClient();

  const { data: receitas, isLoading } = useQuery({
    queryKey: ['receitas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('receitas')
        .select('*')
        .order('data_prevista', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: ReceitaFormData) => {
      const { data: receita, error } = await supabase
        .from('receitas')
        .insert([{
          ...data,
          valor_recebido: data.status === 'recebido' ? data.valor_recebido : null,
          data_recebida: data.status === 'recebido' ? data.data_recebida : null,
        }])
        .select()
        .single();
      
      if (error) throw error;
      return receita;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receitas'] });
      toast({
        title: 'Sucesso!',
        description: 'Receita criada com sucesso.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao criar receita.',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ReceitaFormData> }) => {
      // Clean up data based on status
      const updateData = { ...data };
      if (data.status === 'previsto') {
        updateData.valor_recebido = null;
        updateData.data_recebida = null;
      }
      
      const { data: receita, error } = await supabase
        .from('receitas')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return receita;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receitas'] });
      toast({
        title: 'Sucesso!',
        description: 'Receita atualizada com sucesso.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao atualizar receita.',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('receitas')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receitas'] });
      toast({
        title: 'Sucesso!',
        description: 'Receita excluída com sucesso.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao excluir receita.',
        variant: 'destructive',
      });
    },
  });

  return {
    receitas: receitas || [],
    isLoading,
    createReceita: createMutation.mutate,
    updateReceita: updateMutation.mutate,
    deleteReceita: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
