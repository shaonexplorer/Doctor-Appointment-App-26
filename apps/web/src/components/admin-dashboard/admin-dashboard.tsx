'use client';

import { useState } from 'react';
import { AdminUsers } from '@/components/admin-users';
import { AdminDoctors } from '@/components/admin-doctors';
import { AdminFacilities } from '@/components/admin-facilities';
import { AdminAnalytics } from '@/components/admin-analytics';
import { NotificationCenter } from '@/components/admin-notification-center';
import { GlobalSearch } from '@/components/admin-global-search';
import { AdminUXStateLibrary } from '@/components/admin-ux-state-library';
import {
  Activity,
  Bell,
  Building2,
  CalendarDays,
  CircleHelp,
  ClipboardList,
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  MoreHorizontal,
  PanelLeft,
  Settings,
  ShieldCheck,
  Stethoscope,
  Users,
  UserRound,
  X,
  AlertTriangle,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type StatCardProps = {
  title: string;
  value: string;
  trend: string;
  icon: React.ElementType;
  tone: string;
};

function Card({ title, value, trend, icon: Icon, tone }: StatCardProps) {
  return (
    <div className="border-border bg-card rounded-2xl border p-4 shadow-sm">
      <div className={`grid size-9 place-items-center rounded-xl ${tone}`}>
        <Icon className="size-4" />
      </div>
      <p className="text-muted-foreground mt-4 text-[11px] font-semibold tracking-wide uppercase">
        {title}
      </p>
      <p className="text-foreground mt-1 text-xl font-black tracking-tight">{value}</p>
      <p className="text-primary mt-1 text-[11px] font-medium">{trend}</p>
    </div>
  );
}

import {
  Area,
  AreaChart,
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
import { cn } from 'cn';
import { Button } from '../ui/button';

const growth = [
  { name: 'Apr', users: 820 },
  { name: 'May', users: 980 },
  { name: 'Jun', users: 1180 },
  { name: 'Jul', users: 1410 },
  { name: 'Aug', users: 1720 },
  { name: 'Sep', users: 2080 },
];

const status = [
  { name: 'Scheduled', value: 42, color: 'var(--primary)' },
  { name: 'Completed', value: 34, color: 'var(--secondary)' },
  { name: 'Cancelled', value: 15, color: 'var(--destructive)' },
  { name: 'No-show', value: 9, color: 'var(--tertiary)' },
];

const specialties = [
  { name: 'Cardiology', value: 420 },
  { name: 'Dermatology', value: 350 },
  { name: 'Pediatrics', value: 290 },
  { name: 'Neurology', value: 240 },
  { name: 'Orthopedics', value: 180 },
];

const revenue = [
  { name: 'Apr', revenue: 78 },
  { name: 'May', revenue: 92 },
  { name: 'Jun', revenue: 106 },
  { name: 'Jul', revenue: 124 },
  { name: 'Aug', revenue: 138 },
  { name: 'Sep', revenue: 156 },
];

const utilization = [
  { name: 'Cardiology', value: 88 },
  { name: 'Dermatology', value: 82 },
  { name: 'Pediatrics', value: 76 },
  { name: 'Neurology', value: 71 },
  { name: 'Orthopedics', value: 64 },
];

const nav = [
  ['Dashboard', LayoutDashboard],
  ['Users', Users],
  ['Doctors', Stethoscope],
  ['Patients', UserRound],
  ['Staff', ShieldCheck],
  ['Appointments', CalendarDays],
  ['Clinics', Building2],
  ['Departments', PanelLeft],
  ['Analytics', Activity],
  ['Payments', CreditCard],
  ['Reports', FileText],
  ['Settings', Settings],
] as const;

export function AdminDashboard() {
  const [active, setActive] = useState('Dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [_notice, setNotice] = useState('');
  const go = (item: string) => {
    setActive(item);
    setMobileOpen(false);
    if (item !== 'Dashboard') setNotice(`${item} workspace selected`);
  };
  return (
    <div className="bg-background text-foreground min-h-screen">
      {mobileOpen && (
        <div
          className="bg-background/30 fixed inset-0 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={`border-border bg-card fixed inset-y-0 left-0 z-50 flex w-[252px] flex-col border-r transition-transform lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-5 py-6">
          <Brand />
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-2 text-slate-400 lg:hidden"
            aria-label="Close navigation"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="px-3">
          <p className="text-muted-foreground mb-3 px-3 text-[10px] font-bold tracking-[0.17em] uppercase">
            Admin console
          </p>
          <nav className="flex flex-col gap-1">
            {nav.map(([label, Icon]) => (
              <button
                key={label}
                onClick={() => go(label)}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold transition-colors',
                  active === label
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                <Icon className="size-[17px]" />
                {label}
              </button>
            ))}
          </nav>
        </div>
        <div className="bg-card m-3 mt-auto rounded-2xl p-3">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary grid size-9 place-items-center rounded-full text-xs font-bold">
              AM
            </div>
            <div>
              <p className="text-xs font-bold">Alex Morgan</p>
              <p className="text-[11px] text-slate-500">System Administrator</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" className="rounded-full p-2">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-44" align="end">
                <DropdownMenuItem
                  onClick={() => {
                    void fetch('/api/auth/logout', {
                      method: 'POST',
                      credentials: 'include',
                    }).then(() => {
                      window.location.href = '/login';
                    });
                  }}
                  className="text-destructive focus:text-destructive flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>
      <div className="min-w-0 lg:pl-[252px]">
        <header className="border-border bg-card/90 sticky top-0 z-30 flex h-[76px] items-center justify-between border-b px-4 backdrop-blur-md sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-slate-500 lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="size-5" />
            </button>
            <div className="hidden text-xs text-slate-400 sm:block">
              Admin console <span className="mx-2">/</span>
              <span className="text-foreground font-semibold lg:text-lg">{active}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <GlobalSearch role="admin" onNavigate={go} />
            <button
              onClick={() => setActive('Notifications')}
              className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-50"
              aria-label="Notifications"
            >
              <Bell className="size-[18px]" />
              <span className="bg-warning absolute top-1.5 right-1.5 size-2 rounded-full" />
            </button>
            <button
              className="hidden rounded-xl p-2.5 text-slate-500 hover:bg-slate-50 sm:block"
              aria-label="Help"
            >
              <CircleHelp className="size-[18px]" />
            </button>
            <div className="bg-primary/10 text-primary grid size-9 place-items-center rounded-full text-xs font-bold">
              AM
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-[1500px] p-5 pb-24 sm:p-8 lg:p-10">
          <p className="text-muted-foreground mb-2 text-xs font-bold tracking-[0.16em] uppercase">
            Monday, September 21, 2026
          </p>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                {active === 'Dashboard' ? 'Good morning, Alex' : active}
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                {active === 'Dashboard'
                  ? "Here's what's happening across your healthcare network."
                  : `System-wide ${active.toLowerCase()} overview and operations.`}
              </p>
            </div>
            <button
              onClick={() => setNotice('Report export started')}
              className="border-border bg-card text-foreground hover:bg-accent inline-flex items-center gap-2 self-start rounded-xl border px-4 py-2.5 text-xs font-bold shadow-sm"
            >
              <FileText className="size-4" /> Export report
            </button>
          </div>
          {active === 'Dashboard' ? (
            <Dashboard />
          ) : active === 'Users' ? (
            <AdminUsers />
          ) : active === 'Doctors' ? (
            <AdminDoctors />
          ) : active === 'Clinics' ? (
            <AdminFacilities kind="Clinics" />
          ) : active === 'Departments' ? (
            <AdminFacilities kind="Departments" />
          ) : active === 'Analytics' ? (
            <AdminAnalytics />
          ) : active === 'Notifications' ? (
            <NotificationCenter role="admin" />
          ) : active === 'Settings' ? (
            <AdminUXStateLibrary />
          ) : (
            <div className="border-border bg-card mt-8 rounded-2xl border border-dashed p-12 text-center">
              <ClipboardList className="text-muted-foreground mx-auto size-8" />
              <h2 className="mt-4 font-bold">{active} workspace</h2>
              <p className="mt-2 text-sm text-slate-500">
                System-wide tools for {active.toLowerCase()} are ready to connect here.
              </p>
            </div>
          )}
        </main>
        <nav className="border-border bg-card/95 fixed inset-x-0 bottom-0 z-30 flex h-[72px] items-center justify-around border-t px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
          {(
            [
              ['Dashboard', LayoutDashboard],
              ['Users', Users],
              ['Doctors', Stethoscope],
              ['Analytics', Activity],
              ['Appointments', CalendarDays],
            ] as const
          ).map(([label, Icon]) => (
            <button
              key={label}
              onClick={() => go(label)}
              className={`mobile-touch-target flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl py-2 text-[10px] font-bold ${active === label ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <Icon className="size-[18px]" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
        {/* {notice && (
          <div
            role="status"
            className="border-border bg-card fixed right-5 bottom-6 z-50 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold shadow-lg"
          >
            <ShieldCheck className="text-success size-4" />
            {notice}
          </div>
        )} */}
      </div>
    </div>
  );
}
function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-primary grid size-9 place-items-center rounded-xl text-white shadow-sm">
        <span className="relative block size-4">
          <span className="absolute top-0 left-1/2 h-4 w-1 -translate-x-1/2 rounded-full bg-current" />
          <span className="absolute top-1/2 left-0 h-1 w-4 -translate-y-1/2 rounded-full bg-current" />
        </span>
      </div>
      <span className="text-foreground text-lg font-black tracking-tight">
        Medi<span className="text-primary">Book</span>
      </span>
    </div>
  );
}

function ChartBox({
  title,
  subtitle,
  children,
  className = '',
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`border-border bg-card min-w-0 rounded-2xl border p-5 shadow-sm ${className}`}
    >
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="text-foreground text-sm font-bold">{title}</h2>
          <p className="mt-1 text-[11px] text-slate-500">{subtitle}</p>
        </div>
        <button
          className="rounded-lg p-1 text-slate-400 hover:bg-slate-50"
          aria-label={`${title} options`}
        >
          <MoreHorizontal className="size-4" />
        </button>
      </div>
      {children}
    </section>
  );
}

function Feed({
  title,
  items,
  icon: Icon,
  warning = false,
}: {
  title: string;
  items: string[];
  icon: typeof Activity;
  warning?: boolean;
}) {
  return (
    <section className="border-border bg-card rounded-2xl border p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <Icon className={`size-4 ${warning ? 'text-warning' : 'text-primary'}`} />
        <h2 className="text-sm font-bold">{title}</h2>
      </div>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item} className="flex gap-2 text-xs leading-5 text-slate-500">
            <span
              className={`mt-2 size-1.5 shrink-0 rounded-full ${warning ? 'bg-warning' : 'bg-primary'}`}
            />
            {item}
          </div>
        ))}
      </div>
      <button className="text-primary mt-5 text-xs font-bold">View all</button>
    </section>
  );
}

function Dashboard() {
  return (
    <div className="mt-8 flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <Card
          title="Total users"
          value="12,480"
          trend="+12.8% vs last month"
          icon={Users}
          tone="bg-primary/10 text-primary"
        />
        <Card
          title="Active doctors"
          value="486"
          trend="+4.2% vs last month"
          icon={Stethoscope}
          tone="bg-primary/10 text-primary"
        />
        <Card
          title="Registered patients"
          value="10,842"
          trend="+15.6% vs last month"
          icon={UserRound}
          tone="bg-primary/10 text-primary"
        />
        <Card
          title="Today's appointments"
          value="328"
          trend="+8.4% vs yesterday"
          icon={CalendarDays}
          tone="bg-primary/10 text-primary"
        />
        <Card
          title="Monthly revenue"
          value="$284.6K"
          trend="+18.2% vs last month"
          icon={CreditCard}
          tone="bg-primary/10 text-primary"
        />
        <Card
          title="Completion rate"
          value="91.4%"
          trend="+2.1% vs last month"
          icon={Activity}
          tone="bg-primary/10 text-primary"
        />
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.3fr_.7fr]">
        <ChartBox title="User growth" subtitle="Total registered users over the last six months">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={growth}>
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
                dataKey="users"
                stroke="var(--primary)"
                strokeWidth={3}
                dot={{ r: 3, fill: 'var(--primary)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartBox>
        <ChartBox title="Appointment status" subtitle="Current month distribution">
          <div className="flex items-center justify-center gap-5">
            <ResponsiveContainer width="55%" height={220}>
              <PieChart>
                <Pie
                  data={status}
                  dataKey="value"
                  innerRadius={58}
                  outerRadius={82}
                  paddingAngle={3}
                >
                  {status.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {status.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <span className="size-2.5 rounded-full" style={{ background: item.color }} />
                  <span className="text-slate-500">{item.name}</span>
                  <strong className="text-foreground ml-auto">{item.value}%</strong>
                </div>
              ))}
            </div>
          </div>
        </ChartBox>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <ChartBox title="Appointments by specialty" subtitle="Completed and scheduled visits">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={specialties} layout="vertical" margin={{ left: 12 }}>
              <CartesianGrid stroke="var(--muted)" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                axisLine={false}
                tickLine={false}
                width={85}
                tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
              />
              <Bar dataKey="value" fill="var(--primary)" radius={[0, 6, 6, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>
        <ChartBox title="Revenue trend" subtitle="Monthly revenue in thousands">
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={revenue}>
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
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
                stroke="var(--primary)"
                fill="url(#revenueFill)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartBox>
      </div>
      <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <ChartBox title="Doctor utilization" subtitle="Average booked capacity by specialty">
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={utilization}>
              <CartesianGrid stroke="var(--muted)" vertical={false} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
              />
              <YAxis
                unit="%"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
              />
              <Bar dataKey="value" fill="var(--success)" radius={[6, 6, 0, 0]} barSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>
        <div className="grid gap-5 sm:grid-cols-2">
          <Feed
            title="Recent activity"
            items={[
              'Dr. Carter added 4 appointment slots',
              'Payment #PMT-0482 was refunded',
              'New clinic: Northside Health added',
              'Dr. Patel updated availability for next week',
              'System maintenance completed successfully',
              'New patient: John Doe registered',
              'Dr. Smith completed 12 appointments today',
            ]}
            icon={Activity}
          />
          <Feed
            title="Operational alerts"
            items={[
              '7 pending payment reviews',
              '2 doctors have low availability',
              'System backup completed',
              '3 clinics require license renewal',
              '1 doctor has submitted a leave request',
              'New clinic: Southside Health added',
              'Dr. Johnson updated their profile',
            ]}
            icon={AlertTriangle}
            warning
          />
        </div>
      </div>
    </div>
  );
}
