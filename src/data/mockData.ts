import { Contrato, Entrada, Saida } from '@/types';

// Helper functions for dates
const getDate = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

const getFutureDate = (daysAhead: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().split('T')[0];
};

// Contratos Mock
export const mockContratos: Contrato[] = [
  {
    id: '1',
    nome: 'Empresa ABC Ltda',
    operadora: 'Unimed',
    categoria: 'Empresarial',
    quantidadeVidas: 25,
    valorMensalidade: 580.00,
    percentualComissao: 280, // 280% = 2.8x
    bonificacaoPorVida: 45.00,
    vidasParaBonificacao: 25,
    previsaoRecebimentoBancaria: '5',
    previsaoRecebimentoBonificacao: '10',
    status: 'ativo',
    dataCriacao: getDate(60)
  },
  {
    id: '2',
    nome: 'João Silva - Individual',
    operadora: 'SulAmérica',
    categoria: 'Individual',
    quantidadeVidas: 1,
    valorMensalidade: 890.00,
    percentualComissao: 200, // 200% = 2.0x
    bonificacaoPorVida: 0,
    vidasParaBonificacao: 0,
    previsaoRecebimentoBancaria: '15',
    status: 'ativo',
    dataCriacao: getDate(45)
  }
];

// Entradas Mock
export const mockEntradas: Entrada[] = [
  {
    id: '1',
    tipo: 'bancaria',
    contratoId: '1',
    contratoNome: 'Empresa ABC Ltda',
    valorPrevisto: 4060.00,
    valorRecebido: 4060.00,
    dataPrevista: getDate(5),
    dataRecebida: getDate(5),
    categoria: 'Comissão Bancária',
    formaRecebimento: 'Transferência',
    recorrencia: 'mensal',
    status: 'recebido'
  },
  {
    id: '2',
    tipo: 'bonificacao',
    contratoId: '1',
    contratoNome: 'Empresa ABC Ltda',
    valorPrevisto: 1125.00,
    valorRecebido: 1125.00,
    dataPrevista: getDate(10),
    dataRecebida: getDate(10),
    categoria: 'Bonificação por Vida',
    formaRecebimento: 'Transferência',
    recorrencia: 'mensal',
    status: 'recebido'
  },
  {
    id: '3',
    tipo: 'bancaria',
    contratoId: '2',
    contratoNome: 'João Silva - Individual',
    valorPrevisto: 1780.00,
    valorRecebido: 1780.00,
    dataPrevista: getDate(15),
    dataRecebida: getDate(15),
    categoria: 'Comissão Bancária',
    formaRecebimento: 'Transferência',
    recorrencia: 'mensal',
    status: 'recebido'
  }
];

// Saídas Mock
export const mockSaidas: Saida[] = [
  {
    id: 'SAI-001',
    nome: 'Salários',
    valor: 3500.00,
    categoria: 'Salários',
    tipo: 'fixa',
    fornecedor: 'Folha de Pagamento',
    recorrente: true,
    duracao_meses: 12,
    dataPrevista: getDate(5),
    dataPaga: getDate(5),
    formaPagamento: 'Transferência Bancária',
    observacao: 'Pagamento de equipe administrativa',
    status: 'pago'
  },
  {
    id: 'SAI-002',
    nome: 'Aluguel',
    valor: 2200.00,
    categoria: 'Aluguel',
    tipo: 'fixa',
    fornecedor: 'Imobiliária Central',
    recorrente: true,
    duracao_meses: 12,
    dataPrevista: getDate(10),
    dataPaga: getDate(10),
    formaPagamento: 'Transferência Bancária',
    status: 'pago'
  },
  {
    id: 'SAI-003',
    nome: 'Marketing Digital',
    valor: 850.00,
    categoria: 'Marketing',
    tipo: 'variavel',
    fornecedor: 'Google Ads',
    recorrente: true,
    duracao_meses: 6,
    dataPrevista: getDate(3),
    dataPaga: getDate(3),
    formaPagamento: 'Cartão de Crédito',
    observacao: 'Campanha de aquisição',
    status: 'pago'
  },
  {
    id: 'SAI-004',
    nome: 'Energia Elétrica',
    valor: 450.00,
    categoria: 'Outros',
    tipo: 'fixa',
    fornecedor: 'Companhia de Energia',
    recorrente: true,
    duracao_meses: 12,
    dataPrevista: getFutureDate(5),
    formaPagamento: 'Débito Automático',
    status: 'previsto'
  },
  {
    id: 'SAI-005',
    nome: 'Internet',
    valor: 320.00,
    categoria: 'Tecnologia',
    tipo: 'fixa',
    fornecedor: 'Provedor Fibra',
    recorrente: true,
    duracao_meses: 12,
    dataPrevista: getFutureDate(8),
    formaPagamento: 'Débito Automático',
    status: 'previsto'
  },
  {
    id: 'SAI-006',
    nome: 'Contador',
    valor: 1200.00,
    categoria: 'Impostos',
    tipo: 'fixa',
    fornecedor: 'Contabilidade Expert',
    recorrente: true,
    duracao_meses: 12,
    dataPrevista: getDate(15),
    dataPaga: getDate(15),
    formaPagamento: 'Transferência Bancária',
    status: 'pago'
  },
  {
    id: 'SAI-007',
    nome: 'Software',
    valor: 680.00,
    categoria: 'Tecnologia',
    tipo: 'fixa',
    fornecedor: 'Assinaturas SaaS',
    recorrente: true,
    duracao_meses: 12,
    dataPrevista: getDate(7),
    dataPaga: getDate(7),
    formaPagamento: 'Cartão de Crédito',
    observacao: 'CRM + Gestão + Comunicação',
    status: 'pago'
  },
  {
    id: 'SAI-008',
    nome: 'Impostos',
    valor: 2500.00,
    categoria: 'Impostos',
    tipo: 'fixa',
    fornecedor: 'Receita Federal',
    recorrente: true,
    duracao_meses: 12,
    dataPrevista: getFutureDate(10),
    formaPagamento: 'Débito Automático',
    status: 'previsto'
  },
  {
    id: 'SAI-009',
    nome: 'Treinamento',
    valor: 1500.00,
    categoria: 'Outros',
    tipo: 'variavel',
    fornecedor: 'Instituto de Formação',
    recorrente: false,
    dataPrevista: getDate(20),
    dataPaga: getDate(20),
    formaPagamento: 'Boleto',
    observacao: 'Curso de especialização em planos de saúde',
    status: 'pago'
  },
  {
    id: 'SAI-010',
    nome: 'Manutenção TI',
    valor: 3800.00,
    categoria: 'Tecnologia',
    tipo: 'variavel',
    fornecedor: 'TI Solutions',
    recorrente: false,
    dataPrevista: getFutureDate(15),
    formaPagamento: 'Transferência Bancária',
    observacao: 'Upgrade de infraestrutura',
    status: 'previsto'
  }
];
