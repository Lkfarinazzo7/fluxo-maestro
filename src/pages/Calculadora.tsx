import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/formatters';
import { Calculator, TrendingUp, Target, Users, CheckCircle, DollarSign } from 'lucide-react';

export default function Calculadora() {
  // Estado para Calculadora Financeira (CAC, CPO, ROI)
  const [gastoTotal, setGastoTotal] = useState<number>(0);
  const [oportunidades, setOportunidades] = useState<number>(0);
  const [clientesFechados, setClientesFechados] = useState<number>(0);
  const [retornoFinanceiro, setRetornoFinanceiro] = useState<number>(0);

  // Cálculos da Calculadora Financeira
  const cpo = oportunidades > 0 ? gastoTotal / oportunidades : 0;
  const cac = clientesFechados > 0 ? gastoTotal / clientesFechados : 0;
  const roi = gastoTotal > 0 ? ((retornoFinanceiro - gastoTotal) / gastoTotal) * 100 : 0;
  const roiAbsoluto = retornoFinanceiro - gastoTotal;

  // Estado para Métricas de Funil
  const [leadsGerados, setLeadsGerados] = useState<number>(0);
  const [oportunidadesFunil, setOportunidadesFunil] = useState<number>(0);
  const [reunioesRealizadas, setReunioes] = useState<number>(0);
  const [contratosFechados, setContratosFechados] = useState<number>(0);
  const [valorTotalContratos, setValorTotalContratos] = useState<number>(0);

  // Cálculos do Funil
  const ticketMedio = contratosFechados > 0 ? valorTotalContratos / contratosFechados : 0;
  const convLeadsOportunidades = leadsGerados > 0 ? (oportunidadesFunil / leadsGerados) * 100 : 0;
  const convOportunidadesReunioes = oportunidadesFunil > 0 ? (reunioesRealizadas / oportunidadesFunil) * 100 : 0;
  const convReunioesContratos = reunioesRealizadas > 0 ? (contratosFechados / reunioesRealizadas) * 100 : 0;
  const convLeadsContratos = leadsGerados > 0 ? (contratosFechados / leadsGerados) * 100 : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Calculadora de Métricas</h1>
        <p className="text-muted-foreground">Análise de CAC, CPO, ROI e Funil de Vendas</p>
      </div>

      {/* Calculadora Financeira (CAC, CPO, ROI) */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            <CardTitle>Calculadora Financeira (CAC, CPO, ROI)</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Inputs */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="gasto">Gasto Total (R$)</Label>
                <Input
                  id="gasto"
                  type="number"
                  min="0"
                  step="0.01"
                  value={gastoTotal || ''}
                  onChange={(e) => setGastoTotal(parseFloat(e.target.value) || 0)}
                  placeholder="Ex: 1000.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="oportunidades">Número de Oportunidades</Label>
                <Input
                  id="oportunidades"
                  type="number"
                  min="0"
                  value={oportunidades || ''}
                  onChange={(e) => setOportunidades(parseInt(e.target.value) || 0)}
                  placeholder="Ex: 25"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientes">Clientes Adquiridos</Label>
                <Input
                  id="clientes"
                  type="number"
                  min="0"
                  value={clientesFechados || ''}
                  onChange={(e) => setClientesFechados(parseInt(e.target.value) || 0)}
                  placeholder="Ex: 5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="retorno">Retorno Financeiro (R$)</Label>
                <Input
                  id="retorno"
                  type="number"
                  min="0"
                  step="0.01"
                  value={retornoFinanceiro || ''}
                  onChange={(e) => setRetornoFinanceiro(parseFloat(e.target.value) || 0)}
                  placeholder="Ex: 3500.00"
                />
              </div>
            </div>

            {/* Resultados */}
            <div className="space-y-3">
              <div className="p-4 bg-primary/10 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">CPO (Custo por Oportunidade)</span>
                </div>
                <div className="text-2xl font-bold text-primary">{formatCurrency(cpo)}</div>
              </div>

              <div className="p-4 bg-warning/10 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-warning" />
                  <span className="text-sm font-medium text-muted-foreground">CAC (Custo de Aquisição)</span>
                </div>
                <div className="text-2xl font-bold text-warning">{formatCurrency(cac)}</div>
              </div>

              <div className={`p-4 rounded-lg ${roi >= 0 ? 'bg-success/10' : 'bg-destructive/10'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className={`h-5 w-5 ${roi >= 0 ? 'text-success' : 'text-destructive'}`} />
                  <span className="text-sm font-medium text-muted-foreground">ROI (Retorno sobre Investimento)</span>
                </div>
                <div className={`text-2xl font-bold ${roi >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {roi.toFixed(2)}%
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {roi >= 0 ? 'Lucro' : 'Prejuízo'}: {formatCurrency(roiAbsoluto)}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Métricas de Funil */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-success" />
            <CardTitle>Métricas de Funil de Vendas</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Inputs do Funil */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="leads">Leads Gerados</Label>
                <Input
                  id="leads"
                  type="number"
                  min="0"
                  value={leadsGerados || ''}
                  onChange={(e) => setLeadsGerados(parseInt(e.target.value) || 0)}
                  placeholder="Ex: 250"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="oportunidades-funil">Oportunidades</Label>
                <Input
                  id="oportunidades-funil"
                  type="number"
                  min="0"
                  value={oportunidadesFunil || ''}
                  onChange={(e) => setOportunidadesFunil(parseInt(e.target.value) || 0)}
                  placeholder="Ex: 25"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reunioes">Reuniões Realizadas</Label>
                <Input
                  id="reunioes"
                  type="number"
                  min="0"
                  value={reunioesRealizadas || ''}
                  onChange={(e) => setReunioes(parseInt(e.target.value) || 0)}
                  placeholder="Ex: 20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contratos">Contratos Fechados</Label>
                <Input
                  id="contratos"
                  type="number"
                  min="0"
                  value={contratosFechados || ''}
                  onChange={(e) => setContratosFechados(parseInt(e.target.value) || 0)}
                  placeholder="Ex: 5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="valor-contratos">Valor Total dos Contratos (R$)</Label>
                <Input
                  id="valor-contratos"
                  type="number"
                  min="0"
                  step="0.01"
                  value={valorTotalContratos || ''}
                  onChange={(e) => setValorTotalContratos(parseFloat(e.target.value) || 0)}
                  placeholder="Ex: 15000.00"
                />
              </div>
            </div>

            {/* Resultados do Funil */}
            <div className="space-y-4">
              {/* Ticket Médio */}
              <div className="p-4 bg-success/10 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="text-sm font-medium text-muted-foreground">Ticket Médio</span>
                </div>
                <div className="text-2xl font-bold text-success">{formatCurrency(ticketMedio)}</div>
              </div>

              {/* Funil Visual */}
              <div className="space-y-3 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-3">Taxas de Conversão</h4>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Leads → Oportunidades</span>
                    <span className="font-bold text-primary">{convLeadsOportunidades.toFixed(2)}%</span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(convLeadsOportunidades, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Oportunidades → Reuniões</span>
                    <span className="font-bold text-primary">{convOportunidadesReunioes.toFixed(2)}%</span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(convOportunidadesReunioes, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Reuniões → Contratos</span>
                    <span className="font-bold text-success">{convReunioesContratos.toFixed(2)}%</span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2">
                    <div
                      className="bg-success h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(convReunioesContratos, 100)}%` }}
                    />
                  </div>
                </div>

                <Separator className="my-3" />

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Conversão Geral (Leads → Contratos)</span>
                    <span className="font-bold text-success text-lg">{convLeadsContratos.toFixed(2)}%</span>
                  </div>
                  <div className="w-full bg-background rounded-full h-3">
                    <div
                      className="bg-success h-3 rounded-full transition-all"
                      style={{ width: `${Math.min(convLeadsContratos, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}