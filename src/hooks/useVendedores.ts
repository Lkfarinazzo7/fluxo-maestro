import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useVendedores() {
  const { data: vendedores, isLoading } = useQuery({
    queryKey: ['vendedores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendedores')
        .select('*')
        .order('nome', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  return {
    vendedores: vendedores || [],
    isLoading,
  };
}
