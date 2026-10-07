'use client';

import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { cn } from '@/lib/utils';

export interface PieChartData {
  name: string;
  value: number;
  color: string;
}

export interface PieChartProps {
  data: PieChartData[];
  total?: string | number;
  totalLabel?: string;
  className?: string;
}

export function SpecialtyPieChart({
  data,
  total,
  totalLabel = 'visits',
  className,
}: PieChartProps) {
  return (
    <div className={cn('flex items-center gap-5', className)}>
      <div className="relative h-44 w-44 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={52}
              outerRadius={74}
              paddingAngle={3}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              wrapperStyle={{ zIndex: 1000 }}
              formatter={(value: number, name: string) => [`${value}%`, name]}
              contentStyle={{
                backgroundColor: 'rgba(189, 200, 212, 0.65)', // Semi-transparent color (required for blur to show)
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(187, 196, 206, 0.8)',
                borderRadius: '8px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 z-0 grid place-items-center">
          <div className="text-center">
            <p className="text-2xl font-black">
              {total ?? data.reduce((sum, d) => sum + d.value, 0)}
            </p>
            <p className="text-muted-foreground text-[10px]">{totalLabel}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2 text-xs">
            <span className="size-2.5 rounded-full" style={{ background: item.color }} />
            <span className="text-muted-foreground">{item.name}</span>
            <span className="ml-auto font-black">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export interface BarChartData {
  month: string;
  amount: number;
}

export interface BarChartProps {
  data: BarChartData[];
  barColor?: string;
  className?: string;
  height?: number;
}

export function MonthlyExpensesBarChart({
  data,
  barColor = '#4c46cd',
  className,
  height = 224,
}: BarChartProps) {
  return (
    <div className={cn('h-56', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 4, left: -18, bottom: 0 }}>
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#489ce6' }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#489ce6' }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            cursor={{ fill: '#a197d3' }}
            formatter={(value: number) => [`$${value}`, 'Expenses']}
            contentStyle={{
              backgroundColor: '#c2c8cd',
              border: '1px solid #ccd1d7',
              borderRadius: '8px',
            }}
          />
          <Bar dataKey="amount" fill={barColor} radius={[6, 6, 0, 0]} barSize={45} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
