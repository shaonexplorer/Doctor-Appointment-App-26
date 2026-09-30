'use client';

import { useMemo, useState, type ReactNode } from 'react';
import {
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  FileText,
  HeartPulse,
  Search,
  UserRound,
  X,
} from 'lucide-react';

const patients = [
  {
    name: 'Sarah Johnson',
    initials: 'SJ',
    id: 'MB-10482',
    age: 38,
    last: 'Sep 18, 2026',
    diagnosis: 'Hypertension',
    next: 'Sep 28 · 09:30 AM',
    visits: 12,
    condition: 'Hypertension',
    status: 'Confirmed',
  },
  {
    name: 'Robert Chen',
    initials: 'RC',
    id: 'MB-10217',
    age: 52,
    last: 'Sep 15, 2026',
    diagnosis: 'Type 2 diabetes',
    next: 'Oct 02 · 10:00 AM',
    visits: 8,
    condition: 'Diabetes',
    status: 'Pending',
  },
  {
    name: 'Emily Davis',
    initials: 'ED',
    id: 'MB-10931',
    age: 29,
    last: 'Sep 12, 2026',
    diagnosis: 'Chronic migraine',
    next: '—',
    visits: 5,
    condition: 'Migraine',
    status: 'Completed',
  },
  {
    name: 'Michael Brown',
    initials: 'MB',
    id: 'MB-09844',
    age: 64,
    last: 'Aug 29, 2026',
    diagnosis: 'Coronary artery disease',
    next: 'Sep 25 · 02:00 PM',
    visits: 21,
    condition: 'Cardiac',
    status: 'Confirmed',
  },
];

