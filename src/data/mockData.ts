import { Venda, Produto, Cliente, Conta } from '@/types';

// Helper para gerar datas
const getDate = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

// Clientes Mock
export const mockClientes: Cliente[] = [
  {
    id: '1',
    tipo: 'PJ',
    nome: 'Tech Solutions Ltda',
    cpfCnpj: '12.345.678/0001-90',
    email: 'contato@techsolutions.com',
    telefone: '(11) 3456-7890',
    endereco: {
      cep: '01310-100',
      rua: 'Av. Paulista',
      numero: '1000',
      complemento: 'Sala 501',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      estado: 'SP'
    },
    limiteCredito: 50000,
    totalComprado: 125430.50,
    ultimaCompra: getDate(5),
    status: 'ativo'
  },
  {
    id: '2',
    tipo: 'PF',
    nome: 'João Silva Santos',
    cpfCnpj: '123.456.789-00',
    email: 'joao.silva@email.com',
    telefone: '(11) 98765-4321',
    endereco: {
      cep: '04567-000',
      rua: 'Rua das Flores',
      numero: '234',
      bairro: 'Jardim Paulista',
      cidade: 'São Paulo',
      estado: 'SP'
    },
    limiteCredito: 10000,
    totalComprado: 8750.00,
    ultimaCompra: getDate(12),
    status: 'ativo'
  },
  {
    id: '3',
    tipo: 'PJ',
    nome: 'Comércio Brasil S.A.',
    cpfCnpj: '98.765.432/0001-10',
    email: 'comercial@comerciobrasil.com',
    telefone: '(21) 2345-6789',
    endereco: {
      cep: '20040-020',
      rua: 'Av. Rio Branco',
      numero: '500',
      bairro: 'Centro',
      cidade: 'Rio de Janeiro',
      estado: 'RJ'
    },
    limiteCredito: 80000,
    totalComprado: 234560.00,
    ultimaCompra: getDate(3),
    status: 'ativo'
  },
  {
    id: '4',
    tipo: 'PF',
    nome: 'Maria Oliveira Costa',
    cpfCnpj: '987.654.321-00',
    email: 'maria.oliveira@email.com',
    telefone: '(11) 97654-3210',
    endereco: {
      cep: '05432-100',
      rua: 'Rua Oscar Freire',
      numero: '789',
      bairro: 'Pinheiros',
      cidade: 'São Paulo',
      estado: 'SP'
    },
    limiteCredito: 15000,
    totalComprado: 12450.00,
    ultimaCompra: getDate(8),
    status: 'ativo'
  },
  {
    id: '5',
    tipo: 'PJ',
    nome: 'Distribuidora Rápida Ltda',
    cpfCnpj: '11.222.333/0001-44',
    email: 'vendas@distrapida.com',
    telefone: '(31) 3344-5566',
    endereco: {
      cep: '30130-100',
      rua: 'Av. Afonso Pena',
      numero: '1500',
      bairro: 'Centro',
      cidade: 'Belo Horizonte',
      estado: 'MG'
    },
    limiteCredito: 60000,
    totalComprado: 87650.00,
    ultimaCompra: getDate(15),
    status: 'ativo'
  }
];

