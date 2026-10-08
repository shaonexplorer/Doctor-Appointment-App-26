'use client';

import { useState, type ReactNode } from 'react';
import { StaffBooking } from '@/components/staff-booking';
import { StaffCheckin } from '@/components/staff-checkin';
import { StaffBilling } from '@/components/staff-billing';
import { NotificationCenter } from '@/components/notification-center';
import { GlobalSearch } from '@/components/global-search';
import {
  Bell,
  CalendarDays,
  Check,
  CircleHelp,
  ClipboardCheck,
  CreditCard,
  FileText,
  LayoutDashboard,
  Menu,
  Search,
  Settings,
  Stethoscope,
  Users,
  UserRound,
  X,
  Zap,
} from 'lucide-react';

const nav = [
  ['Dashboard', LayoutDashboard],
  ['Appointments', CalendarDays],
  ['Patients', Users],
  ['Doctors', Stethoscope],
  ['Check-in', ClipboardCheck],
  ['Billing', CreditCard],
  ['Schedule', Zap],
  ['Reports', FileText],
  ['Settings', Settings],
] as const;

const queue = [
  {
    patient: 'Sarah Johnson',
    initials: 'SJ',
    doctor: 'Dr. Michael Anderson',
    time: '09:30 AM',
    status: 'Checked in',
    payment: 'Paid',
    check: 'Room 204',
  },
  {
    patient: 'Robert Williams',
    initials: 'RW',
    doctor: 'Dr. Emily Carter',
    time: '10:00 AM',
    status: 'Waiting',
    payment: 'Pending',
    check: 'Front desk',
  },
  {
    patient: 'Jessica Brown',
    initials: 'JB',
    doctor: 'Dr. Michael Anderson',
    time: '10:30 AM',
    status: 'Confirmed',
    payment: 'Paid',
    check: '—',
  },
  {
    patient: 'David Miller',
    initials: 'DM',
    doctor: 'Dr. James Wilson',
    time: '11:00 AM',
    status: 'Checked in',
    payment: 'Paid',
    check: 'Room 108',
  },
  {
    patient: 'Maria Garcia',
    initials: 'MG',
    doctor: 'Dr. Emily Carter',
    time: '11:30 AM',
    status: 'Confirmed',
    payment: 'Pending',
    check: '—',
  },
];

