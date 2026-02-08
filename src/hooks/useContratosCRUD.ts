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
  vendedor_responsavel?: string;
  percentual_comissao_vendedor?: number;
  supervisor?: string;
  percentual_comissao_supervisor?: number;
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

      // Calcular valor da bancária (comissão)
      const valorBancaria = data.valor_mensalidade * (data.percentual_comissao / 100);

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

      // Calcular 5º dia útil do mês seguinte para comissão do vendedor
      const dataImplantacao = new Date(data.data_implantacao);
      const proximoMes = new Date(dataImplantacao);
      proximoMes.setMonth(proximoMes.getMonth() + 1);
      
      // Função para calcular o 5º dia útil do mês
      const get5thBusinessDay = (year: number, month: number): Date => {
        let businessDays = 0;
        let day = 0;
        while (businessDays < 5) {
          day++;
          const date = new Date(year, month, day);
          const dayOfWeek = date.getDay();
          if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            businessDays++;
          }
        }
        return new Date(year, month, day);
      };
      
      const dataPagamentoVendedor = get5thBusinessDay(proximoMes.getFullYear(), proximoMes.getMonth());
      const dataPagamentoVendedorStr = dataPagamentoVendedor.toISOString().split('T')[0];

      // Calcular a sexta-feira da mesma semana da implantação para comissão do supervisor
      const getFridayOfWeek = (date: Date): Date => {
        const result = new Date(date);
        const dayOfWeek = result.getDay();
        // Se for domingo (0), próxima sexta é em 5 dias
        // Se for segunda (1), próxima sexta é em 4 dias
        // Se for sábado (6), foi ontem, então vamos para a próxima sexta
        let daysToFriday: number;
        if (dayOfWeek === 0) {
          daysToFriday = 5;
        } else if (dayOfWeek === 6) {
          daysToFriday = 6;
        } else {
          daysToFriday = 5 - dayOfWeek;
        }
        result.setDate(result.getDate() + daysToFriday);
        return result;
      };
      
      const dataPagamentoSupervisor = getFridayOfWeek(dataImplantacao);
      const dataPagamentoSupervisorStr = dataPagamentoSupervisor.toISOString().split('T')[0];

      // Criar despesa de comissão para o vendedor
      if (data.vendedor_responsavel && data.percentual_comissao_vendedor && data.percentual_comissao_vendedor > 0) {
        const valorComissaoVendedor = data.valor_mensalidade * (data.percentual_comissao_vendedor / 100);
        
        const { error: despesaVendedorError } = await supabase
          .from('despesas')
          .insert([{
            nome: `Comissão ${data.vendedor_responsavel} - ${data.nome}`,
            valor: valorComissaoVendedor,
            categoria: 'Comissão',
            tipo: 'variavel',
            fornecedor: data.vendedor_responsavel,
            recorrente: true,
            duracao_meses: 12,
            data_prevista: dataPagamentoVendedorStr,
            forma_pagamento: 'Transferência Bancária',
            observacao: `Comissão de vendedor sobre contrato ${data.nome}. Pagamento no 5º dia útil do mês seguinte à implantação.`,
            status: 'previsto',
          }]);

        if (despesaVendedorError) {
          console.error('Erro ao criar despesa de comissão do vendedor:', despesaVendedorError);
        }
      }

      // Criar despesa de comissão para o supervisor
      if (data.supervisor && data.percentual_comissao_supervisor && data.percentual_comissao_supervisor > 0) {
        const valorComissaoSupervisor = data.valor_mensalidade * (data.percentual_comissao_supervisor / 100);
        
        const { error: despesaSupervisorError } = await supabase
          .from('despesas')
          .insert([{
            nome: `Comissão ${data.supervisor} - ${data.nome}`,
            valor: valorComissaoSupervisor,
            categoria: 'Comissão',
            tipo: 'variavel',
            fornecedor: data.supervisor,
            recorrente: true,
            duracao_meses: 12,
            data_prevista: dataPagamentoSupervisorStr,
            forma_pagamento: 'Transferência Bancária',
            observacao: `Comissão de supervisor sobre contrato ${data.nome}. Pagamento na sexta-feira da semana da implantação.`,
            status: 'previsto',
          }]);

        if (despesaSupervisorError) {
          console.error('Erro ao criar despesa de comissão do supervisor:', despesaSupervisorError);
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
      // Buscar contrato atual para comparação
      const { data: contratoAtual, error: fetchError } = await supabase
        .from('contratos')
        .select('*')
        .eq('id', id)
        .single();
      
      if (fetchError) throw fetchError;

      const { data: contrato, error } = await supabase
        .from('contratos')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;

      // Verificar se o percentual de comissão do vendedor mudou
      if (data.vendedor_responsavel && data.percentual_comissao_vendedor !== undefined &&
          (data.percentual_comissao_vendedor !== contratoAtual.percentual_comissao_vendedor || 
           data.vendedor_responsavel !== contratoAtual.vendedor_responsavel)) {
        
        // Calcular receita total como base comissionável
        const receitaBancaria = contrato.valor_mensalidade * (contrato.percentual_comissao / 100);
        const bonificacaoTotal = contrato.bonificacao_por_vida * contrato.quantidade_vidas;
        const receitaTotal = receitaBancaria + bonificacaoTotal;
        const novoValorComissaoVendedor = receitaTotal * (data.percentual_comissao_vendedor / 100);
        
        // Atualizar despesas existentes do vendedor para este contrato
        await supabase
          .from('despesas')
          .update({
            valor: novoValorComissaoVendedor,
            nome: `Comissão ${data.vendedor_responsavel} - ${contrato.nome}`,
            fornecedor: data.vendedor_responsavel,
          })
          .like('nome', `%Comissão%${contratoAtual.vendedor_responsavel}%${contrato.nome}%`);
      }

      // Verificar se o percentual de comissão do supervisor mudou
      if (data.supervisor && data.percentual_comissao_supervisor !== undefined &&
          (data.percentual_comissao_supervisor !== contratoAtual.percentual_comissao_supervisor ||
           data.supervisor !== contratoAtual.supervisor)) {
        
        // Calcular receita total como base comissionável
        const receitaBancaria = contrato.valor_mensalidade * (contrato.percentual_comissao / 100);
        const bonificacaoTotal = contrato.bonificacao_por_vida * contrato.quantidade_vidas;
        const receitaTotal = receitaBancaria + bonificacaoTotal;
        const novoValorComissaoSupervisor = receitaTotal * (data.percentual_comissao_supervisor / 100);
        
        // Atualizar despesas existentes do supervisor para este contrato
        await supabase
          .from('despesas')
          .update({
            valor: novoValorComissaoSupervisor,
            nome: `Comissão ${data.supervisor} - ${contrato.nome}`,
            fornecedor: data.supervisor,
          })
          .like('nome', `%Comissão%${contratoAtual.supervisor}%${contrato.nome}%`);
      }

      return contrato;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratos'] });
      queryClient.invalidateQueries({ queryKey: ['despesas'] });
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
