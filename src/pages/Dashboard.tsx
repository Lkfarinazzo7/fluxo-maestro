import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, FileText, Award, Users } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { MetricCard } from '@/components/Dashboard/MetricCard';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function Dashboard() {
  const { contratos, entradas, saidas } = useApp();

  // Cálculos de métricas
  const contratosAtivos = contratos.filter(c => c.status === 'ativo');
  
  const entradasRecebidas = entradas.filter(e => e.status === 'recebido');
  const entradasPrevistas = entradas.filter(e => e.status === 'previsto');
  
  const receitaMes = entradasRecebidas.reduce((sum, e) => sum + (e.valorRecebido || 0), 0);
  const receitasPrevistas = entradasPrevistas.reduce((sum, e) => sum + e.valorPrevisto, 0);
  
  const saidasPagas = saidas.filter(s => s.status === 'pago');
  const despesasMes = saidasPagas.reduce((sum, s) => sum + s.valor, 0);
  
  const resultadoLiquido = receitaMes - despesasMes;
  
  const ticketMedioContratos = contratosAtivos.length > 0
    ? contratosAtivos.reduce((sum, c) => sum + c.valorMensalidade, 0) / contratosAtivos.length
    : 0;
  
  const bonificacaoRecebida = entradasRecebidas
    .filter(e => e.tipo === 'bonificacao')
    .reduce((sum, e) => sum + (e.valorRecebido || 0), 0);
  
  const bonificacaoPendente = entradasPrevistas
    .filter(e => e.tipo === 'bonificacao')
    .reduce((sum, e) => sum + e.valorPrevisto, 0);

  // Dados para gráfico de fluxo de caixa (últimos 6 meses)
  const fluxoCaixaData = [
    { mes: 'Jul', entradas: 45000, saidas: 12000 },
    { mes: 'Ago', entradas: 52000, saidas: 13500 },
    { mes: 'Set', entradas: 48000, saidas: 12800 },
    { mes: 'Out', entradas: 58000, saidas: 14200 },
    { mes: 'Nov', entradas: 61000, saidas: 13900 },
    { mes: 'Dez', entradas: receitaMes, saidas: despesasMes },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do seu negócio</p>
      </div>

      {/* Métricas principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <MetricCard
          title="Receita do Mês"
          value={formatCurrency(receitaMes)}
          icon={<DollarSign className="h-4 w-4" />}
        />
        
        <MetricCard
          title="Receitas Previstas"
          value={formatCurrency(receitasPrevistas)}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        
        <MetricCard
          title="Despesas do Mês"
          value={formatCurrency(despesasMes)}
          icon={<DollarSign className="h-4 w-4" />}
        />
        
        <MetricCard
          title="Resultado Líquido"
          value={formatCurrency(resultadoLiquido)}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        
        <MetricCard
          title="Contratos Ativos"
          value={contratosAtivos.length.toString()}
          icon={<FileText className="h-4 w-4" />}
        />
      </div>

      {/* Métricas de contratos */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Ticket Médio Contratos"
          value={formatCurrency(ticketMedioContratos)}
          icon={<Award className="h-4 w-4" />}
        />
        
        <MetricCard
          title="Total de Vidas"
          value={contratosAtivos.reduce((sum, c) => sum + c.quantidadeVidas, 0).toString()}
          icon={<Users className="h-4 w-4" />}
        />
        
        <MetricCard
          title="Bonificação Recebida"
          value={formatCurrency(bonificacaoRecebida)}
          icon={<Award className="h-4 w-4" />}
        />
        
        <MetricCard
          title="Bonificação Pendente"
          value={formatCurrency(bonificacaoPendente)}
          icon={<Award className="h-4 w-4" />}
        />
      </div>

      {/* Gráficos */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Fluxo de Caixa (6 meses)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={fluxoCaixaData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Bar dataKey="entradas" fill="hsl(var(--success))" name="Entradas" />
                <Bar dataKey="saidas" fill="hsl(var(--destructive))" name="Saídas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tendência de Receitas</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={fluxoCaixaData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="entradas" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Receitas"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Últimos contratos e próximos recebimentos */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contratos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contratosAtivos.slice(0, 5).map((contrato) => (
                <div key={contrato.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div>
                    <p className="font-medium text-foreground">{contrato.nome}</p>
                    <p className="text-sm text-muted-foreground">{contrato.operadora} • {contrato.quantidadeVidas} vidas</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">{formatCurrency(contrato.valorMensalidade)}</p>
                    <p className="text-xs text-muted-foreground">{contrato.percentualComissao}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximos Recebimentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {entradasPrevistas.slice(0, 5).map((entrada) => (
                <div key={entrada.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div>
                    <p className="font-medium text-foreground">{entrada.contratoNome || 'Receita Avulsa'}</p>
                    <p className="text-sm text-muted-foreground">
                      {entrada.tipo === 'bancaria' ? 'Comissão' : entrada.tipo === 'bonificacao' ? 'Bonificação' : entrada.categoria}
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
    </div>
  );
}
