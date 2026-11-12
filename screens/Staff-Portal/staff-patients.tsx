'use client';

import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  CalendarDays,
  ChevronRight,
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
    phone: '+1 (555) 014-8291',
    email: 'sarah.johnson@email.com',
    age: 38,
    gender: 'Female',
    last: 'Sep 18, 2026',
    diagnosis: 'Hypertension',
    next: 'Sep 28 · 09:30 AM',
    doctor: 'Dr. Michael Anderson',
    visits: 12,
    status: 'Active',
    payment: 'Paid',
  },
  {
    name: 'Robert Williams',
    initials: 'RW',
    id: 'MB-10763',
    phone: '+1 (555) 019-4420',
    email: 'robert.williams@email.com',
    age: 52,
    gender: 'Male',
    last: 'Sep 16, 2026',
    diagnosis: 'Type 2 diabetes',
    next: 'Sep 25 · 10:00 AM',
    doctor: 'Dr. Emily Carter',
    visits: 8,
    status: 'Active',
    payment: 'Pending',
  },
  {
    name: 'Jessica Brown',
    initials: 'JB',
    id: 'MB-10931',
    phone: '+1 (555) 012-7784',
    email: 'jessica.brown@email.com',
    age: 29,
    gender: 'Female',
    last: 'Sep 12, 2026',
    diagnosis: 'Chronic migraine',
    next: '—',
    doctor: 'Dr. Michael Anderson',
    visits: 5,
    status: 'Active',
    payment: 'Paid',
  },
  {
    name: 'David Miller',
    initials: 'DM',
    id: 'MB-09844',
    phone: '+1 (555) 018-3312',
    email: 'david.miller@email.com',
    age: 64,
    gender: 'Male',
    last: 'Aug 29, 2026',
    diagnosis: 'Coronary artery disease',
    next: 'Sep 30 · 02:00 PM',
    doctor: 'Dr. James Wilson',
    visits: 21,
    status: 'Active',
    payment: 'Paid',
  },
  {
    name: 'Maria Garcia',
    initials: 'MG',
    id: 'MB-11102',
    phone: '+1 (555) 016-9087',
    email: 'maria.garcia@email.com',
    age: 44,
    gender: 'Female',
    last: 'Aug 21, 2026',
    diagnosis: 'Asthma',
    next: '—',
    doctor: 'Dr. Emily Carter',
    visits: 3,
    status: 'Inactive',
    payment: 'Paid',
  },
];

type Patient = (typeof patients)[number];

