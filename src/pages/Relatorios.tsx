import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';

const relatorios = [
  { 
    id: 1, 
    nome: 'Vendas por Período', 
    descricao: 'Relatório detalhado de vendas em um período específico' 
  },
  { 
    id: 2, 
    nome: 'Produtos Mais Vendidos', 
    descricao: 'Ranking dos produtos com maior volume de vendas' 
  },
  { 
    id: 3, 
    nome: 'Clientes Top', 
    descricao: 'Clientes que mais compraram no período' 
  },
  { 
    id: 4, 
    nome: 'Margem de Lucro', 
    descricao: 'Análise de margem de lucro por produto' 
  },
  { 
    id: 5, 
    nome: 'Análise de Estoque', 
    descricao: 'Relatório de movimentação e situação do estoque' 
  },
  { 
    id: 6, 
    nome: 'DRE Simplificado', 
    descricao: 'Demonstração do Resultado do Exercício' 
  },
  { 
    id: 7, 
    nome: 'Fluxo de Caixa', 
    descricao: 'Análise de entradas e saídas financeiras' 
  },
  { 
    id: 8, 
    nome: 'Análise de Vendas', 
    descricao: 'Análise completa do desempenho de vendas' 
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
