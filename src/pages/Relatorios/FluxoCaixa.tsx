import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PeriodFilter } from '@/components/Dashboard/PeriodFilter';
import { useState, useMemo } from 'react';
import { DateRange, PeriodType, getPeriodRange } from '@/lib/dateFilters';
import { useEntries } from '@/hooks/useEntries';
import { useExpenses } from '@/hooks/useExpenses';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, ComposedChart } from 'recharts';
import { Label } from '@/components/ui/label';

export default function FluxoCaixa() {
  const navigate = useNavigate();
  const [periodType, setPeriodType] = useState<PeriodType>('mes');
  const [customStart, setCustomStart] = useState<Date>();
  const [customEnd, setCustomEnd] = useState<Date>();

  // Períodos de comparação
  const [comparativoPeriodType, setComparativoPeriodType] = useState<PeriodType>('mes');
  const [comparativoCustomStart, setComparativoCustomStart] = useState<Date>();
  const [comparativoCustomEnd, setComparativoCustomEnd] = useState<Date>();

  const dateRange: DateRange = useMemo(() => {
    return getPeriodRange(periodType, customStart, customEnd);
  }, [periodType, customStart, customEnd]);

  const comparativoDateRange: DateRange = useMemo(() => {
    return getPeriodRange(comparativoPeriodType, comparativoCustomStart, comparativoCustomEnd);
  }, [comparativoPeriodType, comparativoCustomStart, comparativoCustomEnd]);

  const { entradasRecebidas, entradasPrevistas } = useEntries(dateRange);
  const { saidasPagas, saidasPrevistas } = useExpenses(dateRange);

  // Dados do período de comparação
  const { entradasRecebidas: entradasComparativo } = useEntries(comparativoDateRange);
  const { saidasPagas: saidasComparativo } = useExpenses(comparativoDateRange);

  const receitaRecebida = entradasRecebidas.reduce((sum, e) => sum + (e.valorRecebido || 0), 0);
  const receitaPrevista = entradasPrevistas.reduce((sum, e) => sum + e.valorPrevisto, 0);
  const despesaPaga = saidasPagas.reduce((sum, s) => sum + s.valor, 0);
  const despesaPrevista = saidasPrevistas.reduce((sum, s) => sum + s.valor, 0);
  const saldoRealizado = receitaRecebida - despesaPaga;
  const saldoProjetado = (receitaRecebida + receitaPrevista) - (despesaPaga + despesaPrevista);

  const receitaComparativo = entradasComparativo.reduce((sum, e) => sum + (e.valorRecebido || 0), 0);
  const despesaComparativo = saidasComparativo.reduce((sum, s) => sum + s.valor, 0);
  const saldoComparativo = receitaComparativo - despesaComparativo;

  // Preparar dados para o gráfico comparativo
  const chartData = [
    { name: 'Período Atual', receitas: receitaRecebida, despesas: despesaPaga, saldo: saldoRealizado },
    { name: 'Período Comparativo', receitas: receitaComparativo, despesas: despesaComparativo, saldo: saldoComparativo },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/relatorios')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Fluxo de Caixa</h1>
          <p className="text-muted-foreground">Análise detalhada de entradas e saídas financeiras</p>
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
            <CardTitle className="text-sm font-medium text-muted-foreground">Receitas Recebidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{formatCurrency(receitaRecebida)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Receitas Previstas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{formatCurrency(receitaPrevista)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Despesas Pagas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{formatCurrency(despesaPaga)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Saldo Projetado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${saldoProjetado >= 0 ? 'text-success' : 'text-destructive'}`}>
              {formatCurrency(saldoProjetado)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Comparativo de Períodos</CardTitle>
            <div className="flex gap-4 items-center">
              <div>
                <Label className="text-xs text-muted-foreground">Período de Comparação:</Label>
                <PeriodFilter 
                  value={comparativoPeriodType} 
                  customStart={comparativoCustomStart}
                  customEnd={comparativoCustomEnd}
                  onValueChange={setComparativoPeriodType}
                  onCustomStartChange={setComparativoCustomStart}
                  onCustomEndChange={setComparativoCustomEnd}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Bar dataKey="receitas" fill="hsl(var(--success))" name="Receitas" />
              <Bar dataKey="despesas" fill="hsl(var(--destructive))" name="Despesas" />
              <Line type="monotone" dataKey="saldo" stroke="hsl(var(--primary))" strokeWidth={2} name="Saldo" />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              Entradas Recebidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entradasRecebidas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      Nenhuma entrada recebida no período
                    </TableCell>
                  </TableRow>
                ) : (
                  entradasRecebidas.map((entrada) => (
                    <TableRow key={entrada.id}>
                      <TableCell>{entrada.categoria}</TableCell>
                      <TableCell>{entrada.dataRecebida ? formatDate(entrada.dataRecebida) : '-'}</TableCell>
                      <TableCell className="text-right font-medium text-success">
                        {formatCurrency(entrada.valorRecebido || 0)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-destructive" />
              Despesas Pagas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {saidasPagas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      Nenhuma despesa paga no período
                    </TableCell>
                  </TableRow>
                ) : (
                  saidasPagas.map((saida) => (
                    <TableRow key={saida.id}>
                      <TableCell>{saida.categoria}</TableCell>
                      <TableCell>{saida.dataPaga ? formatDate(saida.dataPaga) : '-'}</TableCell>
                      <TableCell className="text-right font-medium text-destructive">
                        {formatCurrency(saida.valor)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
