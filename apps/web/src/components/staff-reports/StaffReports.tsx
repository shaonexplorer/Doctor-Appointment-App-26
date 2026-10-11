'use client';

import { useState, type ReactNode } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CalendarDays, Download, FileBarChart, FileText, Printer, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const volume = [
  { name: 'Mon', appointments: 42, completed: 34 },
  { name: 'Tue', appointments: 51, completed: 45 },
  { name: 'Wed', appointments: 47, completed: 39 },
  { name: 'Thu', appointments: 63, completed: 52 },
  { name: 'Fri', appointments: 58, completed: 48 },
  { name: 'Sat', appointments: 29, completed: 25 },
];

const specialties = [
  { name: 'Cardiology', value: 126 },
  { name: 'Dermatology', value: 98 },
  { name: 'Pediatrics', value: 84 },
  { name: 'Neurology', value: 71 },
  { name: 'Orthopedics', value: 62 },
];

const reports = [
  {
    title: 'Daily appointment report',
    description: 'Appointments, attendance, and payments for today',
    date: 'Sep 21, 2026',
    format: 'PDF',
  },
  {
    title: 'Weekly operations summary',
    description: 'Clinic performance and patient flow overview',
    date: 'Sep 14–20, 2026',
    format: 'CSV',
  },
  {
    title: 'Payment collection report',
    description: 'Paid, pending, and refunded transactions',
    date: 'September 2026',
    format: 'XLSX',
  },
];

const rangeOptions = ['Today', 'This week', 'This month', 'Custom'] as const;
type RangeOption = (typeof rangeOptions)[number];

export function StaffReports() {
  const [range, setRange] = useState<RangeOption>('This week');
  const [notice, setNotice] = useState('');

  const notify = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 2600);
  };

  return (
    <div className="mt-8 space-y-5" aria-label="Staff reports">
      {/* Period Selector & Export */}
      <div className="border-border bg-card flex flex-col gap-3 rounded-2xl border p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm font-bold">
          <CalendarDays className="text-primary size-4" aria-hidden="true" />
          <span>Reporting period</span>
          <span className="text-muted-foreground font-normal">{range}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {rangeOptions.map((item) => (
            <button
              key={item}
              onClick={() => setRange(item)}
              className={cn(
                'rounded-lg px-3 py-2 text-xs font-bold transition-colors',
                range === item
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              )}
            >
              {item}
            </button>
          ))}
          <button
            onClick={() => notify('Report export started')}
            className="border-border inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold transition-colors hover:bg-secondary"
          >
            <Download className="size-3.5" aria-hidden="true" />
            Export
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Total appointments" value="290" trend="+12.4%" />
        <Metric label="Completed visits" value="243" trend="+8.7%" />
        <Metric label="No-show rate" value="4.8%" trend="-1.2%" />
        <Metric label="Collected payments" value="$18,640" trend="+15.2%" />
      </div>

      {/* Charts */}
      <div className="grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
        <Chart title="Appointment volume" subtitle="Booked versus completed visits">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={volume}>
              <CartesianGrid stroke="#eef1f6" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-lg)',
                }}
              />
              <Line
                type="monotone"
                dataKey="appointments"
                stroke="var(--chart-1)"
                strokeWidth={3}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="completed"
                stroke="var(--chart-2)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Chart>
        <Chart title="Appointments by specialty" subtitle="Current reporting period">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={specialties} layout="vertical" margin={{ left: 12, right: 18 }}>
              <CartesianGrid stroke="#eef1f6" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                width={86}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10 }}
              />
              <Bar dataKey="value" fill="var(--chart-1)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Chart>
      </div>

      {/* Saved Reports */}
      <section className="border-border bg-card rounded-2xl border shadow-sm">
        <div className="border-border flex flex-col gap-3 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold">Saved reports</h2>
            <p className="text-muted-foreground mt-1 text-xs">
              Download or print commonly used front-desk reports.
            </p>
          </div>
          <button
            onClick={() => notify('Report builder opened')}
            className="bg-primary text-primary-foreground inline-flex items-center gap-2 self-start rounded-xl px-4 py-2.5 text-xs font-bold transition-colors hover:bg-primary/90"
          >
            <FileBarChart className="size-4" aria-hidden="true" />
            Create report
          </button>
        </div>
        <div className="divide-border divide-y">
          {reports.map((report) => (
            <div
              key={report.title}
              className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="bg-secondary text-primary grid size-10 place-items-center rounded-xl">
                  <FileText className="size-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-bold">{report.title}</p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {report.description} · {report.date}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 pl-[52px] sm:pl-0">
                <span className="bg-secondary text-muted-foreground rounded-full px-2.5 py-1 text-[10px] font-bold">
                  {report.format}
                </span>
                <button
                  onClick={() => notify(`${report.title} downloaded`)}
                  className="border-border text-muted-foreground hover:bg-secondary rounded-lg border p-2 transition-colors"
                  aria-label={`Download ${report.title}`}
                >
                  <Download className="size-4" aria-hidden="true" />
                </button>
                <button
                  onClick={() => notify(`${report.title} sent to printer`)}
                  className="border-border text-muted-foreground hover:bg-secondary rounded-lg border p-2 transition-colors"
                  aria-label={`Print ${report.title}`}
                >
                  <Printer className="size-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Toast Notification */}
      {notice && (
        <div
          role="status"
          aria-live="polite"
          className="border-border bg-card fixed right-5 bottom-6 z-50 rounded-xl border px-4 py-3 text-sm font-semibold shadow-lg"
        >
          {notice}
        </div>
      )}
    </div>
  );
}

interface MetricProps {
  label: string;
  value: string;
  trend: string;
}

function Metric({ label, value, trend }: MetricProps) {
  return (
    <div className="border-border bg-card rounded-2xl border p-4 shadow-sm">
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="mt-2 text-2xl font-black tracking-tight tabular-nums">{value}</p>
      <p className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-success">
        <TrendingUp className="size-3" aria-hidden="true" />
        {trend} vs prior
      </p>
    </div>
  );
}

interface ChartProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

function Chart({ title, subtitle, children }: ChartProps) {
  return (
    <section className="border-border bg-card min-w-0 rounded-2xl border p-5 shadow-sm">
      <h2 className="text-sm font-bold">{title}</h2>
      <p className="text-muted-foreground mt-1 text-xs">{subtitle}</p>
      <div className="mt-4 min-w-0">{children}</div>
    </section>
  );
}

export default StaffReports;