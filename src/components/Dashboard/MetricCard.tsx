import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  trend?: {
    value: number;
    label: string;
  };
}

export function MetricCard({ title, value, icon, trend }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="text-muted-foreground">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {trend && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            {trend.value > 0 ? (
              <ArrowUpIcon className="h-3 w-3 text-success" />
            ) : (
              <ArrowDownIcon className="h-3 w-3 text-destructive" />
            )}
            <span className={trend.value > 0 ? 'text-success' : 'text-destructive'}>
              {Math.abs(trend.value)}%
            </span>
            <span>{trend.label}</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