export function StaffPortalShell() {
  const [active, setActive] = useState('Dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [notice, setNotice] = useState('');
  const filtered = queue.filter((row) =>
    `${row.patient} ${row.doctor}`.toLowerCase().includes(query.toLowerCase())
  );
  const go = (label: string) => {
    setActive(label);
    setMobileOpen(false);
  };

  return (
    <div className="bg-background text-foreground min-h-screen overflow-x-hidden">
      {mobileOpen && (
        <div
          className="bg-foreground/20 fixed inset-0 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
      <aside
        className={`border-border bg-card fixed inset-y-0 left-0 z-50 flex w-[264px] flex-col border-r shadow-xl transition-transform lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-5 py-6">
          <Brand />
          <button
            onClick={() => setMobileOpen(false)}
            className="text-muted-foreground hover:bg-secondary rounded-lg p-2 lg:hidden"
            aria-label="Close navigation"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="px-3">
          <p className="text-muted-foreground mb-3 px-3 text-[10px] font-bold tracking-[0.16em] uppercase">
            Staff portal
          </p>
          <nav className="flex flex-col gap-1">
            {nav.map(([label, Icon]) => (
              <button
                key={label}
                onClick={() => go(label)}
                aria-current={active === label ? 'page' : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${active === label ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
              >
                <Icon className="size-[18px]" />
                {label}
              </button>
            ))}
          </nav>
        </div>
        <div className="bg-secondary m-3 mt-auto rounded-2xl p-3">
          <div className="flex items-center gap-3">
            <div className="text-primary grid size-9 place-items-center rounded-full bg-[#d9e8ff] text-xs font-bold">
              JD
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold">Jordan Davis</p>
              <p className="text-muted-foreground truncate text-[11px]">Front Desk Coordinator</p>
            </div>
          </div>
        </div>
      </aside>
      <div className="min-w-0 lg:pl-[264px]">
        <header className="border-border bg-background/90 sticky top-0 z-30 flex h-[76px] items-center justify-between border-b px-4 backdrop-blur-md sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="text-muted-foreground hover:bg-secondary rounded-lg p-2 lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="size-5" />
            </button>
            <div className="text-muted-foreground hidden items-center gap-2 text-xs sm:flex">
              <span>Staff portal</span>
              <span>/</span>
              <span className="text-foreground font-semibold">{active}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <GlobalSearch role="staff" onNavigate={setActive} />
            <button
              onClick={() => setActive('Notifications')}
              className="text-muted-foreground hover:bg-secondary relative rounded-xl p-2.5"
              aria-label="Notifications"
            >
              <Bell className="size-[18px]" />
              <span className="border-background bg-primary absolute top-1.5 right-1.5 size-2 rounded-full border-2" />
            </button>
            <button
              className="text-muted-foreground hover:bg-secondary hidden rounded-xl p-2.5 sm:block"
              aria-label="Help"
            >
              <CircleHelp className="size-[18px]" />
            </button>
            <div className="text-primary grid size-9 place-items-center rounded-full bg-[#d9e8ff] text-xs font-bold">
              JD
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-[1440px] p-5 pb-24 sm:p-8 lg:p-10">
          {active === 'Book appointment' ? (
            <StaffBooking onBack={() => setActive('Dashboard')} />
          ) : active === 'Check-in' ? (
            <>
              <p className="text-primary mb-2 text-xs font-bold tracking-[0.16em] uppercase">
                Monday, September 21, 2026
              </p>
              <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Patient Check-in</h1>
              <p className="text-muted-foreground mt-2 max-w-xl text-sm">
                Find, verify, and move patients through today&apos;s queue with confidence.
              </p>
              <StaffCheckin />
            </>
          ) : active === 'Billing' ? (
            <>
              <p className="text-primary mb-2 text-xs font-bold tracking-[0.16em] uppercase">
                Monday, September 21, 2026
              </p>
              <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                Billing &amp; Payments
              </h1>
              <p className="text-muted-foreground mt-2 max-w-xl text-sm">
                Track transactions, collect payments, and keep every receipt organized.
              </p>
              <StaffBilling />
            </>
          ) : active === 'Notifications' ? (
            <>
              <p className="text-primary mb-2 text-xs font-bold tracking-[0.16em] uppercase">
                Staff portal
              </p>
              <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Notifications</h1>
              <NotificationCenter role="staff" />
            </>
          ) : (
            <>
              <p className="text-primary mb-2 text-xs font-bold tracking-[0.16em] uppercase">
                Monday, September 21, 2026
              </p>
              <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                {active === 'Dashboard' ? 'Good morning, Jordan' : active}
              </h1>
              <p className="text-muted-foreground mt-2 max-w-xl text-sm">
                {active === 'Dashboard'
                  ? 'Keep today’s front-desk flow moving smoothly.'
                  : `Manage ${active.toLowerCase()} workflows from one place.`}
              </p>
              {active === 'Dashboard' ? (
                <Dashboard
                  onAction={(text) =>
                    text === 'Booking workspace opened'
                      ? setActive('Book appointment')
                      : setNotice(text)
                  }
                  rows={filtered}
                />
              ) : (
                <Placeholder title={active} />
              )}
            </>
          )}
          {notice && (
            <div
              role="status"
              className="border-border bg-card fixed right-5 bottom-24 z-50 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold shadow-lg lg:bottom-6"
            >
              <Check className="text-primary size-4" />
              {notice}
            </div>
          )}
        </main>
        <nav className="border-border bg-card/95 fixed inset-x-0 bottom-0 z-30 flex h-[72px] items-center justify-around border-t px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
          {[
            ['Dashboard', LayoutDashboard],
            ['Appointments', CalendarDays],
            ['Check-in', ClipboardCheck],
            ['Billing', CreditCard],
            ['Patients', Users],
          ].map(([label, Icon]) => (
            <button
              key={label as string}
              onClick={() => go(label as string)}
              className={`mobile-touch-target flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl py-2 text-[10px] font-bold ${active === label ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <Icon className="size-[18px]" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-primary text-primary-foreground grid size-9 place-items-center rounded-xl shadow-sm">
        <span className="relative block size-4">
          <span className="absolute top-0 left-1/2 h-4 w-1 -translate-x-1/2 rounded-full bg-current" />
          <span className="absolute top-1/2 left-0 h-1 w-4 -translate-y-1/2 rounded-full bg-current" />
        </span>
      </div>
      <span className="text-lg font-black tracking-tight">
        Medi<span className="text-primary">Book</span>
      </span>
    </div>
  );
}
function Dashboard({ onAction, rows }: { onAction: (text: string) => void; rows: typeof queue }) {
  return (
    <div className="mt-8 flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Metric label="Today's appointments" value="24" tone="bg-[#edf3ff] text-primary" />
        <Metric label="Checked-in patients" value="8" tone="bg-[#e9f8f3] text-[#258c70]" />
        <Metric label="Waiting patients" value="3" tone="bg-[#fff3e7] text-[#d68b42]" />
        <Metric label="Completed consultations" value="11" tone="bg-[#f1edff] text-[#7864c8]" />
        <Metric label="Pending payments" value="$1,240" tone="bg-[#fff0ef] text-[#c9776d]" />
      </div>
      <section className="border-border bg-card rounded-2xl border shadow-sm">
        <div className="border-border flex flex-col gap-3 border-b p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="font-bold">Today’s appointment queue</h2>
            <p className="text-muted-foreground mt-1 text-xs">
              {rows.length} appointments need attention today
            </p>
          </div>
          <button
            onClick={() => onAction('Booking workspace opened')}
            className="bg-primary text-primary-foreground rounded-xl px-4 py-2.5 text-xs font-bold hover:opacity-90"
          >
            Book appointment
          </button>
        </div>
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary/60 text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
              <tr>
                <th className="px-6 py-3">Patient</th>
                <th className="px-6 py-3">Doctor</th>
                <th className="px-6 py-3">Time</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Payment</th>
                <th className="px-6 py-3">Check-in</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {rows.map((row) => (
                <QueueRow key={row.patient} row={row} onAction={onAction} />
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-3 p-4 md:hidden">
          {rows.map((row) => (
            <div key={row.patient} className="border-border rounded-xl border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-primary grid size-9 place-items-center rounded-full bg-[#d9e8ff] text-xs font-bold">
                    {row.initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{row.patient}</p>
                    <p className="text-muted-foreground text-xs">{row.doctor}</p>
                  </div>
                </div>
                <span className="bg-secondary rounded-full px-2 py-1 text-[10px] font-bold">
                  {row.status}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <span className="bg-secondary rounded-lg p-2">
                  <b>Time</b>
                  <br />
                  {row.time}
                </span>
                <span className="bg-secondary rounded-lg p-2">
                  <b>Payment</b>
                  <br />
                  {row.payment}
                </span>
              </div>
              <button
                onClick={() => onAction(`${row.patient} checked in`)}
                className="border-border hover:bg-secondary mt-3 w-full rounded-lg border py-2 text-xs font-bold"
              >
                {row.status === 'Checked in' ? 'Open patient' : 'Check in patient'}
              </button>
            </div>
          ))}
        </div>
      </section>
      <section>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="font-bold">Quick actions</h2>
            <p className="text-muted-foreground mt-1 text-xs">Common front-desk workflows</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <Action label="Book appointment" icon={CalendarDays} onClick={onAction} />
          <Action label="Register patient" icon={Users} onClick={onAction} />
          <Action label="Check in patient" icon={ClipboardCheck} onClick={onAction} />
          <Action label="Find doctor" icon={Stethoscope} onClick={onAction} />
          <Action label="Collect payment" icon={CreditCard} onClick={onAction} />
        </div>
      </section>
    </div>
  );
}
function Metric({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="border-border bg-card rounded-2xl border p-4 shadow-sm">
      <div className={`mb-3 inline-flex rounded-lg px-2.5 py-1.5 text-lg font-black ${tone}`}>
        {value}
      </div>
      <p className="text-muted-foreground text-xs">{label}</p>
    </div>
  );
}
function QueueRow({
  row,
  onAction,
}: {
  row: (typeof queue)[number];
  onAction: (text: string) => void;
}) {
  return (
    <tr className="hover:bg-secondary/30">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="text-primary grid size-8 place-items-center rounded-full bg-[#d9e8ff] text-[10px] font-bold">
            {row.initials}
          </div>
          <span className="font-bold">{row.patient}</span>
        </div>
      </td>
      <td className="text-muted-foreground px-6 py-4 text-xs">{row.doctor}</td>
      <td className="px-6 py-4 text-xs font-semibold">{row.time}</td>
      <td className="px-6 py-4">
        <span className="bg-secondary rounded-full px-2.5 py-1 text-[10px] font-bold">
          {row.status}
        </span>
      </td>
      <td className="px-6 py-4 text-xs font-semibold">{row.payment}</td>
      <td className="text-muted-foreground px-6 py-4 text-xs">{row.check}</td>
      <td className="px-6 py-4">
        <button
          onClick={() => onAction(`${row.patient} checked in`)}
          className="border-border hover:bg-secondary rounded-lg border px-3 py-1.5 text-[11px] font-bold"
        >
          {row.status === 'Checked in' ? 'Open' : 'Check in'}
        </button>
      </td>
    </tr>
  );
}
function Action({
  label,
  icon: Icon,
  onClick,
}: {
  label: string;
  icon: typeof CalendarDays;
  onClick: (label: string) => void;
}) {
  return (
    <button
      onClick={() => onClick(`${label} opened`)}
      className="border-border bg-card hover:border-primary/40 hover:bg-secondary flex items-center gap-3 rounded-xl border p-4 text-left text-xs font-bold shadow-sm transition hover:-translate-y-0.5"
    >
      <Icon className="text-primary size-4" />
      {label}
    </button>
  );
}
function Placeholder({ title }: { title: string }) {
  return (
    <div className="border-border bg-card mt-8 rounded-2xl border border-dashed p-12 text-center">
      <ClipboardCheck className="text-primary/60 mx-auto size-8" />
      <h2 className="mt-4 font-bold">{title} workspace</h2>
      <p className="text-muted-foreground mt-2 text-sm">
        Front-desk workflow tools for {title.toLowerCase()} are ready to connect here.
      </p>
    </div>
  );
}