export function StaffPatients() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All statuses');
  const [selected, setSelected] = useState<Patient | null>(null);
  const filtered = useMemo(
    () =>
      patients.filter(
        (patient) =>
          `${patient.name} ${patient.id} ${patient.phone} ${patient.email} ${patient.doctor}`
            .toLowerCase()
            .includes(query.toLowerCase()) &&
          (status === 'All statuses' || patient.status === status)
      ),
    [query, status]
  );

  return (
    <div className="mt-8 space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Total patients" value="1,248" tone="bg-[#edf3ff] text-primary" />
        <Metric label="Active patients" value="1,106" tone="bg-[#e9f8f3] text-[#258c70]" />
        <Metric label="New this month" value="86" tone="bg-[#f1edff] text-[#7864c8]" />
        <Metric label="Appointments today" value="24" tone="bg-[#fff3e7] text-[#d68b42]" />
      </div>
      <section className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-black">Patient directory</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Search and manage patient records across the clinic.
            </p>
          </div>
          <button className="bg-primary text-primary-foreground rounded-xl px-4 py-2.5 text-xs font-bold">
            Register patient
          </button>
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <label className="relative min-w-0 flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <input
              aria-label="Search patient records"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name, patient ID, phone, or email"
              className="border-border bg-background focus:border-primary focus:ring-primary/15 h-11 w-full rounded-xl border pr-3 pl-9 text-sm outline-none focus:ring-2"
            />
          </label>
          <select
            aria-label="Patient status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="border-border bg-background h-11 rounded-xl border px-3 text-sm font-semibold"
          >
            <option>All statuses</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
        <p className="text-muted-foreground mt-4 text-xs">
          <span className="text-primary font-bold">{filtered.length}</span> records shown
        </p>
      </section>
      <section className="border-border bg-card overflow-hidden rounded-2xl border shadow-sm">
        {filtered.length ? (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[1040px] text-left text-sm">
                <thead className="border-border bg-secondary/60 text-muted-foreground border-b text-[10px] tracking-wider uppercase">
                  <tr>
                    {[
                      'Patient',
                      'Contact',
                      'Last visit',
                      'Doctor',
                      'Next appointment',
                      'Payment',
                      'Status',
                      'Actions',
                    ].map((heading) => (
                      <th key={heading} className="px-5 py-4 font-bold">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((patient) => (
                    <PatientRow
                      key={patient.id}
                      patient={patient}
                      onView={() => setSelected(patient)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid gap-3 p-4 md:hidden">
              {filtered.map((patient) => (
                <PatientCard
                  key={patient.id}
                  patient={patient}
                  onView={() => setSelected(patient)}
                />
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
function Avatar({ patient }: { patient: Patient }) {
  return (
    <div className="text-primary grid size-9 place-items-center rounded-full bg-[#d9e8ff] text-xs font-bold">
      {patient.initials}
    </div>
  );
}
function PatientRow({ patient, onView }: { patient: Patient; onView: () => void }) {
  return (
    <tr className="border-border hover:bg-secondary/30 border-b last:border-0">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <Avatar patient={patient} />
          <div>
            <p className="font-bold">{patient.name}</p>
            <p className="text-muted-foreground text-[11px]">
              {patient.id} · {patient.age} years
            </p>
          </div>
        </div>
      </td>
      <td className="text-muted-foreground px-5 py-4 text-xs">
        <p>{patient.phone}</p>
        <p className="mt-1">{patient.email}</p>
      </td>
      <td className="px-5 py-4 text-xs font-semibold">{patient.last}</td>
      <td className="text-muted-foreground px-5 py-4 text-xs">{patient.doctor}</td>
      <td className="text-primary px-5 py-4 text-xs font-semibold">{patient.next}</td>
      <td className="px-5 py-4">
        <Badge value={patient.payment} />
      </td>
      <td className="px-5 py-4">
        <Badge value={patient.status} />
      </td>
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
function PatientCard({ patient, onView }: { patient: Patient; onView: () => void }) {
  return (
    <article className="border-border rounded-xl border p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar patient={patient} />
          <div className="min-w-0">
            <p className="truncate font-bold">{patient.name}</p>
            <p className="text-muted-foreground text-xs">
              {patient.id} · {patient.age} years
            </p>
          </div>
        </div>
        <Badge value={patient.status} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <Info label="Phone" value={patient.phone} />
        <Info label="Last visit" value={patient.last} />
        <Info label="Doctor" value={patient.doctor} />
        <Info label="Next visit" value={patient.next} />
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
function Badge({ value }: { value: string }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${value === 'Active' || value === 'Paid' ? 'bg-[#e9f8f3] text-[#258c70]' : value === 'Inactive' ? 'bg-secondary text-muted-foreground' : 'bg-[#fff3e7] text-[#d68b42]'}`}
    >
      {value}
    </span>
  );
}
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-border rounded-xl border p-3">
      <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
        {label}
      </p>
      <p className="mt-1 truncate text-xs font-bold">{value}</p>
    </div>
  );
}
function PatientDetail({ patient, onClose }: { patient: Patient; onClose: () => void }) {
  return (
    <div className="bg-foreground/25 fixed inset-0 z-50">
      <aside
        data-mobile-sheet
        className="border-border bg-card absolute top-0 right-0 bottom-0 h-full w-full max-w-2xl overflow-y-auto border-l p-5 shadow-2xl sm:p-7"
      >
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
              <Avatar patient={patient} />
              <div>
                <h2 className="text-2xl font-black">{patient.name}</h2>
                <p className="text-muted-foreground text-xs">
                  {patient.id} · {patient.age} years · {patient.gender}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close patient details"
            className="mobile-touch-target hover:bg-secondary grid place-items-center rounded-lg p-2"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Info label="Phone" value={patient.phone} />
          <Info label="Last visit" value={patient.last} />
          <Info label="Diagnosis" value={patient.diagnosis} />
          <Info label="Visits" value={`${patient.visits}`} />
        </div>
        <div className="border-border mt-6 flex gap-2 overflow-x-auto border-b pb-2 text-xs font-bold">
          {['Profile', 'Appointments', 'Medical history', 'Payments'].map((tab, index) => (
            <button
              key={tab}
              className={`rounded-lg px-3 py-2 whitespace-nowrap ${index === 0 ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <section className="mt-6 space-y-5">
          <div>
            <h3 className="font-bold">Patient information</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Info label="Email" value={patient.email} />
              <Info label="Assigned doctor" value={patient.doctor} />
              <Info label="Payment status" value={patient.payment} />
              <Info label="Next appointment" value={patient.next} />
            </div>
          </div>
          <div>
            <h3 className="font-bold">Recent activity</h3>
            <div className="mt-3 grid gap-3">
              <Timeline
                icon={CalendarDays}
                title="Appointment record"
                detail={`${patient.last} · Consultation completed`}
              />
              <Timeline icon={HeartPulse} title="Current diagnosis" detail={patient.diagnosis} />
              <Timeline
                icon={FileText}
                title="Patient record"
                detail={`${patient.visits} total visits in MediBook`}
              />
            </div>
          </div>
        </section>
      </aside>
    </div>
  );
}
function Timeline({
  icon: Icon,
  title,
  detail,
}: {
  icon: typeof CalendarDays;
  title: string;
  detail: string;
}) {
  return (
    <div className="border-border flex gap-3 rounded-xl border p-4">
      <div className="text-primary grid size-9 shrink-0 place-items-center rounded-full bg-[#edf3ff]">
        <Icon className="size-4" />
      </div>
      <div>
        <p className="text-sm font-bold">{title}</p>
        <p className="text-muted-foreground mt-1 text-xs">{detail}</p>
      </div>
    </div>
  );
}
function EmptyState() {
  return (
    <div className="p-14 text-center">
      <UserRound className="text-primary/50 mx-auto size-8" />
      <h3 className="mt-3 font-bold">No patients found</h3>
      <p className="text-muted-foreground mt-1 text-sm">
        Try adjusting your search or status filter.
      </p>
    </div>
  );
}
export default StaffPatients;
