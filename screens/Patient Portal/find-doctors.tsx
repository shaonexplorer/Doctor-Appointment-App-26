'use client';

import { useMemo, useState } from 'react';
import {
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Filter,
  Grid2X2,
  List,
  MapPin,
  Search,
  SlidersHorizontal,
  Star,
  Video,
  X,
} from 'lucide-react';

const doctors = [
  {
    name: 'Dr. Michael Anderson',
    initials: 'MA',
    designation: 'Senior Consultant Cardiologist',
    specialties: ['Cardiology', 'Heart & Vascular'],
    symptoms: ['Chest pain', 'High blood pressure'],
    experience: '18 years',
    qualifications: 'MD, FACC',
    fee: '$85',
    clinic: 'Heart & Vascular Center',
    next: 'Today, 4:30 PM',
    availability: 'Available today',
    color: 'bg-[#dce8ff] text-primary',
  },
  {
    name: 'Dr. Emily Carter',
    initials: 'EC',
    designation: 'Consultant Dermatologist',
    specialties: ['Dermatology', 'Cosmetic Skin'],
    symptoms: ['Acne', 'Skin rash'],
    experience: '12 years',
    qualifications: 'MD, FAAD',
    fee: '$70',
    clinic: 'ClearSkin Clinic',
    next: 'Tomorrow, 9:00 AM',
    availability: 'Available this week',
    color: 'bg-[#fce4f0] text-[#bd5d8c]',
  },
  {
    name: 'Dr. James Wilson',
    initials: 'JW',
    designation: 'Internal Medicine Specialist',
    specialties: ['Internal Medicine', 'Primary Care'],
    symptoms: ['Fatigue', 'Diabetes care'],
    experience: '15 years',
    qualifications: 'MD, FACP',
    fee: '$60',
    clinic: 'MediBook Family Clinic',
    next: 'Wed, Sep 23, 11:00 AM',
    availability: 'Available this week',
    color: 'bg-[#e6f7ef] text-[#278e70]',
  },
  {
    name: 'Dr. Olivia Bennett',
    initials: 'OB',
    designation: 'Consultant Pediatrician',
    specialties: ['Pediatrics', 'Child Wellness'],
    symptoms: ['Fever', 'Child nutrition'],
    experience: '10 years',
    qualifications: 'MD, FAAP',
    fee: '$65',
    clinic: 'Little Steps Pediatrics',
    next: 'No appointments today',
    availability: 'Next week',
    color: 'bg-[#fff1d9] text-[#b97932]',
  },
  {
    name: 'Dr. Sophia Patel',
    initials: 'SP',
    designation: 'Consultant Neurologist',
    specialties: ['Neurology', 'Sleep Medicine'],
    symptoms: ['Headaches', 'Sleep issues'],
    experience: '16 years',
    qualifications: 'MD, FAAN',
    fee: '$90',
    clinic: 'NeuroCare Institute',
    next: 'Thu, Sep 24, 2:00 PM',
    availability: 'Available this week',
    color: 'bg-[#eee8ff] text-[#8062c7]',
  },
  {
    name: 'Dr. Daniel Lee',
    initials: 'DL',
    designation: 'Orthopedic Surgeon',
    specialties: ['Orthopedics', 'Sports Medicine'],
    symptoms: ['Joint pain', 'Sports injuries'],
    experience: '20 years',
    qualifications: 'MD, FAAOS',
    fee: '$95',
    clinic: 'Motion & Joint Center',
    next: 'Fri, Sep 25, 10:30 AM',
    availability: 'Available this week',
    color: 'bg-[#e2f3f6] text-[#398a99]',
  },
];
const specialties = [
  'All specialties',
  'Cardiology',
  'Dermatology',
  'Internal Medicine',
  'Pediatrics',
  'Neurology',
  'Orthopedics',
];

