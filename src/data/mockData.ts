import { Contrato, Entrada, Saida } from '@/types';

// Helper para gerar datas
const getDate = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

const getFutureDate = (daysAhead: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().split('T')[0];
};

// Contratos Mock
export const mockContratos: Contrato[] = [
  {
    id: 'CONT-001',
    nome: 'Tech Solutions Ltda',
    operadora: 'Unimed',
    categoria: 'PME',
    quantidadeVidas: 45,
    valorMensalidade: 850.00,
    percentualComissao: 280,
    bonificacaoPorVida: 120.00,
    vidasParaBonificacao: 45,
    previsaoRecebimentoBancaria: getFutureDate(5),
    previsaoRecebimentoBonificacao: getFutureDate(10),
    status: 'ativo',
    observacoes: 'Cliente corporativo de alto valor',
    dataCriacao: getDate(90)
  },
  {
    id: 'CONT-002',
    nome: 'Comércio Brasil S.A.',
    operadora: 'Bradesco Saúde',
    categoria: 'Empresarial',
    quantidadeVidas: 120,
    valorMensalidade: 750.00,
    percentualComissao: 250,
    bonificacaoPorVida: 100.00,
    vidasParaBonificacao: 120,
    previsaoRecebimentoBancaria: getFutureDate(8),
    previsaoRecebimentoBonificacao: getFutureDate(15),
    status: 'ativo',
    observacoes: 'Contrato renovado anualmente',
    dataCriacao: getDate(180)
  },
  {
    id: 'CONT-003',
    nome: 'Indústria Moderna Ltda',
    operadora: 'SulAmérica',
    categoria: 'Empresarial',
    quantidadeVidas: 85,
    valorMensalidade: 920.00,
    percentualComissao: 300,
    bonificacaoPorVida: 150.00,
    vidasParaBonificacao: 85,
    previsaoRecebimentoBancaria: getFutureDate(3),
    previsaoRecebimentoBonificacao: getFutureDate(12),
    status: 'ativo',
    dataCriacao: getDate(60)
  },
  {
    id: 'CONT-004',
    nome: 'Startup Digital ME',
    operadora: 'Hapvida',
    categoria: 'PME',
    quantidadeVidas: 15,
    valorMensalidade: 680.00,
    percentualComissao: 260,
    bonificacaoPorVida: 80.00,
    vidasParaBonificacao: 15,
    previsaoRecebimentoBancaria: getFutureDate(7),
    status: 'ativo',
    dataCriacao: getDate(30)
  },
  {
    id: 'CONT-005',
    nome: 'Construtora Alicerce',
    operadora: 'Amil',
    categoria: 'Empresarial',
    quantidadeVidas: 200,
    valorMensalidade: 820.00,
    percentualComissao: 290,
    bonificacaoPorVida: 130.00,
    vidasParaBonificacao: 200,
    previsaoRecebimentoBancaria: getFutureDate(6),
    previsaoRecebimentoBonificacao: getFutureDate(14),
    status: 'ativo',
    observacoes: 'Maior contrato ativo',
    dataCriacao: getDate(120)
  },
  {
    id: 'CONT-006',
    nome: 'Escritório Advocacia Silva',
    operadora: 'Porto Seguro Saúde',
    categoria: 'PME',
    quantidadeVidas: 8,
    valorMensalidade: 950.00,
    percentualComissao: 270,
    bonificacaoPorVida: 110.00,
    vidasParaBonificacao: 8,
    previsaoRecebimentoBancaria: getFutureDate(4),
    status: 'ativo',
    dataCriacao: getDate(45)
  },
  {
    id: 'CONT-007',
    nome: 'Rede de Farmácias Saúde+',
    operadora: 'Unimed',
    categoria: 'Empresarial',
    quantidadeVidas: 65,
    valorMensalidade: 780.00,
    percentualComissao: 285,
    bonificacaoPorVida: 125.00,
    vidasParaBonificacao: 65,
    previsaoRecebimentoBancaria: getFutureDate(9),
    previsaoRecebimentoBonificacao: getFutureDate(16),
    status: 'ativo',
    dataCriacao: getDate(75)
  },
  {
    id: 'CONT-008',
    nome: 'Academia FitLife',
    operadora: 'Bradesco Saúde',
    categoria: 'PME',
    quantidadeVidas: 22,
    valorMensalidade: 720.00,
    percentualComissao: 265,
    bonificacaoPorVida: 95.00,
    vidasParaBonificacao: 22,
    previsaoRecebimentoBancaria: getFutureDate(11),
    status: 'cancelado',
    observacoes: 'Cancelado por inadimplência',
    dataCriacao: getDate(150)
  }
];

