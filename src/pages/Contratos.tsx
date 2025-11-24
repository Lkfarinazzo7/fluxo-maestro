import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FileText, Search, Plus, Users } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/formatters';

export default function Contratos() {
  const { contratos } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContratos = contratos.filter(contrato =>
    contrato.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contrato.operadora.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const contratosAtivos = contratos.filter(c => c.status === 'ativo');
  const totalVidas = contratosAtivos.reduce((sum, c) => sum + c.quantidadeVidas, 0);
  const receitaMensalTotal = contratosAtivos.reduce((sum, c) => {
    const comissao = c.valorMensalidade * (c.percentualComissao / 100);
    return sum + comissao;
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Contratos</h1>
          <p className="text-muted-foreground">Gestão de contratos e propostas</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Contrato
        </Button>
      </div>

      {/* Métricas resumidas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Contratos Ativos
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{contratosAtivos.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Vidas
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalVidas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receita Mensal
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(receitaMensalTotal)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ticket Médio
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(contratosAtivos.length > 0 ? receitaMensalTotal / contratosAtivos.length : 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Busca e filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou operadora..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Operadora</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Vidas</TableHead>
                <TableHead>Mensalidade</TableHead>
                <TableHead>Comissão</TableHead>
                <TableHead>Receita Mensal</TableHead>
                <TableHead>Bonificação</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContratos.map((contrato) => {
                const receitaMensal = contrato.valorMensalidade * (contrato.percentualComissao / 100);
                const bonificacaoMensal = contrato.quantidadeVidas * contrato.bonificacaoPorVida;
                
                return (
                  <TableRow key={contrato.id} className="hover:bg-accent cursor-pointer">
                    <TableCell className="font-medium">{contrato.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{contrato.nome}</p>
                        {contrato.observacoes && (
                          <p className="text-xs text-muted-foreground">{contrato.observacoes}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{contrato.operadora}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{contrato.categoria}</Badge>
                    </TableCell>
                    <TableCell>{contrato.quantidadeVidas}</TableCell>
                    <TableCell>{formatCurrency(contrato.valorMensalidade)}</TableCell>
                    <TableCell>
                      <span className="text-success font-medium">{contrato.percentualComissao}%</span>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(receitaMensal)}
                    </TableCell>
                    <TableCell>
                      {bonificacaoMensal > 0 ? (
                        <span className="text-primary font-medium">
                          {formatCurrency(bonificacaoMensal)}
                        </span>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={
                          contrato.status === 'ativo' 
                            ? 'bg-success text-success-foreground' 
                            : 'bg-destructive text-destructive-foreground'
                        }
                      >
                        {contrato.status === 'ativo' ? 'Ativo' : 'Cancelado'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
