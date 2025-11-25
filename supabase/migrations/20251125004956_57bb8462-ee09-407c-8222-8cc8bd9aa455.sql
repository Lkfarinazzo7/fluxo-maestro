-- Create contratos table
CREATE TABLE public.contratos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  operadora TEXT NOT NULL,
  categoria TEXT NOT NULL,
  tipo_contrato TEXT NOT NULL CHECK (tipo_contrato IN ('PJ', 'PF')),
  valor_mensalidade DECIMAL(10, 2) NOT NULL,
  percentual_comissao DECIMAL(5, 2) NOT NULL,
  bonificacao_por_vida DECIMAL(10, 2) NOT NULL DEFAULT 0,
  quantidade_vidas INTEGER NOT NULL DEFAULT 0,
  data_implantacao DATE NOT NULL,
  previsao_recebimento_bancaria TEXT,
  previsao_recebimento_bonificacao TEXT,
  observacoes TEXT,
  status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'cancelado')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create receitas (entradas) table
CREATE TABLE public.receitas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo TEXT NOT NULL CHECK (tipo IN ('bancaria', 'bonificacao', 'avulsa')),
  contrato_id UUID REFERENCES public.contratos(id) ON DELETE SET NULL,
  contrato_nome TEXT,
  valor_previsto DECIMAL(10, 2) NOT NULL,
  valor_recebido DECIMAL(10, 2),
  data_prevista DATE NOT NULL,
  data_recebida DATE,
  categoria TEXT NOT NULL,
  forma_recebimento TEXT NOT NULL,
  recorrencia TEXT NOT NULL DEFAULT 'sem' CHECK (recorrencia IN ('sem', 'mensal', '2meses', '3meses', '6meses', '12meses', 'vitalicio')),
  observacao TEXT,
  status TEXT NOT NULL DEFAULT 'previsto' CHECK (status IN ('previsto', 'recebido')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create despesas (saidas) table
CREATE TABLE public.despesas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  valor DECIMAL(10, 2) NOT NULL,
  categoria TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('fixa', 'variavel')),
  fornecedor TEXT NOT NULL,
  recorrente BOOLEAN NOT NULL DEFAULT false,
  frequencia TEXT CHECK (frequencia IN ('mensal', '2meses', '3meses', '6meses', '12meses', 'vitalicio')),
  data_prevista DATE NOT NULL,
  data_paga DATE,
  forma_pagamento TEXT NOT NULL,
  comprovante TEXT,
  observacao TEXT,
  status TEXT NOT NULL DEFAULT 'previsto' CHECK (status IN ('previsto', 'pago')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.contratos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receitas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.despesas ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for now, since auth is not implemented yet)
-- These should be restricted once authentication is added
CREATE POLICY "Allow all operations on contratos" ON public.contratos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on receitas" ON public.receitas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on despesas" ON public.despesas FOR ALL USING (true) WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_contratos_status ON public.contratos(status);
CREATE INDEX idx_contratos_data_implantacao ON public.contratos(data_implantacao);
CREATE INDEX idx_receitas_status ON public.receitas(status);
CREATE INDEX idx_receitas_data_prevista ON public.receitas(data_prevista);
CREATE INDEX idx_receitas_data_recebida ON public.receitas(data_recebida);
CREATE INDEX idx_receitas_contrato_id ON public.receitas(contrato_id);
CREATE INDEX idx_despesas_status ON public.despesas(status);
CREATE INDEX idx_despesas_data_prevista ON public.despesas(data_prevista);
CREATE INDEX idx_despesas_data_paga ON public.despesas(data_paga);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_contratos_updated_at BEFORE UPDATE ON public.contratos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_receitas_updated_at BEFORE UPDATE ON public.receitas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_despesas_updated_at BEFORE UPDATE ON public.despesas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
-- Sample contratos
INSERT INTO public.contratos (nome, operadora, categoria, tipo_contrato, valor_mensalidade, percentual_comissao, bonificacao_por_vida, quantidade_vidas, data_implantacao, previsao_recebimento_bancaria, previsao_recebimento_bonificacao, status) VALUES
('Empresa ABC Ltda', 'Unimed', 'Empresarial', 'PJ', 15000.00, 280.00, 50.00, 25, '2024-01-15', '5', '10', 'ativo'),
('João Silva', 'SulAmérica', 'Individual', 'PF', 800.00, 250.00, 30.00, 3, '2024-02-10', '10', '15', 'ativo');

-- Sample receitas (usando os IDs dos contratos criados)
INSERT INTO public.receitas (tipo, contrato_id, contrato_nome, valor_previsto, valor_recebido, data_prevista, data_recebida, categoria, forma_recebimento, recorrencia, status) 
SELECT 
  'bancaria',
  id,
  nome,
  valor_mensalidade * (percentual_comissao / 100),
  valor_mensalidade * (percentual_comissao / 100),
  DATE '2024-03-05',
  DATE '2024-03-05',
  'Comissão',
  'Transferência',
  'mensal',
  'recebido'
FROM public.contratos WHERE nome = 'Empresa ABC Ltda';

INSERT INTO public.receitas (tipo, contrato_id, contrato_nome, valor_previsto, data_prevista, categoria, forma_recebimento, recorrencia, status) 
SELECT 
  'bonificacao',
  id,
  nome,
  bonificacao_por_vida * quantidade_vidas,
  DATE '2024-03-15',
  'Bonificação',
  'PIX',
  'mensal',
  'previsto'
FROM public.contratos WHERE nome = 'João Silva';

-- Sample despesas
INSERT INTO public.despesas (nome, valor, categoria, tipo, fornecedor, recorrente, frequencia, data_prevista, data_paga, forma_pagamento, status) VALUES
('Aluguel do Escritório', 3500.00, 'Aluguel', 'fixa', 'Imobiliária XYZ', true, 'mensal', '2024-03-10', '2024-03-10', 'Boleto', 'pago'),
('Material de Marketing', 1200.00, 'Marketing', 'variavel', 'Gráfica Rápida', false, NULL, '2024-03-20', NULL, 'Cartão de Crédito', 'previsto');