'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

export interface UtilizationData {
  name: string;
  value: number;
  color: string;
  total: number;
}

export interface UtilizationDonutChartProps {
  data: UtilizationData[];
  height?: number;
}

export function UtilizationDonutChart({ data, height = 180 }: UtilizationDonutChartProps) {
  // Calculate total for percentage display
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="w-full">
      <div className="flex items-center justify-center" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={55}
              outerRadius={78}
              paddingAngle={3}
              label={({ name, percent }) =>
                total > 0 && percent > 0.05 ? `${name} ${(percent * 100).toFixed(0)}%` : null
              }
              labelLine={false}
            >
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
              formatter={(value: number, name: string) => {
                const item = data.find((d) => d.name === name);
                const percentage =
                  total > 0 ? (((item?.value || 0) / total) * 100).toFixed(1) : '0';
                return [value, `${name} (${percentage}%)`];
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {total > 0 && (
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-1.5 text-xs">
              <span className="size-2 rounded-full" style={{ background: item.color }} />
              <span className="text-muted-foreground">{item.name}</span>
              <strong className="text-foreground ml-1">
                {Math.round((item.value / total) * 100)}%
              </strong>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
