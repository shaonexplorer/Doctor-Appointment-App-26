'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { Download, FileText, TrendingUp } from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toast';

const ranges = ['Today', '7 days', '30 days', '3 months', '6 months', 'Custom'] as const;

// --- Mock report data (ready to wire to /api/reports endpoints) ---

const appointmentsOverTime = [
  { name: 'Week 1', total: 820, completed: 704 },
  { name: 'Week 2', total: 910, completed: 782 },
  { name: 'Week 3', total: 980, completed: 846 },
  { name: 'Week 4', total: 1120, completed: 972 },
  { name: 'Week 5', total: 1240, completed: 1086 },
  { name: 'Week 6', total: 1380, completed: 1212 },
];

const appointmentStatus = [
  { name: 'Scheduled', value: 42, color: 'var(--primary)' },
  { name: 'Completed', value: 34, color: 'var(--secondary)' },
  { name: 'Cancelled', value: 15, color: 'var(--destructive)' },
  { name: 'No-show', value: 9, color: 'var(--tertiary)' },
];

const paymentStatus = [
  { name: 'Paid', value: 74, color: 'var(--secondary)' },
  { name: 'Pending', value: 18, color: 'var(--tertiary)' },
  { name: 'Refunded', value: 8, color: 'var(--primary)' },
];

const appointmentsBySpecialty = [
  { name: 'Cardiology', value: 420 },
  { name: 'Dermatology', value: 350 },
  { name: 'Pediatrics', value: 290 },
  { name: 'Neurology', value: 240 },
  { name: 'Orthopedics', value: 180 },
];

const revenueOverTime = [
  { name: 'Apr', revenue: 78 },
  { name: 'May', revenue: 92 },
  { name: 'Jun', revenue: 106 },
  { name: 'Jul', revenue: 124 },
  { name: 'Aug', revenue: 138 },
  { name: 'Sep', revenue: 156 },
];

const doctorUtilization = [
  { name: 'Cardiology', value: 88 },
  { name: 'Dermatology', value: 82 },
  { name: 'Pediatrics', value: 76 },
  { name: 'Neurology', value: 71 },
  { name: 'Orthopedics', value: 64 },
];

const patientRegistrations = [
  { name: 'Apr', patients: 840 },
  { name: 'May', patients: 1020 },
  { name: 'Jun', patients: 1180 },
  { name: 'Jul', patients: 1390 },
  { name: 'Aug', patients: 1670 },
  { name: 'Sep', patients: 2040 },
];

const kpis = [
  { title: 'Total appointments', value: '4,826', trend: '+12.8%' },
  { title: 'Total revenue', value: '$284.6K', trend: '+18.2%' },
  { title: 'Active doctors', value: '486', trend: '+4.2%' },
  { title: 'Active patients', value: '10,842', trend: '+15.6%' },
  { title: 'Completion rate', value: '91.4%', trend: '+2.1%' },
  { title: 'Pending payments', value: '$42.3K', trend: '+5.1%' },
];

const insights = [
  'Completed appointments are up 9.4% versus the previous period.',
  'Cardiology leads specialty demand with 420 appointments.',
  'Doctor utilization is strongest in Cardiology at 88%.',
  'Patient registrations have grown 143% since April.',
  '74% of payments are collected successfully.',
];

