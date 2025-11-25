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
  previsao_recebimento_bancaria: string;
  previsao_recebimento_bonificacao?: string;
  observacoes?: string;
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
      // Criar contrato
      const { data: contrato, error } = await supabase
        .from('contratos')
        .insert([data])
        .select()
        .single();
      
      if (error) throw error;

      // Calcular valor da bancária
      const valorBancaria = (data.valor_mensalidade * data.quantidade_vidas * data.percentual_comissao) / 100;

      // Criar receita de bancária automaticamente
      const { error: receitaBancariaError } = await supabase
        .from('receitas')
        .insert([{
          tipo: 'bancaria',
          contrato_id: contrato.id,
          contrato_nome: data.nome,
          valor_previsto: valorBancaria,
          data_prevista: data.previsao_recebimento_bancaria,
          categoria: 'Comissão Bancária',
          forma_recebimento: 'Transferência',
          recorrencia: 'mensal',
          status: 'previsto',
        }]);

      if (receitaBancariaError) {
        console.error('Erro ao criar receita bancária:', receitaBancariaError);
      }

      // Se houver bonificação, criar receita de bonificação
      if (data.bonificacao_por_vida > 0) {
        const valorBonificacao = data.bonificacao_por_vida * data.quantidade_vidas;
        const dataBonificacao = data.previsao_recebimento_bonificacao || data.previsao_recebimento_bancaria;

        const { error: receitaBonificacaoError } = await supabase
          .from('receitas')
          .insert([{
            tipo: 'bonificacao',
            contrato_id: contrato.id,
            contrato_nome: data.nome,
            valor_previsto: valorBonificacao,
            data_prevista: dataBonificacao,
            categoria: 'Bonificação por Vida',
            forma_recebimento: 'Transferência',
            recorrencia: 'mensal',
            status: 'previsto',
          }]);

        if (receitaBonificacaoError) {
          console.error('Erro ao criar receita de bonificação:', receitaBonificacaoError);
        }
      }

      return contrato;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratos'] });
      queryClient.invalidateQueries({ queryKey: ['receitas'] });
      toast({
        title: 'Sucesso!',
        description: 'Contrato e receitas criados com sucesso.',
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
