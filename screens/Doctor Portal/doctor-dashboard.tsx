'use client';

import { useState, type ReactNode } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  MoreHorizontal,
  Play,
  UserRound,
  UsersRound,
} from 'lucide-react';

const volume = [
  { day: 'Mon', patients: 18 },
  { day: 'Tue', patients: 24 },
  { day: 'Wed', patients: 21 },
  { day: 'Thu', patients: 29 },
  { day: 'Fri', patients: 25 },
  { day: 'Sat', patients: 14 },
  { day: 'Sun', patients: 10 },
];
const utilization = [
  { name: 'Booked', value: 68, color: '#536dfe' },
  { name: 'Available', value: 22, color: '#a6d8cf' },
  { name: 'Cancelled', value: 10, color: '#f2b7a8' },
];
const revenue = [
  { day: 'Mon', follow: 420, new: 260, video: 180 },
  { day: 'Tue', follow: 560, new: 320, video: 220 },
  { day: 'Wed', follow: 480, new: 390, video: 150 },
  { day: 'Thu', follow: 620, new: 420, video: 260 },
  { day: 'Fri', follow: 520, new: 350, video: 200 },
];
const appointments = [
  {
    time: '09:00 AM',
    patient: 'Sarah Johnson',
    type: 'Follow-up',
    status: 'Confirmed',
    payment: 'Paid',
  },
  {
    time: '09:30 AM',
    patient: 'Robert Chen',
    type: 'New consultation',
    status: 'Waiting',
    payment: 'Paid',
  },
  {
    time: '10:30 AM',
    patient: 'Emily Davis',
    type: 'Video consultation',
    status: 'Confirmed',
    payment: 'Pending',
  },
  {
    time: '11:15 AM',
    patient: 'James Wilson',
    type: 'Follow-up',
    status: 'Confirmed',
    payment: 'Paid',
  },
];
const recent = [
  {
    patient: 'Sarah Johnson',
    visit: 'Sep 14, 2026',
    diagnosis: 'Hypertension',
    appointment: 'Follow-up',
    initials: 'SJ',
  },
  {
    patient: 'Robert Chen',
    visit: 'Sep 11, 2026',
    diagnosis: 'Arrhythmia',
    appointment: 'Consultation',
    initials: 'RC',
  },
  {
    patient: 'Emily Davis',
    visit: 'Sep 08, 2026',
    diagnosis: 'Palpitations',
    appointment: 'Video visit',
    initials: 'ED',
  },
];

