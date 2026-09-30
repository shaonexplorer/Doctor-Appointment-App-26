'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export interface VolumeData {
  day: string;
  patients: number;
}

export interface VolumeChartProps {
  data: VolumeData[];
  height?: number;
}

export function VolumeChart({ data, height = 220 }: VolumeChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical">
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
          width={50}
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
        <Bar dataKey="patients" fill="#1E40AF" radius={[4, 0, 0, 4]} maxBarSize={32} />
      </BarChart>
    </ResponsiveContainer>
  );
}
