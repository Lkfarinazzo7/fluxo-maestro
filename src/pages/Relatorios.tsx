import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';

const relatorios = [
  { 
    id: 1, 
    nome: 'Fluxo de Caixa', 
    descricao: 'Análise detalhada de entradas e saídas financeiras' 
  },
  { 
    id: 2, 
    nome: 'DRE Simplificado', 
    descricao: 'Demonstração do Resultado do Exercício' 
  },
  { 
    id: 3, 
    nome: 'Receitas Previstas vs Recebidas', 
    descricao: 'Comparativo entre valores previstos e realizados' 
  },
  { 
    id: 4, 
    nome: 'Despesas por Categoria', 
    descricao: 'Análise de gastos por categoria de despesa' 
  },
  { 
    id: 5, 
    nome: 'Contratos por Operadora', 
    descricao: 'Distribuição e performance por operadora' 
  },
  { 
    id: 6, 
    nome: 'Ticket Médio dos Contratos', 
    descricao: 'Análise de ticket médio e variações' 
  },
  { 
    id: 7, 
    nome: 'Bonificações', 
    descricao: 'Relatório de bonificações pagas e pendentes' 
  },
  { 
    id: 8, 
    nome: 'Previsão Anual', 
    descricao: 'Projeção de receitas e despesas para o ano' 
  },
];

export default function Relatorios() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
        <p className="text-muted-foreground">Análises e relatórios do seu negócio</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {relatorios.map((relatorio) => (
          <Card key={relatorio.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
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
                <Download className="mr-2 h-4 w-4" />
                Gerar Relatório
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
