import { useState, useMemo } from 'react';
import { useReceitasCRUD } from '@/hooks/useReceitasCRUD';
import { useDespesasCRUD } from '@/hooks/useDespesasCRUD';
import { ReceitaFormDialog } from '@/components/Forms/ReceitaFormDialog';
import { ReceitaEditDialog } from '@/components/Forms/ReceitaEditDialog';
import { DespesaFormDialog } from '@/components/Forms/DespesaFormDialog';
import { DespesaEditDialog } from '@/components/Forms/DespesaEditDialog';
import { ExcelImportDialog } from '@/components/Forms/ExcelImportDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { DollarSign, TrendingUp, TrendingDown, Pencil, Trash2, ArrowUpDown, ArrowUp, ArrowDown, Calculator } from 'lucide-react';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/formatters';
import { MetricCard } from '@/components/Dashboard/MetricCard';
import { isDateInRange, getPeriodRange, PeriodType, DateRange } from '@/lib/dateFilters';

type SortDirection = 'asc' | 'desc' | null;
type ReceitaSortField = 'valor_previsto' | 'valor_recebido' | 'data_prevista' | 'data_recebida' | 'categoria' | 'status';
type DespesaSortField = 'valor' | 'data_prevista' | 'data_paga' | 'categoria' | 'status' | 'fornecedor';

