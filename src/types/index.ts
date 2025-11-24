export interface Venda {
  id: string;
  clienteId: string;
  cliente: string;
  data: string;
  items: ItemVenda[];
  subtotal: number;
  desconto: number;
  impostos: number;
  total: number;
  status: 'pendente' | 'pago' | 'cancelado';
  formaPagamento: string;
  observacoes?: string;
}

export interface ItemVenda {
  id: string;
  produtoId: string;
  produto: string;
  quantidade: number;
  valorUnitario: number;
  desconto: number;
  subtotal: number;
}

export interface Produto {
  id: string;
  codigo: string;
  nome: string;
  descricao: string;
  categoria: string;
  estoqueAtual: number;
  estoqueMinimo: number;
  custoCompra: number;
  precoVenda: number;
  imagemUrl?: string;
  status: 'ativo' | 'inativo';
}

export interface Cliente {
  id: string;
  tipo: 'PF' | 'PJ';
  nome: string;
  cpfCnpj: string;
  email: string;
  telefone: string;
  endereco: Endereco;
  limiteCredito: number;
  totalComprado: number;
  ultimaCompra?: string;
  status: 'ativo' | 'bloqueado';
}

export interface Endereco {
  cep: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export interface Conta {
  id: string;
  tipo: 'receber' | 'pagar';
  descricao: string;
  valor: number;
  vencimento: string;
  status: 'aberto' | 'pago' | 'vencido';
  clienteId?: string;
  cliente?: string;
  categoria: string;
}

export interface DashboardMetrics {
  vendasMes: {
    total: number;
    variacao: number;
  };
  financeiro: {
    receitas: number;
    despesas: number;
    lucro: number;
  };
  estoqueCritico: Produto[];
  ultimasVendas: Venda[];
  contasReceber: number;
  contasPagar: number;
}
