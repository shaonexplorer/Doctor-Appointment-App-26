'use client';

import { useMemo, useState, type ReactNode } from 'react';
import {
  Activity,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Search,
  ShieldCheck,
  Stethoscope,
  UserRound,
  X,
} from 'lucide-react';

const doctors = [
  {
    name: 'Dr. Michael Anderson',
    initials: 'MA',
    specialty: 'Cardiology',
    clinic: 'MediBook Downtown',
    today: 8,
    next: '09:30 AM',
    availability: 'Available',
    status: 'ACTIVE',
    patients: 248,
    utilization: 88,
  },
  {
    name: 'Dr. Emily Carter',
    initials: 'EC',
    specialty: 'Internal Medicine',
    clinic: 'MediBook Westside',
    today: 6,
    next: '10:00 AM',
    availability: 'In consultation',
    status: 'ACTIVE',
    patients: 196,
    utilization: 82,
  },
  {
    name: 'Dr. James Wilson',
    initials: 'JW',
    specialty: 'Neurology',
    clinic: 'MediBook Downtown',
    today: 4,
    next: '11:00 AM',
    availability: 'Available at 10:45',
    status: 'ACTIVE',
    patients: 84,
    utilization: 54,
  },
  {
    name: 'Dr. Priya Shah',
    initials: 'PS',
    specialty: 'Dermatology',
    clinic: 'MediBook Westside',
    today: 3,
    next: '01:30 PM',
    availability: 'On break',
    status: 'ACTIVE',
    patients: 196,
    utilization: 76,
  },
  {
    name: 'Dr. Robert Kim',
    initials: 'RK',
    specialty: 'Orthopedics',
    clinic: 'MediBook East',
    today: 0,
    next: 'Tomorrow',
    availability: 'Off today',
    status: 'OFFLINE',
    patients: 68,
    utilization: 42,
  },
];

