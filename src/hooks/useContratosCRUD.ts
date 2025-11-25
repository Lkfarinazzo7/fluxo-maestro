import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface ContratoFormData {
  nome: string;
  operadora: string;
  categoria: string;
  tipo_contrato: 'PJ' | 'PF';
  valor_mensalidade: number;
  percentual_comissao: number;
  bonificacao_por_vida: number;
  quantidade_vidas: number;
  data_implantacao: string;
  previsao_recebimento_bancaria?: string;
  previsao_recebimento_bonificacao?: string;
  observacoes?: string;
  status?: 'ativo' | 'cancelado';
}

export function useContratosCRUD() {
  const queryClient = useQueryClient();

  const { data: contratos, isLoading } = useQuery({
    queryKey: ['contratos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contratos')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: ContratoFormData) => {
      const { data: contrato, error } = await supabase
        .from('contratos')
        .insert([data])
        .select()
        .single();
      
      if (error) throw error;
      return contrato;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratos'] });
      toast({
        title: 'Sucesso!',
        description: 'Contrato criado com sucesso.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao criar contrato.',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ContratoFormData> }) => {
      const { data: contrato, error } = await supabase
        .from('contratos')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return contrato;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratos'] });
      toast({
        title: 'Sucesso!',
        description: 'Contrato atualizado com sucesso.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao atualizar contrato.',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('contratos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratos'] });
      toast({
        title: 'Sucesso!',
        description: 'Contrato excluído com sucesso.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao excluir contrato.',
        variant: 'destructive',
      });
    },
  });

  return {
    contratos: contratos || [],
    isLoading,
    createContrato: createMutation.mutate,
    updateContrato: updateMutation.mutate,
    deleteContrato: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