export function AdminReports() {
  const [range, setRange] = useState<(typeof ranges)[number]>('30 days');
  const [notice, setNotice] = useState('');

  const rangeLabel = useMemo(
    () => (range === 'Custom' ? 'Sep 1 – Sep 21, 2026' : `Last ${range.toLowerCase()}`),
    [range]
  );

  return (
    <div className="mt-8 space-y-5">
      {/* Period selector + export */}
      <section
        className={cn(
          'border-border bg-card flex flex-col gap-3 rounded-2xl border p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between'
        )}
      >
        <div className="flex items-center gap-2 text-sm font-bold">
          <FileText className="text-primary size-4" />
          Report period <span className="text-muted-foreground font-normal">{rangeLabel}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {ranges.map((item) => (
            <button
              key={item}
              onClick={() => setRange(item)}
              className={`rounded-lg px-3 py-2 text-xs font-bold ${range === item ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary'}`}
            >
              {item}
            </button>
          ))}
          {range === 'Custom' && (
            <div className="flex items-center gap-2">
              <Label htmlFor="report-from" className="text-[10px] font-bold uppercase">From</Label>
              <Input
                id="report-from"
                type="date"
                className="h-9 w-[150px] text-xs"
              />
              <Label htmlFor="report-to" className="text-[10px] font-bold uppercase ml-2">To</Label>
              <Input
                id="report-to"
                type="date"
                className="h-9 w-[150px] text-xs"
              />
            </div>
          )}
          <Button
            onClick={() => setNotice('Report export started')}
            className="border-border text-foreground inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold"
          >
            <Download className="size-3.5" /> Export report
          </Button>
        </div>
      </section>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {kpis.map((item) => (
          <Metric key={item.title} {...item} />
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
        <Chart title="Appointments over time" subtitle="Volume and completed visits">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={appointmentsOverTime}>
              <CartesianGrid stroke="var(--muted)" vertical={false} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
              />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="total"
                name="Appointments"
                stroke="var(--primary)"
                strokeWidth={3}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="completed"
                name="Completed"
                stroke="var(--secondary)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Chart>
        <Chart title="Appointment status" subtitle="Share of all appointments">
          <Donut data={appointmentStatus} />
        </Chart>
      </div>

      {/* Charts row 2 */}
      <div className="grid gap-5 xl:grid-cols-2">
        <Chart title="Appointments by specialty" subtitle="Current period volume">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={appointmentsBySpecialty} layout="vertical" margin={{ left: 18, right: 18 }}>
              <CartesianGrid stroke="var(--muted)" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                axisLine={false}
                tickLine={false}
                width={92}
                tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
              />
              <Bar
                dataKey="value"
                name="Appointments"
                fill="var(--primary)"
                radius={[0, 6, 6, 0]}
              />
              <Tooltip />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        </Chart>
        <Chart title="Revenue over time" subtitle="Revenue in thousands">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenueOverTime}>
              <defs>
                <linearGradient id="reportsRevenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--muted)" vertical={false} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
              />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue ($K)"
                stroke="var(--primary)"
                fill="url(#reportsRevenueFill)"
                strokeWidth={3}
              />
              <Legend />
            </AreaChart>
          </ResponsiveContainer>
        </Chart>
      </div>

      {/* Charts row 3 */}
      <div className="grid gap-5 xl:grid-cols-2">
        <Chart title="Doctor utilization" subtitle="Booked capacity by specialty">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={doctorUtilization} layout="vertical" margin={{ left: 18, right: 18 }}>
              <CartesianGrid stroke="var(--muted)" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} unit="%" hide />
              <YAxis
                type="category"
                dataKey="name"
                axisLine={false}
                tickLine={false}
                width={92}
                tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
              />
              <Bar
                dataKey="value"
                name="Utilization"
                fill="var(--secondary)"
                radius={[0, 6, 6, 0]}
                label={{
                  position: 'right',
                  fontSize: 11,
                  fill: 'var(--muted-foreground)',
                  formatter: (v: number) => `${v}%`,
                }}
              />
              <Tooltip />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        </Chart>
        <Chart title="Patient registration growth" subtitle="New patient registrations">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={patientRegistrations}>
              <CartesianGrid stroke="var(--muted)" vertical={false} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="patients"
                name="New patients"
                stroke="var(--tertiary)"
                strokeWidth={3}
                dot={{ r: 3, fill: 'var(--tertiary)' }}
              />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </Chart>
      </div>

      {/* Charts row 4 */}
      <div className="grid gap-5 xl:grid-cols-2">
        <Chart title="Payment status" subtitle="Collected, pending, and refunded payments">
          <Donut data={paymentStatus} />
        </Chart>
        <div className="border-border bg-card rounded-2xl border p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-success size-4" />
            <h2 className="text-sm font-bold">Report highlights</h2>
          </div>
          <div className="mt-5 space-y-4">
            {insights.map((item) => (
              <div key={item} className="flex gap-3 text-sm text-slate-500">
                <span className="bg-primary mt-2 size-2 shrink-0 rounded-full" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {notice && (
        <div
          role="status"
          className="border-border bg-card fixed right-5 bottom-6 z-50 rounded-xl border px-4 py-3 text-sm font-semibold shadow-lg"
        >
          {notice}
        </div>
      )}

      {/* Toaster for notifications */}
      <Toaster />
    </div>
  );
}

function Metric({
  title,
  value,
  trend,
}: {
  title: string;
  value: string;
  trend: string;
}) {
  return (
    <div className="border-border bg-card rounded-2xl p-4 shadow-sm">
      <p className="text-muted-foreground text-[11px] font-semibold">{title}</p>
      <p className="text-foreground mt-2 text-xl font-black tabular-nums">{value}</p>
      <p className="mt-3 text-[11px] font-bold text-primary">{trend} vs prior</p>
    </div>
  );
}

function Chart({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <section className="border-border bg-card min-w-0 rounded-2xl p-5 shadow-sm">
      <h2 className="text-foreground text-sm font-bold">{title}</h2>
      <p className="mt-1 text-[11px] text-slate-500">{subtitle}</p>
      <div className="mt-4 min-w-0">{children}</div>
    </section>
  );
}

function Donut({ data }: { data: { name: string; value: number; color: string }[] }) {
  return (
    <div className="flex min-h-[260px] items-center justify-center gap-5">
      <ResponsiveContainer width="55%" height={230}>
        <PieChart>
          <Pie data={data} dataKey="value" innerRadius={60} outerRadius={88} paddingAngle={3}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
            <Tooltip />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2 text-xs text-slate-500">
            <span className="size-2 rounded-full" style={{ background: item.color }} />
            {item.name}
            <strong className="text-foreground ml-2">{item.value}%</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminReports;
