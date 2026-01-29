import { z } from 'zod';

// Operadoras pré-definidas
export const OPERADORAS = [
  'Unimed FERJ',
  'Bradesco',
  'SulAmérica',
  'Amil',
  'Porto Seguro',
  'MedSênior',
  'Prevent Senior',
  'Leve Saúde',
] as const;

// Categorias de despesas pré-definidas
export const CATEGORIAS_DESPESAS = [
  'Comissão',
  'Salários',
  'Aluguel',
  'Marketing',
  'Tecnologia',
  'Transporte',
  'Alimentação',
  'Impostos',
  'Escritório',
  'Insumos',
  'Administrativo',
  'Outros',
] as const;

// Formas de pagamento pré-definidas
export const FORMAS_PAGAMENTO = [
  'Dinheiro',
  'PIX',
  'Boleto',
  'Cartão de Crédito',
  'Cartão de Débito',
  'Transferência Bancária',
  'Outros',
] as const;

export const contratoSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  operadora: z.enum(OPERADORAS as any, {
    required_error: 'Operadora é obrigatória',
  }),
  categoria: z.string().min(2, 'Categoria é obrigatória'),
  tipo_contrato: z.enum(['PJ', 'PF'], {
    required_error: 'Tipo de contrato é obrigatório',
  }),
  valor_mensalidade: z.coerce.number().min(0, 'Valor deve ser maior que zero'),
  percentual_comissao: z.coerce.number().min(0, 'Percentual deve ser maior que zero'),
  bonificacao_por_vida: z.coerce.number().min(0, 'Bonificação deve ser maior ou igual a zero'),
  quantidade_vidas: z.coerce.number().int().min(1, 'Quantidade de vidas deve ser maior que zero'),
  data_implantacao: z.string().min(1, 'Data de implantação é obrigatória'),
  previsao_recebimento_bancaria: z.string().min(1, 'Data de previsão de recebimento é obrigatória'),
  previsao_recebimento_bonificacao: z.string().optional(),
  vendedor_responsavel: z.string().optional(),
  percentual_comissao_vendedor: z.coerce.number().min(0).default(0),
  supervisor: z.string().optional(),
  percentual_comissao_supervisor: z.coerce.number().min(0).default(0),
  observacoes: z.string().optional(),
});

export const receitaSchema = z.object({
  tipo: z.enum(['bancaria', 'bonificacao', 'avulsa'], {
    required_error: 'Tipo é obrigatório',
  }),
  contrato_id: z.string().uuid().optional(),
  contrato_nome: z.string().optional(),
  valor_previsto: z.coerce.number().min(0, 'Valor deve ser maior que zero'),
  valor_recebido: z.coerce.number().min(0).optional(),
  data_prevista: z.string().min(1, 'Data prevista é obrigatória'),
  data_recebida: z.string().optional(),
  categoria: z.string().min(2, 'Categoria é obrigatória'),
  forma_recebimento: z.string().min(2, 'Forma de recebimento é obrigatória'),
  recorrencia: z.enum(['sem', 'mensal', '2meses', '3meses', '6meses', '12meses', 'vitalicio']).default('sem'),
  observacao: z.string().optional(),
  status: z.enum(['previsto', 'recebido']).default('previsto'),
});

export const despesaSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  valor: z.coerce.number().min(0, 'Valor deve ser maior que zero'),
  categoria: z.enum(CATEGORIAS_DESPESAS as any, {
    required_error: 'Categoria é obrigatória',
  }),
  tipo: z.enum(['fixa', 'variavel'], {
    required_error: 'Tipo é obrigatório',
  }),
  fornecedor: z.string().min(2, 'Fornecedor é obrigatório'),
  recorrente: z.boolean().default(false),
  duracao_meses: z.coerce.number().int().min(1).optional(),
  data_prevista: z.string().min(1, 'Data de vencimento é obrigatória'),
  data_paga: z.string().optional(),
  forma_pagamento: z.enum(FORMAS_PAGAMENTO as any, {
    required_error: 'Forma de pagamento é obrigatória',
  }),
  comprovante: z.string().optional(),
  observacao: z.string().optional(),
  status: z.enum(['previsto', 'pago']).default('previsto'),
});

export type ContratoFormValues = z.infer<typeof contratoSchema>;
export type ReceitaFormValues = z.infer<typeof receitaSchema>;
export type DespesaFormValues = z.infer<typeof despesaSchema>;
