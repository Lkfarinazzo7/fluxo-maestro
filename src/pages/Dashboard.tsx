import { useApp } from '@/contexts/AppContext';
import { MetricCard } from '@/components/Dashboard/MetricCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  ShoppingCart, 
  TrendingUp, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '@/lib/formatters';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export default function Dashboard() {
  const { vendas, produtos, contas } = useApp();
  const navigate = useNavigate();

  // Cálculos
  const vendasMes = vendas.filter(v => {
    const vendaDate = new Date(v.data);
    const now = new Date();
    return vendaDate.getMonth() === now.getMonth() && 
           vendaDate.getFullYear() === now.getFullYear();
  });

  const totalVendasMes = vendasMes.reduce((sum, v) => sum + v.total, 0);
  const vendasMesAnterior = vendas.filter(v => {
    const vendaDate = new Date(v.data);
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    return vendaDate.getMonth() === lastMonth.getMonth() && 
           vendaDate.getFullYear() === lastMonth.getFullYear();
  });
  const totalVendasMesAnterior = vendasMesAnterior.reduce((sum, v) => sum + v.total, 0);
  const variacaoVendas = totalVendasMesAnterior > 0 
    ? ((totalVendasMes - totalVendasMesAnterior) / totalVendasMesAnterior) * 100 
    : 0;

  const totalReceitas = contas
    .filter(c => c.tipo === 'receber' && c.status === 'pago')
    .reduce((sum, c) => sum + c.valor, 0);
  
  const totalDespesas = contas
    .filter(c => c.tipo === 'pagar' && c.status === 'pago')
    .reduce((sum, c) => sum + c.valor, 0);
  
  const lucroLiquido = totalReceitas - totalDespesas;

  const produtosCriticos = produtos.filter(p => p.estoqueAtual < p.estoqueMinimo);
  
  const ultimasVendas = [...vendas].slice(0, 5);

  const contasReceber = contas.filter(c => c.tipo === 'receber' && c.status !== 'pago');
  const contasPagar = contas.filter(c => c.tipo === 'pagar' && c.status !== 'pago');

  // Dados para gráficos
  const ultimosDias = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const vendasPorDia = ultimosDias.map(dia => {
    const total = vendas
      .filter(v => v.data === dia)
      .reduce((sum, v) => sum + v.total, 0);
    return {
      dia: new Date(dia).toLocaleDateString('pt-BR', { weekday: 'short' }),
      valor: total
    };
  });

  const financeiroData = [
    { name: 'Receitas', value: totalReceitas },
    { name: 'Despesas', value: totalDespesas },
  ];

  const COLORS = ['hsl(var(--success))', 'hsl(var(--destructive))'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do seu negócio</p>
      </div>

      {/* Cards de métricas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Vendas do Mês"
          value={formatCurrency(totalVendasMes)}
          icon={<ShoppingCart className="h-4 w-4" />}
          trend={{
            value: Math.round(variacaoVendas),
            label: 'vs mês anterior'
          }}
        />
        
        <MetricCard
          title="Receitas"
          value={formatCurrency(totalReceitas)}
          icon={<DollarSign className="h-4 w-4" />}
        />
        
        <MetricCard
          title="Despesas"
          value={formatCurrency(totalDespesas)}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        
        <MetricCard
          title="Lucro Líquido"
          value={formatCurrency(lucroLiquido)}
          icon={<TrendingUp className="h-4 w-4" />}
        />
      </div>

      {/* Gráficos */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Vendas - Últimos 7 Dias</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={vendasPorDia}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="dia" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Bar dataKey="valor" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financeiro</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={financeiroData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {financeiroData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Estoque Crítico */}
      {produtosCriticos.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Estoque Crítico
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {produtosCriticos.length} produtos abaixo do estoque mínimo
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate('/produtos')}>
              Ver Todos <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {produtosCriticos.slice(0, 5).map(produto => (
                <div key={produto.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div>
                    <p className="font-medium text-foreground">{produto.nome}</p>
                    <p className="text-sm text-muted-foreground">Código: {produto.codigo}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">
                      Atual: <span className="text-destructive">{produto.estoqueAtual}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">Mínimo: {produto.estoqueMinimo}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Últimas Vendas e Contas */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Últimas Vendas</CardTitle>
            <Button variant="outline" size="sm" onClick={() => navigate('/vendas')}>
              Ver Todas
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ultimasVendas.map(venda => (
                <div 
                  key={venda.id} 
                  className="flex items-center justify-between p-3 rounded-lg border border-border cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => navigate(`/vendas/${venda.id}`)}
                >
                  <div>
                    <p className="font-medium text-foreground">{venda.cliente}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(venda.data)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">{formatCurrency(venda.total)}</p>
                    <Badge className={getStatusColor(venda.status)}>
                      {getStatusLabel(venda.status)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-success/10">
                <div>
                  <p className="text-sm text-muted-foreground">A Receber</p>
                  <p className="text-2xl font-bold text-success">
                    {formatCurrency(contasReceber.reduce((sum, c) => sum + c.valor, 0))}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">{contasReceber.length} contas</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-destructive/10">
                <div>
                  <p className="text-sm text-muted-foreground">A Pagar</p>
                  <p className="text-2xl font-bold text-destructive">
                    {formatCurrency(contasPagar.reduce((sum, c) => sum + c.valor, 0))}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">{contasPagar.length} contas</p>
                </div>
              </div>

              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => navigate('/financeiro')}
              >
                Ver Detalhes <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
