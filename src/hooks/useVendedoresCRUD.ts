import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useVendedoresCRUD() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (nome: string) => {
      const { data, error } = await supabase
        .from('vendedores')
        .insert({ nome })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendedores'] });
      toast.success('Vendedor cadastrado com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao cadastrar vendedor');
      console.error('Error creating vendedor:', error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, nome }: { id: string; nome: string }) => {
      const { data, error } = await supabase
        .from('vendedores')
        .update({ nome })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendedores'] });
      toast.success('Vendedor atualizado com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar vendedor');
      console.error('Error updating vendedor:', error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('vendedores')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendedores'] });
      toast.success('Vendedor removido com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao remover vendedor');
      console.error('Error deleting vendedor:', error);
    },
  });

  return {
    createVendedor: createMutation.mutate,
    updateVendedor: updateMutation.mutate,
    deleteVendedor: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}