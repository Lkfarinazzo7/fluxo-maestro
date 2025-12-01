import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useSupervisores() {
  const { data: supervisores, isLoading } = useQuery({
    queryKey: ['supervisores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('supervisores')
        .select('*')
        .order('nome', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  return {
    supervisores: supervisores || [],
    isLoading,
  };
}
