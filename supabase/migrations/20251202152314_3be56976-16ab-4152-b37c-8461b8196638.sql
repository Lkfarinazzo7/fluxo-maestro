-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Allow all operations on contratos" ON public.contratos;
DROP POLICY IF EXISTS "Allow all operations on receitas" ON public.receitas;
DROP POLICY IF EXISTS "Allow all operations on despesas" ON public.despesas;
DROP POLICY IF EXISTS "Allow all operations on vendedores" ON public.vendedores;
DROP POLICY IF EXISTS "Allow all operations on supervisores" ON public.supervisores;

-- Create proper RLS policies for contratos (authenticated users only)
CREATE POLICY "Authenticated users can view contratos"
ON public.contratos FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert contratos"
ON public.contratos FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update contratos"
ON public.contratos FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete contratos"
ON public.contratos FOR DELETE
TO authenticated
USING (true);

-- Create proper RLS policies for receitas (authenticated users only)
CREATE POLICY "Authenticated users can view receitas"
ON public.receitas FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert receitas"
ON public.receitas FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update receitas"
ON public.receitas FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete receitas"
ON public.receitas FOR DELETE
TO authenticated
USING (true);

-- Create proper RLS policies for despesas (authenticated users only)
CREATE POLICY "Authenticated users can view despesas"
ON public.despesas FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert despesas"
ON public.despesas FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update despesas"
ON public.despesas FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete despesas"
ON public.despesas FOR DELETE
TO authenticated
USING (true);

-- Create proper RLS policies for vendedores (authenticated users only)
CREATE POLICY "Authenticated users can view vendedores"
ON public.vendedores FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert vendedores"
ON public.vendedores FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update vendedores"
ON public.vendedores FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete vendedores"
ON public.vendedores FOR DELETE
TO authenticated
USING (true);

-- Create proper RLS policies for supervisores (authenticated users only)
CREATE POLICY "Authenticated users can view supervisores"
ON public.supervisores FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert supervisores"
ON public.supervisores FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update supervisores"
ON public.supervisores FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete supervisores"
ON public.supervisores FOR DELETE
TO authenticated
USING (true);