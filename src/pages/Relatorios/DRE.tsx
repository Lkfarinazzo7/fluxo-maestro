import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PeriodFilter } from '@/components/Dashboard/PeriodFilter';
import { useState, useMemo } from 'react';
import { DateRange, PeriodType, getPeriodRange } from '@/lib/dateFilters';
import { useEntries } from '@/hooks/useEntries';
import { useExpenses } from '@/hooks/useExpenses';
import { formatCurrency } from '@/lib/formatters';
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Target, Percent } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function DRE() {
  const navigate = useNavigate();
  const [periodType, setPeriodType] = useState<PeriodType>('mes');
  const [customStart, setCustomStart] = useState<Date>();
  const [customEnd, setCustomEnd] = useState<Date>();
  const [percentualImpostos, setPercentualImpostos] = useState<number>(0);

  const dateRange: DateRange = useMemo(() => {
    return getPeriodRange(periodType, customStart, customEnd);
  }, [periodType, customStart, customEnd]);

  const { entradasRecebidas } = useEntries(dateRange);
  const { saidasPagas } = useExpenses(dateRange);

  const receitaBruta = entradasRecebidas.reduce((sum, e) => sum + (e.valor_recebido || 0), 0);
  
  // Separar despesas variáveis (incluindo comissões) e fixas
  const despesasVariaveis = saidasPagas.filter(s => s.tipo === 'variavel');
  const despesasFixas = saidasPagas.filter(s => s.tipo === 'fixa');
  
  const totalDespesasVariaveis = despesasVariaveis.reduce((sum, s) => sum + s.valor, 0);
  const totalDespesasFixas = despesasFixas.reduce((sum, s) => sum + s.valor, 0);
  
  // Margem de Contribuição
  const margemContribuicao = receitaBruta - totalDespesasVariaveis;
  const margemContribuicaoPercentual = receitaBruta > 0 ? (margemContribuicao / receitaBruta) * 100 : 0;
  
  // Impostos
  const impostos = (receitaBruta * percentualImpostos) / 100;
  
  // Resultado Líquido
  const resultadoLiquido = margemContribuicao - totalDespesasFixas - impostos;
  const margemLiquida = receitaBruta > 0 ? (resultadoLiquido / receitaBruta) * 100 : 0;
  
  // Break-even (Ponto de Equilíbrio)
  const breakEvenFaturamento = margemContribuicaoPercentual > 0 
    ? (totalDespesasFixas + impostos) / (margemContribuicaoPercentual / 100)
    : 0;

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

      <div className="flex items-center gap-4">
        <PeriodFilter 
          value={periodType} 
          customStart={customStart}
          customEnd={customEnd}
          onValueChange={setPeriodType}
          onCustomStartChange={setCustomStart}
          onCustomEndChange={setCustomEnd}
        />
        <Card className="flex-1">
          <CardContent className="flex items-center gap-3 py-3">
            <Label htmlFor="impostos" className="text-sm font-medium whitespace-nowrap">
              % Impostos:
            </Label>
            <Input
              id="impostos"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={percentualImpostos}
              onChange={(e) => setPercentualImpostos(parseFloat(e.target.value) || 0)}
              className="w-24"
            />
            <span className="text-sm text-muted-foreground">
              = {formatCurrency(impostos)}
            </span>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Coluna 1: DRE Detalhado */}
        <Card>
          <CardHeader>
            <CardTitle>Demonstrativo de Resultado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Receita Bruta */}
            <div className="flex items-center justify-between p-4 bg-success/10 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-success" />
                <span className="font-medium">Receita Bruta</span>
              </div>
              <span className="text-xl font-bold text-success">{formatCurrency(receitaBruta)}</span>
            </div>

            {/* Custos Variáveis */}
            <div className="flex items-center justify-between text-sm px-2">
              <span className="text-muted-foreground">(-) Custos Variáveis</span>
              <span className="font-medium text-destructive">{formatCurrency(totalDespesasVariaveis)}</span>
            </div>

            <Separator />

            {/* Margem de Contribuição */}
            <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <span className="font-medium">Margem de Contribuição</span>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-primary">{formatCurrency(margemContribuicao)}</div>
                <div className="text-sm text-muted-foreground">{margemContribuicaoPercentual.toFixed(2)}%</div>
              </div>
            </div>

            {/* Despesas Fixas */}
            <div className="flex items-center justify-between text-sm px-2">
              <span className="text-muted-foreground">(-) Despesas Fixas</span>
              <span className="font-medium text-destructive">{formatCurrency(totalDespesasFixas)}</span>
            </div>

            {/* Impostos */}
            <div className="flex items-center justify-between text-sm px-2">
              <span className="text-muted-foreground">(-) Impostos ({percentualImpostos}%)</span>
              <span className="font-medium text-destructive">{formatCurrency(impostos)}</span>
            </div>

            <Separator />

            {/* Resultado Líquido */}
            <div className={`flex items-center justify-between p-4 rounded-lg ${resultadoLiquido >= 0 ? 'bg-success/10' : 'bg-destructive/10'}`}>
              <div className="flex items-center gap-2">
                <DollarSign className={`h-5 w-5 ${resultadoLiquido >= 0 ? 'text-success' : 'text-destructive'}`} />
                <span className="font-medium">Resultado Líquido</span>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${resultadoLiquido >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {formatCurrency(resultadoLiquido)}
                </div>
                <div className={`text-sm ${margemLiquida >= 0 ? 'text-success' : 'text-destructive'}`}>
                  Margem: {margemLiquida.toFixed(2)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Coluna 2: Indicadores e Break-even */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ponto de Equilíbrio (Break-even)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-warning/10 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Percent className="h-5 w-5 text-warning" />
                  <span className="text-sm font-medium text-muted-foreground">Faturamento Necessário</span>
                </div>
                <div className="text-2xl font-bold text-warning">{formatCurrency(breakEvenFaturamento)}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  Faturamento mínimo necessário para cobrir todas as despesas fixas e impostos
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Custos Variáveis</div>
                  <div className="text-lg font-bold text-destructive">{formatCurrency(totalDespesasVariaveis)}</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Despesas Fixas</div>
                  <div className="text-lg font-bold text-destructive">{formatCurrency(totalDespesasFixas)}</div>
                </div>
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
                  <span className="text-sm font-medium">Custos Variáveis</span>
                  <span className="text-sm text-muted-foreground">
                    {receitaBruta > 0 ? ((totalDespesasVariaveis / receitaBruta) * 100).toFixed(1) : 0}% da receita
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className="bg-warning h-3 rounded-full transition-all"
                    style={{ width: receitaBruta > 0 ? `${Math.min((totalDespesasVariaveis / receitaBruta) * 100, 100)}%` : '0%' }}
                  />
                </div>
                <div className="text-right mt-1">
                  <span className="text-lg font-bold text-warning">{formatCurrency(totalDespesasVariaveis)}</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Despesas Fixas</span>
                  <span className="text-sm text-muted-foreground">
                    {receitaBruta > 0 ? ((totalDespesasFixas / receitaBruta) * 100).toFixed(1) : 0}% da receita
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className="bg-destructive h-3 rounded-full transition-all"
                    style={{ width: receitaBruta > 0 ? `${Math.min((totalDespesasFixas / receitaBruta) * 100, 100)}%` : '0%' }}
                  />
                </div>
                <div className="text-right mt-1">
                  <span className="text-lg font-bold text-destructive">{formatCurrency(totalDespesasFixas)}</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                <h4 className="font-medium">Indicadores Chave</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Margem Contrib.</div>
                    <div className="text-lg font-bold text-primary">
                      {margemContribuicaoPercentual.toFixed(1)}%
                    </div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Margem Líquida</div>
                    <div className={`text-lg font-bold ${margemLiquida >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {margemLiquida.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}