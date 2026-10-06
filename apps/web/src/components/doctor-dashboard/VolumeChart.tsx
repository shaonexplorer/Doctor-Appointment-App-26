'use client';

import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export interface VolumeData {
  date: string;
  count: number;
  label: string;
}

export interface VolumeChartProps {
  data: VolumeData[];
  height?: number;
}

export function VolumeChart({ data, height = 220 }: VolumeChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid vertical={false} stroke="#e9eef5" />
        <XAxis
          dataKey="label"
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
          labelStyle={{ color: '#1e293b', fontWeight: 600 }}
          itemStyle={{ fontSize: 12 }}
        />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#1E40AF"
          strokeWidth={3}
          dot={{ r: 4, fill: '#1E40AF' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
