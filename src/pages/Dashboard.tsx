import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown, FileText, Users, Building2, Wallet, Calculator } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { MetricCard } from '@/components/Dashboard/MetricCard';
import { PeriodFilter } from '@/components/Dashboard/PeriodFilter';
import { useDashboardData } from '@/hooks/useDashboardData';
import { getPeriodRange, PeriodType, DateRange } from '@/lib/dateFilters';
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

  const { 
    metrics, 
    contratosPorOperadora, 
    proximosRecebimentos, 
    proximasDespesas,
    fluxoCaixaData,
    isLoading 
  } = useDashboardData(dateRange);

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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Carregando dados...</p>
        </div>
      </div>
    );
  }

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

      {/* Métricas financeiras principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <MetricCard
          title="Receita do Período"
          value={formatCurrency(metrics.receitaPeriodo)}
          icon={<DollarSign className="h-4 w-4" />}
        />
        
        <MetricCard
          title="Receita Prevista"
          value={formatCurrency(metrics.receitaPrevista)}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        
        <MetricCard
          title="Despesas do Período"
          value={formatCurrency(metrics.despesasPeriodo)}
          icon={<TrendingDown className="h-4 w-4" />}
        />

        <MetricCard
          title="Despesas Previstas"
          value={formatCurrency(metrics.despesasPrevistas)}
          icon={<Wallet className="h-4 w-4" />}
        />
        
        <MetricCard
          title="Resultado Líquido"
          value={formatCurrency(metrics.resultadoLiquido)}
          icon={<Calculator className="h-4 w-4" />}
        />
      </div>

      {/* Métricas de contratos */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <MetricCard
          title="Contratos no Período"
          value={metrics.contratosNoPeriodo.toString()}
          icon={<FileText className="h-4 w-4" />}
        />
        
        <MetricCard
          title="Valor Total Contratos"
          value={formatCurrency(metrics.valorTotalContratos)}
          icon={<DollarSign className="h-4 w-4" />}
        />

        <MetricCard
          title="Ticket Médio"
          value={formatCurrency(metrics.ticketMedioContratos)}
          icon={<Building2 className="h-4 w-4" />}
        />
        
        <MetricCard
          title="Total de Vidas"
          value={metrics.totalVidas.toString()}
          icon={<Users className="h-4 w-4" />}
        />

        <MetricCard
          title="Média de Vidas/Contrato"
          value={metrics.mediaVidasPorContrato.toFixed(1)}
          icon={<Users className="h-4 w-4" />}
        />
      </div>

      {/* Gráficos */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Fluxo de Caixa</CardTitle>
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
            {contratosPorOperadoraChart.length > 0 ? (
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
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                Nenhum contrato no período
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Ticket Médio por Operadora */}
      {ticketMedioPorOperadoraChart.length > 0 && (
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
      )}

      {/* Próximos recebimentos e despesas */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Próximos Recebimentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {proximosRecebimentos.length > 0 ? (
                proximosRecebimentos.map((entrada) => (
                  <div key={entrada.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div>
                      <p className="font-medium text-foreground">{entrada.contrato_nome || 'Receita Avulsa'}</p>
                      <p className="text-sm text-muted-foreground">
                        {entrada.tipo === 'bancaria' ? 'Comissão Bancária' : entrada.tipo === 'bonificacao' ? 'Bonificação' : entrada.categoria}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-success">{formatCurrency(entrada.valor_previsto)}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(entrada.data_prevista).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-8">Nenhum recebimento previsto</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximas Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {proximasDespesas.length > 0 ? (
                proximasDespesas.map((saida) => (
                  <div key={saida.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div>
                      <p className="font-medium text-foreground">{saida.nome}</p>
                      <p className="text-sm text-muted-foreground">{saida.categoria}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-destructive">{formatCurrency(saida.valor)}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(saida.data_prevista).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-8">Nenhuma despesa prevista</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
