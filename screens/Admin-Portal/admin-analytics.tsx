'use client';

import { useMemo, useState, type ReactNode } from 'react';
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
import { CalendarDays, Download, Filter, TrendingUp } from 'lucide-react';

const ranges = ['Today', '7 days', '30 days', '3 months', '6 months', 'Custom'];
const appointments = [
  { name: 'Apr 1', total: 820, completed: 704 },
  { name: 'Apr 8', total: 910, completed: 782 },
  { name: 'Apr 15', total: 980, completed: 846 },
  { name: 'Apr 22', total: 1120, completed: 972 },
  { name: 'Apr 29', total: 1240, completed: 1086 },
  { name: 'May 6', total: 1380, completed: 1212 },
];
const specialties = [
  { name: 'Cardiology', value: 420 },
  { name: 'Dermatology', value: 350 },
  { name: 'Pediatrics', value: 290 },
  { name: 'Neurology', value: 240 },
  { name: 'Orthopedics', value: 180 },
];
const status = [
  { name: 'Completed', value: 68, color: '#43ae91' },
  { name: 'Scheduled', value: 17, color: '#5d83d8' },
  { name: 'Cancelled', value: 9, color: '#d9a45d' },
  { name: 'No-shows', value: 6, color: '#d47778' },
];
const revenue = [
  { name: 'Apr 1', amount: 42 },
  { name: 'Apr 8', amount: 58 },
  { name: 'Apr 15', amount: 64 },
  { name: 'Apr 22', amount: 72 },
  { name: 'Apr 29', amount: 81 },
  { name: 'May 6', amount: 94 },
];
const utilization = [
  { name: 'Cardiology', value: 92 },
  { name: 'Dermatology', value: 87 },
  { name: 'Pediatrics', value: 81 },
  { name: 'Neurology', value: 76 },
  { name: 'Orthopedics', value: 69 },
];
const registrations = [
  { name: 'Apr', patients: 840 },
  { name: 'May', patients: 1020 },
  { name: 'Jun', patients: 1180 },
  { name: 'Jul', patients: 1390 },
  { name: 'Aug', patients: 1670 },
  { name: 'Sep', patients: 2040 },
];
const payments = [
  { name: 'Paid', value: 74, color: '#43ae91' },
  { name: 'Pending', value: 18, color: '#d9a45d' },
  { name: 'Refunded', value: 8, color: '#826fd1' },
];

