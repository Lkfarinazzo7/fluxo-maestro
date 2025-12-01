import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useContratosCRUD } from '@/hooks/useContratosCRUD';
import { useVendedores } from '@/hooks/useVendedores';
import { useDespesasCRUD } from '@/hooks/useDespesasCRUD';
import { formatCurrency } from '@/lib/formatters';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { filterByDateRange, DateRange, getPeriodRange } from '@/lib/dateFilters';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export default function RelatorioVendedores() {
  const [period, setPeriod] = useState<string>('mes');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedVendedor, setSelectedVendedor] = useState<string>('all');

  const { contratos } = useContratosCRUD();
  const { vendedores } = useVendedores();
  const { despesas } = useDespesasCRUD();

  const dateRange: DateRange = useMemo(() => {
    if (period === 'personalizado' && startDate && endDate) {
      return getPeriodRange('personalizado', startDate, endDate);
    }
    return getPeriodRange(period as any);
  }, [period, startDate, endDate]);

  const filteredData = useMemo(() => {
    const dateFilteredContratos = filterByDateRange(contratos, 'data_implantacao', dateRange);
    
    const vendedorStats = vendedores.map(vendedor => {
      const vendedorContratos = dateFilteredContratos.filter(c => c.vendedor_responsavel === vendedor.nome);
      const totalContratos = vendedorContratos.length;
      const valorTotal = vendedorContratos.reduce((sum, c) => sum + Number(c.valor_mensalidade), 0);
      const totalVidas = vendedorContratos.reduce((sum, c) => sum + Number(c.quantidade_vidas), 0);
      const ticketMedio = totalContratos > 0 ? valorTotal / totalContratos : 0;
      const mediaVidas = totalContratos > 0 ? totalVidas / totalContratos : 0;

      // Calcular comissões (despesas do vendedor)
      const comissoes = despesas.filter(d => 
        d.fornecedor === vendedor.nome && 
        d.categoria === 'Salários' &&
        filterByDateRange([d], 'data_prevista', dateRange).length > 0
      );
      const totalComissao = comissoes.reduce((sum, d) => sum + Number(d.valor), 0);
      const comissaoPaga = comissoes
        .filter(d => d.status === 'pago')
        .reduce((sum, d) => sum + Number(d.valor), 0);
      const comissaoPrevista = totalComissao - comissaoPaga;

      return {
        nome: vendedor.nome,
        totalContratos,
        valorTotal,
        ticketMedio,
        totalVidas,
        mediaVidas,
        totalComissao,
        comissaoPaga,
        comissaoPrevista,
      };
    });

    if (selectedVendedor !== 'all') {
      return vendedorStats.filter(v => v.nome === selectedVendedor);
    }

    return vendedorStats;
  }, [contratos, vendedores, despesas, dateRange, selectedVendedor]);

  const chartData = filteredData.map(v => ({
    nome: v.nome,
    'Contratos': v.totalContratos,
    'Valor Total': v.valorTotal,
    'Comissão Total': v.totalComissao,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Relatório de Vendedores</h1>
        <p className="text-muted-foreground">Desempenho e comissões por vendedor</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Período</label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hoje">Hoje</SelectItem>
                  <SelectItem value="semana">Esta Semana</SelectItem>
                  <SelectItem value="mes">Este Mês</SelectItem>
                  <SelectItem value="7dias">Últimos 7 Dias</SelectItem>
                  <SelectItem value="30dias">Últimos 30 Dias</SelectItem>
                  <SelectItem value="personalizado">Período Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {period === 'personalizado' && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Data Inicial</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "dd/MM/yyyy", { locale: ptBR }) : "Selecione"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus className="pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Data Final</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "dd/MM/yyyy", { locale: ptBR }) : "Selecione"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus className="pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Vendedor</label>
              <Select value={selectedVendedor} onValueChange={setSelectedVendedor}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {vendedores.map(v => (
                    <SelectItem key={v.id} value={v.nome}>{v.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Desempenho por Vendedor</CardTitle>
          <CardDescription>Visão comparativa de contratos e comissões</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nome" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Bar dataKey="Contratos" fill="hsl(var(--primary))" />
              <Bar dataKey="Comissão Total" fill="hsl(var(--success))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detalhamento por Vendedor</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendedor</TableHead>
                <TableHead className="text-right">Contratos</TableHead>
                <TableHead className="text-right">Valor Total</TableHead>
                <TableHead className="text-right">Ticket Médio</TableHead>
                <TableHead className="text-right">Vidas</TableHead>
                <TableHead className="text-right">Média Vidas</TableHead>
                <TableHead className="text-right">Comissão Paga</TableHead>
                <TableHead className="text-right">Comissão Prevista</TableHead>
                <TableHead className="text-right">Comissão Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((vendedor) => (
                <TableRow key={vendedor.nome}>
                  <TableCell className="font-medium">{vendedor.nome}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary">{vendedor.totalContratos}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(vendedor.valorTotal)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(vendedor.ticketMedio)}</TableCell>
                  <TableCell className="text-right">{vendedor.totalVidas}</TableCell>
                  <TableCell className="text-right">{vendedor.mediaVidas.toFixed(1)}</TableCell>
                  <TableCell className="text-right text-success">{formatCurrency(vendedor.comissaoPaga)}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{formatCurrency(vendedor.comissaoPrevista)}</TableCell>
                  <TableCell className="text-right font-semibold">{formatCurrency(vendedor.totalComissao)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
