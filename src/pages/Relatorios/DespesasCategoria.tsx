import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PeriodFilter } from '@/components/Dashboard/PeriodFilter';
import { useState, useMemo } from 'react';
import { DateRange, PeriodType, getPeriodRange } from '@/lib/dateFilters';
import { useExpenses } from '@/hooks/useExpenses';
import { formatCurrency } from '@/lib/formatters';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['hsl(var(--destructive))', 'hsl(var(--warning))', 'hsl(var(--primary))', 'hsl(var(--success))', 'hsl(var(--muted))'];

export default function DespesasCategoria() {
  const navigate = useNavigate();
  const [periodType, setPeriodType] = useState<PeriodType>('mes');
  const [customStart, setCustomStart] = useState<Date>();
  const [customEnd, setCustomEnd] = useState<Date>();

  const dateRange: DateRange = useMemo(() => {
    return getPeriodRange(periodType, customStart, customEnd);
  }, [periodType, customStart, customEnd]);

  const { saidasPagas, porCategoria } = useExpenses(dateRange);

  const totalDespesas = saidasPagas.reduce((sum, s) => sum + s.valor, 0);

  const chartData = porCategoria.map(cat => ({
    name: cat.categoria,
    value: cat.total,
    quantidade: cat.quantidade
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/relatorios')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Despesas por Categoria</h1>
          <p className="text-muted-foreground">Análise de gastos por categoria de despesa</p>
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

      <Card>
        <CardHeader>
          <CardTitle>Total de Despesas: {formatCurrency(totalDespesas)}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detalhamento por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-center">Quantidade</TableHead>
                <TableHead className="text-right">Valor Total</TableHead>
                <TableHead className="text-right">Média por Despesa</TableHead>
                <TableHead className="text-right">% do Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {porCategoria.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Nenhuma despesa no período selecionado
                  </TableCell>
                </TableRow>
              ) : (
                porCategoria.map((cat, index) => (
                  <TableRow key={cat.categoria}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      {cat.categoria}
                    </TableCell>
                    <TableCell className="text-center">{cat.quantidade}</TableCell>
                    <TableCell className="text-right font-bold text-destructive">
                      {formatCurrency(cat.total)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(cat.total / cat.quantidade)}
                    </TableCell>
                    <TableCell className="text-right">
                      {totalDespesas > 0 ? ((cat.total / totalDespesas) * 100).toFixed(1) : 0}%
                    </TableCell>
                  </TableRow>
                ))
              )}
              {porCategoria.length > 0 && (
                <TableRow className="font-bold bg-muted/50">
                  <TableCell>TOTAL</TableCell>
                  <TableCell className="text-center">
                    {porCategoria.reduce((sum, cat) => sum + cat.quantidade, 0)}
                  </TableCell>
                  <TableCell className="text-right text-destructive">
                    {formatCurrency(totalDespesas)}
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-right">100%</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
