'use client';

import { useMemo, useState, type ReactNode } from 'react';
import {
  AlertCircle,
  CalendarCheck,
  Check,
  ClipboardCheck,
  CreditCard,
  Search,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const appointments = [
  {
    id: 'APT-2026-004821',
    patient: 'Sarah Johnson',
    initials: 'SJ',
    phone: '+1 (555) 014-2288',
    doctor: 'Dr. Michael Anderson',
    time: '09:30 AM',
    status: 'Checked In',
    payment: 'Paid',
    order: 1,
  },
  {
    id: 'APT-2026-004822',
    patient: 'Robert Williams',
    initials: 'RW',
    phone: '+1 (555) 019-4432',
    doctor: 'Dr. Emily Carter',
    time: '10:00 AM',
    status: 'Waiting',
    payment: 'Pending',
    order: 2,
  },
  {
    id: 'APT-2026-004823',
    patient: 'Jessica Brown',
    initials: 'JB',
    phone: '+1 (555) 018-7621',
    doctor: 'Dr. Michael Anderson',
    time: '10:30 AM',
    status: 'Waiting',
    payment: 'Paid',
    order: 3,
  },
  {
    id: 'APT-2026-004824',
    patient: 'David Miller',
    initials: 'DM',
    phone: '+1 (555) 013-9001',
    doctor: 'Dr. James Wilson',
    time: '11:00 AM',
    status: 'In Consultation',
    payment: 'Paid',
    order: 4,
  },
  {
    id: 'APT-2026-004825',
    patient: 'Maria Garcia',
    initials: 'MG',
    phone: '+1 (555) 016-3344',
    doctor: 'Dr. Emily Carter',
    time: '11:30 AM',
    status: 'Waiting',
    payment: 'Pending',
    order: 5,
  },
];

const statusTone: Record<string, string> = {
  Waiting: 'bg-[#fff3e7] text-[#b8782f]',
  'Checked In': 'bg-[#e8f8f1] text-[#258c70]',
  'In Consultation': 'bg-[#edf3ff] text-primary',
  Completed: 'bg-secondary text-muted-foreground',
  'No-show': 'bg-[#fff0ef] text-[#b86f63]',
};

export function StaffCheckin() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All statuses');
  const [selected, setSelected] = useState<(typeof appointments)[number] | null>(null);
  const [confirmed, setConfirmed] = useState<string[]>(['APT-2026-004821']);
  const filtered = useMemo(
    () =>
      appointments.filter(
        (a) =>
          `${a.id} ${a.patient} ${a.phone} ${a.doctor}`
            .toLowerCase()
            .includes(query.toLowerCase()) &&
          (status === 'All statuses' || a.status === status)
      ),
    [query, status]
  );
  const checkIn = () => {
    if (!selected) return;
    setConfirmed((items) => [...items, selected.id]);
    setSelected(null);
  };
  return (
    <div className="mt-8 flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Today's appointments"
          value="24"
          icon={<CalendarCheck className="size-4" />}
        />
        <Metric label="Waiting queue" value="3" icon={<ClipboardCheck className="size-4" />} />
        <Metric label="Checked in" value="8" icon={<Check className="size-4" />} />
        <Metric label="Pending payments" value="$1,240" icon={<CreditCard className="size-4" />} />
      </div>
      <section className="border-border bg-card rounded-2xl border shadow-sm">
        <div className="border-border border-b p-5 sm:p-6">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-bold">Find an appointment</h2>
              <p className="text-muted-foreground mt-1 text-xs">
                Search by appointment ID, patient name, or phone number.
              </p>
            </div>
            <span className="text-muted-foreground text-xs font-semibold">
              {filtered.length} matches
            </span>
          </div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <label className="relative flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <input
                aria-label="Search appointments"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="APT-2026-004821, Sarah Johnson, or phone..."
                className="border-border bg-background focus:border-primary focus:ring-primary/15 h-11 w-full rounded-xl border pr-3 pl-9 text-xs outline-none focus:ring-2"
              />
            </label>
            <select
              aria-label="Filter status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border-border bg-background focus:border-primary h-11 rounded-xl border px-3 text-xs font-semibold outline-none"
            >
              <option>All statuses</option>
              <option>Waiting</option>
              <option>Checked In</option>
              <option>In Consultation</option>
              <option>Completed</option>
              <option>No-show</option>
            </select>
          </div>
        </div>
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary/60 text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
              <tr>
                <th className="px-6 py-3">Patient</th>
                <th className="px-6 py-3">Doctor</th>
                <th className="px-6 py-3">Appointment time</th>
                <th className="px-6 py-3">Check-in status</th>
                <th className="px-6 py-3">Payment status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {filtered.map((a) => (
                <Row
                  key={a.id}
                  appointment={a}
                  checked={confirmed.includes(a.id)}
                  onOpen={() => setSelected(a)}
                />
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-3 p-4 md:hidden">
          {filtered.map((a) => (
            <Card
              key={a.id}
              appointment={a}
              checked={confirmed.includes(a.id)}
              onOpen={() => setSelected(a)}
            />
          ))}
        </div>
        {filtered.length === 0 && <Empty />}
      </section>
      <section className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold">Waiting queue</h2>
            <p className="text-muted-foreground mt-1 text-xs">
              Estimated order for patients ready to be seen.
            </p>
          </div>
          <span className="rounded-full bg-[#fff3e7] px-3 py-1 text-[11px] font-bold text-[#b8782f]">
            3 waiting
          </span>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {appointments
            .filter((a) => a.status === 'Waiting')
            .map((a) => (
              <div key={a.id} className="bg-secondary/60 flex items-center gap-3 rounded-xl p-3">
                <span className="bg-primary text-primary-foreground grid size-7 place-items-center rounded-full text-xs font-black">
                  {a.order}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold">{a.patient}</p>
                  <p className="text-muted-foreground text-[11px]">
                    Estimated wait {a.order * 8} min
                  </p>
                </div>
              </div>
            ))}
        </div>
      </section>
      {selected && (
        <CheckinDialog
          appointment={selected}
          onClose={() => setSelected(null)}
          onConfirm={checkIn}
        />
      )}
    </div>
  );
}

function Metric({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return (
    <div className="border-border bg-card rounded-2xl border p-4 shadow-sm">
      <div className="text-primary mb-3 flex size-9 items-center justify-center rounded-xl bg-[#edf3ff]">
        {icon}
      </div>
      <p className="text-2xl font-black tracking-tight">{value}</p>
      <p className="text-muted-foreground mt-1 text-xs">{label}</p>
    </div>
  );
}

function Row({
  appointment: a,
  checked,
  onOpen,
}: {
  appointment: (typeof appointments)[number];
  checked: boolean;
  onOpen: () => void;
}) {
  return (
    <tr className="hover:bg-secondary/30">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="text-primary grid size-9 place-items-center rounded-full bg-[#d9e8ff] text-[10px] font-bold">
            {a.initials}
          </span>
          <div>
            <p className="font-bold">{a.patient}</p>
            <p className="text-muted-foreground text-[10px]">{a.id}</p>
          </div>
        </div>
      </td>
      <td className="text-muted-foreground px-6 py-4 text-xs">{a.doctor}</td>
      <td className="px-6 py-4 text-xs font-semibold">{a.time}</td>
      <td className="px-6 py-4">
        <Badge className={statusTone[checked ? 'Checked In' : a.status]}>
          {checked ? 'Checked In' : a.status}
        </Badge>
      </td>
      <td className="px-6 py-4 text-xs font-semibold">{a.payment}</td>
      <td className="px-6 py-4">
        <Button variant="outline" size="xs" onClick={onOpen}>
          {checked ? 'View details' : 'Check in'}
        </Button>
      </td>
    </tr>
  );
}

function Card({
  appointment: a,
  checked,
  onOpen,
}: {
  appointment: (typeof appointments)[number];
  checked: boolean;
  onOpen: () => void;
}) {
  return (
    <div className="border-border rounded-xl border p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-primary grid size-9 place-items-center rounded-full bg-[#d9e8ff] text-[10px] font-bold">
            {a.initials}
          </span>
          <div>
            <p className="text-sm font-bold">{a.patient}</p>
            <p className="text-muted-foreground text-[10px]">{a.id}</p>
          </div>
        </div>
        <Badge className={statusTone[checked ? 'Checked In' : a.status]}>
          {checked ? 'Checked In' : a.status}
        </Badge>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <div>
          <p className="text-muted-foreground">Doctor</p>
          <p className="mt-1 font-semibold">{a.doctor}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Time</p>
          <p className="mt-1 font-semibold">{a.time}</p>
        </div>
      </div>
      <Button onClick={onOpen} className="mt-4 w-full">
        {checked ? 'View details' : 'Check in patient'}
      </Button>
    </div>
  );
}

function CheckinDialog({
  appointment: a,
  onClose,
  onConfirm,
}: {
  appointment: (typeof appointments)[number];
  onClose: () => void;
  onConfirm: () => void;
}) {
  const [step, setStep] = useState(1);
  return (
    <div
      className="bg-foreground/30 fixed inset-0 z-50 grid place-items-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Patient check-in"
    >
      <div className="border-border bg-card w-full max-w-lg rounded-2xl border p-5 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-primary text-xs font-bold tracking-wider uppercase">
              Check-in workflow
            </p>
            <h2 className="mt-1 text-xl font-black">
              {step === 5 ? 'Confirm check-in' : `Step ${step} of 5`}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="text-muted-foreground hover:bg-secondary rounded-lg p-2"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="mt-5 flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <span
              key={n}
              className={`h-1.5 flex-1 rounded-full ${n <= step ? 'bg-primary' : 'bg-secondary'}`}
            />
          ))}
        </div>
        <div className="bg-secondary/60 mt-6 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-primary grid size-11 place-items-center rounded-full bg-[#d9e8ff] text-xs font-bold">
              {a.initials}
            </span>
            <div>
              <p className="font-bold">{a.patient}</p>
              <p className="text-muted-foreground text-xs">
                {a.id} &middot; {a.time}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-5 grid gap-3 text-sm">
          {step === 1 && (
            <>
              <p className="font-bold">Find appointment</p>
              <p className="text-muted-foreground">Appointment located by ID and patient record.</p>
            </>
          )}
          {step === 2 && (
            <>
              <p className="font-bold">Verify patient</p>
              <p className="text-muted-foreground">
                Confirm {a.patient}&apos;s phone number: {a.phone}
              </p>
            </>
          )}
          {step === 3 && (
            <>
              <p className="font-bold">Confirm appointment details</p>
              <p className="text-muted-foreground">
                {a.doctor} &middot; {a.time} &middot; General consultation
              </p>
            </>
          )}
          {step === 4 && (
            <>
              <p className="font-bold">Confirm payment</p>
              <p className="text-muted-foreground">
                Payment status: <strong>{a.payment}</strong>.{' '}
                {a.payment === 'Pending'
                  ? 'Collect payment before continuing.'
                  : 'Payment is verified.'}
              </p>
            </>
          )}
          {step === 5 && (
            <>
              <p className="font-bold">Ready to check in</p>
              <p className="text-muted-foreground">
                This patient will be added to the waiting queue in position {a.order}.
              </p>
            </>
          )}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {step < 5 ? (
            <Button onClick={() => setStep(step + 1)}>
              Continue
            </Button>
          ) : (
            <Button onClick={onConfirm}>
              Confirm check-in
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function Empty() {
  return (
    <div className="text-muted-foreground p-10 text-center text-sm">
      <AlertCircle className="text-primary/60 mx-auto size-6" />
      <p className="mt-2 font-semibold">No appointments found</p>
    </div>
  );
}