// Produtos Mock
export const mockProdutos: Produto[] = [
  {
    id: '1',
    codigo: 'PROD-001',
    nome: 'Notebook Dell Inspiron 15',
    descricao: 'Notebook i7, 16GB RAM, 512GB SSD',
    categoria: 'Eletrônicos',
    estoqueAtual: 15,
    estoqueMinimo: 5,
    custoCompra: 2500.00,
    precoVenda: 3499.00,
    status: 'ativo'
  },
  {
    id: '2',
    codigo: 'PROD-002',
    nome: 'Mouse Logitech MX Master 3',
    descricao: 'Mouse sem fio ergonômico',
    categoria: 'Eletrônicos',
    estoqueAtual: 45,
    estoqueMinimo: 20,
    custoCompra: 250.00,
    precoVenda: 399.90,
    status: 'ativo'
  },
  {
    id: '3',
    codigo: 'PROD-003',
    nome: 'Teclado Mecânico Keychron K2',
    descricao: 'Teclado mecânico RGB',
    categoria: 'Eletrônicos',
    estoqueAtual: 3,
    estoqueMinimo: 10,
    custoCompra: 350.00,
    precoVenda: 549.90,
    status: 'ativo'
  },
  {
    id: '4',
    codigo: 'PROD-004',
    nome: 'Monitor LG 27" UltraWide',
    descricao: 'Monitor 27 polegadas Full HD',
    categoria: 'Eletrônicos',
    estoqueAtual: 8,
    estoqueMinimo: 5,
    custoCompra: 900.00,
    precoVenda: 1299.00,
    status: 'ativo'
  },
  {
    id: '5',
    codigo: 'PROD-005',
    nome: 'Cadeira Gamer ThunderX3',
    descricao: 'Cadeira ergonômica para escritório',
    categoria: 'Móveis',
    estoqueAtual: 12,
    estoqueMinimo: 8,
    custoCompra: 600.00,
    precoVenda: 899.00,
    status: 'ativo'
  },
  {
    id: '6',
    codigo: 'PROD-006',
    nome: 'Webcam Logitech C920',
    descricao: 'Webcam Full HD 1080p',
    categoria: 'Eletrônicos',
    estoqueAtual: 25,
    estoqueMinimo: 15,
    custoCompra: 280.00,
    precoVenda: 449.90,
    status: 'ativo'
  },
  {
    id: '7',
    codigo: 'PROD-007',
    nome: 'Headset HyperX Cloud II',
    descricao: 'Headset gamer 7.1',
    categoria: 'Eletrônicos',
    estoqueAtual: 2,
    estoqueMinimo: 10,
    custoCompra: 300.00,
    precoVenda: 499.90,
    status: 'ativo'
  },
  {
    id: '8',
    codigo: 'PROD-008',
    nome: 'SSD Samsung 1TB',
    descricao: 'SSD NVMe M.2 1TB',
    categoria: 'Eletrônicos',
    estoqueAtual: 30,
    estoqueMinimo: 20,
    custoCompra: 350.00,
    precoVenda: 549.00,
    status: 'ativo'
  },
  {
    id: '9',
    codigo: 'PROD-009',
    nome: 'Impressora HP LaserJet',
    descricao: 'Impressora multifuncional laser',
    categoria: 'Eletrônicos',
    estoqueAtual: 6,
    estoqueMinimo: 5,
    custoCompra: 800.00,
    precoVenda: 1199.00,
    status: 'ativo'
  },
  {
    id: '10',
    codigo: 'PROD-010',
    nome: 'Mesa para Escritório',
    descricao: 'Mesa de escritório 120x60cm',
    categoria: 'Móveis',
    estoqueAtual: 1,
    estoqueMinimo: 5,
    custoCompra: 250.00,
    precoVenda: 399.00,
    status: 'ativo'
  }
];