export function DoctorPatients() {
  const [query, setQuery] = useState('');
  const [condition, setCondition] = useState('All conditions');
  const [status, setStatus] = useState('All statuses');
  const [selected, setSelected] = useState<(typeof patients)[number] | null>(null);
  const filtered = useMemo(
    () =>
      patients.filter(
        (p) =>
          `${p.name} ${p.id} ${p.condition}`.toLowerCase().includes(query.toLowerCase()) &&
          (condition === 'All conditions' || p.condition === condition) &&
          (status === 'All statuses' || p.status === status)
      ),
    [query, condition, status]
  );
  return (
    <div className="mt-8 space-y-5">
      <section className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black">Patient directory</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Search and manage your care panel securely.
            </p>
          </div>
          <button className="bg-primary text-primary-foreground rounded-xl px-4 py-2.5 text-xs font-bold">
            Add patient
          </button>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <label className="relative min-w-[240px] flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <input
              aria-label="Search patients"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Patient name, ID, or phone"
              className="border-border bg-background focus:border-primary h-10 w-full rounded-xl border pr-3 pl-9 text-xs outline-none"
            />
          </label>
          <select
            aria-label="Condition filter"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="border-border bg-background h-10 rounded-xl border px-3 text-xs font-semibold"
          >
            <option>All conditions</option>
            <option>Hypertension</option>
            <option>Diabetes</option>
            <option>Migraine</option>
            <option>Cardiac</option>
          </select>
          <select
            aria-label="Appointment status filter"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border-border bg-background h-10 rounded-xl border px-3 text-xs font-semibold"
          >
            <option>All statuses</option>
            <option>Confirmed</option>
            <option>Pending</option>
            <option>Completed</option>
          </select>
        </div>
        <p className="text-muted-foreground mt-4 text-xs">
          <span className="text-primary font-bold">{filtered.length}</span> patients in your care
          panel
        </p>
      </section>
      <section className="border-border bg-card overflow-hidden rounded-2xl border shadow-sm">
        {filtered.length ? (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[980px] text-left">
                <thead className="border-border bg-secondary/60 text-muted-foreground border-b text-[10px] tracking-wider uppercase">
                  <tr>
                    {[
                      'Patient',
                      'Age',
                      'Last appointment',
                      'Last diagnosis',
                      'Upcoming appointment',
                      'Total visits',
                      'Actions',
                    ].map((h) => (
                      <th key={h} className="px-5 py-4 font-bold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <PatientRow key={p.id} patient={p} onView={() => setSelected(p)} />
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid gap-3 p-4 md:hidden">
              {filtered.map((p) => (
                <PatientCard key={p.id} patient={p} onView={() => setSelected(p)} />
              ))}
            </div>
          </>
        ) : (
          <EmptyState />
        )}
      </section>
      {selected && <PatientDetail patient={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
function PatientRow({
  patient: p,
  onView,
}: {
  patient: (typeof patients)[number];
  onView: () => void;
}) {
  return (
    <tr className="border-border border-b last:border-0">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="text-primary grid size-9 place-items-center rounded-full bg-[#d9e8ff] text-xs font-bold">
            {p.initials}
          </div>
          <div>
            <p className="text-sm font-bold">{p.name}</p>
            <p className="text-muted-foreground text-[11px]">{p.id}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-4 text-sm">{p.age}</td>
      <td className="px-5 py-4 text-xs font-semibold">{p.last}</td>
      <td className="text-muted-foreground px-5 py-4 text-xs">{p.diagnosis}</td>
      <td className="text-primary px-5 py-4 text-xs font-semibold">{p.next}</td>
      <td className="px-5 py-4 text-sm">{p.visits}</td>
      <td className="px-5 py-4">
        <button
          onClick={onView}
          className="border-border hover:bg-secondary rounded-lg border px-3 py-1.5 text-[10px] font-bold"
        >
          View patient
        </button>
      </td>
    </tr>
  );
}
function PatientCard({
  patient: p,
  onView,
}: {
  patient: (typeof patients)[number];
  onView: () => void;
}) {
  return (
    <article className="border-border rounded-xl border p-4">
      <div className="flex items-start gap-3">
        <div className="text-primary grid size-10 place-items-center rounded-full bg-[#d9e8ff] text-xs font-bold">
          {p.initials}
        </div>
        <div className="min-w-0">
          <p className="font-bold">{p.name}</p>
          <p className="text-muted-foreground text-xs">
            {p.id} · {p.age} years
          </p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <Info label="Last diagnosis" value={p.diagnosis} />
        <Info label="Next visit" value={p.next} />
        <Info label="Total visits" value={`${p.visits}`} />
        <Info label="Status" value={p.status} />
      </div>
      <button
        onClick={onView}
        className="bg-primary text-primary-foreground mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold"
      >
        View patient <ChevronRight className="size-4" />
      </button>
    </article>
  );
}
function PatientDetail({
  patient: p,
  onClose,
}: {
  patient: (typeof patients)[number];
  onClose: () => void;
}) {
  return (
    <div className="bg-foreground/25 fixed inset-0 z-50">
      <aside className="border-border bg-card absolute top-0 right-0 h-full w-full max-w-2xl overflow-y-auto border-l p-5 shadow-2xl sm:p-7">
        <div className="flex items-start justify-between">
          <div>
            <button
              onClick={onClose}
              className="text-primary mb-4 flex items-center gap-2 text-xs font-bold"
            >
              <ArrowLeft className="size-4" />
              Back to patients
            </button>
            <div className="flex items-center gap-3">
              <div className="text-primary grid size-12 place-items-center rounded-full bg-[#d9e8ff] font-bold">
                {p.initials}
              </div>
              <div>
                <h2 className="text-2xl font-black">{p.name}</h2>
                <p className="text-muted-foreground text-xs">
                  {p.id} · {p.age} years
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close patient details"
            className="hover:bg-secondary rounded-lg p-2"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Info label="Last visit" value={p.last} />
          <Info label="Diagnosis" value={p.diagnosis} />
          <Info label="Total visits" value={`${p.visits}`} />
          <Info label="Next appointment" value={p.next} />
        </div>
        <div className="border-border mt-6 flex gap-2 overflow-x-auto border-b pb-2 text-xs font-bold">
          {[
            'Profile',
            'Medical history',
            'Visit history',
            'Prescriptions',
            'Diagnostic reports',
            'Appointments',
          ].map((tab, i) => (
            <button
              key={tab}
              className={`rounded-lg px-3 py-2 whitespace-nowrap ${i === 0 ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <section className="mt-6">
          <h3 className="font-bold">Patient timeline</h3>
          <div className="border-primary/20 mt-4 grid gap-4 border-l-2 pl-5">
            {[
              [CalendarDays, 'Appointment', 'Sep 18, 2026 · Follow-up consultation'],
              [HeartPulse, 'Symptoms', 'Chest discomfort and shortness of breath'],
              [FileText, 'Diagnosis', 'Hypertension — stable with treatment'],
              [PillIcon, 'Prescription', 'Amlodipine 5mg · once daily'],
              [Clock3, 'Follow-up', 'Review blood pressure in 2 weeks'],
            ].map(([Icon, title, text]) => (
              <div key={String(title)} className="relative">
                <span className="bg-primary text-primary-foreground absolute -left-[31px] grid size-5 place-items-center rounded-full">
                  <Icon className="size-3" />
                </span>
                <p className="text-primary text-xs font-bold">{String(title)}</p>
                <p className="text-muted-foreground mt-1 text-sm">{String(text)}</p>
              </div>
            ))}
          </div>
        </section>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <button className="bg-primary text-primary-foreground rounded-xl py-3 text-xs font-bold">
            Schedule appointment
          </button>
          <button className="border-border hover:bg-secondary rounded-xl border py-3 text-xs font-bold">
            View full record
          </button>
        </div>
      </aside>
    </div>
  );
}
function PillIcon({ className }: { className?: string }) {
  return <HeartPulse className={className} />;
}
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-border rounded-xl border p-3">
      <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
        {label}
      </p>
      <p className="mt-1 text-xs font-bold">{value}</p>
    </div>
  );
}
function EmptyState() {
  return (
    <div className="p-14 text-center">
      <UserRound className="text-primary/50 mx-auto size-8" />
      <h3 className="mt-3 font-bold">No patients found</h3>
      <p className="text-muted-foreground mt-1 text-sm">Try adjusting your search or filters.</p>
    </div>
  );
}
export default DoctorPatients;

function LoadingState({ children }: { children?: ReactNode }) {
  return (
    <div className="border-border bg-card text-muted-foreground animate-pulse rounded-2xl border p-8 text-sm">
      Loading patient records...{children}
    </div>
  );
}
function CheckState() {
  return <Check className="text-primary size-4" />;
}
function UserState() {
  return <UserRound className="size-4" />;
}
