-- Adicionar campos de vendedor e supervisor na tabela contratos
ALTER TABLE contratos 
ADD COLUMN vendedor_responsavel TEXT,
ADD COLUMN percentual_comissao_vendedor NUMERIC DEFAULT 0,
ADD COLUMN supervisor TEXT,
ADD COLUMN percentual_comissao_supervisor NUMERIC DEFAULT 0;