import { useReceitasCRUD } from '@/hooks/useReceitasCRUD';
import { useDespesasCRUD } from '@/hooks/useDespesasCRUD';
import { ReceitaFormDialog } from '@/components/Forms/ReceitaFormDialog';
import { DespesaFormDialog } from '@/components/Forms/DespesaFormDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '@/lib/formatters';
import { MetricCard } from '@/components/Dashboard/MetricCard';

export default function Financeiro() {
  const { receitas, isLoading: loadingReceitas } = useReceitasCRUD();
  const { despesas, isLoading: loadingDespesas } = useDespesasCRUD();

  const receitasRecebidas = receitas.filter(e => e.status === 'recebido');
  const receitasPrevistas = receitas.filter(e => e.status === 'previsto');
  
  const totalReceber = receitasPrevistas.reduce((sum, e) => sum + e.valor_previsto, 0);
  const totalRecebido = receitasRecebidas.reduce((sum, e) => sum + (e.valor_recebido || 0), 0);
  
  const despesasPagas = despesas.filter(s => s.status === 'pago');
  const despesasPrevistas = despesas.filter(s => s.status === 'previsto');
  
  const totalPagar = despesasPrevistas.reduce((sum, s) => sum + s.valor, 0);
  const totalPago = despesasPagas.reduce((sum, s) => sum + s.valor, 0);
  
  const saldoProjetado = totalRecebido + totalReceber - totalPagar;

  if (loadingReceitas || loadingDespesas) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Financeiro</h1>
          <p className="text-muted-foreground">Carregando dados financeiros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Financeiro</h1>
          <p className="text-muted-foreground">Gestão de entradas e saídas</p>
        </div>
        <div className="flex gap-2">
          <ReceitaFormDialog />
          <DespesaFormDialog />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="A Receber"
          value={formatCurrency(totalReceber)}
          icon={<TrendingUp className="h-4 w-4" />}
        />

        <MetricCard
          title="Já Recebido"
          value={formatCurrency(totalRecebido)}
          icon={<DollarSign className="h-4 w-4" />}
        />

        <MetricCard
          title="A Pagar"
          value={formatCurrency(totalPagar)}
          icon={<TrendingDown className="h-4 w-4" />}
        />

        <MetricCard
          title="Saldo Projetado"
          value={formatCurrency(saldoProjetado)}
          icon={<DollarSign className="h-4 w-4" />}
        />
      </div>

      <Tabs defaultValue="entradas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="entradas">Entradas</TabsTrigger>
          <TabsTrigger value="saidas">Saídas</TabsTrigger>
        </TabsList>

        <TabsContent value="entradas">
          <Card>
            <CardHeader>
              <CardTitle>Entradas / Receitas</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Contrato</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Previsto</TableHead>
                    <TableHead>Recebido</TableHead>
                    <TableHead>Data Prevista</TableHead>
                    <TableHead>Data Recebida</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receitas.map((receita) => (
                    <TableRow key={receita.id} className="hover:bg-accent">
                      <TableCell className="font-medium">{receita.id.substring(0, 8)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {receita.tipo === 'bancaria' ? 'Comissão' : receita.tipo === 'bonificacao' ? 'Bonificação' : 'Avulsa'}
                        </Badge>
                      </TableCell>
                      <TableCell>{receita.contrato_nome || '-'}</TableCell>
                      <TableCell>{receita.categoria}</TableCell>
                      <TableCell>{formatCurrency(receita.valor_previsto)}</TableCell>
                      <TableCell className="font-medium">
                        {receita.valor_recebido ? formatCurrency(receita.valor_recebido) : '-'}
                      </TableCell>
                      <TableCell>{formatDate(receita.data_prevista)}</TableCell>
                      <TableCell>{receita.data_recebida ? formatDate(receita.data_recebida) : '-'}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(receita.status)}>
                          {receita.status === 'recebido' ? 'Recebido' : 'Previsto'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saidas">
          <Card>
            <CardHeader>
              <CardTitle>Saídas / Despesas</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Data Prevista</TableHead>
                    <TableHead>Data Paga</TableHead>
                    <TableHead>Forma Pagamento</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {despesas.map((despesa) => (
                    <TableRow key={despesa.id} className="hover:bg-accent">
                      <TableCell className="font-medium">{despesa.id.substring(0, 8)}</TableCell>
                      <TableCell>{despesa.categoria}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {despesa.tipo === 'fixa' ? 'Fixa' : 'Variável'}
                        </Badge>
                      </TableCell>
                      <TableCell>{despesa.fornecedor}</TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(despesa.valor)}
                      </TableCell>
                      <TableCell>{formatDate(despesa.data_prevista)}</TableCell>
                      <TableCell>{despesa.data_paga ? formatDate(despesa.data_paga) : '-'}</TableCell>
                      <TableCell>{despesa.forma_pagamento}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(despesa.status)}>
                          {despesa.status === 'pago' ? 'Pago' : 'Previsto'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
