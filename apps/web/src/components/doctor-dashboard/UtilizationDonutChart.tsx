'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

export interface UtilizationData {
  name: string;
  value: number;
  color: string;
}

export interface UtilizationDonutChartProps {
  data: UtilizationData[];
  height?: number;
}

export function UtilizationDonutChart({ data, height = 180 }: UtilizationDonutChartProps) {
  return (
    <div className="flex items-center gap-4">
      <ResponsiveContainer width="52%" height={height}>
        <PieChart>
          <Pie data={data} dataKey="value" innerRadius={55} outerRadius={78} paddingAngle={3}>
            {data.map((item) => (
              <Cell key={item.name} fill={item.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e9eef5',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2 text-xs">
            <span className="size-2.5 rounded-full" style={{ background: item.color }} />
            <span className="text-muted-foreground">{item.name}</span>
            <strong className="ml-auto">{item.value}%</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