// Entradas Mock
export const mockEntradas: Entrada[] = [
  {
    id: 'ENT-001',
    tipo: 'bancaria',
    contratoId: 'CONT-001',
    contratoNome: 'Tech Solutions Ltda',
    valorPrevisto: 2380.00,
    valorRecebido: 2380.00,
    dataPrevista: getDate(5),
    dataRecebida: getDate(5),
    categoria: 'Comissão Bancária',
    formaRecebimento: 'Transferência Bancária',
    recorrencia: 'mensal',
    status: 'recebido'
  },
  {
    id: 'ENT-002',
    tipo: 'bonificacao',
    contratoId: 'CONT-001',
    contratoNome: 'Tech Solutions Ltda',
    valorPrevisto: 5400.00,
    valorRecebido: 5400.00,
    dataPrevista: getDate(10),
    dataRecebida: getDate(8),
    categoria: 'Bonificação',
    formaRecebimento: 'Transferência Bancária',
    recorrencia: 'mensal',
    status: 'recebido'
  },
  {
    id: 'ENT-003',
    tipo: 'bancaria',
    contratoId: 'CONT-002',
    contratoNome: 'Comércio Brasil S.A.',
    valorPrevisto: 1875.00,
    valorRecebido: 1875.00,
    dataPrevista: getDate(3),
    dataRecebida: getDate(3),
    categoria: 'Comissão Bancária',
    formaRecebimento: 'Transferência Bancária',
    recorrencia: 'mensal',
    status: 'recebido'
  },
  {
    id: 'ENT-004',
    tipo: 'bonificacao',
    contratoId: 'CONT-002',
    contratoNome: 'Comércio Brasil S.A.',
    valorPrevisto: 12000.00,
    dataPrevista: getFutureDate(15),
    categoria: 'Bonificação',
    formaRecebimento: 'Transferência Bancária',
    recorrencia: 'mensal',
    status: 'previsto'
  },
  {
    id: 'ENT-005',
    tipo: 'bancaria',
    contratoId: 'CONT-003',
    contratoNome: 'Indústria Moderna Ltda',
    valorPrevisto: 2760.00,
    dataPrevista: getFutureDate(3),
    categoria: 'Comissão Bancária',
    formaRecebimento: 'Transferência Bancária',
    recorrencia: 'mensal',
    status: 'previsto'
  },
  {
    id: 'ENT-006',
    tipo: 'bonificacao',
    contratoId: 'CONT-003',
    contratoNome: 'Indústria Moderna Ltda',
    valorPrevisto: 12750.00,
    dataPrevista: getFutureDate(12),
    categoria: 'Bonificação',
    formaRecebimento: 'Transferência Bancária',
    recorrencia: 'mensal',
    status: 'previsto'
  },
  {
    id: 'ENT-007',
    tipo: 'bancaria',
    contratoId: 'CONT-005',
    contratoNome: 'Construtora Alicerce',
    valorPrevisto: 2378.00,
    valorRecebido: 2378.00,
    dataPrevista: getDate(2),
    dataRecebida: getDate(2),
    categoria: 'Comissão Bancária',
    formaRecebimento: 'Transferência Bancária',
    recorrencia: 'mensal',
    status: 'recebido'
  },
  {
    id: 'ENT-008',
    tipo: 'bonificacao',
    contratoId: 'CONT-005',
    contratoNome: 'Construtora Alicerce',
    valorPrevisto: 26000.00,
    valorRecebido: 26000.00,
    dataPrevista: getDate(7),
    dataRecebida: getDate(6),
    categoria: 'Bonificação',
    formaRecebimento: 'Transferência Bancária',
    recorrencia: 'mensal',
    status: 'recebido'
  },
  {
    id: 'ENT-009',
    tipo: 'avulsa',
    valorPrevisto: 5000.00,
    valorRecebido: 5000.00,
    dataPrevista: getDate(15),
    dataRecebida: getDate(15),
    categoria: 'Consultoria',
    formaRecebimento: 'PIX',
    recorrencia: 'sem',
    observacao: 'Consultoria para implantação de plano de saúde',
    status: 'recebido'
  },
  {
    id: 'ENT-010',
    tipo: 'avulsa',
    valorPrevisto: 2500.00,
    dataPrevista: getFutureDate(20),
    categoria: 'Serviços',
    formaRecebimento: 'Boleto',
    recorrencia: 'sem',
    observacao: 'Análise de sinistralidade',
    status: 'previsto'
  }
];

