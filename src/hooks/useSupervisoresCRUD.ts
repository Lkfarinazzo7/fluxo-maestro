import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useSupervisoresCRUD() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (nome: string) => {
      const { data, error } = await supabase
        .from('supervisores')
        .insert({ nome })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supervisores'] });
      toast.success('Supervisor cadastrado com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao cadastrar supervisor');
      console.error('Error creating supervisor:', error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, nome }: { id: string; nome: string }) => {
      const { data, error } = await supabase
        .from('supervisores')
        .update({ nome })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supervisores'] });
      toast.success('Supervisor atualizado com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar supervisor');
      console.error('Error updating supervisor:', error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('supervisores')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supervisores'] });
      toast.success('Supervisor removido com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao remover supervisor');
      console.error('Error deleting supervisor:', error);
    },
  });

  return {
    createSupervisor: createMutation.mutate,
    updateSupervisor: updateMutation.mutate,
    deleteSupervisor: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}