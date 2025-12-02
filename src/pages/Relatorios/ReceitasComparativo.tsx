import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PeriodFilter } from '@/components/Dashboard/PeriodFilter';
import { useState, useMemo } from 'react';
import { DateRange, PeriodType, getPeriodRange } from '@/lib/dateFilters';
import { useEntries } from '@/hooks/useEntries';
import { formatCurrency, formatDate, getStatusLabel } from '@/lib/formatters';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useApp } from '@/contexts/AppContext';

export default function ReceitasComparativo() {
  const navigate = useNavigate();
  const [periodType, setPeriodType] = useState<PeriodType>('mes');
  const [customStart, setCustomStart] = useState<Date>();
  const [customEnd, setCustomEnd] = useState<Date>();

  const dateRange: DateRange = useMemo(() => {
    return getPeriodRange(periodType, customStart, customEnd);
  }, [periodType, customStart, customEnd]);

  const { entradas } = useApp();
  const { entradasRecebidas, entradasPrevistas } = useEntries(dateRange);

  const totalPrevisto = [...entradasRecebidas, ...entradasPrevistas].reduce((sum, e) => sum + e.valor_previsto, 0);
  const totalRecebido = entradasRecebidas.reduce((sum, e) => sum + (e.valor_recebido || 0), 0);
  const totalPendente = entradasPrevistas.reduce((sum, e) => sum + e.valor_previsto, 0);
  const percentualRecebido = totalPrevisto > 0 ? (totalRecebido / totalPrevisto) * 100 : 0;

  const chartData = [
    { name: 'Previsto', valor: totalPrevisto },
    { name: 'Recebido', valor: totalRecebido },
    { name: 'Pendente', valor: totalPendente }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/relatorios')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Receitas Previstas vs Recebidas</h1>
          <p className="text-muted-foreground">Comparativo entre valores previstos e realizados</p>
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

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Previsto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatCurrency(totalPrevisto)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Recebido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{formatCurrency(totalRecebido)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {percentualRecebido.toFixed(1)}% do previsto
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pendente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{formatCurrency(totalPendente)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Comparativo Visual</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Bar dataKey="valor" fill="hsl(var(--primary))" name="Valor (R$)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detalhamento de Receitas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Data Prevista</TableHead>
                <TableHead>Data Recebida</TableHead>
                <TableHead className="text-right">Valor Previsto</TableHead>
                <TableHead className="text-right">Valor Recebido</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...entradasRecebidas, ...entradasPrevistas].length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    Nenhuma entrada no período selecionado
                  </TableCell>
                </TableRow>
              ) : (
                [...entradasRecebidas, ...entradasPrevistas]
                  .sort((a, b) => new Date(a.data_prevista).getTime() - new Date(b.data_prevista).getTime())
                  .map((entrada) => (
                    <TableRow key={entrada.id}>
                      <TableCell className="font-medium">{entrada.tipo}</TableCell>
                      <TableCell>{entrada.categoria}</TableCell>
                      <TableCell>{formatDate(entrada.data_prevista)}</TableCell>
                      <TableCell>{entrada.data_recebida ? formatDate(entrada.data_recebida) : '-'}</TableCell>
                      <TableCell className="text-right">{formatCurrency(entrada.valor_previsto)}</TableCell>
                      <TableCell className="text-right font-medium text-success">
                        {entrada.valor_recebido ? formatCurrency(entrada.valor_recebido) : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={entrada.status === 'recebido' ? 'default' : 'secondary'}>
                          {getStatusLabel(entrada.status)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
