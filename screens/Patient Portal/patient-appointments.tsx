'use client';

import { useMemo, useState, type ReactNode } from 'react';
import {
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  Download,
  FileText,
  Filter,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react';

type Tab = 'Upcoming' | 'Completed' | 'Cancelled';
type Appointment = {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  clinic: string;
  status: string;
  payment: string;
  tab: Tab;
  symptoms: string;
  prescription?: string;
};

const appointments: Appointment[] = [
  {
    id: 'APT-2026-004821',
    doctor: 'Dr. Michael Anderson',
    specialty: 'Cardiology',
    date: 'Thu, Sep 24, 2026',
    time: '10:30 AM',
    clinic: 'Heart & Vascular Center',
    status: 'Confirmed',
    payment: 'Pending',
    tab: 'Upcoming',
    symptoms: 'Routine consultation and follow-up for chest discomfort.',
  },
  {
    id: 'APT-2026-004739',
    doctor: 'Dr. Emily Rodriguez',
    specialty: 'Dermatology',
    date: 'Mon, Sep 28, 2026',
    time: '02:00 PM',
    clinic: 'MediBook Downtown Clinic',
    status: 'Confirmed',
    payment: 'Paid',
    tab: 'Upcoming',
    symptoms: 'Skin consultation.',
  },
  {
    id: 'APT-2026-003988',
    doctor: 'Dr. Sarah Williams',
    specialty: 'General Medicine',
    date: 'Tue, Aug 18, 2026',
    time: '09:00 AM',
    clinic: 'MediBook Midtown Clinic',
    status: 'Completed',
    payment: 'Paid',
    tab: 'Completed',
    symptoms: 'Annual wellness check-up.',
    prescription: 'Prescription_2026-003988.pdf',
  },
  {
    id: 'APT-2026-003741',
    doctor: 'Dr. James Patel',
    specialty: 'Neurology',
    date: 'Fri, Jul 31, 2026',
    time: '11:30 AM',
    clinic: 'NeuroCare Center',
    status: 'Completed',
    payment: 'Paid',
    tab: 'Completed',
    symptoms: 'Recurring headaches and fatigue.',
    prescription: 'Prescription_2026-003741.pdf',
  },
  {
    id: 'APT-2026-003502',
    doctor: 'Dr. Lisa Chen',
    specialty: 'Pediatrics',
    date: 'Wed, Jul 15, 2026',
    time: '03:00 PM',
    clinic: 'MediBook West Clinic',
    status: 'Cancelled',
    payment: 'Refunded',
    tab: 'Cancelled',
    symptoms: 'Routine consultation.',
  },
];

export function PatientAppointments() {
  const [tab, setTab] = useState<Tab>('Upcoming');
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('All specialties');
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null);
  const [notice, setNotice] = useState('');
  const filtered = useMemo(
    () =>
      appointments.filter(
        (item) =>
          item.tab === tab &&
          (!search ||
            `${item.doctor} ${item.specialty} ${item.clinic}`
              .toLowerCase()
              .includes(search.toLowerCase())) &&
          (specialty === 'All specialties' || item.specialty === specialty)
      ),
    [tab, search, specialty]
  );
  const specialties = [
    'All specialties',
    ...Array.from(new Set(appointments.map((item) => item.specialty))),
  ];

  return (
    <div className="relative">
      {notice && (
        <div
          role="status"
          className="mb-4 flex items-center gap-2 rounded-xl border border-[#bfe4d5] bg-[#f0fbf6] px-4 py-3 text-sm font-bold text-[#218765]"
        >
          <Check className="size-4" />
          {notice}
          <button className="ml-auto" onClick={() => setNotice('')} aria-label="Dismiss notice">
            <X className="size-4" />
          </button>
        </div>
      )}
      <div className="border-border bg-card rounded-2xl border shadow-sm">
        <div className="border-border border-b p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-black">Appointments</h2>
              <p className="text-muted-foreground mt-1 text-xs">
                Keep track of your visits and care history.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <label className="relative">
                <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search appointments"
                  className="border-border bg-background focus:border-primary h-10 w-full rounded-xl border pr-3 pl-9 text-xs outline-none sm:w-52"
                />
              </label>
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="border-border bg-background focus:border-primary h-10 rounded-xl border px-3 text-xs font-bold outline-none"
              >
                {specialties.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <button className="border-border text-muted-foreground hover:bg-secondary flex h-10 items-center gap-2 rounded-xl border px-3 text-xs font-bold">
                <Filter className="size-4" /> Filters
              </button>
            </div>
          </div>
          <div className="border-border mt-6 flex gap-6 overflow-x-auto border-b">
            {(['Upcoming', 'Completed', 'Cancelled'] as Tab[]).map((item) => (
              <button
                key={item}
                onClick={() => setTab(item)}
                className={`-mb-px border-b-2 px-1 pb-3 text-sm font-black whitespace-nowrap ${tab === item ? 'border-primary text-primary' : 'text-muted-foreground hover:text-foreground border-transparent'}`}
              >
                {item}
                <span className="bg-secondary ml-2 rounded-full px-2 py-0.5 text-[10px]">
                  {appointments.filter((a) => a.tab === item).length}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="p-5 sm:p-6">
          {filtered.length === 0 ? (
            <EmptyState tab={tab} />
          ) : (
            <div className="grid gap-3">
              {filtered.map((item) => (
                <AppointmentCard
                  key={item.id}
                  appointment={item}
                  onView={() => setSelected(item)}
                  onCancel={() => setCancelTarget(item)}
                  onNotice={setNotice}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      {selected && (
        <AppointmentDrawer
          appointment={selected}
          onClose={() => setSelected(null)}
          onNotice={setNotice}
        />
      )}
      {cancelTarget && (
        <CancelModal
          appointment={cancelTarget}
          onClose={() => setCancelTarget(null)}
          onConfirm={() => {
            setCancelTarget(null);
            setNotice(
              'Appointment cancelled. Your refund will be processed within 5–7 business days.'
            );
          }}
        />
      )}
    </div>
  );
}

function AppointmentCard({
  appointment: item,
  onView,
  onCancel,
  onNotice,
}: {
  appointment: Appointment;
  onView: () => void;
  onCancel: () => void;
  onNotice: (message: string) => void;
}) {
  return (
    <article className="border-border hover:border-primary/40 rounded-2xl border p-4 transition hover:shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className="text-primary grid size-11 shrink-0 place-items-center rounded-xl bg-[#eaf1ff]">
            <CalendarDays className="size-5" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-black">{item.doctor}</h3>
              <Status value={item.status} />
            </div>
            <p className="text-primary mt-1 text-xs font-semibold">{item.specialty}</p>
            <p className="text-muted-foreground mt-2 text-xs">
              {item.date} · {item.time}
            </p>
            <p className="text-muted-foreground mt-1 truncate text-xs">{item.clinic}</p>
          </div>
        </div>
        <div className="border-border flex items-center gap-3 border-t pt-3 lg:border-t-0 lg:pt-0">
          <div className="min-w-24">
            <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
              Payment
            </p>
            <p
              className={`mt-1 text-xs font-black ${item.payment === 'Refunded' ? 'text-[#218765]' : 'text-foreground'}`}
            >
              {item.payment}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onView}
              className="border-border hover:bg-secondary rounded-lg border px-3 py-2 text-xs font-black"
            >
              {item.tab === 'Completed' ? 'View details' : 'View'}
            </button>
            {item.tab === 'Upcoming' && (
              <>
                <button
                  onClick={() => onNotice('Reschedule flow is ready to continue.')}
                  className="border-border hover:bg-secondary rounded-lg border px-3 py-2 text-xs font-black"
                >
                  Reschedule
                </button>
                <button
                  onClick={onCancel}
                  className="rounded-lg border border-[#efd3ce] px-3 py-2 text-xs font-black text-[#b86f63] hover:bg-[#fff8f6]"
                >
                  Cancel
                </button>
              </>
            )}
            {item.tab === 'Completed' && (
              <button
                onClick={() =>
                  onNotice(
                    item.prescription
                      ? `Downloading ${item.prescription}`
                      : 'No prescription is attached.'
                  )
                }
                className="bg-primary text-primary-foreground rounded-lg px-3 py-2 text-xs font-black hover:opacity-90"
              >
                <Download className="mr-1 inline size-3" />
                Prescription
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
function Status({ value }: { value: string }) {
  return (
    <span
      className={`rounded-full px-2 py-1 text-[10px] font-black ${value === 'Confirmed' ? 'bg-[#e9f8f3] text-[#218765]' : value === 'Completed' ? 'text-primary bg-[#eaf1ff]' : 'bg-[#fff2ef] text-[#b86f63]'}`}
    >
      {value}
    </span>
  );
}
function EmptyState({ tab }: { tab: Tab }) {
  return (
    <div className="border-border rounded-2xl border border-dashed p-12 text-center">
      <CalendarDays className="text-primary/50 mx-auto size-8" />
      <h3 className="mt-4 font-black">No {tab.toLowerCase()} appointments</h3>
      <p className="text-muted-foreground mx-auto mt-2 max-w-sm text-sm">
        {tab === 'Upcoming'
          ? 'When you book a visit, it will appear here.'
          : `Your ${tab.toLowerCase()} appointment history will appear here.`}
      </p>
    </div>
  );
}
function AppointmentDrawer({
  appointment: item,
  onClose,
  onNotice,
}: {
  appointment: Appointment;
  onClose: () => void;
  onNotice: (message: string) => void;
}) {
  return (
    <div className="bg-foreground/20 fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Appointment details"
        className="border-border bg-card h-full w-full max-w-xl overflow-y-auto border-l p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-primary text-xs font-black tracking-wider uppercase">
              Appointment details
            </p>
            <h2 className="mt-2 text-2xl font-black">{item.doctor}</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              {item.specialty} · {item.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:bg-secondary rounded-xl p-2"
            aria-label="Close details"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <Info label="Date & time" value={`${item.date} · ${item.time}`} />
          <Info label="Clinic" value={item.clinic} />
          <Info label="Appointment status" value={item.status} />
          <Info label="Payment status" value={item.payment} />
        </div>
        <Section title="Patient symptoms">
          <p className="text-muted-foreground text-sm leading-6">{item.symptoms}</p>
        </Section>
        <Section title="Doctor information">
          <div className="flex items-center gap-3">
            <div className="text-primary grid size-11 place-items-center rounded-full bg-[#dce8ff] text-sm font-black">
              MA
            </div>
            <div>
              <p className="text-sm font-black">{item.doctor}</p>
              <p className="text-muted-foreground text-xs">
                Verified {item.specialty} specialist · 4.9 rating
              </p>
            </div>
          </div>
        </Section>
        <Section title="Timeline">
          <div className="flex flex-col gap-4">
            {[
              'Appointment requested',
              'Payment status verified',
              item.status === 'Completed' ? 'Visit completed' : 'Appointment confirmed',
            ].map((event, i) => (
              <div key={event} className="flex items-center gap-3 text-sm">
                <div
                  className={`grid size-7 place-items-center rounded-full ${i === 2 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-primary'}`}
                >
                  <Check className="size-3" />
                </div>
                <span className="font-bold">{event}</span>
              </div>
            ))}
          </div>
        </Section>
        {item.prescription && (
          <Section title="Prescription">
            <div className="border-border bg-background flex items-center justify-between rounded-xl border p-3">
              <div className="flex items-center gap-3">
                <FileText className="text-primary size-5" />
                <span className="text-xs font-bold">{item.prescription}</span>
              </div>
              <button
                onClick={() => onNotice(`Downloading ${item.prescription}`)}
                className="bg-primary text-primary-foreground rounded-lg px-3 py-2 text-xs font-black"
              >
                <Download className="mr-1 inline size-3" />
                Download
              </button>
            </div>
          </Section>
        )}
        <div className="mt-8">
          <button
            onClick={onClose}
            className="bg-primary text-primary-foreground w-full rounded-xl py-3 text-sm font-black"
          >
            Done
          </button>
        </div>
      </aside>
    </div>
  );
}
function CancelModal({
  appointment: item,
  onClose,
  onConfirm,
}: {
  appointment: Appointment;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="bg-foreground/30 fixed inset-0 z-[60] grid place-items-center p-5"
      onClick={onClose}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        className="border-border bg-card w-full max-w-md rounded-2xl border p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid size-11 place-items-center rounded-full bg-[#fff2ef] text-[#b86f63]">
          <Clock3 className="size-5" />
        </div>
        <h2 className="mt-5 text-xl font-black">
          Are you sure you want to cancel this appointment?
        </h2>
        <p className="text-muted-foreground mt-2 text-sm">
          {item.doctor} · {item.date} at {item.time}
        </p>
        <div className="mt-5 rounded-xl border border-[#f1d8a9] bg-[#fff9ed] p-4 text-xs leading-5 text-[#91651f]">
          <ShieldCheck className="mr-2 inline size-4" />
          Cancellation policy: cancellations more than 24 hours before the visit are eligible for a
          full refund. Your current refund status is <strong>Eligible</strong>.
        </div>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            onClick={onClose}
            className="border-border rounded-xl border px-4 py-3 text-sm font-black"
          >
            Keep appointment
          </button>
          <button
            onClick={onConfirm}
            className="rounded-xl bg-[#b86f63] px-4 py-3 text-sm font-black text-white"
          >
            Cancel appointment
          </button>
        </div>
      </div>
    </div>
  );
}
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-secondary rounded-xl p-3">
      <p className="text-muted-foreground text-[10px] font-black tracking-wider uppercase">
        {label}
      </p>
      <p className="mt-1 text-xs font-black">{value}</p>
    </div>
  );
}
function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-border mt-7 border-t pt-5">
      <h3 className="mb-3 text-sm font-black">{title}</h3>
      {children}
    </section>
  );
}
export default PatientAppointments;