// Vendas Mock
export const mockVendas: Venda[] = [
  {
    id: 'VND-001',
    clienteId: '1',
    cliente: 'Tech Solutions Ltda',
    data: getDate(1),
    items: [
      {
        id: '1',
        produtoId: '1',
        produto: 'Notebook Dell Inspiron 15',
        quantidade: 3,
        valorUnitario: 3499.00,
        desconto: 0,
        subtotal: 10497.00
      },
      {
        id: '2',
        produtoId: '4',
        produto: 'Monitor LG 27" UltraWide',
        quantidade: 3,
        valorUnitario: 1299.00,
        desconto: 0,
        subtotal: 3897.00
      }
    ],
    subtotal: 14394.00,
    desconto: 500.00,
    impostos: 1500.00,
    total: 15394.00,
    status: 'pago',
    formaPagamento: 'Boleto',
    observacoes: 'Entrega agendada'
  },
  {
    id: 'VND-002',
    clienteId: '2',
    cliente: 'João Silva Santos',
    data: getDate(2),
    items: [
      {
        id: '1',
        produtoId: '2',
        produto: 'Mouse Logitech MX Master 3',
        quantidade: 1,
        valorUnitario: 399.90,
        desconto: 0,
        subtotal: 399.90
      },
      {
        id: '2',
        produtoId: '3',
        produto: 'Teclado Mecânico Keychron K2',
        quantidade: 1,
        valorUnitario: 549.90,
        desconto: 0,
        subtotal: 549.90
      }
    ],
    subtotal: 949.80,
    desconto: 50.00,
    impostos: 100.00,
    total: 999.80,
    status: 'pago',
    formaPagamento: 'PIX',
    observacoes: ''
  },
  {
    id: 'VND-003',
    clienteId: '3',
    cliente: 'Comércio Brasil S.A.',
    data: getDate(3),
    items: [
      {
        id: '1',
        produtoId: '1',
        produto: 'Notebook Dell Inspiron 15',
        quantidade: 10,
        valorUnitario: 3499.00,
        desconto: 500,
        subtotal: 34490.00
      },
      {
        id: '2',
        produtoId: '6',
        produto: 'Webcam Logitech C920',
        quantidade: 10,
        valorUnitario: 449.90,
        desconto: 0,
        subtotal: 4499.00
      }
    ],
    subtotal: 38989.00,
    desconto: 1000.00,
    impostos: 4200.00,
    total: 42189.00,
    status: 'pago',
    formaPagamento: 'Cartão',
    observacoes: 'Cliente corporativo'
  },
  {
    id: 'VND-004',
    clienteId: '4',
    cliente: 'Maria Oliveira Costa',
    data: getDate(5),
    items: [
      {
        id: '1',
        produtoId: '5',
        produto: 'Cadeira Gamer ThunderX3',
        quantidade: 1,
        valorUnitario: 899.00,
        desconto: 0,
        subtotal: 899.00
      }
    ],
    subtotal: 899.00,
    desconto: 0,
    impostos: 100.00,
    total: 999.00,
    status: 'pendente',
    formaPagamento: 'Boleto',
    observacoes: 'Aguardando pagamento'
  },
  {
    id: 'VND-005',
    clienteId: '5',
    cliente: 'Distribuidora Rápida Ltda',
    data: getDate(7),
    items: [
      {
        id: '1',
        produtoId: '8',
        produto: 'SSD Samsung 1TB',
        quantidade: 20,
        valorUnitario: 549.00,
        desconto: 0,
        subtotal: 10980.00
      }
    ],
    subtotal: 10980.00,
    desconto: 500.00,
    impostos: 1200.00,
    total: 11680.00,
    status: 'pago',
    formaPagamento: 'Transferência',
    observacoes: ''
  },
  {
    id: 'VND-006',
    clienteId: '1',
    cliente: 'Tech Solutions Ltda',
    data: getDate(10),
    items: [
      {
        id: '1',
        produtoId: '9',
        produto: 'Impressora HP LaserJet',
        quantidade: 2,
        valorUnitario: 1199.00,
        desconto: 0,
        subtotal: 2398.00
      }
    ],
    subtotal: 2398.00,
    desconto: 0,
    impostos: 280.00,
    total: 2678.00,
    status: 'pago',
    formaPagamento: 'PIX',
    observacoes: ''
  }
];

// Contas Mock
export const mockContas: Conta[] = [
  {
    id: 'CR-001',
    tipo: 'receber',
    descricao: 'Venda VND-004',
    valor: 999.00,
    vencimento: getDate(-5),
    status: 'aberto',
    clienteId: '4',
    cliente: 'Maria Oliveira Costa',
    categoria: 'Vendas'
  },
  {
    id: 'CR-002',
    tipo: 'receber',
    descricao: 'Venda parcelada',
    valor: 5000.00,
    vencimento: getDate(-2),
    status: 'vencido',
    clienteId: '3',
    cliente: 'Comércio Brasil S.A.',
    categoria: 'Vendas'
  },
  {
    id: 'CP-001',
    tipo: 'pagar',
    descricao: 'Fornecedor ABC - Estoque',
    valor: 15000.00,
    vencimento: getDate(-10),
    status: 'pago',
    categoria: 'Compras'
  },
  {
    id: 'CP-002',
    tipo: 'pagar',
    descricao: 'Aluguel do galpão',
    valor: 8000.00,
    vencimento: getDate(-3),
    status: 'aberto',
    categoria: 'Despesas Fixas'
  },
  {
    id: 'CP-003',
    tipo: 'pagar',
    descricao: 'Energia elétrica',
    valor: 2500.00,
    vencimento: getDate(-1),
    status: 'vencido',
    categoria: 'Despesas Fixas'
  }
];
