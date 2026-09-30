'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export interface RevenueData {
  day: string;
  follow: number;
  new: number;
  video: number;
}

export interface RevenueStackedBarChartProps {
  data: RevenueData[];
  height?: number;
}

export function RevenueStackedBarChart({ data, height = 230 }: RevenueStackedBarChartProps) {
  return (
    <>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          <CartesianGrid vertical={false} stroke="#e9eef5" />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#8292a7' }}
          />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#8292a7' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e9eef5',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            }}
          />
          <Bar dataKey="follow" stackId="a" fill="#1E40AF" radius={[0, 0, 0, 0]} />
          <Bar dataKey="new" stackId="a" fill="#4F6EFF" />
          <Bar dataKey="video" stackId="a" fill="#059669" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="text-muted-foreground mt-3 flex flex-wrap gap-4 text-[10px]">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-[#1E40AF]" />
          Follow-up
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-[#4F6EFF]" />
          New consultation
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-[#059669]" />
          Video
        </span>
      </div>
    </>
  );
}