// Saídas Mock
export const mockSaidas: Saida[] = [
  {
    id: 'SAI-001',
    valor: 3500.00,
    categoria: 'Salários',
    tipo: 'fixa',
    fornecedor: 'Folha de Pagamento',
    recorrente: true,
    frequencia: 'mensal',
    dataPrevista: getDate(5),
    dataPaga: getDate(5),
    formaPagamento: 'Transferência Bancária',
    observacao: 'Pagamento de equipe administrativa',
    status: 'pago'
  },
  {
    id: 'SAI-002',
    valor: 2200.00,
    categoria: 'Aluguel',
    tipo: 'fixa',
    fornecedor: 'Imobiliária Central',
    recorrente: true,
    frequencia: 'mensal',
    dataPrevista: getDate(10),
    dataPaga: getDate(10),
    formaPagamento: 'Transferência Bancária',
    status: 'pago'
  },
  {
    id: 'SAI-003',
    valor: 850.00,
    categoria: 'Marketing',
    tipo: 'variavel',
    fornecedor: 'Google Ads',
    recorrente: true,
    frequencia: 'mensal',
    dataPrevista: getDate(3),
    dataPaga: getDate(3),
    formaPagamento: 'Cartão de Crédito',
    observacao: 'Campanha de aquisição',
    status: 'pago'
  },
  {
    id: 'SAI-004',
    valor: 450.00,
    categoria: 'Energia',
    tipo: 'fixa',
    fornecedor: 'Companhia de Energia',
    recorrente: true,
    frequencia: 'mensal',
    dataPrevista: getFutureDate(5),
    formaPagamento: 'Débito Automático',
    status: 'previsto'
  },
  {
    id: 'SAI-005',
    valor: 320.00,
    categoria: 'Internet',
    tipo: 'fixa',
    fornecedor: 'Provedor Fibra',
    recorrente: true,
    frequencia: 'mensal',
    dataPrevista: getFutureDate(8),
    formaPagamento: 'Débito Automático',
    status: 'previsto'
  },
  {
    id: 'SAI-006',
    valor: 1200.00,
    categoria: 'Contador',
    tipo: 'fixa',
    fornecedor: 'Contabilidade Expert',
    recorrente: true,
    frequencia: 'mensal',
    dataPrevista: getDate(15),
    dataPaga: getDate(15),
    formaPagamento: 'Transferência Bancária',
    status: 'pago'
  },
  {
    id: 'SAI-007',
    valor: 680.00,
    categoria: 'Software',
    tipo: 'fixa',
    fornecedor: 'Assinaturas SaaS',
    recorrente: true,
    frequencia: 'mensal',
    dataPrevista: getDate(7),
    dataPaga: getDate(7),
    formaPagamento: 'Cartão de Crédito',
    observacao: 'CRM + Gestão + Comunicação',
    status: 'pago'
  },
  {
    id: 'SAI-008',
    valor: 2500.00,
    categoria: 'Impostos',
    tipo: 'fixa',
    fornecedor: 'Receita Federal',
    recorrente: true,
    frequencia: 'mensal',
    dataPrevista: getFutureDate(10),
    formaPagamento: 'Débito Automático',
    status: 'previsto'
  },
  {
    id: 'SAI-009',
    valor: 1500.00,
    categoria: 'Treinamento',
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
    valor: 3800.00,
    categoria: 'Manutenção',
    tipo: 'variavel',
    fornecedor: 'TI Solutions',
    recorrente: false,
    dataPrevista: getFutureDate(15),
    formaPagamento: 'Transferência Bancária',
    observacao: 'Upgrade de infraestrutura',
    status: 'previsto'
  }
];
