'use client';

import { useMemo, useState } from 'react';
import { CalendarDays, ClipboardCheck, CreditCard, Stethoscope, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const queue = [
  {
    patient: 'Sarah Johnson',
    initials: 'SJ',
    doctor: 'Dr. Michael Anderson',
    time: '09:30 AM',
    status: 'Checked In',
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
    status: 'Checked In',
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

const statusTone: Record<string, string> = {
  Waiting: 'bg-[#fff3e7] text-[#b8782f]',
  'Checked In': 'bg-[#e9f8f3] text-[#258c70]',
  Confirmed: 'bg-[#edf3ff] text-primary',
  Completed: 'bg-secondary text-muted-foreground',
  'No-show': 'bg-[#fff0ef] text-[#b86f63]',
};

export function StaffDashboard({ onAction }: { onAction: (text: string) => void }) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(
    () =>
      queue.filter((row) =>
        `${row.patient} ${row.doctor}`.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

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
            <h2 className="font-bold">Today's appointment queue</h2>
            <p className="text-muted-foreground mt-1 text-xs">
              {filtered.length} appointments need attention today
            </p>
          </div>
          <Button onClick={() => onAction('Booking workspace opened')}>Book appointment</Button>
        </div>
        {/* <div className="border-border flex flex-col gap-3 border-b p-4">
          <label className="relative min-w-[220px] flex-1">
            <input
              aria-label="Search queue"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search patient or doctor..."
              className="border-border bg-background focus:border-primary focus:ring-primary/15 h-10 w-full rounded-xl border pr-3 pl-9 text-xs outline-none focus:ring-2"
            />
          </label>
        </div> */}
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
              {filtered.map((row) => (
                <QueueRow key={row.patient} row={row} onAction={onAction} />
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-3 p-4 md:hidden">
          {filtered.map((row) => (
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
              <Button
                variant="outline"
                className="mt-3 w-full"
                onClick={() => onAction(`${row.patient} checked in`)}
              >
                {row.status === 'Checked In' ? 'Open patient' : 'Check in patient'}
              </Button>
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
        <Badge className={statusTone[row.status]}>{row.status}</Badge>
      </td>
      <td className="px-6 py-4 text-xs font-semibold">{row.payment}</td>
      <td className="text-muted-foreground px-6 py-4 text-xs">{row.check}</td>
      <td className="px-6 py-4">
        <Button variant="outline" size="xs" onClick={() => onAction(`${row.patient} checked in`)}>
          {row.status === 'Checked In' ? 'Open' : 'Check in'}
        </Button>
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
    <Button
      variant="outline"
      onClick={() => onClick(`${label} opened`)}
      className="flex items-center gap-3 rounded-xl p-4 text-left text-xs font-bold shadow-sm transition hover:-translate-y-0.5"
    >
      <Icon className="text-primary size-4" />
      {label}
    </Button>
  );
}