export function AdminAnalytics() {
  const [range, setRange] = useState('30 days');
  const [notice, setNotice] = useState('');
  const rangeLabel = useMemo(
    () => (range === 'Custom' ? 'Sep 1 – Sep 21, 2026' : `Last ${range.toLowerCase()}`),
    [range]
  );
  return (
    <div className="mt-8 space-y-5">
      <div className="flex flex-col gap-3 rounded-2xl border border-[#e5e9f2] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm font-bold">
          <CalendarDays className="size-4 text-[#5d83d8]" /> Analytics period{' '}
          <span className="font-normal text-slate-400">{rangeLabel}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {ranges.map((item) => (
            <button
              key={item}
              onClick={() => setRange(item)}
              className={`rounded-lg px-3 py-2 text-xs font-bold ${range === item ? 'bg-[#eaf0ff] text-[#4f72c9]' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              {item}
            </button>
          ))}
          <button
            onClick={() => setNotice('Analytics report export started')}
            className="inline-flex items-center gap-2 rounded-lg border border-[#dce2ee] px-3 py-2 text-xs font-bold text-slate-600"
          >
            <Download className="size-3.5" /> Export
          </button>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-7">
        <Metric title="Total appointments" value="4,826" trend="+12.8%" />
        <Metric title="Completed" value="3,284" trend="+9.4%" />
        <Metric title="Cancelled" value="434" trend="-4.2%" negative />
        <Metric title="No-shows" value="289" trend="-8.1%" negative />
        <Metric title="Revenue" value="$284.6K" trend="+18.2%" />
        <Metric title="Active doctors" value="486" trend="+4.2%" />
        <Metric title="Active patients" value="10,842" trend="+15.6%" />
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
        <Chart title="Appointments over time" subtitle="Volume and completed visits">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={appointments}>
              <Grid />
              <Axis />
              <Line
                type="monotone"
                dataKey="total"
                name="Appointments"
                stroke="#5d83d8"
                strokeWidth={3}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="completed"
                name="Completed"
                stroke="#43ae91"
                strokeWidth={2}
                dot={false}
              />
              <Tip />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </Chart>
        <Chart title="Appointment status" subtitle="Share of all appointments">
          <Donut data={status} />
        </Chart>
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <Chart title="Appointments by specialty" subtitle="Current period volume">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={specialties} layout="vertical" margin={{ left: 18, right: 18 }}>
              <Grid />
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                axisLine={false}
                tickLine={false}
                width={92}
                tick={{ fontSize: 11, fill: '#8993a7' }}
              />
              <Bar dataKey="value" name="Appointments" fill="#5d83d8" radius={[0, 6, 6, 0]} />
              <Tip />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        </Chart>
        <Chart title="Revenue over time" subtitle="Revenue in thousands">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenue}>
              <Grid />
              <Axis />
              <Area
                type="monotone"
                dataKey="amount"
                name="Revenue ($K)"
                stroke="#826fd1"
                fill="#eeeaff"
                strokeWidth={3}
              />
              <Tip />
              <Legend />
            </AreaChart>
          </ResponsiveContainer>
        </Chart>
      </div>
      <div className="grid gap-5 xl:grid-cols-[.9fr_1.1fr]">
        <Chart title="Doctor utilization" subtitle="Booked capacity by specialty">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={utilization} layout="vertical" margin={{ left: 18, right: 18 }}>
              <Grid />
              <XAxis type="number" domain={[0, 100]} unit="%" hide />
              <YAxis
                type="category"
                dataKey="name"
                axisLine={false}
                tickLine={false}
                width={92}
                tick={{ fontSize: 11, fill: '#8993a7' }}
              />
              <Bar
                dataKey="value"
                name="Utilization"
                fill="#43ae91"
                radius={[0, 6, 6, 0]}
                label={{
                  position: 'right',
                  fontSize: 11,
                  fill: '#64748b',
                  formatter: (v) => `${v}%`,
                }}
              />
              <Tip />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        </Chart>
        <Chart title="Patient registration growth" subtitle="New patient registrations">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={registrations}>
              <Grid />
              <Axis />
              <Line
                type="monotone"
                dataKey="patients"
                name="New patients"
                stroke="#d39a56"
                strokeWidth={3}
                dot={{ r: 3, fill: '#d39a56' }}
              />
              <Tip />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </Chart>
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <Chart title="Payment status" subtitle="Collected, pending, and refunded payments">
          <Donut data={payments} />
        </Chart>
        <div className="rounded-2xl border border-[#e5e9f2] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <TrendingUp className="size-4 text-[#43ae91]" />
            <h2 className="text-sm font-bold">Analytics highlights</h2>
          </div>
          <div className="mt-5 space-y-4">
            {[
              'Completed appointments are up 9.4% versus the previous period.',
              'Cardiology leads specialty demand with 420 appointments.',
              'Doctor utilization is strongest in Cardiology at 92%.',
              'Patient registrations have grown 142% since April.',
              '74% of payments are collected successfully.',
            ].map((item) => (
              <div key={item} className="flex gap-3 text-sm text-slate-500">
                <span className="mt-2 size-2 shrink-0 rounded-full bg-[#5d83d8]" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
      {notice && (
        <div
          role="status"
          className="fixed right-5 bottom-6 z-50 rounded-xl border border-[#dce2ee] bg-white px-4 py-3 text-sm font-semibold shadow-lg"
        >
          {notice}
        </div>
      )}
    </div>
  );
}
function Metric({
  title,
  value,
  trend,
  negative = false,
}: {
  title: string;
  value: string;
  trend: string;
  negative?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[#e5e9f2] bg-white p-4 shadow-sm">
      <p className="text-[11px] font-semibold text-slate-500">{title}</p>
      <p className="mt-2 text-xl font-black text-[#17233d]">{value}</p>
      <p className={`mt-3 text-[11px] font-bold ${negative ? 'text-[#43ae91]' : 'text-[#43ae91]'}`}>
        {trend} vs prior
      </p>
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
    <section className="min-w-0 rounded-2xl border border-[#e5e9f2] bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold text-[#17233d]">{title}</h2>
      <p className="mt-1 text-[11px] text-slate-500">{subtitle}</p>
      <div className="mt-4 min-w-0">{children}</div>
    </section>
  );
}
function Grid() {
  return <CartesianGrid stroke="#eef1f6" vertical={false} />;
}
function Axis() {
  return (
    <>
      <XAxis
        dataKey="name"
        axisLine={false}
        tickLine={false}
        tick={{ fontSize: 11, fill: '#8993a7' }}
      />
      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#8993a7' }} />
    </>
  );
}
function Tip() {
  return <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e9f2', fontSize: 12 }} />;
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
          </Pie>
          <Tip />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2 text-xs text-slate-500">
            <span className="size-2 rounded-full" style={{ background: item.color }} />
            {item.name}
            <strong className="ml-2 text-[#17233d]">{item.value}%</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