export default function Financeiro() {
  const { receitas, isLoading: loadingReceitas, deleteReceita } = useReceitasCRUD();
  const { despesas, isLoading: loadingDespesas, deleteDespesa } = useDespesasCRUD();
  const [editingReceita, setEditingReceita] = useState<any>(null);
  const [editingDespesa, setEditingDespesa] = useState<any>(null);
  const [deletingReceita, setDeletingReceita] = useState<string | null>(null);
  const [deletingDespesa, setDeletingDespesa] = useState<string | null>(null);
  
  // Filtro de período global - começa com "mes"
  const [periodo, setPeriodo] = useState<string>('mes');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Filtros de status
  const [receitaStatus, setReceitaStatus] = useState<string>('todos');
  const [despesaStatus, setDespesaStatus] = useState<string>('todos');
  const [despesaCategoria, setDespesaCategoria] = useState<string>('todas');

  // Ordenação receitas
  const [receitaSortField, setReceitaSortField] = useState<ReceitaSortField>('data_recebida');
  const [receitaSortDirection, setReceitaSortDirection] = useState<SortDirection>('desc');

  // Ordenação despesas
  const [despesaSortField, setDespesaSortField] = useState<DespesaSortField>('data_paga');
  const [despesaSortDirection, setDespesaSortDirection] = useState<SortDirection>('desc');

  // Obter range de datas baseado no período
  const dateRange: DateRange | null = useMemo(() => {
    if (periodo === 'todos') return null;
    if (periodo === 'personalizado') {
      if (!startDate || !endDate) return null;
      return {
        start: new Date(startDate),
        end: new Date(endDate),
      };
    }
    return getPeriodRange(periodo as PeriodType);
  }, [periodo, startDate, endDate]);

  // Filtrar receitas
  const receitasFiltradas = useMemo(() => {
    let filtered = receitas.filter(receita => {
      // Filtro de status
      if (receitaStatus !== 'todos' && receita.status !== receitaStatus) {
        return false;
      }
      
      // Filtro de período
      if (dateRange) {
        if (receita.status === 'recebido' && receita.data_recebida) {
          return isDateInRange(receita.data_recebida, dateRange);
        }
        if (receita.status === 'previsto') {
          return isDateInRange(receita.data_prevista, dateRange);
        }
        return false;
      }
      
      return true;
    });

    // Ordenação
    if (receitaSortField && receitaSortDirection) {
      filtered = [...filtered].sort((a, b) => {
        let valA: any;
        let valB: any;

        switch (receitaSortField) {
          case 'valor_previsto':
            valA = a.valor_previsto;
            valB = b.valor_previsto;
            break;
          case 'valor_recebido':
            valA = a.valor_recebido || 0;
            valB = b.valor_recebido || 0;
            break;
          case 'data_prevista':
            valA = new Date(a.data_prevista).getTime();
            valB = new Date(b.data_prevista).getTime();
            break;
          case 'data_recebida':
            valA = a.data_recebida ? new Date(a.data_recebida).getTime() : 0;
            valB = b.data_recebida ? new Date(b.data_recebida).getTime() : 0;
            break;
          case 'categoria':
            valA = a.categoria.toLowerCase();
            valB = b.categoria.toLowerCase();
            break;
          case 'status':
            valA = a.status;
            valB = b.status;
            break;
          default:
            return 0;
        }

        if (valA < valB) return receitaSortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return receitaSortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [receitas, receitaStatus, dateRange, receitaSortField, receitaSortDirection]);

  // Filtrar despesas
  const despesasFiltradas = useMemo(() => {
    let filtered = despesas.filter(despesa => {
      // Filtro de status
      if (despesaStatus !== 'todos' && despesa.status !== despesaStatus) {
        return false;
      }
      
      // Filtro de categoria
      if (despesaCategoria !== 'todas' && despesa.categoria !== despesaCategoria) {
        return false;
      }
      
      // Filtro de período
      if (dateRange) {
        if (despesa.status === 'pago' && despesa.data_paga) {
          return isDateInRange(despesa.data_paga, dateRange);
        }
        if (despesa.status === 'previsto') {
          return isDateInRange(despesa.data_prevista, dateRange);
        }
        return false;
      }
      
      return true;
    });

    // Ordenação
    if (despesaSortField && despesaSortDirection) {
      filtered = [...filtered].sort((a, b) => {
        let valA: any;
        let valB: any;

        switch (despesaSortField) {
          case 'valor':
            valA = a.valor;
            valB = b.valor;
            break;
          case 'data_prevista':
            valA = new Date(a.data_prevista).getTime();
            valB = new Date(b.data_prevista).getTime();
            break;
          case 'data_paga':
            valA = a.data_paga ? new Date(a.data_paga).getTime() : 0;
            valB = b.data_paga ? new Date(b.data_paga).getTime() : 0;
            break;
          case 'categoria':
            valA = a.categoria.toLowerCase();
            valB = b.categoria.toLowerCase();
            break;
          case 'status':
            valA = a.status;
            valB = b.status;
            break;
          case 'fornecedor':
            valA = a.fornecedor.toLowerCase();
            valB = b.fornecedor.toLowerCase();
            break;
          default:
            return 0;
        }

        if (valA < valB) return despesaSortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return despesaSortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [despesas, despesaStatus, despesaCategoria, dateRange, despesaSortField, despesaSortDirection]);

  // Obter categorias únicas para o filtro
  const categoriasUnicas = useMemo(() => {
    const cats = new Set(despesas.map(d => d.categoria));
    return Array.from(cats).sort();
  }, [despesas]);

  // Cálculos para os indicadores (usando filtros aplicados)
  const totalReceber = receitasFiltradas.filter(e => e.status === 'previsto').reduce((sum, e) => sum + e.valor_previsto, 0);
  const totalRecebido = receitasFiltradas.filter(e => e.status === 'recebido').reduce((sum, e) => sum + (e.valor_recebido || 0), 0);
  const totalPagar = despesasFiltradas.filter(s => s.status === 'previsto').reduce((sum, s) => sum + s.valor, 0);
  const totalPago = despesasFiltradas.filter(s => s.status === 'pago').reduce((sum, s) => sum + s.valor, 0);
  const resultadoPeriodo = totalRecebido - totalPago;

  const handleReceitaSort = (field: ReceitaSortField) => {
    if (receitaSortField === field) {
      if (receitaSortDirection === 'asc') {
        setReceitaSortDirection('desc');
      } else if (receitaSortDirection === 'desc') {
        setReceitaSortDirection('asc');
      }
    } else {
      setReceitaSortField(field);
      setReceitaSortDirection('asc');
    }
  };

  const handleDespesaSort = (field: DespesaSortField) => {
    if (despesaSortField === field) {
      if (despesaSortDirection === 'asc') {
        setDespesaSortDirection('desc');
      } else if (despesaSortDirection === 'desc') {
        setDespesaSortDirection('asc');
      }
    } else {
      setDespesaSortField(field);
      setDespesaSortDirection('asc');
    }
  };

  const getSortIcon = (field: string, currentField: string, direction: SortDirection) => {
    if (field !== currentField) return <ArrowUpDown className="h-4 w-4 ml-1" />;
    if (direction === 'asc') return <ArrowUp className="h-4 w-4 ml-1" />;
    return <ArrowDown className="h-4 w-4 ml-1" />;
  };

  const handleDeleteReceita = () => {
    if (deletingReceita) {
      deleteReceita(deletingReceita);
      setDeletingReceita(null);
    }
  };

  const handleDeleteDespesa = () => {
    if (deletingDespesa) {
      deleteDespesa(deletingDespesa);
      setDeletingDespesa(null);
    }
  };

  if (loadingReceitas || loadingDespesas) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Financeiro</h1>
          <p className="text-muted-foreground">Carregando dados financeiros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com filtro de período no topo */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Financeiro</h1>
            <p className="text-muted-foreground">Gestão de entradas e saídas</p>
          </div>
          <div className="flex gap-2">
            <ExcelImportDialog />
            <ReceitaFormDialog />
            <DespesaFormDialog />
          </div>
        </div>

        {/* Filtro de período no topo */}
        <div className="flex flex-wrap items-center gap-4">
          <Select value={periodo} onValueChange={setPeriodo}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="hoje">Hoje</SelectItem>
              <SelectItem value="semana">Esta Semana</SelectItem>
              <SelectItem value="mes">Este Mês</SelectItem>
              <SelectItem value="7dias">Últimos 7 dias</SelectItem>
              <SelectItem value="30dias">Últimos 30 dias</SelectItem>
              <SelectItem value="personalizado">Personalizado</SelectItem>
            </SelectContent>
          </Select>
          
          {periodo === 'personalizado' && (
            <>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-[160px]"
              />
              <span className="text-muted-foreground">até</span>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-[160px]"
              />
            </>
          )}
        </div>
      </div>

      {/* 5 Indicadores principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <MetricCard
          title="Valor a Receber"
          value={formatCurrency(totalReceber)}
          icon={<TrendingUp className="h-4 w-4" />}
        />

        <MetricCard
          title="Valor Recebido"
          value={formatCurrency(totalRecebido)}
          icon={<DollarSign className="h-4 w-4" />}
        />

        <MetricCard
          title="Valor a Pagar"
          value={formatCurrency(totalPagar)}
          icon={<TrendingDown className="h-4 w-4" />}
        />

        <MetricCard
          title="Valor Pago"
          value={formatCurrency(totalPago)}
          icon={<DollarSign className="h-4 w-4" />}
        />

        <MetricCard
          title="Resultado do Período"
          value={formatCurrency(resultadoPeriodo)}
          icon={<Calculator className="h-4 w-4" />}
        />
      </div>

      <Tabs defaultValue="entradas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="entradas">Entradas</TabsTrigger>
          <TabsTrigger value="saidas">Saídas</TabsTrigger>
        </TabsList>

        <TabsContent value="entradas">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <CardTitle>Entradas / Receitas</CardTitle>
                <Select value={receitaStatus} onValueChange={setReceitaStatus}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="recebido">Recebido</SelectItem>
                    <SelectItem value="previsto">Previsto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Contrato</TableHead>
                    <TableHead 
                      className="cursor-pointer select-none"
                      onClick={() => handleReceitaSort('categoria')}
                    >
                      <div className="flex items-center">
                        Categoria
                        {getSortIcon('categoria', receitaSortField, receitaSortDirection)}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer select-none"
                      onClick={() => handleReceitaSort('valor_previsto')}
                    >
                      <div className="flex items-center">
                        Previsto
                        {getSortIcon('valor_previsto', receitaSortField, receitaSortDirection)}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer select-none"
                      onClick={() => handleReceitaSort('valor_recebido')}
                    >
                      <div className="flex items-center">
                        Recebido
                        {getSortIcon('valor_recebido', receitaSortField, receitaSortDirection)}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer select-none"
                      onClick={() => handleReceitaSort('data_prevista')}
                    >
                      <div className="flex items-center">
                        Data Prevista
                        {getSortIcon('data_prevista', receitaSortField, receitaSortDirection)}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer select-none"
                      onClick={() => handleReceitaSort('data_recebida')}
                    >
                      <div className="flex items-center">
                        Data Recebida
                        {getSortIcon('data_recebida', receitaSortField, receitaSortDirection)}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer select-none"
                      onClick={() => handleReceitaSort('status')}
                    >
                      <div className="flex items-center">
                        Status
                        {getSortIcon('status', receitaSortField, receitaSortDirection)}
                      </div>
                    </TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receitasFiltradas.map((receita) => (
                    <TableRow key={receita.id} className="hover:bg-accent">
                      <TableCell className="font-medium">{receita.id.substring(0, 8)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {receita.tipo === 'bancaria' ? 'Comissão' : receita.tipo === 'bonificacao' ? 'Bonificação' : 'Avulsa'}
                        </Badge>
                      </TableCell>
                      <TableCell>{receita.contrato_nome || '-'}</TableCell>
                      <TableCell>{receita.categoria}</TableCell>
                      <TableCell>{formatCurrency(receita.valor_previsto)}</TableCell>
                      <TableCell className="font-medium">
                        {receita.valor_recebido ? formatCurrency(receita.valor_recebido) : '-'}
                      </TableCell>
                      <TableCell>{formatDate(receita.data_prevista)}</TableCell>
                      <TableCell>{receita.data_recebida ? formatDate(receita.data_recebida) : '-'}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(receita.status)}>
                          {receita.status === 'recebido' ? 'Recebido' : 'Previsto'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingReceita(receita)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeletingReceita(receita.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {receitasFiltradas.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                        Nenhuma receita encontrada
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saidas">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <CardTitle>Saídas / Despesas</CardTitle>
                <div className="flex gap-2">
                  <Select value={despesaCategoria} onValueChange={setDespesaCategoria}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas Categorias</SelectItem>
                      {categoriasUnicas.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={despesaStatus} onValueChange={setDespesaStatus}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="pago">Pago</SelectItem>
                      <SelectItem value="previsto">Não Pago</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead 
                      className="cursor-pointer select-none"
                      onClick={() => handleDespesaSort('categoria')}
                    >
                      <div className="flex items-center">
                        Categoria
                        {getSortIcon('categoria', despesaSortField, despesaSortDirection)}
                      </div>
                    </TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead 
                      className="cursor-pointer select-none"
                      onClick={() => handleDespesaSort('fornecedor')}
                    >
                      <div className="flex items-center">
                        Fornecedor
                        {getSortIcon('fornecedor', despesaSortField, despesaSortDirection)}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer select-none"
                      onClick={() => handleDespesaSort('valor')}
                    >
                      <div className="flex items-center">
                        Valor
                        {getSortIcon('valor', despesaSortField, despesaSortDirection)}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer select-none"
                      onClick={() => handleDespesaSort('data_prevista')}
                    >
                      <div className="flex items-center">
                        Data Prevista
                        {getSortIcon('data_prevista', despesaSortField, despesaSortDirection)}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer select-none"
                      onClick={() => handleDespesaSort('data_paga')}
                    >
                      <div className="flex items-center">
                        Data Paga
                        {getSortIcon('data_paga', despesaSortField, despesaSortDirection)}
                      </div>
                    </TableHead>
                    <TableHead>Forma Pagamento</TableHead>
                    <TableHead 
                      className="cursor-pointer select-none"
                      onClick={() => handleDespesaSort('status')}
                    >
                      <div className="flex items-center">
                        Status
                        {getSortIcon('status', despesaSortField, despesaSortDirection)}
                      </div>
                    </TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {despesasFiltradas.map((despesa) => (
                    <TableRow key={despesa.id} className="hover:bg-accent">
                      <TableCell className="font-medium">{despesa.id.substring(0, 8)}</TableCell>
                      <TableCell>{despesa.categoria}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {despesa.tipo === 'fixa' ? 'Fixa' : 'Variável'}
                        </Badge>
                      </TableCell>
                      <TableCell>{despesa.fornecedor}</TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(despesa.valor)}
                      </TableCell>
                      <TableCell>{formatDate(despesa.data_prevista)}</TableCell>
                      <TableCell>{despesa.data_paga ? formatDate(despesa.data_paga) : '-'}</TableCell>
                      <TableCell>{despesa.forma_pagamento}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(despesa.status)}>
                          {despesa.status === 'pago' ? 'Pago' : 'Previsto'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingDespesa(despesa)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeletingDespesa(despesa.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {despesasFiltradas.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                        Nenhuma despesa encontrada
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {editingReceita && (
        <ReceitaEditDialog
          receita={editingReceita}
          open={!!editingReceita}
          onOpenChange={(open) => !open && setEditingReceita(null)}
        />
      )}

      {editingDespesa && (
        <DespesaEditDialog
          despesa={editingDespesa}
          open={!!editingDespesa}
          onOpenChange={(open) => !open && setEditingDespesa(null)}
        />
      )}

      {/* Dialog de confirmação para excluir receita */}
      <AlertDialog open={!!deletingReceita} onOpenChange={(open) => !open && setDeletingReceita(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta receita? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteReceita} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de confirmação para excluir despesa */}
      <AlertDialog open={!!deletingDespesa} onOpenChange={(open) => !open && setDeletingDespesa(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta despesa? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDespesa} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
