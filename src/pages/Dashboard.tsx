import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, FileText, Users, Building2 } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { MetricCard } from '@/components/Dashboard/MetricCard';
import { PeriodFilter } from '@/components/Dashboard/PeriodFilter';
import { useDashboard } from '@/hooks/useDashboard';
import { useEntries } from '@/hooks/useEntries';
import { getPeriodRange, PeriodType, DateRange } from '@/lib/dateFilters';
import { format, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, startOfWeek, endOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--destructive))', 'hsl(var(--accent))'];

export default function Dashboard() {
  const [periodType, setPeriodType] = useState<PeriodType>('mes');
  const [customStart, setCustomStart] = useState<Date>();
  const [customEnd, setCustomEnd] = useState<Date>();

  const dateRange: DateRange = useMemo(() => {
    return getPeriodRange(periodType, customStart, customEnd);
  }, [periodType, customStart, customEnd]);

  const { metrics, contratosPorOperadora } = useDashboard(dateRange);
  const { entradasRecebidas, entradasPrevistas } = useEntries(dateRange);

  // Dados para gráfico de fluxo de caixa dinâmico
  const fluxoCaixaData = useMemo(() => {
    const diffInDays = Math.ceil((dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24));
    
    let intervals: Date[] = [];
    let formatStr = 'dd/MM';
    
    if (diffInDays <= 7) {
      // Últimos 7 dias: mostrar por dia
      intervals = eachDayOfInterval({ start: dateRange.start, end: dateRange.end });
      formatStr = 'dd/MM';
    } else if (diffInDays <= 31) {
      // Até 1 mês: mostrar por semana
      intervals = eachWeekOfInterval({ start: dateRange.start, end: dateRange.end }, { weekStartsOn: 0 });
      formatStr = "'Sem' w";
    } else {
      // Mais de 1 mês: mostrar por mês
      intervals = eachMonthOfInterval({ start: dateRange.start, end: dateRange.end });
      formatStr = 'MMM/yy';
    }

    return intervals.map(date => {
      let intervalStart = date;
      let intervalEnd = date;

      if (diffInDays <= 7) {
        intervalStart = date;
        intervalEnd = date;
      } else if (diffInDays <= 31) {
        intervalStart = startOfWeek(date, { weekStartsOn: 0 });
        intervalEnd = endOfWeek(date, { weekStartsOn: 0 });
      } else {
        intervalStart = new Date(date.getFullYear(), date.getMonth(), 1);
        intervalEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      }

      const entradasInterval = entradasRecebidas.filter(e => {
        if (!e.dataRecebida) return false;
        const d = new Date(e.dataRecebida);
        return d >= intervalStart && d <= intervalEnd;
      });

      const saidasInterval = entradasPrevistas.filter(e => {
        const d = new Date(e.dataPrevista);
        return d >= intervalStart && d <= intervalEnd;
      });

      return {
        periodo: format(date, formatStr, { locale: ptBR }),
        entradas: entradasInterval.reduce((sum, e) => sum + (e.valorRecebido || 0), 0),
        saidas: 0, // Placeholder - would be calculated from saidas
      };
    });
  }, [dateRange, entradasRecebidas, entradasPrevistas]);

  // Dados para gráfico de contratos por operadora
  const contratosPorOperadoraChart = contratosPorOperadora.map(item => ({
    name: item.operadora,
    value: item.quantidade,
  }));

  // Dados para gráfico de ticket médio por operadora
  const ticketMedioPorOperadoraChart = contratosPorOperadora.map(item => ({
    operadora: item.operadora,
    ticketMedio: item.ticketMedio,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral do seu negócio</p>
        </div>
        <PeriodFilter
          value={periodType}
          customStart={customStart}
          customEnd={customEnd}
          onValueChange={setPeriodType}
          onCustomStartChange={setCustomStart}
          onCustomEndChange={setCustomEnd}
        />
      </div>

      {/* Métricas principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Receita do Período"
          value={formatCurrency(metrics.receitaPeriodo)}
          icon={<DollarSign className="h-4 w-4" />}
        />
        
        <MetricCard
          title="Receitas Previstas"
          value={formatCurrency(metrics.receitaPrevista)}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        
        <MetricCard
          title="Despesas do Período"
          value={formatCurrency(metrics.despesasPeriodo)}
          icon={<DollarSign className="h-4 w-4" />}
        />
        
        <MetricCard
          title="Resultado Líquido"
          value={formatCurrency(metrics.resultadoLiquido)}
          icon={<TrendingUp className="h-4 w-4" />}
        />
      </div>

      {/* Métricas de contratos */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Contratos no Período"
          value={metrics.contratosImplantados.toString()}
          icon={<FileText className="h-4 w-4" />}
        />
        
        <MetricCard
          title="Ticket Médio dos Contratos"
          value={formatCurrency(metrics.ticketMedioContratos)}
          icon={<Building2 className="h-4 w-4" />}
        />
        
        <MetricCard
          title="Total de Vidas no Período"
          value={metrics.totalVidasPeriodo.toString()}
          icon={<Users className="h-4 w-4" />}
        />
      </div>

      {/* Gráficos */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Fluxo de Caixa - {periodType === 'mes' ? 'Mês Atual' : periodType === 'semana' ? 'Semana Atual' : 'Período Selecionado'}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={fluxoCaixaData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="periodo" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  formatter={(value) => formatCurrency(Number(value))} 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="entradas" fill="hsl(var(--success))" name="Entradas" radius={[4, 4, 0, 0]} />
                <Bar dataKey="saidas" fill="hsl(var(--destructive))" name="Saídas" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contratos por Operadora</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={contratosPorOperadoraChart}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="hsl(var(--primary))"
                  dataKey="value"
                >
                  {contratosPorOperadoraChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Novo gráfico: Ticket Médio por Operadora */}
      <Card>
        <CardHeader>
          <CardTitle>Ticket Médio por Operadora</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ticketMedioPorOperadoraChart}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="operadora" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip 
                formatter={(value) => formatCurrency(Number(value))} 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="ticketMedio" fill="hsl(var(--primary))" name="Ticket Médio" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Próximos recebimentos */}
      <Card>
        <CardHeader>
          <CardTitle>Próximos Recebimentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {entradasPrevistas.slice(0, 8).map((entrada) => (
              <div key={entrada.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div>
                  <p className="font-medium text-foreground">{entrada.contratoNome || 'Receita Avulsa'}</p>
                  <p className="text-sm text-muted-foreground">
                    {entrada.tipo === 'bancaria' ? 'Comissão Bancária' : entrada.tipo === 'bonificacao' ? 'Bonificação' : entrada.categoria}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">{formatCurrency(entrada.valorPrevisto)}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(entrada.dataPrevista).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
