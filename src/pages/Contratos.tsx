import { useState } from 'react';
import { useContratosCRUD } from '@/hooks/useContratosCRUD';
import { ContratoFormDialog } from '@/components/Forms/ContratoFormDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { FileText, Search, Users, Pencil, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';

export default function Contratos() {
  const { contratos, isLoading, deleteContrato } = useContratosCRUD();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | 'created' | 'implanted'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [editingContrato, setEditingContrato] = useState<any>(null);
  const [deletingContrato, setDeletingContrato] = useState<string | null>(null);

  const filteredContratos = contratos.filter(contrato => {
    const matchesSearch = contrato.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contrato.operadora.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (dateFilter === 'all' || !startDate || !endDate) return true;
    
    const filterDate = dateFilter === 'created' ? contrato.created_at : contrato.data_implantacao;
    const contratoDate = new Date(filterDate);
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return contratoDate >= start && contratoDate <= end;
  });

  const contratosAtivos = contratos;
  const totalVidas = contratosAtivos.reduce((sum, c) => sum + c.quantidade_vidas, 0);
  const receitaMensalTotal = contratosAtivos.reduce((sum, c) => {
    const receitaBancaria = c.valor_mensalidade * (c.percentual_comissao / 100);
    return sum + receitaBancaria;
  }, 0);

  const handleDeleteContrato = () => {
    if (deletingContrato) {
      deleteContrato(deletingContrato);
      setDeletingContrato(null);
    }
  };

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
          <div className="flex flex-col gap-4">
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
            
            <div className="flex items-center gap-4">
              <Select value={dateFilter} onValueChange={(value: any) => setDateFilter(value)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filtrar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="created">Data de Cadastro</SelectItem>
                  <SelectItem value="implanted">Data de Implantação</SelectItem>
                </SelectContent>
              </Select>
              
              {dateFilter !== 'all' && (
                <>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="Data inicial"
                    className="w-[160px]"
                  />
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="Data final"
                    className="w-[160px]"
                  />
                </>
              )}
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
                <TableHead>Mensalidade</TableHead>
                <TableHead>Receita da Bancária</TableHead>
                <TableHead>Vendedor</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContratos.map((contrato) => {
                const receitaMensal = contrato.valor_mensalidade * (contrato.percentual_comissao / 100);
                
                return (
                  <TableRow key={contrato.id} className="hover:bg-accent">
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
                    <TableCell className="font-medium">
                      {formatCurrency(contrato.valor_mensalidade)}
                    </TableCell>
                    <TableCell className="font-medium text-success">
                      {formatCurrency(receitaMensal)}
                    </TableCell>
                    <TableCell>
                      {contrato.vendedor_responsavel || '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingContrato(contrato)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingContrato(contrato.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {editingContrato && (
        <ContratoFormDialog
          trigger={null}
          contrato={editingContrato}
          open={!!editingContrato}
          onOpenChange={(open) => !open && setEditingContrato(null)}
        />
      )}

      {/* Dialog de confirmação para excluir contrato */}
      <AlertDialog open={!!deletingContrato} onOpenChange={(open) => !open && setDeletingContrato(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este contrato? Esta ação não pode ser desfeita e as receitas/despesas associadas permanecerão no sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteContrato} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}