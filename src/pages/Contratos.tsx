import { useState } from 'react';
import { useContratosCRUD } from '@/hooks/useContratosCRUD';
import { ContratoFormDialog } from '@/components/Forms/ContratoFormDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FileText, Search, Users } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';

export default function Contratos() {
  const { contratos, isLoading } = useContratosCRUD();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContratos = contratos.filter(contrato =>
    contrato.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contrato.operadora.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const contratosAtivos = contratos;
  const totalVidas = contratosAtivos.reduce((sum, c) => sum + c.quantidade_vidas, 0);
  const receitaMensalTotal = contratosAtivos.reduce((sum, c) => {
    const receitaBancaria = (c.valor_mensalidade * c.quantidade_vidas * c.percentual_comissao) / 100;
    return sum + receitaBancaria;
  }, 0);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Contratos</h1>
          <p className="text-muted-foreground">Carregando contratos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Contratos</h1>
          <p className="text-muted-foreground">Gestão de contratos e propostas</p>
        </div>
        <ContratoFormDialog />
      </div>

      {/* Métricas resumidas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Contratos
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{contratos.length}</div>
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
                <TableHead>Tipo</TableHead>
                <TableHead>Vidas</TableHead>
                <TableHead>Receita da Bancária</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContratos.map((contrato) => {
                const receitaMensal = (contrato.valor_mensalidade * contrato.quantidade_vidas * contrato.percentual_comissao) / 100;
                
                return (
                  <TableRow key={contrato.id} className="hover:bg-accent cursor-pointer">
                    <TableCell className="font-medium">{contrato.id.substring(0, 8)}</TableCell>
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
                    <TableCell>
                      <Badge variant={contrato.tipo_contrato === 'PJ' ? 'default' : 'secondary'}>
                        {contrato.tipo_contrato}
                      </Badge>
                    </TableCell>
                    <TableCell>{contrato.quantidade_vidas}</TableCell>
                    <TableCell className="font-medium text-success">
                      {formatCurrency(receitaMensal)}
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
