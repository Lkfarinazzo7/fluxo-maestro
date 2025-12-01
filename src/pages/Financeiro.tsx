import { useState, useMemo } from 'react';
import { useReceitasCRUD } from '@/hooks/useReceitasCRUD';
import { useDespesasCRUD } from '@/hooks/useDespesasCRUD';
import { ReceitaFormDialog } from '@/components/Forms/ReceitaFormDialog';
import { ReceitaEditDialog } from '@/components/Forms/ReceitaEditDialog';
import { DespesaFormDialog } from '@/components/Forms/DespesaFormDialog';
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
import { DollarSign, TrendingUp, TrendingDown, Pencil } from 'lucide-react';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '@/lib/formatters';
import { MetricCard } from '@/components/Dashboard/MetricCard';

export default function Financeiro() {
  const { receitas, isLoading: loadingReceitas } = useReceitasCRUD();
  const { despesas, isLoading: loadingDespesas } = useDespesasCRUD();
  const [editingReceita, setEditingReceita] = useState<any>(null);
  
  // Filtros para receitas
  const [receitaPeriodo, setReceitaPeriodo] = useState<string>('todos');
  const [receitaStartDate, setReceitaStartDate] = useState('');
  const [receitaEndDate, setReceitaEndDate] = useState('');
  const [receitaStatus, setReceitaStatus] = useState<string>('todos');
  
  // Filtros para despesas
  const [despesaPeriodo, setDespesaPeriodo] = useState<string>('todos');
  const [despesaStartDate, setDespesaStartDate] = useState('');
  const [despesaEndDate, setDespesaEndDate] = useState('');
  const [despesaStatus, setDespesaStatus] = useState<string>('todos');

  const receitasFiltradas = useMemo(() => {
    return receitas.filter(receita => {
      // Filtro de status
      if (receitaStatus !== 'todos') {
        if (receita.status !== receitaStatus) return false;
      }
      
      // Filtro de período
      if (receitaPeriodo !== 'todos' && receitaPeriodo !== 'personalizado') {
        const hoje = new Date();
        const dataReceita = new Date(receita.status === 'recebido' ? receita.data_recebida || receita.data_prevista : receita.data_prevista);
        
        if (receitaPeriodo === 'hoje') {
          return dataReceita.toDateString() === hoje.toDateString();
        } else if (receitaPeriodo === 'semana') {
          const inicioSemana = new Date(hoje);
          inicioSemana.setDate(hoje.getDate() - hoje.getDay());
          return dataReceita >= inicioSemana && dataReceita <= hoje;
        } else if (receitaPeriodo === 'mes') {
          return dataReceita.getMonth() === hoje.getMonth() && dataReceita.getFullYear() === hoje.getFullYear();
        } else if (receitaPeriodo === '30dias') {
          const treintaDiasAtras = new Date(hoje);
          treintaDiasAtras.setDate(hoje.getDate() - 30);
          return dataReceita >= treintaDiasAtras && dataReceita <= hoje;
        }
      } else if (receitaPeriodo === 'personalizado' && receitaStartDate && receitaEndDate) {
        const dataReceita = new Date(receita.status === 'recebido' ? receita.data_recebida || receita.data_prevista : receita.data_prevista);
        const inicio = new Date(receitaStartDate);
        const fim = new Date(receitaEndDate);
        return dataReceita >= inicio && dataReceita <= fim;
      }
      
      return true;
    });
  }, [receitas, receitaStatus, receitaPeriodo, receitaStartDate, receitaEndDate]);

  const despesasFiltradas = useMemo(() => {
    return despesas.filter(despesa => {
      // Filtro de status
      if (despesaStatus !== 'todos') {
        if (despesa.status !== despesaStatus) return false;
      }
      
      // Filtro de período
      if (despesaPeriodo !== 'todos' && despesaPeriodo !== 'personalizado') {
        const hoje = new Date();
        const dataDespesa = new Date(despesa.status === 'pago' ? despesa.data_paga || despesa.data_prevista : despesa.data_prevista);
        
        if (despesaPeriodo === 'hoje') {
          return dataDespesa.toDateString() === hoje.toDateString();
        } else if (despesaPeriodo === 'semana') {
          const inicioSemana = new Date(hoje);
          inicioSemana.setDate(hoje.getDate() - hoje.getDay());
          return dataDespesa >= inicioSemana && dataDespesa <= hoje;
        } else if (despesaPeriodo === 'mes') {
          return dataDespesa.getMonth() === hoje.getMonth() && dataDespesa.getFullYear() === hoje.getFullYear();
        } else if (despesaPeriodo === '30dias') {
          const treintaDiasAtras = new Date(hoje);
          treintaDiasAtras.setDate(hoje.getDate() - 30);
          return dataDespesa >= treintaDiasAtras && dataDespesa <= hoje;
        }
      } else if (despesaPeriodo === 'personalizado' && despesaStartDate && despesaEndDate) {
        const dataDespesa = new Date(despesa.status === 'pago' ? despesa.data_paga || despesa.data_prevista : despesa.data_prevista);
        const inicio = new Date(despesaStartDate);
        const fim = new Date(despesaEndDate);
        return dataDespesa >= inicio && dataDespesa <= fim;
      }
      
      return true;
    });
  }, [despesas, despesaStatus, despesaPeriodo, despesaStartDate, despesaEndDate]);

  const receitasRecebidas = receitasFiltradas.filter(e => e.status === 'recebido');
  const receitasPrevistas = receitasFiltradas.filter(e => e.status === 'previsto');
  
  const totalReceber = receitasPrevistas.reduce((sum, e) => sum + e.valor_previsto, 0);
  const totalRecebido = receitasRecebidas.reduce((sum, e) => sum + (e.valor_recebido || 0), 0);
  
  const despesasPagas = despesasFiltradas.filter(s => s.status === 'pago');
  const despesasPrevistas = despesasFiltradas.filter(s => s.status === 'previsto');
  
  const totalPagar = despesasPrevistas.reduce((sum, s) => sum + s.valor, 0);
  const totalPago = despesasPagas.reduce((sum, s) => sum + s.valor, 0);
  
  const saldoProjetado = totalRecebido + totalReceber - totalPagar;

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Financeiro</h1>
          <p className="text-muted-foreground">Gestão de entradas e saídas</p>
        </div>
        <div className="flex gap-2">
          <ReceitaFormDialog />
          <DespesaFormDialog />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="A Receber"
          value={formatCurrency(totalReceber)}
          icon={<TrendingUp className="h-4 w-4" />}
        />

        <MetricCard
          title="Já Recebido"
          value={formatCurrency(totalRecebido)}
          icon={<DollarSign className="h-4 w-4" />}
        />

        <MetricCard
          title="A Pagar"
          value={formatCurrency(totalPagar)}
          icon={<TrendingDown className="h-4 w-4" />}
        />

        <MetricCard
          title="Saldo Projetado"
          value={formatCurrency(saldoProjetado)}
          icon={<DollarSign className="h-4 w-4" />}
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
              <div className="space-y-4">
                <CardTitle>Entradas / Receitas</CardTitle>
                <div className="flex flex-wrap items-center gap-4">
                  <Select value={receitaPeriodo} onValueChange={setReceitaPeriodo}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="hoje">Hoje</SelectItem>
                      <SelectItem value="semana">Esta Semana</SelectItem>
                      <SelectItem value="mes">Este Mês</SelectItem>
                      <SelectItem value="30dias">Últimos 30 dias</SelectItem>
                      <SelectItem value="personalizado">Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {receitaPeriodo === 'personalizado' && (
                    <>
                      <Input
                        type="date"
                        value={receitaStartDate}
                        onChange={(e) => setReceitaStartDate(e.target.value)}
                        className="w-[160px]"
                      />
                      <Input
                        type="date"
                        value={receitaEndDate}
                        onChange={(e) => setReceitaEndDate(e.target.value)}
                        className="w-[160px]"
                      />
                    </>
                  )}
                  
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
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Contrato</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Previsto</TableHead>
                    <TableHead>Recebido</TableHead>
                    <TableHead>Data Prevista</TableHead>
                    <TableHead>Data Recebida</TableHead>
                    <TableHead>Status</TableHead>
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
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingReceita(receita)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saidas">
          <Card>
            <CardHeader>
              <div className="space-y-4">
                <CardTitle>Saídas / Despesas</CardTitle>
                <div className="flex flex-wrap items-center gap-4">
                  <Select value={despesaPeriodo} onValueChange={setDespesaPeriodo}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="hoje">Hoje</SelectItem>
                      <SelectItem value="semana">Esta Semana</SelectItem>
                      <SelectItem value="mes">Este Mês</SelectItem>
                      <SelectItem value="30dias">Últimos 30 dias</SelectItem>
                      <SelectItem value="personalizado">Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {despesaPeriodo === 'personalizado' && (
                    <>
                      <Input
                        type="date"
                        value={despesaStartDate}
                        onChange={(e) => setDespesaStartDate(e.target.value)}
                        className="w-[160px]"
                      />
                      <Input
                        type="date"
                        value={despesaEndDate}
                        onChange={(e) => setDespesaEndDate(e.target.value)}
                        className="w-[160px]"
                      />
                    </>
                  )}
                  
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
                    <TableHead>Categoria</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Data Prevista</TableHead>
                    <TableHead>Data Paga</TableHead>
                    <TableHead>Forma Pagamento</TableHead>
                    <TableHead>Status</TableHead>
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
                    </TableRow>
                  ))}
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
    </div>
  );
}
