import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useContratosCRUD } from '@/hooks/useContratosCRUD';
import { useSupervisores } from '@/hooks/useSupervisores';
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

export default function RelatorioSupervisores() {
  const [period, setPeriod] = useState<string>('mes');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedSupervisor, setSelectedSupervisor] = useState<string>('all');

  const { contratos } = useContratosCRUD();
  const { supervisores } = useSupervisores();
  const { despesas } = useDespesasCRUD();

  const dateRange: DateRange = useMemo(() => {
    if (period === 'personalizado' && startDate && endDate) {
      return getPeriodRange('personalizado', startDate, endDate);
    }
    return getPeriodRange(period as any);
  }, [period, startDate, endDate]);

  const filteredData = useMemo(() => {
    const dateFilteredContratos = filterByDateRange(contratos, 'data_implantacao', dateRange);
    
    const supervisorStats = supervisores.map(supervisor => {
      const supervisorContratos = dateFilteredContratos.filter(c => c.supervisor === supervisor.nome);
      const totalContratos = supervisorContratos.length;
      const valorTotal = supervisorContratos.reduce((sum, c) => sum + Number(c.valor_mensalidade), 0);
      const totalVidas = supervisorContratos.reduce((sum, c) => sum + Number(c.quantidade_vidas), 0);
      const ticketMedio = totalContratos > 0 ? valorTotal / totalContratos : 0;
      const mediaVidas = totalContratos > 0 ? totalVidas / totalContratos : 0;

      // Calcular comissões (despesas do supervisor)
      const comissoes = despesas.filter(d => 
        d.fornecedor === supervisor.nome && 
        d.categoria === 'Salários' &&
        filterByDateRange([d], 'data_prevista', dateRange).length > 0
      );
      const totalComissao = comissoes.reduce((sum, d) => sum + Number(d.valor), 0);
      const comissaoPaga = comissoes
        .filter(d => d.status === 'pago')
        .reduce((sum, d) => sum + Number(d.valor), 0);
      const comissaoPrevista = totalComissao - comissaoPaga;

      return {
        nome: supervisor.nome,
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

    if (selectedSupervisor !== 'all') {
      return supervisorStats.filter(s => s.nome === selectedSupervisor);
    }

    return supervisorStats;
  }, [contratos, supervisores, despesas, dateRange, selectedSupervisor]);

  const chartData = filteredData.map(s => ({
    nome: s.nome,
    'Contratos': s.totalContratos,
    'Valor Total': s.valorTotal,
    'Comissão Total': s.totalComissao,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Relatório de Supervisores</h1>
        <p className="text-muted-foreground">Desempenho e comissões por supervisor</p>
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
              <label className="text-sm font-medium">Supervisor</label>
              <Select value={selectedSupervisor} onValueChange={setSelectedSupervisor}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {supervisores.map(s => (
                    <SelectItem key={s.id} value={s.nome}>{s.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Desempenho por Supervisor</CardTitle>
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
          <CardTitle>Detalhamento por Supervisor</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supervisor</TableHead>
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
              {filteredData.map((supervisor) => (
                <TableRow key={supervisor.nome}>
                  <TableCell className="font-medium">{supervisor.nome}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary">{supervisor.totalContratos}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(supervisor.valorTotal)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(supervisor.ticketMedio)}</TableCell>
                  <TableCell className="text-right">{supervisor.totalVidas}</TableCell>
                  <TableCell className="text-right">{supervisor.mediaVidas.toFixed(1)}</TableCell>
                  <TableCell className="text-right text-success">{formatCurrency(supervisor.comissaoPaga)}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{formatCurrency(supervisor.comissaoPrevista)}</TableCell>
                  <TableCell className="text-right font-semibold">{formatCurrency(supervisor.totalComissao)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
