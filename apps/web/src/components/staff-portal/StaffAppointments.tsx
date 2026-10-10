'use client';

import { useMemo, useState } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  MoreHorizontal,
  Search,
  UserRound,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

interface Appointment {
  id: string;
  time: string;
  patient: string;
  age: string;
  doctor: string;
  specialty: string;
  type: string;
  status: 'Confirmed' | 'Checked in' | 'Waiting' | 'Cancelled';
  payment: 'Paid' | 'Pending' | 'Refunded';
}

const mockAppointments: Appointment[] = [
  {
    id: 'APT-004932',
    time: '09:00 AM',
    patient: 'Sarah Johnson',
    age: '34',
    doctor: 'Dr. Emily Carter',
    specialty: 'General Medicine',
    type: 'Follow-up',
    status: 'Confirmed',
    payment: 'Paid',
  },
  {
    id: 'APT-004933',
    time: '09:30 AM',
    patient: 'Michael Chen',
    age: '42',
    doctor: 'Dr. James Wilson',
    specialty: 'Cardiology',
    type: 'Consultation',
    status: 'Checked in',
    payment: 'Paid',
  },
  {
    id: 'APT-004934',
    time: '10:00 AM',
    patient: 'Priya Sharma',
    age: '29',
    doctor: 'Dr. Emily Carter',
    specialty: 'General Medicine',
    type: 'New patient',
    status: 'Waiting',
    payment: 'Pending',
  },
  {
    id: 'APT-004935',
    time: '10:30 AM',
    patient: 'Robert Williams',
    age: '57',
    doctor: 'Dr. Olivia Brown',
    specialty: 'Orthopedics',
    type: 'Follow-up',
    status: 'Confirmed',
    payment: 'Paid',
  },
  {
    id: 'APT-004936',
    time: '11:00 AM',
    patient: 'Linda Davis',
    age: '46',
    doctor: 'Dr. James Wilson',
    specialty: 'Cardiology',
    type: 'Consultation',
    status: 'Cancelled',
    payment: 'Refunded',
  },
  {
    id: 'APT-004937',
    time: '11:30 AM',
    patient: 'David Miller',
    age: '51',
    doctor: 'Dr. Olivia Brown',
    specialty: 'Orthopedics',
    type: 'Follow-up',
    status: 'Confirmed',
    payment: 'Pending',
  },
];

const statCards = [
  { label: 'Today', value: '24', icon: CalendarDays, tone: 'blue' },
  { label: 'Confirmed', value: '16', icon: CheckCircle2, tone: 'green' },
  { label: 'Waiting', value: '4', icon: Clock3, tone: 'amber' },
  { label: 'Cancelled', value: '2', icon: XCircle, tone: 'red' },
] as const;

const toneStyles: Record<string, string> = {
  green: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  red: 'bg-rose-50 text-rose-600',
  blue: 'bg-blue-50 text-blue-600',
};

const statusBadgeVariant: Record<string, 'success' | 'warning' | 'destructive' | 'default'> = {
  Cancelled: 'destructive',
  Waiting: 'warning',
  'Checked in': 'default',
  Confirmed: 'success',
};

const paymentBadgeVariant: Record<string, 'success' | 'warning' | 'destructive'> = {
  Paid: 'success',
  Refunded: 'destructive',
  Pending: 'warning',
};

export function StaffAppointments() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All statuses');
  const [notice, setNotice] = useState('');

  const router = useRouter();

  const filtered = useMemo(
    () =>
      mockAppointments.filter(
        (item) =>
          `${item.patient} ${item.doctor} ${item.id} ${item.specialty}`
            .toLowerCase()
            .includes(query.toLowerCase()) &&
          (status === 'All statuses' || item.status === status)
      ),
    [query, status]
  );

  const action = (message: string) => {
    // console.log(message);
    setNotice(message);
    router.push('/staff/booking');
  };

  return (
    <section className="mt-8 space-y-5" aria-label="Appointment management">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="border-border bg-card rounded-2xl border p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm">{label}</p>
              <span className={`rounded-xl p-2 ${toneStyles[tone]}`}>
                <Icon className="size-4" />
              </span>
            </div>
            <p className="mt-3 text-2xl font-black tracking-tight">{value}</p>
          </div>
        ))}
      </div>

      <div className="border-border bg-card rounded-2xl border shadow-sm">
        <div className="border-border flex flex-col gap-4 border-b p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-bold">Today&apos;s appointments</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Monday, September 21, 2026 · 24 scheduled appointments
            </p>
          </div>
          <Button onClick={() => action('Booking workspace opened')}>Book appointment</Button>
        </div>

        <div className="border-border flex flex-col gap-3 border-b p-4 sm:flex-row">
          <label className="relative min-w-0 flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <input
              aria-label="Search appointments"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search patient, doctor, appointment ID..."
              className="border-border bg-background focus:border-primary focus:ring-primary/15 h-11 w-full rounded-xl border pr-3 pl-9 text-sm outline-none focus:ring-2"
            />
          </label>
          <select
            aria-label="Filter appointment status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="border-border bg-background h-11 rounded-xl border px-3 text-sm"
          >
            <option>All statuses</option>
            <option>Confirmed</option>
            <option>Checked in</option>
            <option>Waiting</option>
            <option>Cancelled</option>
          </select>
          {/* <Button variant="outline" className="text-sm font-bold">
            <Filter className="mr-2 inline size-4" />
            More filters
          </Button> */}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 text-muted-foreground text-xs tracking-wider uppercase">
              <tr>
                <th className="px-5 py-3">Time</th>
                <th className="px-5 py-3">Patient</th>
                <th className="px-5 py-3">Doctor</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Payment</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-muted/20">
                  <td className="px-5 py-4 font-bold whitespace-nowrap">{item.time}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="bg-primary/10 text-primary rounded-xl p-2">
                        <UserRound className="size-4" />
                      </span>
                      <div>
                        <p className="font-bold">{item.patient}</p>
                        <p className="text-muted-foreground text-xs">
                          {item.age} years · {item.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-medium">{item.doctor}</p>
                    <p className="text-muted-foreground text-xs">{item.specialty}</p>
                  </td>
                  <td className="text-muted-foreground px-5 py-4">{item.type}</td>
                  <td className="px-5 py-4">
                    <Badge variant={statusBadgeVariant[item.status]}>{item.status}</Badge>
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant={paymentBadgeVariant[item.payment]}>{item.payment}</Badge>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => {}}
                      aria-label={`View ${item.patient}`}
                      className="mobile-touch-target text-muted-foreground hover:bg-muted rounded-lg p-2"
                    >
                      <Eye className="size-4" />
                    </button>
                    <button
                      onClick={() => action('Appointment actions opened')}
                      aria-label={`More actions for ${item.patient}`}
                      className="mobile-touch-target text-muted-foreground hover:bg-muted rounded-lg p-2"
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
            No appointments match these filters.
          </div>
        )}
      </div>

      {notice && (
        <div
          role="status"
          className="fixed right-5 bottom-24 z-40 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg"
        >
          {notice}
        </div>
      )}
    </section>
  );
}