export function DoctorDashboard() {
  const [notice, setNotice] = useState('');
  const [range, setRange] = useState('Week');
  const action = (label: string) => setNotice(`${label} action is ready for the selected patient.`);
  return (
    <div className="mt-8 space-y-5">
      {notice && (
        <div
          role="status"
          className="border-primary/20 bg-primary/5 text-primary rounded-xl border px-4 py-3 text-sm font-semibold"
        >
          {notice}
        </div>
      )}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          icon={CalendarDays}
          label="Today's appointments"
          value="12"
          detail="3 more than average"
          tone="text-primary bg-[#edf3ff]"
        />
        <Metric
          icon={CheckCircle2}
          label="Completed consultations"
          value="8"
          detail="67% of today's visits"
          tone="text-[#2b9d7e] bg-[#e9f8f3]"
        />
        <Metric
          icon={Clock3}
          label="Waiting patients"
          value="3"
          detail="Average wait 12 min"
          tone="text-[#d68b42] bg-[#fff3e7]"
        />
        <Metric
          icon={CircleDollarSign}
          label="Today's revenue"
          value="$1,240"
          detail="18% above last Monday"
          tone="text-[#8767d8] bg-[#f2edff]"
        />
      </div>
      <section className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-bold">Upcoming appointments</h2>
            <p className="text-muted-foreground mt-1 text-xs">Your clinic schedule for today</p>
          </div>
          <button
            onClick={() => action('Schedule view')}
            className="border-border hover:bg-secondary rounded-xl border px-3 py-2 text-xs font-bold"
          >
            View full schedule
          </button>
        </div>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[780px] text-left text-sm">
            <thead>
              <tr className="border-border text-muted-foreground border-b text-[10px] tracking-wider uppercase">
                <th className="pb-3">Time</th>
                <th className="pb-3">Patient</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Payment</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((item) => (
                <tr key={item.time} className="border-border/70 border-b last:border-0">
                  <td className="text-primary py-4 font-bold">{item.time}</td>
                  <td className="py-4 font-bold">{item.patient}</td>
                  <td className="text-muted-foreground py-4">{item.type}</td>
                  <td className="py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${item.status === 'Waiting' ? 'bg-[#fff3e7] text-[#bd7b31]' : 'bg-[#e9f8f3] text-[#258c70]'}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <span
                      className={`text-xs font-bold ${item.payment === 'Paid' ? 'text-[#258c70]' : 'text-[#bd7b31]'}`}
                    >
                      {item.payment}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => action('Start consultation')}
                        aria-label={`Start consultation for ${item.patient}`}
                        className="text-primary hover:bg-primary/10 rounded-lg p-2"
                      >
                        <Play className="size-4" />
                      </button>
                      <button
                        onClick={() => action('View patient')}
                        aria-label={`View patient ${item.patient}`}
                        className="text-muted-foreground hover:bg-secondary rounded-lg p-2"
                      >
                        <UserRound className="size-4" />
                      </button>
                      <button
                        onClick={() => action('More options')}
                        aria-label={`More options for ${item.patient}`}
                        className="text-muted-foreground hover:bg-secondary rounded-lg p-2"
                      >
                        <MoreHorizontal className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <div className="grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
        <ChartCard
          title="Patient volume"
          subtitle="Daily patient visits"
          action={
            <div className="bg-secondary flex rounded-lg p-0.5">
              {['Day', 'Week', 'Month'].map((item) => (
                <button
                  key={item}
                  onClick={() => setRange(item)}
                  className={`rounded-md px-2.5 py-1 text-[10px] font-bold ${range === item ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground'}`}
                >
                  {item}
                </button>
              ))}
            </div>
          }
        >
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={volume}>
              <CartesianGrid vertical={false} stroke="#e9eef5" />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#8292a7' }}
              />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#8292a7' }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="patients"
                stroke="#536dfe"
                strokeWidth={3}
                dot={{ r: 4, fill: '#536dfe' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Slot utilization" subtitle="Today's appointment capacity">
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="52%" height={180}>
              <PieChart>
                <Pie
                  data={utilization}
                  dataKey="value"
                  innerRadius={55}
                  outerRadius={78}
                  paddingAngle={3}
                >
                  {utilization.map((item) => (
                    <Cell key={item.name} fill={item.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {utilization.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <span className="size-2.5 rounded-full" style={{ background: item.color }} />
                  <span className="text-muted-foreground">{item.name}</span>
                  <strong className="ml-auto">{item.value}%</strong>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <ChartCard title="Revenue breakdown" subtitle="Consultation revenue by type">
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={revenue}>
              <CartesianGrid vertical={false} stroke="#e9eef5" />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#8292a7' }}
              />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#8292a7' }} />
              <Tooltip />
              <Bar dataKey="follow" stackId="a" fill="#536dfe" radius={[0, 0, 0, 0]} />
              <Bar dataKey="new" stackId="a" fill="#8f9dff" />
              <Bar dataKey="video" stackId="a" fill="#a6d8cf" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="text-muted-foreground mt-3 flex flex-wrap gap-4 text-[10px]">
            <Legend color="#536dfe" label="Follow-up" />
            <Legend color="#8f9dff" label="New consultation" />
            <Legend color="#a6d8cf" label="Video" />
          </div>
        </ChartCard>
        <section className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
          <h2 className="font-bold">Today&apos;s schedule</h2>
          <p className="text-muted-foreground mt-1 text-xs">A visual timeline of your clinic day</p>
          <div className="mt-5 space-y-1">
            {appointments.map((item, index) => (
              <div key={item.time} className="flex gap-3">
                <div className="text-muted-foreground w-16 pt-3 text-right text-[10px] font-bold">
                  {item.time}
                </div>
                <div className="border-border relative flex flex-1 gap-3 border-l pb-4 pl-4">
                  <span
                    className={`border-card absolute top-3 -left-1.5 size-2.5 rounded-full border-2 ${index === 1 ? 'bg-[#d68b42]' : 'bg-primary'}`}
                  />
                  <div className="bg-secondary w-full rounded-xl px-3 py-2.5">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold">{item.patient}</p>
                      <span className="text-muted-foreground text-[10px]">{item.type}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <section className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold">Recent patients</h2>
            <p className="text-muted-foreground mt-1 text-xs">
              Patients seen recently in your clinic
            </p>
          </div>
          <button
            onClick={() => action('Patient directory')}
            className="text-primary text-xs font-bold hover:underline"
          >
            View all patients
          </button>
        </div>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead>
              <tr className="border-border text-muted-foreground border-b text-[10px] tracking-wider uppercase">
                <th className="pb-3">Patient</th>
                <th className="pb-3">Last visit</th>
                <th className="pb-3">Diagnosis</th>
                <th className="pb-3">Appointment</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((item) => (
                <tr key={item.patient} className="border-border/70 border-b last:border-0">
                  <td className="flex items-center gap-3 py-4">
                    <span className="text-primary grid size-8 place-items-center rounded-full bg-[#d9e8ff] text-[10px] font-bold">
                      {item.initials}
                    </span>
                    <span className="font-bold">{item.patient}</span>
                  </td>
                  <td className="text-muted-foreground py-4">{item.visit}</td>
                  <td className="py-4">{item.diagnosis}</td>
                  <td className="text-muted-foreground py-4">{item.appointment}</td>
                  <td className="py-4 text-right">
                    <button
                      onClick={() => action(`Viewing ${item.patient}`)}
                      className="text-primary hover:bg-primary/10 rounded-lg px-3 py-1.5 text-xs font-bold"
                    >
                      View record
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
function Metric({
  icon: Icon,
  label,
  value,
  detail,
  tone,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: string;
  detail: string;
  tone: string;
}) {
  return (
    <div className="border-border bg-card rounded-2xl border p-4 shadow-sm">
      <div className={`grid size-10 place-items-center rounded-xl ${tone}`}>
        <Icon className="size-5" />
      </div>
      <p className="text-muted-foreground mt-4 text-xs">{label}</p>
      <p className="mt-1 text-2xl font-black tracking-tight">{value}</p>
      <p className="text-muted-foreground mt-1 text-[10px]">{detail}</p>
    </div>
  );
}
function ChartCard({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-bold">{title}</h2>
          <p className="text-muted-foreground mt-1 text-xs">{subtitle}</p>
        </div>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}
function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="size-2 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}
