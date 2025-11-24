import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, TrendingUp, DollarSign, BarChart3, PieChart, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const relatorios = [
  { 
    id: 'fluxo-caixa',
    nome: 'Fluxo de Caixa', 
    descricao: 'Análise detalhada de entradas e saídas financeiras com gráficos e tabelas',
    icon: TrendingUp,
    color: 'text-primary'
  },
  { 
    id: 'dre',
    nome: 'DRE Simplificado', 
    descricao: 'Demonstração do Resultado do Exercício com receitas e despesas',
    icon: FileText,
    color: 'text-success'
  },
  { 
    id: 'receitas-comparativo',
    nome: 'Receitas Previstas vs Recebidas', 
    descricao: 'Comparativo entre valores previstos e realizados',
    icon: DollarSign,
    color: 'text-warning'
  },
  { 
    id: 'despesas-categoria',
    nome: 'Despesas por Categoria', 
    descricao: 'Análise de gastos por categoria de despesa com gráficos',
    icon: PieChart,
    color: 'text-destructive'
  },
  { 
    id: 'contratos-operadora',
    nome: 'Contratos por Operadora', 
    descricao: 'Distribuição e performance por operadora com gráficos e tabelas',
    icon: BarChart3,
    color: 'text-primary'
  },
  { 
    id: 'ticket-medio',
    nome: 'Ticket Médio dos Contratos', 
    descricao: 'Análise de ticket médio e variações por período',
    icon: Award,
    color: 'text-success'
  },
];

export default function Relatorios() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
        <p className="text-muted-foreground">Dashboards visuais e análises detalhadas</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {relatorios.map((relatorio) => {
          const Icon = relatorio.icon;
          return (
            <Card key={relatorio.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/relatorios/${relatorio.id}`)}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className={`h-5 w-5 ${relatorio.color}`} />
                    </div>
                    <CardTitle className="text-lg">{relatorio.nome}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {relatorio.descricao}
                </p>
                <Button className="w-full" variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Visualizar Relatório
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
