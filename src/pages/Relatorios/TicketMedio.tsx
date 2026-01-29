import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PeriodFilter } from '@/components/Dashboard/PeriodFilter';
import { useState, useMemo } from 'react';
import { DateRange, PeriodType, getPeriodRange, filterByDateRange } from '@/lib/dateFilters';
import { useContratosCRUD } from '@/hooks/useContratosCRUD';
import { formatCurrency } from '@/lib/formatters';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function TicketMedio() {
  const navigate = useNavigate();
  const [periodType, setPeriodType] = useState<PeriodType>('mes');
  const [customStart, setCustomStart] = useState<Date>();
  const [customEnd, setCustomEnd] = useState<Date>();

  const dateRange: DateRange = useMemo(() => {
    return getPeriodRange(periodType, customStart, customEnd);
  }, [periodType, customStart, customEnd]);

  const { contratos: allContratos } = useContratosCRUD();

  // Filtrar contratos pelo período de implantação
  const contratos = useMemo(() => {
    return filterByDateRange(allContratos, 'data_implantacao', dateRange);
  }, [allContratos, dateRange]);

  const ticketMedioGeral = contratos.length > 0
    ? contratos.reduce((sum, c) => sum + Number(c.valor_mensalidade), 0) / contratos.length
    : 0;

  const ticketMedioComComissao = contratos.length > 0
    ? contratos.reduce((sum, c) => sum + (Number(c.valor_mensalidade) * (Number(c.percentual_comissao) / 100)), 0) / contratos.length
    : 0;

  const maiorTicket = contratos.length > 0
    ? Math.max(...contratos.map(c => Number(c.valor_mensalidade)))
    : 0;

  const menorTicket = contratos.length > 0
    ? Math.min(...contratos.map(c => Number(c.valor_mensalidade)))
    : 0;

  // Agrupar por operadora para análise
  const ticketPorOperadora = contratos.reduce((acc, contrato) => {
    if (!acc[contrato.operadora]) {
      acc[contrato.operadora] = {
        operadora: contrato.operadora,
        totalMensalidade: 0,
        quantidade: 0
      };
    }
    acc[contrato.operadora].totalMensalidade += Number(contrato.valor_mensalidade);
    acc[contrato.operadora].quantidade += 1;
    return acc;
  }, {} as Record<string, { operadora: string; totalMensalidade: number; quantidade: number }>);

  const chartData = Object.values(ticketPorOperadora).map(item => ({
    operadora: item.operadora,
    ticketMedio: item.totalMensalidade / item.quantidade
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/relatorios')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Ticket Médio dos Contratos</h1>
          <p className="text-muted-foreground">Análise de ticket médio e variações por período</p>
        </div>
      </div>

      <PeriodFilter 
        value={periodType} 
        customStart={customStart}
        customEnd={customEnd}
        onValueChange={setPeriodType}
        onCustomStartChange={setCustomStart}
        onCustomEndChange={setCustomEnd}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ticket Médio Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatCurrency(ticketMedioGeral)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ticket Médio (c/ Comissão)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{formatCurrency(ticketMedioComComissao)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Maior Ticket</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{formatCurrency(maiorTicket)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Menor Ticket</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">{formatCurrency(menorTicket)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ticket Médio por Operadora</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="operadora" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Bar dataKey="ticketMedio" fill="hsl(var(--primary))" name="Ticket Médio (R$)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contratos por Faixa de Ticket</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do Contrato</TableHead>
                <TableHead>Operadora</TableHead>
                <TableHead className="text-center">Vidas</TableHead>
                <TableHead className="text-right">Mensalidade</TableHead>
                <TableHead className="text-right">Comissão Real</TableHead>
                <TableHead className="text-right">Ticket/Vida</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contratos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Nenhum contrato no período selecionado
                  </TableCell>
                </TableRow>
              ) : (
                contratos
                  .sort((a, b) => Number(b.valor_mensalidade) - Number(a.valor_mensalidade))
                  .map((contrato) => {
                    const comissaoReal = Number(contrato.valor_mensalidade) * (Number(contrato.percentual_comissao) / 100);
                    const ticketPorVida = Number(contrato.valor_mensalidade) / Number(contrato.quantidade_vidas);
                    
                    return (
                      <TableRow key={contrato.id}>
                        <TableCell className="font-medium">{contrato.nome}</TableCell>
                        <TableCell>{contrato.operadora}</TableCell>
                        <TableCell className="text-center">{contrato.quantidade_vidas}</TableCell>
                        <TableCell className="text-right">{formatCurrency(Number(contrato.valor_mensalidade))}</TableCell>
                        <TableCell className="text-right font-bold text-success">
                          {formatCurrency(comissaoReal)}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {formatCurrency(ticketPorVida)}
                        </TableCell>
                      </TableRow>
                    );
                  })
              )}
              {contratos.length > 0 && (
                <TableRow className="font-bold bg-muted/50">
                  <TableCell colSpan={2}>MÉDIA GERAL</TableCell>
                  <TableCell className="text-center">
                    {(contratos.reduce((sum, c) => sum + Number(c.quantidade_vidas), 0) / contratos.length).toFixed(0)}
                  </TableCell>
                  <TableCell className="text-right text-primary">{formatCurrency(ticketMedioGeral)}</TableCell>
                  <TableCell className="text-right text-success">{formatCurrency(ticketMedioComComissao)}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}