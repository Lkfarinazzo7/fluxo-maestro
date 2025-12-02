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
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDespesasCRUD } from '@/hooks/useDespesasCRUD';
import { CATEGORIAS_DESPESAS, FORMAS_PAGAMENTO } from '@/lib/validations';

const despesaEditSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  valor: z.coerce.number().min(0, 'Valor deve ser positivo'),
  categoria: z.string().min(1, 'Categoria é obrigatória'),
  tipo: z.enum(['fixa', 'variavel']),
  fornecedor: z.string().min(1, 'Fornecedor é obrigatório'),
  recorrente: z.boolean(),
  duracao_meses: z.coerce.number().optional(),
  data_prevista: z.string().min(1, 'Data prevista é obrigatória'),
  data_paga: z.string().optional(),
  forma_pagamento: z.string().min(1, 'Forma de pagamento é obrigatória'),
  comprovante: z.string().optional(),
  observacao: z.string().optional(),
  status: z.enum(['previsto', 'pago']),
});

type DespesaEditValues = z.infer<typeof despesaEditSchema>;

interface DespesaEditDialogProps {
  despesa: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DespesaEditDialog({ despesa, open, onOpenChange }: DespesaEditDialogProps) {
  const { updateDespesa, isUpdating } = useDespesasCRUD();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<DespesaEditValues>({
    resolver: zodResolver(despesaEditSchema),
    defaultValues: {
      nome: despesa?.nome || '',
      valor: despesa?.valor || 0,
      categoria: despesa?.categoria || '',
      tipo: despesa?.tipo || 'fixa',
      fornecedor: despesa?.fornecedor || '',
      recorrente: despesa?.recorrente || false,
      duracao_meses: despesa?.duracao_meses || undefined,
      data_prevista: despesa?.data_prevista || '',
      data_paga: despesa?.data_paga || '',
      forma_pagamento: despesa?.forma_pagamento || '',
      comprovante: despesa?.comprovante || '',
      observacao: despesa?.observacao || '',
      status: despesa?.status || 'previsto',
    },
  });

  const status = watch('status');
  const recorrente = watch('recorrente');

  useEffect(() => {
    if (despesa) {
      setValue('nome', despesa.nome);
      setValue('valor', despesa.valor);
      setValue('categoria', despesa.categoria);
      setValue('tipo', despesa.tipo);
      setValue('fornecedor', despesa.fornecedor);
      setValue('recorrente', despesa.recorrente);
      setValue('duracao_meses', despesa.duracao_meses);
      setValue('data_prevista', despesa.data_prevista);
      setValue('data_paga', despesa.data_paga || '');
      setValue('forma_pagamento', despesa.forma_pagamento);
      setValue('comprovante', despesa.comprovante || '');
      setValue('observacao', despesa.observacao || '');
      setValue('status', despesa.status);
    }
  }, [despesa, setValue]);

  const onSubmit = (data: DespesaEditValues) => {
    updateDespesa({ id: despesa.id, data: data as any }, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  if (!despesa) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Despesa</DialogTitle>
          <DialogDescription>
            Atualize os dados da despesa
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome da Despesa *</Label>
              <Input id="nome" {...register('nome')} />
              {errors.nome && (
                <p className="text-sm text-destructive">{errors.nome.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor">Valor *</Label>
              <Input id="valor" type="number" step="0.01" {...register('valor')} />
              {errors.valor && (
                <p className="text-sm text-destructive">{errors.valor.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria *</Label>
              <Select 
                value={watch('categoria')} 
                onValueChange={(value) => setValue('categoria', value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIAS_DESPESAS.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoria && (
                <p className="text-sm text-destructive">{String(errors.categoria.message)}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo *</Label>
              <Select 
                value={watch('tipo')} 
                onValueChange={(value) => setValue('tipo', value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixa">Fixa</SelectItem>
                  <SelectItem value="variavel">Variável</SelectItem>
                </SelectContent>
              </Select>
              {errors.tipo && (
                <p className="text-sm text-destructive">{errors.tipo.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fornecedor">Fornecedor *</Label>
              <Input id="fornecedor" {...register('fornecedor')} />
              {errors.fornecedor && (
                <p className="text-sm text-destructive">{errors.fornecedor.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="forma_pagamento">Forma de Pagamento *</Label>
              <Select 
                value={watch('forma_pagamento')} 
                onValueChange={(value) => setValue('forma_pagamento', value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {FORMAS_PAGAMENTO.map((forma) => (
                    <SelectItem key={forma} value={forma}>
                      {forma}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.forma_pagamento && (
                <p className="text-sm text-destructive">{String(errors.forma_pagamento.message)}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="data_prevista">Data de Vencimento *</Label>
              <Input id="data_prevista" type="date" {...register('data_prevista')} />
              {errors.data_prevista && (
                <p className="text-sm text-destructive">{errors.data_prevista.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select 
                value={status} 
                onValueChange={(value) => setValue('status', value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="previsto">A Pagar</SelectItem>
                  <SelectItem value="pago">Pago</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-destructive">{errors.status.message}</p>
              )}
            </div>

            {status === 'pago' && (
              <div className="space-y-2">
                <Label htmlFor="data_paga">Data de Pagamento</Label>
                <Input id="data_paga" type="date" {...register('data_paga')} />
              </div>
            )}

            <div className="space-y-2 flex items-center gap-2 pt-6">
              <Checkbox 
                id="recorrente" 
                checked={recorrente}
                onCheckedChange={(checked) => setValue('recorrente', checked as boolean)}
              />
              <Label htmlFor="recorrente" className="cursor-pointer">
                Despesa Recorrente
              </Label>
            </div>

            {recorrente && (
              <div className="space-y-2">
                <Label htmlFor="duracao_meses">Duração (meses)</Label>
                <Input 
                  id="duracao_meses" 
                  type="number" 
                  min="1"
                  {...register('duracao_meses')}
                  placeholder="Ex: 3 para 3 meses"
                />
                {errors.duracao_meses && (
                  <p className="text-sm text-destructive">{errors.duracao_meses.message}</p>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="comprovante">Comprovante (arquivo ou URL)</Label>
            <Input id="comprovante" {...register('comprovante')} placeholder="Nome do arquivo ou URL" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacao">Observações</Label>
            <Textarea id="observacao" {...register('observacao')} rows={3} />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