export function StaffDoctors() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All doctors');
  const [selected, setSelected] = useState<(typeof doctors)[number] | null>(null);
  const [notice, setNotice] = useState('');
  const filtered = useMemo(
    () =>
      doctors.filter(
        (doctor) =>
          `${doctor.name} ${doctor.specialty} ${doctor.clinic}`
            .toLowerCase()
            .includes(query.toLowerCase()) &&
          (filter === 'All doctors' ||
            (filter === 'Available'
              ? doctor.availability === 'Available'
              : doctor.status === 'OFFLINE'))
      ),
    [query, filter]
  );
  const action = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 2600);
  };
  return (
    <div className="mt-8 space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Total doctors" value="24" icon={Stethoscope} tone="blue" />
        <Metric label="Available now" value="12" icon={CheckCircle2} tone="green" />
        <Metric label="In consultation" value="8" icon={Clock3} tone="amber" />
        <Metric label="Avg utilization" value="74.8%" icon={Activity} tone="purple" />
      </div>
      <div className="border-border bg-card flex flex-col gap-3 rounded-2xl border p-4 shadow-sm sm:flex-row">
        <label className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <input
            aria-label="Search doctors"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search doctors, specialties, or clinics..."
            className="border-border bg-background focus:border-primary focus:ring-primary/15 h-11 w-full rounded-xl border pr-3 pl-9 text-sm outline-none focus:ring-2"
          />
        </label>
        <select
          aria-label="Filter doctors"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="border-border bg-background h-11 rounded-xl border px-3 text-sm font-semibold"
        >
          <option>All doctors</option>
          <option>Available</option>
          <option>Offline</option>
        </select>
        <button
          onClick={() => action('Doctor invite workspace opened')}
          className="bg-primary text-primary-foreground rounded-xl px-4 py-2.5 text-xs font-bold"
        >
          Add doctor
        </button>
      </div>
      <section className="border-border bg-card overflow-hidden rounded-2xl border shadow-sm">
        <div className="border-border border-b p-5">
          <h2 className="font-bold">Doctors on duty</h2>
          <p className="text-muted-foreground mt-1 text-xs">
            Coordinate availability and patient flow with the clinical team.
          </p>
        </div>
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-secondary/60 text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
              <tr>
                {[
                  'Doctor',
                  'Specialty & clinic',
                  'Today',
                  'Next appointment',
                  'Availability',
                  'Utilization',
                  'Actions',
                ].map((heading) => (
                  <th key={heading} className="px-5 py-3">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {filtered.map((doctor) => (
                <DoctorRow
                  key={doctor.name}
                  doctor={doctor}
                  onView={() => setSelected(doctor)}
                  onAction={action}
                />
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid gap-3 p-4 md:hidden">
          {filtered.map((doctor) => (
            <div key={doctor.name} className="border-border rounded-xl border p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar initials={doctor.initials} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">{doctor.name}</p>
                    <p className="text-muted-foreground text-xs">{doctor.specialty}</p>
                  </div>
                </div>
                <Availability value={doctor.availability} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <Info label="Today" value={`${doctor.today} appointments`} />
                <Info label="Next" value={doctor.next} />
                <Info label="Clinic" value={doctor.clinic} />
                <Info label="Utilization" value={`${doctor.utilization}%`} />
              </div>
              <button
                onClick={() => setSelected(doctor)}
                className="border-border hover:bg-secondary mt-4 w-full rounded-lg border py-2.5 text-xs font-bold"
              >
                View doctor
              </button>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-muted-foreground p-12 text-center text-sm">
            No doctors match this search.
          </div>
        )}
      </section>
      {notice && (
        <div
          role="status"
          className="bg-foreground text-background fixed right-5 bottom-5 z-50 rounded-xl px-4 py-3 text-xs font-bold shadow-xl"
        >
          {notice}
        </div>
      )}
      {selected && (
        <div className="bg-foreground/20 fixed inset-0 z-50 flex justify-end">
          <div className="bg-card h-full w-full max-w-md overflow-y-auto p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-primary text-xs font-bold tracking-[0.16em] uppercase">
                  Doctor profile
                </p>
                <h2 className="mt-2 text-xl font-black">{selected.name}</h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  {selected.specialty} · {selected.clinic}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                aria-label="Close doctor profile"
                className="text-muted-foreground hover:bg-secondary rounded-lg p-2"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="bg-secondary mt-6 flex items-center gap-3 rounded-2xl p-4">
              <Avatar initials={selected.initials} />
              <div>
                <p className="text-sm font-bold">{selected.availability}</p>
                <p className="text-muted-foreground text-xs">
                  {selected.today} appointments scheduled today
                </p>
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Info label="Next appointment" value={selected.next} />
              <Info label="Patients this month" value={`${selected.patients}`} />
              <Info label="Slot utilization" value={`${selected.utilization}%`} />
              <Info label="Current status" value={selected.status} />
            </div>
            <div className="mt-6 grid gap-2">
              <button
                onClick={() => action(`Schedule opened for ${selected.name}`)}
                className="bg-primary text-primary-foreground flex items-center gap-2 rounded-xl px-4 py-3 text-left text-xs font-bold"
              >
                <CalendarDays className="size-4" />
                View schedule
              </button>
              <button
                onClick={() => action(`Message sent to ${selected.name}`)}
                className="border-border hover:bg-secondary flex items-center gap-2 rounded-xl border px-4 py-3 text-left text-xs font-bold"
              >
                <UserRound className="text-primary size-4" />
                Contact doctor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
function Metric({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  icon: typeof Activity;
  tone: string;
}) {
  return (
    <div className="border-border bg-card rounded-2xl border p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-xs font-semibold">{label}</span>
        <span
          className={`grid size-8 place-items-center rounded-lg ${tone === 'green' ? 'bg-[#e7f7f0] text-[#2e9675]' : tone === 'amber' ? 'bg-[#fff3e2] text-[#b57a2f]' : tone === 'purple' ? 'bg-[#f1edff] text-[#826fd1]' : 'bg-[#eaf0ff] text-[#5577c8]'}`}
        >
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-black">{value}</p>
    </div>
  );
}
function DoctorRow({
  doctor,
  onView,
  onAction,
}: {
  doctor: (typeof doctors)[number];
  onView: () => void;
  onAction: (message: string) => void;
}) {
  return (
    <tr className="hover:bg-secondary/30">
      <td className="px-5 py-4">
        <button onClick={onView} className="flex items-center gap-3 text-left">
          <Avatar initials={doctor.initials} />
          <span className="font-bold">{doctor.name}</span>
        </button>
      </td>
      <td className="px-5 py-4">
        <p className="font-semibold">{doctor.specialty}</p>
        <p className="text-muted-foreground text-xs">{doctor.clinic}</p>
      </td>
      <td className="px-5 py-4 text-xs font-semibold">{doctor.today} appointments</td>
      <td className="px-5 py-4 text-xs font-semibold">{doctor.next}</td>
      <td className="px-5 py-4">
        <Availability value={doctor.availability} />
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="bg-secondary h-1.5 w-16 rounded-full">
            <div
              className="bg-primary h-1.5 rounded-full"
              style={{ width: `${doctor.utilization}%` }}
            />
          </div>
          <span className="text-xs">{doctor.utilization}%</span>
        </div>
      </td>
      <td className="px-5 py-4">
        <button
          onClick={() => onAction(`Schedule opened for ${doctor.name}`)}
          className="border-border hover:bg-secondary rounded-lg border px-3 py-1.5 text-[11px] font-bold"
        >
          Schedule
        </button>
      </td>
    </tr>
  );
}
function Avatar({ initials }: { initials: string }) {
  return (
    <div className="text-primary grid size-9 shrink-0 place-items-center rounded-full bg-[#d9e8ff] text-[10px] font-bold">
      {initials}
    </div>
  );
}
function Availability({ value }: { value: string }) {
  const tone =
    value === 'Available'
      ? 'bg-[#e7f7f0] text-[#2e9675]'
      : value === 'Off today'
        ? 'bg-secondary text-muted-foreground'
        : 'bg-[#fff3e2] text-[#b57a2f]';
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${tone}`}>
      {value}
    </span>
  );
}
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-border rounded-xl border p-3">
      <p className="text-muted-foreground text-[10px] font-bold tracking-wide uppercase">{label}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}
export default StaffDoctors;
