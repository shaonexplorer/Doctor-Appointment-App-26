'use client';

import { useMemo, useState, type ReactNode } from 'react';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MoreHorizontal,
  Plus,
  Search,
  UserRound,
} from 'lucide-react';

const doctors = [
  { name: 'Dr. Emily Carter', specialty: 'Cardiology', color: 'bg-blue-500', slots: '8 / 10' },
  { name: 'Dr. Michael Chen', specialty: 'Dermatology', color: 'bg-violet-500', slots: '6 / 8' },
  { name: 'Dr. Sarah Mitchell', specialty: 'Neurology', color: 'bg-emerald-500', slots: '7 / 9' },
  {
    name: 'Dr. James Wilson',
    specialty: 'General Medicine',
    color: 'bg-amber-500',
    slots: '5 / 8',
  },
];
const events = [
  [
    '09:00',
    'Sarah Johnson',
    'Dr. Emily Carter',
    'Confirmed',
    'bg-blue-50 text-blue-700 border-blue-200',
  ],
  [
    '10:30',
    'Robert Williams',
    'Dr. Michael Chen',
    'Checked in',
    'bg-emerald-50 text-emerald-700 border-emerald-200',
  ],
  [
    '11:00',
    'James Anderson',
    'Dr. Sarah Mitchell',
    'Pending',
    'bg-amber-50 text-amber-700 border-amber-200',
  ],
  [
    '13:30',
    'Maria Garcia',
    'Dr. James Wilson',
    'Confirmed',
    'bg-blue-50 text-blue-700 border-blue-200',
  ],
] as const;
function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section className={`border-border bg-card rounded-2xl border shadow-sm ${className}`}>
      {children}
    </section>
  );
}

export function StaffSchedule() {
  const [view, setView] = useState('Week');
  const [query, setQuery] = useState('');
  const [notice, setNotice] = useState('');
  const filtered = useMemo(
    () => events.filter((event) => event.join(' ').toLowerCase().includes(query.toLowerCase())),
    [query]
  );
  return (
    <div className="mt-8 space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Today's appointments", '26', 'Across 4 doctors'],
          ['Available slots', '18', 'Ready to book'],
          ['Doctors on duty', '4', 'All clinics'],
          ['Blocked time', '2', 'Today'],
        ].map(([label, value, detail]) => (
          <Card key={label} className="p-5">
            <p className="text-muted-foreground text-sm">{label}</p>
            <p className="mt-2 text-3xl font-black tracking-tight">{value}</p>
            <p className="text-muted-foreground mt-1 text-xs">{detail}</p>
          </Card>
        ))}
      </div>
      <Card className="overflow-hidden">
        <div className="border-border flex flex-col gap-4 border-b p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold">Schedule overview</h2>
            <p className="text-muted-foreground mt-1 text-sm">September 21 – 27, 2026</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              className="mobile-touch-target border-border rounded-xl border p-2"
              aria-label="Previous week"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              className="mobile-touch-target border-border rounded-xl border p-2"
              aria-label="Next week"
            >
              <ChevronRight className="size-4" />
            </button>
            {['Day', 'Week', 'Month'].map((item) => (
              <button
                key={item}
                onClick={() => setView(item)}
                className={`mobile-touch-target rounded-xl px-3 py-2 text-sm font-semibold ${view === item ? 'bg-primary text-primary-foreground' : 'border-border border'}`}
              >
                {item}
              </button>
            ))}
            <button
              onClick={() => setNotice('Booking workspace opened')}
              className="mobile-touch-target bg-primary text-primary-foreground inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold"
            >
              <Plus className="size-4" />
              Add appointment
            </button>
          </div>
        </div>
        <div className="mobile-scroll-x overflow-x-auto">
          <div className="min-w-[850px] p-5">
            <div className="grid grid-cols-7 gap-2">
              {['Mon 21', 'Tue 22', 'Wed 23', 'Thu 24', 'Fri 25', 'Sat 26', 'Sun 27'].map(
                (day, index) => (
                  <div
                    key={day}
                    className={`rounded-xl p-3 text-center text-sm font-bold ${index === 0 ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
                  >
                    {day}
                  </div>
                )
              )}
            </div>
            <div className="mt-3 grid grid-cols-7 gap-2">
              {[
                '26 appointments',
                '18 appointments',
                '22 appointments',
                '24 appointments',
                '20 appointments',
                '8 appointments',
                'Closed',
              ].map((value, index) => (
                <div
                  key={value}
                  className="border-border bg-background min-h-48 rounded-xl border p-3"
                >
                  <p className="text-muted-foreground text-xs">{value}</p>
                  {index < 6 && (
                    <div className="mt-4 space-y-2">
                      <div className="rounded-lg border border-blue-200 bg-blue-50 p-2 text-xs text-blue-800">
                        <b>09:00</b>
                        <br />
                        Sarah Johnson
                      </div>
                      <div className="rounded-lg border border-violet-200 bg-violet-50 p-2 text-xs text-violet-800">
                        <b>10:30</b>
                        <br />
                        Robert Williams
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card className="overflow-hidden">
          <div className="border-border flex flex-col gap-3 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold">Today&apos;s appointment queue</h2>
              <p className="text-muted-foreground text-sm">Monday, September 21</p>
            </div>
            <label className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <input
                aria-label="Search schedule"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search patient or doctor"
                className="border-border bg-background focus:border-primary h-10 w-full rounded-xl border pr-3 pl-9 text-sm outline-none sm:w-64"
              />
            </label>
          </div>
          <div className="mobile-scroll-x overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-secondary text-muted-foreground text-xs tracking-wider uppercase">
                <tr>
                  <th className="px-5 py-3">Time</th>
                  <th className="px-5 py-3">Patient</th>
                  <th className="px-5 py-3">Doctor</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-border divide-y">
                {filtered.map((event) => (
                  <tr key={event[1]}>
                    <td className="px-5 py-4 font-semibold">
                      <span className="inline-flex items-center gap-2">
                        <Clock3 className="text-muted-foreground size-4" />
                        {event[0]}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-2 font-semibold">
                        <UserRound className="text-muted-foreground size-4" />
                        {event[1]}
                      </span>
                    </td>
                    <td className="text-muted-foreground px-5 py-4">{event[2]}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs font-bold ${event[4]}`}
                      >
                        {event[3]}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        className="mobile-touch-target text-muted-foreground hover:bg-secondary rounded-lg p-2"
                        aria-label={`More actions for ${event[1]}`}
                      >
                        <MoreHorizontal className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-muted-foreground p-10 text-center text-sm">
              No appointments match your search.
            </div>
          )}
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Doctors on duty</h2>
              <p className="text-muted-foreground text-sm">Live availability</p>
            </div>
            <CalendarDays className="text-primary size-5" />
          </div>
          <div className="mt-5 space-y-4">
            {doctors.map((doctor) => (
              <div key={doctor.name} className="flex items-center gap-3">
                <div
                  className={`grid size-9 place-items-center rounded-full ${doctor.color} text-xs font-bold text-white`}
                >
                  {doctor.name.split(' ')[1]?.[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{doctor.name}</p>
                  <p className="text-muted-foreground text-xs">{doctor.specialty}</p>
                </div>
                <span className="text-primary text-xs font-bold">{doctor.slots}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
      {notice && (
        <div
          role="status"
          className="bg-foreground text-background fixed right-5 bottom-24 z-40 rounded-xl px-4 py-3 text-sm font-semibold shadow-lg"
        >
          {notice}
        </div>
      )}
    </div>
  );
}
