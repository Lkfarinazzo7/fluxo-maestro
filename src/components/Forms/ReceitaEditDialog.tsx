import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useReceitasCRUD } from '@/hooks/useReceitasCRUD';

const receitaEditSchema = z.object({
  status: z.enum(['previsto', 'recebido']),
  valor_recebido: z.coerce.number().min(0).optional(),
  data_recebida: z.string().optional(),
});

type ReceitaEditValues = z.infer<typeof receitaEditSchema>;

interface ReceitaEditDialogProps {
  receita: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReceitaEditDialog({ receita, open, onOpenChange }: ReceitaEditDialogProps) {
  const { updateReceita, isUpdating } = useReceitasCRUD();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ReceitaEditValues>({
    resolver: zodResolver(receitaEditSchema),
    defaultValues: {
      status: receita?.status || 'previsto',
      valor_recebido: receita?.valor_recebido || receita?.valor_previsto,
      data_recebida: receita?.data_recebida || '',
    },
  });

  const status = watch('status');

  useEffect(() => {
    if (receita) {
      setValue('status', receita.status);
      setValue('valor_recebido', receita.valor_recebido || receita.valor_previsto);
      setValue('data_recebida', receita.data_recebida || '');
    }
  }, [receita, setValue]);

  const onSubmit = (data: ReceitaEditValues) => {
    updateReceita({ id: receita.id, data: data as any }, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  if (!receita) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Receita</DialogTitle>
          <DialogDescription>
            Atualize o status e valores da receita
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Tipo</Label>
            <Input value={receita.tipo === 'bancaria' ? 'Comissão' : receita.tipo === 'bonificacao' ? 'Bonificação' : 'Avulsa'} disabled />
          </div>

          {receita.contrato_nome && (
            <div className="space-y-2">
              <Label>Contrato</Label>
              <Input value={receita.contrato_nome} disabled />
            </div>
          )}

          <div className="space-y-2">
            <Label>Valor Previsto</Label>
            <Input value={`R$ ${receita.valor_previsto.toFixed(2)}`} disabled />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select value={status} onValueChange={(value) => setValue('status', value as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="previsto">Previsto</SelectItem>
                <SelectItem value="recebido">Recebido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {status === 'recebido' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="valor_recebido">Valor Recebido *</Label>
                <Input id="valor_recebido" type="number" step="0.01" {...register('valor_recebido')} />
                {errors.valor_recebido && (
                  <p className="text-sm text-destructive">{errors.valor_recebido.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="data_recebida">Data Recebida *</Label>
                <Input id="data_recebida" type="date" {...register('data_recebida')} />
                {errors.data_recebida && (
                  <p className="text-sm text-destructive">{errors.data_recebida.message}</p>
                )}
              </div>
            </>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
