export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString + 'T00:00:00');
  return new Intl.DateTimeFormat('pt-BR').format(date);
};

export const formatCPFCNPJ = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length === 11) {
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  
  if (numbers.length === 14) {
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  
  return value;
};

export const formatPhone = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length === 11) {
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  
  if (numbers.length === 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  return value;
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    'ativo': 'bg-success text-success-foreground',
    'inativo': 'bg-muted text-muted-foreground',
    'bloqueado': 'bg-destructive text-destructive-foreground',
    'pago': 'bg-success text-success-foreground',
    'pendente': 'bg-warning text-warning-foreground',
    'cancelado': 'bg-destructive text-destructive-foreground',
    'aberto': 'bg-warning text-warning-foreground',
    'vencido': 'bg-destructive text-destructive-foreground',
  };
  
  return colors[status] || 'bg-muted text-muted-foreground';
};

export const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    'ativo': 'Ativo',
    'inativo': 'Inativo',
    'bloqueado': 'Bloqueado',
    'pago': 'Pago',
    'pendente': 'Pendente',
    'cancelado': 'Cancelado',
    'aberto': 'Em Aberto',
    'vencido': 'Vencido',
  };
  
  return labels[status] || status;
};
