import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useReceitasCRUD } from '@/hooks/useReceitasCRUD';
import { useContratosCRUD } from '@/hooks/useContratosCRUD';
import { receitaSchema, ReceitaFormValues } from '@/lib/validations';
import { PlusCircle } from 'lucide-react';

interface ReceitaFormDialogProps {
  trigger?: React.ReactNode;
}

export function ReceitaFormDialog({ trigger }: ReceitaFormDialogProps) {
  const [open, setOpen] = useState(false);
  const { createReceita, isCreating } = useReceitasCRUD();
  const { contratos } = useContratosCRUD();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ReceitaFormValues>({
    resolver: zodResolver(receitaSchema),
    defaultValues: {
      status: 'previsto',
      recorrencia: 'sem',
      tipo: undefined,
      categoria: '',
      forma_recebimento: '',
    },
  });

  const status = watch('status');

  const onSubmit = (data: ReceitaFormValues) => {
    createReceita(data as any, {
      onSuccess: () => {
        setOpen(false);
        reset();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Nova Receita
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Receita</DialogTitle>
          <DialogDescription>
            Preencha os dados da nova receita
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo *</Label>
              <Select onValueChange={(value) => setValue('tipo', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bancaria">Comissão Bancária</SelectItem>
                  <SelectItem value="bonificacao">Bonificação</SelectItem>
                  <SelectItem value="avulsa">Receita Avulsa</SelectItem>
                </SelectContent>
              </Select>
              {errors.tipo && (
                <p className="text-sm text-destructive">{errors.tipo.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contrato_id">Contrato (opcional)</Label>
              <Select onValueChange={(value) => {
                if (value === "__none__") {
                  setValue('contrato_id', null);
                  setValue('contrato_nome', null);
                } else {
                  setValue('contrato_id', value);
                  const contrato = contratos.find(c => c.id === value);
                  if (contrato) setValue('contrato_nome', contrato.nome);
                }
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um contrato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Nenhum</SelectItem>
                  {contratos?.map((contrato) => (
                    <SelectItem key={contrato.id} value={contrato.id}>
                      {contrato.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor_previsto">Valor Previsto *</Label>
              <Input id="valor_previsto" type="number" step="0.01" {...register('valor_previsto')} />
              {errors.valor_previsto && (
                <p className="text-sm text-destructive">{errors.valor_previsto.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="data_prevista">Data Prevista *</Label>
              <Input id="data_prevista" type="date" {...register('data_prevista')} />
              {errors.data_prevista && (
                <p className="text-sm text-destructive">{errors.data_prevista.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select onValueChange={(value) => setValue('status', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="previsto">Pendente</SelectItem>
                  <SelectItem value="recebido">Recebido</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-destructive">{errors.status.message}</p>
              )}
            </div>

            {status === 'recebido' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="valor_recebido">Valor Recebido</Label>
                  <Input id="valor_recebido" type="number" step="0.01" {...register('valor_recebido')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="data_recebida">Data Recebida</Label>
                  <Input id="data_recebida" type="date" {...register('data_recebida')} />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria *</Label>
              <Input id="categoria" {...register('categoria')} placeholder="Ex: Comissão, Bonificação" />
              {errors.categoria && (
                <p className="text-sm text-destructive">{errors.categoria.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="forma_recebimento">Forma de Recebimento *</Label>
              <Input id="forma_recebimento" {...register('forma_recebimento')} placeholder="Ex: PIX, Transferência" />
              {errors.forma_recebimento && (
                <p className="text-sm text-destructive">{errors.forma_recebimento.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="recorrencia">Recorrência</Label>
              <Select onValueChange={(value) => setValue('recorrencia', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sem">Sem recorrência</SelectItem>
                  <SelectItem value="mensal">Mensal</SelectItem>
                  <SelectItem value="2meses">A cada 2 meses</SelectItem>
                  <SelectItem value="3meses">A cada 3 meses</SelectItem>
                  <SelectItem value="6meses">A cada 6 meses</SelectItem>
                  <SelectItem value="12meses">Anual</SelectItem>
                  <SelectItem value="vitalicio">Vitalício</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacao">Observações</Label>
            <Textarea id="observacao" {...register('observacao')} rows={3} />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? 'Salvando...' : 'Salvar Receita'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
