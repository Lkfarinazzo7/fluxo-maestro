export interface Contrato {
  id: string;
  nome: string;
  operadora: string;
  categoria: string;
  quantidadeVidas: number;
  valorMensalidade: number;
  percentualComissao: number; // Ex: 280 = 280% = 2,8x
  bonificacaoPorVida: number;
  vidasParaBonificacao: number;
  previsaoRecebimentoBancaria: string;
  previsaoRecebimentoBonificacao?: string;
  status: 'ativo' | 'cancelado';
  observacoes?: string;
  dataCriacao: string;
}

export interface Entrada {
  id: string;
  tipo: 'bancaria' | 'bonificacao' | 'avulsa';
  contratoId?: string;
  contratoNome?: string;
  valorPrevisto: number;
  valorRecebido?: number;
  dataPrevista: string;
  dataRecebida?: string;
  categoria: string;
  formaRecebimento: string;
  recorrencia: 'sem' | 'mensal' | '2meses' | '3meses' | '6meses' | '12meses' | 'vitalicio';
  observacao?: string;
  status: 'previsto' | 'recebido';
}

export interface Saida {
  id: string;
  valor: number;
  categoria: string;
  tipo: 'fixa' | 'variavel';
  fornecedor: string;
  recorrente: boolean;
  frequencia?: 'mensal' | '2meses' | '3meses' | '6meses' | '12meses' | 'vitalicio';
  dataPrevista: string;
  dataPaga?: string;
  formaPagamento: string;
  comprovante?: string;
  observacao?: string;
  status: 'previsto' | 'pago';
}

export interface DashboardMetrics {
  receitaMes: number;
  receitasPrevistas: number;
  despesasMes: number;
  resultadoLiquido: number;
  contratosAtivos: number;
  ticketMedioContratos: number;
  ticketMedioRecebido: number;
  bonificacaoTotal: number;
  bonificacaoPendente: number;
}
