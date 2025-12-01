-- Criar tabela de vendedores
CREATE TABLE public.vendedores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now())
);

-- Criar tabela de supervisores
CREATE TABLE public.supervisores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc', now())
);

-- Habilitar RLS
ALTER TABLE public.vendedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supervisores ENABLE ROW LEVEL SECURITY;

-- Políticas para permitir todas as operações
CREATE POLICY "Allow all operations on vendedores"
ON public.vendedores
FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all operations on supervisores"
ON public.supervisores
FOR ALL
USING (true)
WITH CHECK (true);

-- Inserir dados iniciais
INSERT INTO public.vendedores (nome) VALUES 
  ('Kaick'),
  ('Júlia'),
  ('Rhayssa');

INSERT INTO public.supervisores (nome) VALUES 
  ('Wellington');