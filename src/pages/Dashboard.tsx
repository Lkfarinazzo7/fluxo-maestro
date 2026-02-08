import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown, FileText, Users, Building2, Wallet, Calculator, Percent } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { MetricCard } from '@/components/Dashboard/MetricCard';
import { PeriodFilter } from '@/components/Dashboard/PeriodFilter';
import { useDashboardData } from '@/hooks/useDashboardData';
import { getPeriodRange, PeriodType, DateRange } from '@/lib/dateFilters';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from 'recharts';
import { differenceInDays, differenceInMonths } from 'date-fns';

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
    proximosRecebimentos, 
    proximasDespesas,
    fluxoCaixaData,
    pfVsPjData,
    isLoading 
  } = useDashboardData(dateRange);

  // Determinar granularidade do gráfico baseado no período
  const getGranularity = () => {
    const days = differenceInDays(dateRange.end, dateRange.start);
    if (days <= 7) return 'day';
    if (days <= 31) return 'day';
    return 'month';
  };

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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
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

        <MetricCard
          title="Proporção Média"
          value={`${metrics.proporcaoMediaContrato.toFixed(2)}x`}
          icon={<Percent className="h-4 w-4" />}
        />
      </div>

      {/* Gráficos */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Fluxo de Caixa melhorado */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Fluxo de Caixa</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={fluxoCaixaData}>
                <defs>
                  <linearGradient id="colorEntradas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorSaidas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
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
                <Area 
                  type="monotone" 
                  dataKey="entradas" 
                  stroke="hsl(var(--success))" 
                  fillOpacity={1} 
                  fill="url(#colorEntradas)" 
                  name="Recebido"
                />
                <Area 
                  type="monotone" 
                  dataKey="saidas" 
                  stroke="hsl(var(--destructive))" 
                  fillOpacity={1} 
                  fill="url(#colorSaidas)" 
                  name="Pago"
                />
                <Line 
                  type="monotone" 
                  dataKey="saldoAcumulado" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                  name="Saldo Acumulado"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* PF vs PJ */}
        <Card>
          <CardHeader>
            <CardTitle>Contratos PF vs PJ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Por Quantidade</p>
                  <div className="flex items-center gap-2">
                    <div className="w-full h-4 bg-muted rounded-full overflow-hidden flex">
                      <div 
                        className="h-full bg-primary transition-all"
                        style={{ width: `${pfVsPjData.percentualQuantidadePJ}%` }}
                      />
                      <div 
                        className="h-full bg-secondary transition-all"
                        style={{ width: `${pfVsPjData.percentualQuantidadePF}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-primary">PJ: {pfVsPjData.quantidadePJ} ({pfVsPjData.percentualQuantidadePJ.toFixed(1)}%)</span>
                    <span className="text-muted-foreground">PF: {pfVsPjData.quantidadePF} ({pfVsPjData.percentualQuantidadePF.toFixed(1)}%)</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Por Valor</p>
                  <div className="flex items-center gap-2">
                    <div className="w-full h-4 bg-muted rounded-full overflow-hidden flex">
                      <div 
                        className="h-full bg-success transition-all"
                        style={{ width: `${pfVsPjData.percentualValorPJ}%` }}
                      />
                      <div 
                        className="h-full bg-warning transition-all"
                        style={{ width: `${pfVsPjData.percentualValorPF}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-success">PJ: {formatCurrency(pfVsPjData.valorTotalPJ)} ({pfVsPjData.percentualValorPJ.toFixed(1)}%)</span>
                    <span className="text-warning">PF: {formatCurrency(pfVsPjData.valorTotalPF)} ({pfVsPjData.percentualValorPF.toFixed(1)}%)</span>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart 
                  data={[
                    { tipo: 'Quantidade', PJ: pfVsPjData.quantidadePJ, PF: pfVsPjData.quantidadePF },
                    { tipo: 'Valor (mil)', PJ: pfVsPjData.valorTotalPJ / 1000, PF: pfVsPjData.valorTotalPF / 1000 },
                  ]}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" className="text-xs" />
                  <YAxis dataKey="tipo" type="category" className="text-xs" width={80} />
                  <Tooltip 
                    formatter={(value, name, props) => {
                      if (props.dataKey === 'PJ' || props.dataKey === 'PF') {
                        if (props.payload.tipo === 'Valor (mil)') {
                          return formatCurrency(Number(value) * 1000);
                        }
                        return value;
                      }
                      return value;
                    }}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="PJ" stackId="a" fill="hsl(var(--primary))" name="PJ" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="PF" stackId="a" fill="hsl(var(--muted-foreground))" name="PF" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Resumo financeiro do período */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo do Período</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart 
                data={[
                  { nome: 'Receitas', realizado: metrics.receitaPeriodo, previsto: metrics.receitaPrevista },
                  { nome: 'Despesas', realizado: metrics.despesasPeriodo, previsto: metrics.despesasPrevistas },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="nome" className="text-xs" />
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
                <Bar dataKey="realizado" fill="hsl(var(--success))" name="Realizado" radius={[4, 4, 0, 0]} />
                <Bar dataKey="previsto" fill="hsl(var(--warning))" name="Previsto" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

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