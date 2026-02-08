import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PeriodType } from '@/lib/dateFilters';
import { cn } from '@/lib/utils';

interface PeriodFilterProps {
  value: PeriodType;
  customStart?: Date;
  customEnd?: Date;
  onValueChange: (value: PeriodType) => void;
  onCustomStartChange: (date?: Date) => void;
  onCustomEndChange: (date?: Date) => void;
}

export function PeriodFilter({
  value,
  customStart,
  customEnd,
  onValueChange,
  onCustomStartChange,
  onCustomEndChange,
}: PeriodFilterProps) {
  const [showCustom, setShowCustom] = useState(false);

  const handlePeriodChange = (newValue: string) => {
    const periodValue = newValue as PeriodType;
    onValueChange(periodValue);
    setShowCustom(periodValue === 'personalizado');
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Select value={value} onValueChange={handlePeriodChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Selecione o período" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="hoje">Hoje</SelectItem>
          <SelectItem value="semana">Semana Atual</SelectItem>
          <SelectItem value="mes">Mês Atual</SelectItem>
          <SelectItem value="proximoMes">Próximo Mês</SelectItem>
          <SelectItem value="7dias">Últimos 7 Dias</SelectItem>
          <SelectItem value="30dias">Últimos 30 Dias</SelectItem>
          <SelectItem value="personalizado">Período Personalizado</SelectItem>
        </SelectContent>
      </Select>

      {showCustom && (
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[140px] justify-start text-left font-normal">
                <Calendar className="mr-2 h-4 w-4" />
                {customStart ? format(customStart, 'dd/MM/yyyy', { locale: ptBR }) : 'Data início'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={customStart}
                onSelect={onCustomStartChange}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>

          <span className="text-muted-foreground">até</span>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[140px] justify-start text-left font-normal">
                <Calendar className="mr-2 h-4 w-4" />
                {customEnd ? format(customEnd, 'dd/MM/yyyy', { locale: ptBR }) : 'Data fim'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={customEnd}
                onSelect={onCustomEndChange}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
}
