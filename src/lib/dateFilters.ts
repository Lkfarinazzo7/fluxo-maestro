import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays, addMonths, isWithinInterval, parseISO } from 'date-fns';

export type PeriodType = 'hoje' | 'semana' | 'mes' | 'proximoMes' | '7dias' | '30dias' | 'personalizado';

export interface DateRange {
  start: Date;
  end: Date;
}

export function getPeriodRange(period: PeriodType, customStart?: Date, customEnd?: Date): DateRange {
  const now = new Date();
  
  switch (period) {
    case 'hoje':
      return {
        start: startOfDay(now),
        end: endOfDay(now)
      };
    
    case 'semana':
      return {
        start: startOfWeek(now, { weekStartsOn: 0 }),
        end: endOfWeek(now, { weekStartsOn: 0 })
      };
    
    case 'mes':
      return {
        start: startOfMonth(now),
        end: endOfMonth(now)
      };
    
    case 'proximoMes':
      const nextMonth = addMonths(now, 1);
      return {
        start: startOfMonth(nextMonth),
        end: endOfMonth(nextMonth)
      };
    
    case '7dias':
      return {
        start: startOfDay(subDays(now, 6)),
        end: endOfDay(now)
      };
    
    case '30dias':
      return {
        start: startOfDay(subDays(now, 29)),
        end: endOfDay(now)
      };
    
    case 'personalizado':
      return {
        start: customStart ? startOfDay(customStart) : startOfDay(now),
        end: customEnd ? endOfDay(customEnd) : endOfDay(now)
      };
    
    default:
      return {
        start: startOfMonth(now),
        end: endOfMonth(now)
      };
  }
}

export function isDateInRange(dateString: string, range: DateRange): boolean {
  try {
    const date = parseISO(dateString);
    return isWithinInterval(date, { start: range.start, end: range.end });
  } catch {
    return false;
  }
}

export function filterByDateRange<T extends { [key: string]: any }>(
  items: T[],
  dateField: keyof T,
  range: DateRange
): T[] {
  return items.filter(item => {
    const dateValue = item[dateField];
    if (typeof dateValue === 'string') {
      return isDateInRange(dateValue, range);
    }
    return false;
  });
}
