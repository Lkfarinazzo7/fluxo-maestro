-- Remover coluna status da tabela contratos
ALTER TABLE contratos DROP COLUMN IF EXISTS status;

-- Adicionar coluna duracao_meses na tabela despesas
ALTER TABLE despesas ADD COLUMN IF NOT EXISTS duracao_meses integer;

-- Remover coluna frequencia da tabela despesas
ALTER TABLE despesas DROP COLUMN IF EXISTS frequencia;

-- Adicionar coluna nome na tabela despesas se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='despesas' AND column_name='nome') THEN
    ALTER TABLE despesas ADD COLUMN nome text NOT NULL DEFAULT '';
  END IF;
END $$;