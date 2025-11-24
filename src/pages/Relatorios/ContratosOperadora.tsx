import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PeriodFilter } from '@/components/Dashboard/PeriodFilter';
import { useState, useMemo } from 'react';
import { DateRange, PeriodType, getPeriodRange } from '@/lib/dateFilters';
import { useDashboard } from '@/hooks/useDashboard';
import { formatCurrency } from '@/lib/formatters';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--destructive))', 'hsl(var(--muted))'];

export default function ContratosOperadora() {
  const navigate = useNavigate();
  const [periodType, setPeriodType] = useState<PeriodType>('mes');
  const [customStart, setCustomStart] = useState<Date>();
  const [customEnd, setCustomEnd] = useState<Date>();

  const dateRange: DateRange = useMemo(() => {
    return getPeriodRange(periodType, customStart, customEnd);
  }, [periodType, customStart, customEnd]);

  const { contratosPorOperadora } = useDashboard(dateRange);

  const totalContratos = contratosPorOperadora.reduce((sum, op) => sum + op.quantidade, 0);
  const ticketMedioGeral = contratosPorOperadora.reduce((sum, op) => sum + op.ticketMedio, 0) / (contratosPorOperadora.length || 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/relatorios')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Contratos por Operadora</h1>
          <p className="text-muted-foreground">Distribuição e performance por operadora</p>
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

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Contratos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalContratos}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ticket Médio Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{formatCurrency(ticketMedioGeral)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Contratos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={contratosPorOperadora}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ operadora, percent }) => `${operadora}: ${(percent * 100).toFixed(1)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="quantidade"
                >
                  {contratosPorOperadora.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ticket Médio por Operadora</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={contratosPorOperadora}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="operadora" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Bar dataKey="ticketMedio" fill="hsl(var(--success))" name="Ticket Médio (R$)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalhamento por Operadora</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Operadora</TableHead>
                <TableHead className="text-center">Quantidade de Contratos</TableHead>
                <TableHead className="text-right">Ticket Médio</TableHead>
                <TableHead className="text-right">Receita Total Estimada</TableHead>
                <TableHead className="text-right">% do Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contratosPorOperadora.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Nenhum contrato no período selecionado
                  </TableCell>
                </TableRow>
              ) : (
                contratosPorOperadora
                  .sort((a, b) => b.quantidade - a.quantidade)
                  .map((op, index) => (
                    <TableRow key={op.operadora}>
                      <TableCell className="font-medium flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        {op.operadora}
                      </TableCell>
                      <TableCell className="text-center font-bold">{op.quantidade}</TableCell>
                      <TableCell className="text-right">{formatCurrency(op.ticketMedio)}</TableCell>
                      <TableCell className="text-right font-bold text-success">
                        {formatCurrency(op.ticketMedio * op.quantidade)}
                      </TableCell>
                      <TableCell className="text-right">
                        {totalContratos > 0 ? ((op.quantidade / totalContratos) * 100).toFixed(1) : 0}%
                      </TableCell>
                    </TableRow>
                  ))
              )}
              {contratosPorOperadora.length > 0 && (
                <TableRow className="font-bold bg-muted/50">
                  <TableCell>TOTAL</TableCell>
                  <TableCell className="text-center">{totalContratos}</TableCell>
                  <TableCell className="text-right">{formatCurrency(ticketMedioGeral)}</TableCell>
                  <TableCell className="text-right text-success">
                    {formatCurrency(contratosPorOperadora.reduce((sum, op) => sum + (op.ticketMedio * op.quantidade), 0))}
                  </TableCell>
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
