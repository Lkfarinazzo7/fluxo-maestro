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
import { useContratosCRUD } from '@/hooks/useContratosCRUD';
import { contratoSchema, ContratoFormValues, OPERADORAS } from '@/lib/validations';
import { PlusCircle, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface ContratoFormDialogProps {
  trigger?: React.ReactNode;
}

export function ContratoFormDialog({ trigger }: ContratoFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [dataBancaria, setDataBancaria] = useState<Date>();
  const [dataBonificacao, setDataBonificacao] = useState<Date>();
  const { createContrato, isCreating } = useContratosCRUD();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ContratoFormValues>({
    resolver: zodResolver(contratoSchema),
    defaultValues: {
      tipo_contrato: undefined,
      operadora: undefined,
    },
  });

  const valorMensalidade = watch('valor_mensalidade');

  const onSubmit = (data: ContratoFormValues) => {
    createContrato(data as any, {
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
            Novo Contrato
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Contrato</DialogTitle>
          <DialogDescription>
            Preencha os dados do novo contrato
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Contrato *</Label>
              <Input id="nome" {...register('nome')} />
              {errors.nome && (
                <p className="text-sm text-destructive">{errors.nome.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="operadora">Operadora *</Label>
              <Select onValueChange={(value) => setValue('operadora', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a operadora" />
                </SelectTrigger>
                <SelectContent>
                  {OPERADORAS.map((op) => (
                    <SelectItem key={op} value={op}>
                      {op}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.operadora && (
                <p className="text-sm text-destructive">{String(errors.operadora.message)}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria *</Label>
              <Input id="categoria" {...register('categoria')} placeholder="Ex: Empresarial, Individual" />
              {errors.categoria && (
                <p className="text-sm text-destructive">{errors.categoria.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo_contrato">Tipo de Contrato *</Label>
              <Select onValueChange={(value) => setValue('tipo_contrato', value as 'PJ' | 'PF')}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PJ">PJ</SelectItem>
                  <SelectItem value="PF">PF</SelectItem>
                </SelectContent>
              </Select>
              {errors.tipo_contrato && (
                <p className="text-sm text-destructive">{errors.tipo_contrato.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor_mensalidade">Valor da Mensalidade *</Label>
              <Input 
                id="valor_mensalidade" 
                type="text"
                {...register('valor_mensalidade')}
                placeholder="R$ 0,00"
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  const numValue = parseFloat(value) / 100;
                  setValue('valor_mensalidade', numValue);
                  e.target.value = numValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                }}
                onBlur={(e) => {
                  const numValue = parseFloat(String(valorMensalidade || 0));
                  e.target.value = numValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                }}
              />
              {errors.valor_mensalidade && (
                <p className="text-sm text-destructive">{errors.valor_mensalidade.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="percentual_comissao">Percentual de Comissão (%) *</Label>
              <Input id="percentual_comissao" type="number" step="0.01" {...register('percentual_comissao')} placeholder="Ex: 280 = 280%" />
              {errors.percentual_comissao && (
                <p className="text-sm text-destructive">{errors.percentual_comissao.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bonificacao_por_vida">Bonificação por Vida (R$) *</Label>
              <Input id="bonificacao_por_vida" type="number" step="0.01" {...register('bonificacao_por_vida')} />
              {errors.bonificacao_por_vida && (
                <p className="text-sm text-destructive">{errors.bonificacao_por_vida.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantidade_vidas">Quantidade de Vidas *</Label>
              <Input id="quantidade_vidas" type="number" {...register('quantidade_vidas')} />
              {errors.quantidade_vidas && (
                <p className="text-sm text-destructive">{errors.quantidade_vidas.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="data_implantacao">Data de Implantação *</Label>
              <Input id="data_implantacao" type="date" {...register('data_implantacao')} />
              {errors.data_implantacao && (
                <p className="text-sm text-destructive">{errors.data_implantacao.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="previsao_recebimento_bancaria">Previsão Recebimento Bancária *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dataBancaria && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataBancaria ? format(dataBancaria, "dd/MM/yyyy", { locale: ptBR }) : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dataBancaria}
                    onSelect={(date) => {
                      setDataBancaria(date);
                      if (date) {
                        setValue('previsao_recebimento_bancaria', format(date, 'yyyy-MM-dd'));
                      }
                    }}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              {errors.previsao_recebimento_bancaria && (
                <p className="text-sm text-destructive">{errors.previsao_recebimento_bancaria.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="previsao_recebimento_bonificacao">Previsão Recebimento Bonificação</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dataBonificacao && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataBonificacao ? format(dataBonificacao, "dd/MM/yyyy", { locale: ptBR }) : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dataBonificacao}
                    onSelect={(date) => {
                      setDataBonificacao(date);
                      if (date) {
                        setValue('previsao_recebimento_bonificacao', format(date, 'yyyy-MM-dd'));
                      }
                    }}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea id="observacoes" {...register('observacoes')} rows={3} />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? 'Salvando...' : 'Salvar Contrato'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
