'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export interface RevenueData {
  type: string;
  amount: number;
}

export interface RevenueStackedBarChartProps {
  data: RevenueData[];
  height?: number;
}

export function RevenueStackedBarChart({ data, height = 230 }: RevenueStackedBarChartProps) {
  // Transform data for stacked bar chart by day
  // The backend returns revenue by consultation type, we need to create daily breakdown
  // For now, we'll show a simple bar chart by consultation type
  const chartData = data.map((item) => ({
    day: item.type,
    amount: item.amount,
  }));

  return (
    <>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid vertical={false} stroke="#e9eef5" />
          <XAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#8292a7' }}
            type="number"
          />
          <YAxis
            dataKey="day"
            type="category"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#8292a7' }}
            width={100}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e9eef5',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            }}
            labelStyle={{ color: '#1e293b', fontWeight: 600 }}
            itemStyle={{ fontSize: 12 }}
          />
          <Bar dataKey="amount" fill="#1E40AF" radius={[4, 0, 0, 4]} maxBarSize={32} />
        </BarChart>
      </ResponsiveContainer>
      <div className="text-muted-foreground mt-3 flex flex-wrap gap-4 text-[10px]">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-[#1E40AF]" />
          Revenue by Type
        </span>
      </div>
    </>
  );
}
