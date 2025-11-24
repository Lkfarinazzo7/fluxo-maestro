import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DollarSign, TrendingUp, TrendingDown, Plus } from 'lucide-react';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '@/lib/formatters';
import { MetricCard } from '@/components/Dashboard/MetricCard';

export default function Financeiro() {
  const { entradas, saidas } = useApp();

  const entradasRecebidas = entradas.filter(e => e.status === 'recebido');
  const entradasPrevistas = entradas.filter(e => e.status === 'previsto');
  
  const totalReceber = entradasPrevistas.reduce((sum, e) => sum + e.valorPrevisto, 0);
  const totalRecebido = entradasRecebidas.reduce((sum, e) => sum + (e.valorRecebido || 0), 0);
  
  const saidasPagas = saidas.filter(s => s.status === 'pago');
  const saidasPrevistas = saidas.filter(s => s.status === 'previsto');
  
  const totalPagar = saidasPrevistas.reduce((sum, s) => sum + s.valor, 0);
  const totalPago = saidasPagas.reduce((sum, s) => sum + s.valor, 0);
  
  const saldoProjetado = totalReceber - totalPagar;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Financeiro</h1>
          <p className="text-muted-foreground">Gestão de entradas e saídas</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Transação
        </Button>
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
                  {entradas.map((entrada) => (
                    <TableRow key={entrada.id} className="hover:bg-accent">
                      <TableCell className="font-medium">{entrada.id}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {entrada.tipo === 'bancaria' ? 'Comissão' : entrada.tipo === 'bonificacao' ? 'Bonificação' : 'Avulsa'}
                        </Badge>
                      </TableCell>
                      <TableCell>{entrada.contratoNome || '-'}</TableCell>
                      <TableCell>{entrada.categoria}</TableCell>
                      <TableCell>{formatCurrency(entrada.valorPrevisto)}</TableCell>
                      <TableCell className="font-medium">
                        {entrada.valorRecebido ? formatCurrency(entrada.valorRecebido) : '-'}
                      </TableCell>
                      <TableCell>{formatDate(entrada.dataPrevista)}</TableCell>
                      <TableCell>{entrada.dataRecebida ? formatDate(entrada.dataRecebida) : '-'}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(entrada.status)}>
                          {entrada.status === 'recebido' ? 'Recebido' : 'Previsto'}
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
                  {saidas.map((saida) => (
                    <TableRow key={saida.id} className="hover:bg-accent">
                      <TableCell className="font-medium">{saida.id}</TableCell>
                      <TableCell>{saida.categoria}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {saida.tipo === 'fixa' ? 'Fixa' : 'Variável'}
                        </Badge>
                      </TableCell>
                      <TableCell>{saida.fornecedor}</TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(saida.valor)}
                      </TableCell>
                      <TableCell>{formatDate(saida.dataPrevista)}</TableCell>
                      <TableCell>{saida.dataPaga ? formatDate(saida.dataPaga) : '-'}</TableCell>
                      <TableCell>{saida.formaPagamento}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(saida.status)}>
                          {saida.status === 'pago' ? 'Pago' : 'Previsto'}
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
