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
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDespesasCRUD } from '@/hooks/useDespesasCRUD';
import { despesaSchema, DespesaFormValues, CATEGORIAS_DESPESAS } from '@/lib/validations';
import { PlusCircle, Upload } from 'lucide-react';

interface DespesaFormDialogProps {
  trigger?: React.ReactNode;
}

export function DespesaFormDialog({ trigger }: DespesaFormDialogProps) {
  const [open, setOpen] = useState(false);
  const { createDespesa, isCreating } = useDespesasCRUD();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<DespesaFormValues>({
    resolver: zodResolver(despesaSchema),
    defaultValues: {
      status: 'previsto',
      recorrente: false,
      tipo: undefined,
      categoria: undefined,
    },
  });

  const status = watch('status');
  const recorrente = watch('recorrente');

  const onSubmit = (data: DespesaFormValues) => {
    createDespesa(data as any, {
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
            Nova Despesa
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Despesa</DialogTitle>
          <DialogDescription>
            Preencha os dados da nova despesa
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
              <Select onValueChange={(value) => setValue('categoria', value as any)}>
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
              <Select onValueChange={(value) => setValue('tipo', value as any)}>
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
              <Input id="forma_pagamento" {...register('forma_pagamento')} placeholder="Ex: Boleto, Cartão" />
              {errors.forma_pagamento && (
                <p className="text-sm text-destructive">{errors.forma_pagamento.message}</p>
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
                <Label htmlFor="data_paga">Data Paga</Label>
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
                <p className="text-xs text-muted-foreground">
                  Informe por quantos meses essa despesa se repetirá
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="comprovante">Anexar Comprovante</Label>
            <div className="flex items-center gap-2">
              <Input 
                id="comprovante" 
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // Por enquanto, armazena apenas o nome do arquivo
                    setValue('comprovante', file.name);
                  }
                }}
                className="cursor-pointer"
              />
              <Upload className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">
              Formatos aceitos: PDF, imagens (PNG, JPG)
            </p>
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
              {isCreating ? 'Salvando...' : 'Salvar Despesa'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
