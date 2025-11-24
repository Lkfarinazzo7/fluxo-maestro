import { useApp } from '@/contexts/AppContext';
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
import { DollarSign, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '@/lib/formatters';
import { MetricCard } from '@/components/Dashboard/MetricCard';

export default function Financeiro() {
  const { contas } = useApp();

  const contasReceber = contas.filter(c => c.tipo === 'receber');
  const contasPagar = contas.filter(c => c.tipo === 'pagar');

  const totalReceber = contasReceber
    .filter(c => c.status !== 'pago')
    .reduce((sum, c) => sum + c.valor, 0);

  const totalPagar = contasPagar
    .filter(c => c.status !== 'pago')
    .reduce((sum, c) => sum + c.valor, 0);

  const contasVencidasReceber = contasReceber.filter(c => c.status === 'vencido').length;
  const contasVencidasPagar = contasPagar.filter(c => c.status === 'vencido').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Financeiro</h1>
        <p className="text-muted-foreground">Gestão de contas a pagar e receber</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="A Receber"
          value={formatCurrency(totalReceber)}
          icon={<TrendingUp className="h-4 w-4" />}
        />

        <MetricCard
          title="A Pagar"
          value={formatCurrency(totalPagar)}
          icon={<TrendingDown className="h-4 w-4" />}
        />

        <MetricCard
          title="Saldo Projetado"
          value={formatCurrency(totalReceber - totalPagar)}
          icon={<DollarSign className="h-4 w-4" />}
        />

        <MetricCard
          title="Contas Vencidas"
          value={`${contasVencidasReceber + contasVencidasPagar}`}
          icon={<AlertCircle className="h-4 w-4" />}
        />
      </div>

      <Tabs defaultValue="receber" className="space-y-4">
        <TabsList>
          <TabsTrigger value="receber">Contas a Receber</TabsTrigger>
          <TabsTrigger value="pagar">Contas a Pagar</TabsTrigger>
        </TabsList>

        <TabsContent value="receber">
          <Card>
            <CardHeader>
              <CardTitle>Contas a Receber</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contasReceber.map((conta) => (
                    <TableRow key={conta.id} className="hover:bg-accent">
                      <TableCell className="font-medium">{conta.id}</TableCell>
                      <TableCell>{conta.cliente || '-'}</TableCell>
                      <TableCell>{conta.descricao}</TableCell>
                      <TableCell>{formatDate(conta.vencimento)}</TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(conta.valor)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(conta.status)}>
                          {getStatusLabel(conta.status)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pagar">
          <Card>
            <CardHeader>
              <CardTitle>Contas a Pagar</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contasPagar.map((conta) => (
                    <TableRow key={conta.id} className="hover:bg-accent">
                      <TableCell className="font-medium">{conta.id}</TableCell>
                      <TableCell>{conta.descricao}</TableCell>
                      <TableCell>{conta.categoria}</TableCell>
                      <TableCell>{formatDate(conta.vencimento)}</TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(conta.valor)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(conta.status)}>
                          {getStatusLabel(conta.status)}
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
