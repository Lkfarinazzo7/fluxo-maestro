import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PeriodFilter } from '@/components/Dashboard/PeriodFilter';
import { useState, useMemo } from 'react';
import { DateRange, PeriodType, getPeriodRange } from '@/lib/dateFilters';
import { useEntries } from '@/hooks/useEntries';
import { useExpenses } from '@/hooks/useExpenses';
import { formatCurrency } from '@/lib/formatters';
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function DRE() {
  const navigate = useNavigate();
  const [periodType, setPeriodType] = useState<PeriodType>('mes');
  const [customStart, setCustomStart] = useState<Date>();
  const [customEnd, setCustomEnd] = useState<Date>();

  const dateRange: DateRange = useMemo(() => {
    return getPeriodRange(periodType, customStart, customEnd);
  }, [periodType, customStart, customEnd]);

  const { entradasRecebidas } = useEntries(dateRange);
  const { saidasPagas } = useExpenses(dateRange);

  const receitaBruta = entradasRecebidas.reduce((sum, e) => sum + (e.valorRecebido || 0), 0);
  const despesasFixas = saidasPagas.filter(s => s.categoria.toLowerCase().includes('fixa'));
  const despesasVariaveis = saidasPagas.filter(s => !s.categoria.toLowerCase().includes('fixa'));
  const totalDespesasFixas = despesasFixas.reduce((sum, s) => sum + s.valor, 0);
  const totalDespesasVariaveis = despesasVariaveis.reduce((sum, s) => sum + s.valor, 0);
  const totalDespesas = totalDespesasFixas + totalDespesasVariaveis;
  const resultadoLiquido = receitaBruta - totalDespesas;
  const margemLiquida = receitaBruta > 0 ? (resultadoLiquido / receitaBruta) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/relatorios')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">DRE Simplificado</h1>
          <p className="text-muted-foreground">Demonstração do Resultado do Exercício</p>
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

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Resumo Financeiro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-success/10 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-success" />
                <span className="font-medium">Receita Bruta</span>
              </div>
              <span className="text-xl font-bold text-success">{formatCurrency(receitaBruta)}</span>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">(-) Despesas Fixas</span>
                <span className="font-medium text-destructive">{formatCurrency(totalDespesasFixas)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">(-) Despesas Variáveis</span>
                <span className="font-medium text-destructive">{formatCurrency(totalDespesasVariaveis)}</span>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-destructive" />
                <span className="font-medium">Total de Despesas</span>
              </div>
              <span className="text-xl font-bold text-destructive">{formatCurrency(totalDespesas)}</span>
            </div>

            <Separator />

            <div className={`flex items-center justify-between p-4 rounded-lg ${resultadoLiquido >= 0 ? 'bg-success/10' : 'bg-destructive/10'}`}>
              <div className="flex items-center gap-2">
                <DollarSign className={`h-5 w-5 ${resultadoLiquido >= 0 ? 'text-success' : 'text-destructive'}`} />
                <span className="font-medium">Resultado Líquido</span>
              </div>
              <span className={`text-2xl font-bold ${resultadoLiquido >= 0 ? 'text-success' : 'text-destructive'}`}>
                {formatCurrency(resultadoLiquido)}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-sm text-muted-foreground">Margem Líquida</span>
              <span className={`text-lg font-bold ${margemLiquida >= 0 ? 'text-success' : 'text-destructive'}`}>
                {margemLiquida.toFixed(2)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Despesas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Despesas Fixas</span>
                <span className="text-sm text-muted-foreground">
                  {totalDespesas > 0 ? ((totalDespesasFixas / totalDespesas) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className="bg-destructive h-3 rounded-full transition-all"
                  style={{ width: totalDespesas > 0 ? `${(totalDespesasFixas / totalDespesas) * 100}%` : '0%' }}
                />
              </div>
              <div className="text-right mt-1">
                <span className="text-lg font-bold text-destructive">{formatCurrency(totalDespesasFixas)}</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Despesas Variáveis</span>
                <span className="text-sm text-muted-foreground">
                  {totalDespesas > 0 ? ((totalDespesasVariaveis / totalDespesas) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className="bg-warning h-3 rounded-full transition-all"
                  style={{ width: totalDespesas > 0 ? `${(totalDespesasVariaveis / totalDespesas) * 100}%` : '0%' }}
                />
              </div>
              <div className="text-right mt-1">
                <span className="text-lg font-bold text-warning">{formatCurrency(totalDespesasVariaveis)}</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-3">
              <h4 className="font-medium">Indicadores</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Despesas/Receita</div>
                  <div className="text-lg font-bold">
                    {receitaBruta > 0 ? ((totalDespesas / receitaBruta) * 100).toFixed(1) : 0}%
                  </div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Fixas/Variáveis</div>
                  <div className="text-lg font-bold">
                    {totalDespesasVariaveis > 0 ? (totalDespesasFixas / totalDespesasVariaveis).toFixed(2) : '∞'}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