export function FindDoctors({ onOpenProfile }: { onOpenProfile?: () => void }) {
  const [query, setQuery] = useState('');
  const [specialty, setSpecialty] = useState('All specialties');
  const [availableToday, setAvailableToday] = useState(false);
  const [consultation, setConsultation] = useState('Any type');
  const [sort, setSort] = useState('Recommended');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [mobileFilters, setMobileFilters] = useState(false);
  const [notice, setNotice] = useState('');

  const filtered = useMemo(
    () =>
      doctors.filter((doctor) => {
        const haystack = [
          doctor.name,
          doctor.designation,
          ...doctor.specialties,
          ...doctor.symptoms,
          doctor.clinic,
        ]
          .join(' ')
          .toLowerCase();
        return (
          haystack.includes(query.toLowerCase()) &&
          (specialty === 'All specialties' || doctor.specialties.includes(specialty)) &&
          (!availableToday || doctor.availability === 'Available today')
        );
      }),
    [query, specialty, availableToday]
  );

  const action = (label: string) => setNotice(`${label} is ready to open.`);
  const filters = (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-black">Filters</h2>
        <button
          onClick={() => {
            setSpecialty('All specialties');
            setAvailableToday(false);
            setConsultation('Any type');
          }}
          className="text-primary text-xs font-bold hover:underline"
        >
          Clear all
        </button>
      </div>
      <FilterSection title="Specialty">
        <div className="flex flex-col gap-2">
          {specialties.map((item) => (
            <label
              key={item}
              className="text-muted-foreground flex cursor-pointer items-center gap-2 text-xs font-semibold"
            >
              <input
                type="radio"
                name="specialty"
                checked={specialty === item}
                onChange={() => setSpecialty(item)}
                className="accent-[var(--primary)]"
              />
              {item}
            </label>
          ))}
        </div>
      </FilterSection>
      <FilterSection title="Designation">
        <SelectFilter
          label="Any designation"
          options={['Any designation', 'Consultant', 'Senior Consultant', 'Specialist', 'Surgeon']}
        />
      </FilterSection>
      <FilterSection title="Consultation fee">
        <div className="flex items-center justify-between text-xs font-bold">
          <span>$0</span>
          <span>$150+</span>
        </div>
        <input
          type="range"
          min="0"
          max="150"
          defaultValue="150"
          className="mt-3 w-full accent-[var(--primary)]"
        />
      </FilterSection>
      <FilterSection title="Availability">
        <label className="text-muted-foreground flex cursor-pointer items-center gap-2 text-xs font-semibold">
          <input
            type="checkbox"
            checked={availableToday}
            onChange={(e) => setAvailableToday(e.target.checked)}
            className="size-4 accent-[var(--primary)]"
          />
          Available today
        </label>
        <label className="text-muted-foreground mt-3 flex cursor-pointer items-center gap-2 text-xs font-semibold">
          <input type="checkbox" className="size-4 accent-[var(--primary)]" />
          Available this week
        </label>
      </FilterSection>
      <FilterSection title="Consultation type">
        <SelectFilter
          label={consultation}
          options={['Any type', 'In-clinic', 'Video consultation']}
          onChange={setConsultation}
        />
      </FilterSection>
      <FilterSection title="Gender">
        <div className="flex flex-wrap gap-2">
          {['Any', 'Female', 'Male'].map((item) => (
            <button
              key={item}
              className="border-border text-muted-foreground hover:border-primary hover:text-primary rounded-lg border px-3 py-2 text-xs font-bold"
            >
              {item}
            </button>
          ))}
        </div>
      </FilterSection>
      <FilterSection title="Clinic">
        <SelectFilter
          label="All clinics"
          options={[
            'All clinics',
            'Heart & Vascular Center',
            'ClearSkin Clinic',
            'MediBook Family Clinic',
          ]}
        />
      </FilterSection>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      {notice && (
        <div
          role="status"
          className="border-primary/20 bg-primary/5 text-primary flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold"
        >
          <span>{notice}</span>
          <button onClick={() => setNotice('')} aria-label="Dismiss">
            <X className="size-4" />
          </button>
        </div>
      )}
      <div className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-black tracking-tight sm:text-2xl">
              Find the right doctor for your needs
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Search trusted specialists and book care that works for you.
            </p>
          </div>
          <button
            onClick={() => setMobileFilters(true)}
            className="border-border flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold lg:hidden"
          >
            <SlidersHorizontal className="size-4" /> Filters
          </button>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-[1.4fr_1fr_1fr]">
          <label className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by doctor, specialty, or symptom"
              className="border-border bg-background focus:border-primary focus:ring-primary/15 h-11 w-full rounded-xl border pr-3 pl-9 text-sm outline-none focus:ring-2"
            />
          </label>
          <SelectFilter label="All specialties" options={specialties} onChange={setSpecialty} />
          <SelectFilter
            label="Any consultation type"
            options={['Any consultation type', 'In-clinic', 'Video consultation']}
            onChange={setConsultation}
          />
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[230px_1fr]">
        <aside className="border-border bg-card hidden rounded-2xl border p-5 shadow-sm lg:block">
          {filters}
        </aside>
        <section className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-bold">
              <span className="text-primary">{filtered.length}</span> doctors found
            </p>
            <div className="flex items-center gap-2">
              <label className="text-muted-foreground hidden items-center gap-2 text-xs font-semibold sm:flex">
                Sort by{' '}
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="border-border bg-card text-foreground rounded-lg border px-2 py-2 font-bold outline-none"
                >
                  <option>Recommended</option>
                  <option>Experience</option>
                  <option>Fee: low to high</option>
                </select>
              </label>
              <div className="border-border bg-card flex rounded-lg border p-1">
                <button
                  onClick={() => setView('grid')}
                  className={`rounded-md p-1.5 ${view === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                  aria-label="Grid view"
                >
                  <Grid2X2 className="size-4" />
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`rounded-md p-1.5 ${view === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                  aria-label="List view"
                >
                  <List className="size-4" />
                </button>
              </div>
            </div>
          </div>
          {filtered.length === 0 ? (
            <EmptyState
              onClear={() => {
                setQuery('');
                setSpecialty('All specialties');
                setAvailableToday(false);
              }}
            />
          ) : (
            <div className={view === 'grid' ? 'grid gap-4 xl:grid-cols-2' : 'flex flex-col gap-4'}>
              {filtered.map((doctor) => (
                <DoctorCard
                  key={doctor.name}
                  doctor={doctor}
                  list={view === 'list'}
                  onAction={action}
                  onOpenProfile={onOpenProfile}
                />
              ))}
            </div>
          )}
          <div className="border-border bg-card mt-6 flex items-center justify-between rounded-xl border px-4 py-3">
            <p className="text-muted-foreground text-xs">
              Showing 1–{filtered.length} of 48 doctors
            </p>
            <div className="flex items-center gap-1">
              <button className="bg-primary text-primary-foreground rounded-lg px-3 py-2 text-xs font-bold">
                1
              </button>
              <button className="text-muted-foreground hover:bg-secondary rounded-lg px-3 py-2 text-xs font-bold">
                2
              </button>
              <button className="text-muted-foreground hover:bg-secondary rounded-lg px-3 py-2 text-xs font-bold">
                3
              </button>
              <button className="text-muted-foreground hover:bg-secondary rounded-lg p-2">
                <ChevronDown className="size-4 -rotate-90" />
              </button>
            </div>
          </div>
        </section>
      </div>
      {mobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="bg-foreground/20 absolute inset-0"
            onClick={() => setMobileFilters(false)}
          />
          <div className="bg-card absolute inset-y-0 right-0 w-[min(88vw,360px)] overflow-y-auto p-5 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-black">Filter doctors</h2>
              <button
                onClick={() => setMobileFilters(false)}
                className="hover:bg-secondary rounded-lg p-2"
                aria-label="Close filters"
              >
                <X className="size-5" />
              </button>
            </div>
            {filters}
            <button
              onClick={() => setMobileFilters(false)}
              className="bg-primary text-primary-foreground mt-8 w-full rounded-xl py-3 text-sm font-bold"
            >
              Show results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function DoctorCard({
  doctor,
  list,
  onAction,
  onOpenProfile,
}: {
  doctor: (typeof doctors)[number];
  list: boolean;
  onAction: (label: string) => void;
  onOpenProfile?: () => void;
}) {
  return (
    <article
      className={`border-border bg-card hover:border-primary/30 rounded-2xl border p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${list ? 'sm:flex sm:items-center sm:gap-5' : ''}`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`grid size-14 shrink-0 place-items-center rounded-2xl text-lg font-black ${doctor.color}`}
        >
          {doctor.initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="font-black">{doctor.name}</h3>
              <p className="text-primary mt-1 text-xs font-semibold">{doctor.designation}</p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-[#c28a31]">
              <Star className="size-3.5 fill-current" />
              4.9
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {doctor.specialties.map((item) => (
              <span
                key={item}
                className="bg-secondary text-muted-foreground rounded-full px-2.5 py-1 text-[10px] font-bold"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="border-border mt-4 grid gap-3 border-y py-4 text-xs sm:grid-cols-2">
        <Info icon={Clock3} label="Experience" value={doctor.experience} />
        <Info icon={Check} label="Qualifications" value={doctor.qualifications} />
        <Info icon={MapPin} label="Clinic" value={doctor.clinic} />
        <Info icon={CalendarDays} label="Next available" value={doctor.next} />
      </div>
      <p className="text-muted-foreground mb-4 text-xs">
        <span className="text-foreground font-bold">Treats:</span> {doctor.symptoms.join(' · ')}
      </p>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
            Consultation fee
          </p>
          <p className="mt-1 text-lg font-black">
            {doctor.fee}{' '}
            <span className="text-muted-foreground text-[10px] font-semibold">/ visit</span>
          </p>
          <p
            className={`mt-1 text-[10px] font-bold ${doctor.availability === 'Available today' ? 'text-[#278e70]' : 'text-primary'}`}
          >
            {doctor.availability}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onAction(`${doctor.name} profile`)}
            className="border-border hover:bg-secondary rounded-xl border px-3 py-2.5 text-xs font-bold"
          >
            View profile
          </button>
          <button
            onClick={() => onAction(`Booking with ${doctor.name}`)}
            className="bg-primary text-primary-foreground rounded-xl px-3 py-2.5 text-xs font-bold hover:opacity-90"
          >
            Book appointment
          </button>
        </div>
      </div>
    </article>
  );
}
function Info({ icon: Icon, label, value }: { icon: typeof Clock3; label: string; value: string }) {
  return (
    <div className="flex min-w-0 items-start gap-2">
      <Icon className="text-primary mt-0.5 size-3.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-muted-foreground text-[10px] font-bold tracking-wide uppercase">
          {label}
        </p>
        <p className="mt-1 truncate font-bold">{value}</p>
      </div>
    </div>
  );
}
function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-border border-b pb-5 last:border-0">
      <h3 className="text-foreground mb-3 text-xs font-black tracking-wider uppercase">{title}</h3>
      {children}
    </div>
  );
}
function SelectFilter({
  label,
  options,
  onChange,
}: {
  label: string;
  options: string[];
  onChange?: (value: string) => void;
}) {
  return (
    <div className="relative">
      <select
        aria-label={label}
        defaultValue={label}
        onChange={(e) => onChange?.(e.target.value)}
        className="border-border bg-background focus:border-primary h-11 w-full appearance-none rounded-xl border px-3 pr-9 text-sm font-semibold outline-none"
      >
        <option disabled>{label}</option>
        {options
          .filter((option) => option !== label)
          .map((option) => (
            <option key={option}>{option}</option>
          ))}
      </select>
      <ChevronDown className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2" />
    </div>
  );
}
function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="border-border bg-card rounded-2xl border border-dashed p-12 text-center">
      <Search className="text-muted-foreground mx-auto size-8" />
      <h2 className="mt-4 text-lg font-black">No doctors found</h2>
      <p className="text-muted-foreground mx-auto mt-2 max-w-sm text-sm">
        Try a different name, specialty, symptom, or remove one of your filters.
      </p>
      <button
        onClick={onClear}
        className="bg-primary text-primary-foreground mt-5 rounded-xl px-4 py-2.5 text-xs font-bold"
      >
        Clear search
      </button>
    </div>
  );
}
