'use client';

import { useMemo, useState, type ReactNode } from 'react';
import {
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  UserPlus,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const patients = [
  {
    name: 'Sarah Johnson',
    id: 'PT-20481',
    phone: '+1 (555) 014-2281',
    email: 'sarah.johnson@email.com',
  },
  {
    name: 'Robert Williams',
    id: 'PT-18942',
    phone: '+1 (555) 014-9014',
    email: 'robert.w@email.com',
  },
];
const doctors = [
  {
    name: 'Dr. Michael Anderson',
    specialty: 'Cardiology',
    fee: '$120',
    availability: 'Available today',
  },
  {
    name: 'Dr. Emily Carter',
    specialty: 'Dermatology',
    fee: '$95',
    availability: 'Available tomorrow',
  },
  {
    name: 'Dr. James Wilson',
    specialty: 'General Medicine',
    fee: '$80',
    availability: 'Available today',
  },
];
const slots = ['09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '01:30 PM', '02:00 PM'];

function SectionTitle({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="bg-primary/10 text-primary grid size-10 shrink-0 place-items-center rounded-xl">
        {icon}
      </div>
      <div>
        <h3 className="font-black">{title}</h3>
        <p className="text-muted-foreground mt-1 text-sm">{description}</p>
      </div>
    </div>
  );
}

export function StaffBooking({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(1);
  const [patient, setPatient] = useState<(typeof patients)[number] | null>(null);
  const [doctor, setDoctor] = useState(doctors[0]);
  const [date, setDate] = useState('Tue, Sep 22');
  const [slot, setSlot] = useState('10:30 AM');
  const [symptoms, setSymptoms] = useState('');
  const [query, setQuery] = useState('');
  const [created, setCreated] = useState(false);
  const [error, setError] = useState('');
  const found = useMemo(
    () =>
      patients.filter((p) =>
        `${p.name} ${p.id} ${p.phone} ${p.email}`.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );
  const next = () => {
    setError('');
    if (step === 1 && !patient)
      return setError('Select an existing patient or create a new patient first.');
    if (step === 3 && !slot) return setError('Choose an available appointment slot.');
    if (step === 4 && symptoms.trim().length < 5)
      return setError("Add a brief description of the patient's symptoms.");
    setStep((s) => Math.min(5, s + 1));
  };

  if (created)
    return (
      <main className="mx-auto max-w-3xl p-5 pb-24 sm:p-8 lg:p-10">
        <div className="border-border bg-card rounded-3xl border p-8 text-center shadow-sm sm:p-14">
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-[#e9f8f3] text-[#258c70]">
            <Check className="size-8" />
          </div>
          <p className="text-primary mt-6 text-xs font-bold tracking-[0.16em] uppercase">
            Booking complete
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight">
            Appointment created successfully
          </h2>
          <p className="text-muted-foreground mt-3 text-sm">
            The patient and doctor have been added to the appointment queue.
          </p>
          <div className="bg-secondary mx-auto mt-8 max-w-md rounded-2xl p-5 text-left">
            <p className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
              Appointment ID
            </p>
            <p className="text-primary mt-1 text-xl font-black">APT-2026-004932</p>
            <div className="mt-4 grid gap-2 text-sm">
              <p>
                <b>{patient?.name}</b> with {doctor.name}
              </p>
              <p>
                {date} at {slot} &middot; {doctor.fee}
              </p>
              <p>
                Payment status: <b>Pending</b>
              </p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              Print confirmation
            </Button>
            <Button variant="outline" size="sm" onClick={() => setError('Notification sent to the patient.')}>
              Send notification
            </Button>
            <Button size="sm" onClick={() => {
                setCreated(false);
                setStep(1);
                setPatient(null);
              }}>
              Book another appointment
            </Button>
          </div>
          {error && (
            <p role="status" className="text-primary mt-5 text-sm font-semibold">
              {error}
            </p>
          )}
        </div>
      </main>
    );

  return (
    <main className="mx-auto max-w-5xl min-w-0 p-5 pb-24 sm:p-8 lg:p-10">
      <Button variant="ghost" className="mb-5 text-muted-foreground hover:text-foreground" onClick={onBack}>
        <ArrowLeft className="mr-2 size-4" />
        Back to dashboard
      </Button>
      <div className="mb-8">
        <p className="text-primary text-xs font-bold tracking-[0.16em] uppercase">
          Front desk booking
        </p>
        <h2 className="mt-2 text-3xl font-black tracking-tight">Book an appointment</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Create a visit on behalf of a patient in five clear steps.
        </p>
      </div>
      <div className="mb-8 grid grid-cols-5 gap-2">
        {['Patient', 'Doctor', 'Date & time', 'Symptoms', 'Review'].map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`grid size-8 shrink-0 place-items-center rounded-full text-xs font-black ${
                step > i + 1 ? 'bg-[#e9f8f3] text-[#258c70]' : step === i + 1 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
              }`}
            >
              {step > i + 1 ? <Check className="size-4" /> : i + 1}
            </div>
            <span className="text-muted-foreground hidden text-[11px] font-bold sm:block">
              {label}
            </span>
          </div>
        ))}
      </div>
      {error && (
        <div
          role="alert"
          className="mb-5 rounded-xl border border-[#f0d2cc] bg-[#fff8f6] p-3 text-sm font-semibold text-[#b86f63]"
        >
          {error}
        </div>
      )}
      <section className="border-border bg-card rounded-2xl border p-5 shadow-sm sm:p-7">
        {step === 1 && (
          <>
            <SectionTitle
              icon={<Users />}
              title="Search existing patient"
              description="Search by name, phone, email, or patient ID."
            />
            <input
              aria-label="Search existing patient"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search patient name, phone, email, or ID"
              className="border-border bg-background focus:border-primary focus:ring-primary/15 mt-6 h-12 w-full rounded-xl border px-4 text-sm outline-none focus:ring-2"
            />
            <div className="mt-4 flex flex-col gap-2">
              {found.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPatient(p)}
                  className={`flex items-center justify-between rounded-xl border p-4 text-left transition ${
                    patient?.id === p.id ? 'border-primary bg-primary/5' : 'border-border hover:bg-secondary'
                  }`}
                >
                  <span>
                    <b className="text-sm">{p.name}</b>
                    <span className="text-muted-foreground ml-2 text-xs">
                      {p.id} &middot; {p.phone}
                    </span>
                  </span>
                  {patient?.id === p.id && <Check className="text-primary size-4" />}
                </button>
              ))}
            </div>
            <Button variant="outline" className="mt-5 border-dashed" onClick={() => setError('New patient registration opened in a separate workflow.')}>
              <UserPlus className="mr-2 size-4" />
              Create New Patient
            </Button>
          </>
        )}
        {step === 2 && (
          <>
            <SectionTitle
              icon={<Users />}
              title="Select doctor"
              description="Filter by specialty and availability."
            />
            <div className="mt-6 grid gap-3">
              {doctors.map((d) => (
                <button
                  key={d.name}
                  onClick={() => setDoctor(d)}
                  className={`flex items-center justify-between rounded-xl border p-4 text-left ${
                    doctor.name === d.name ? 'border-primary bg-primary/5' : 'border-border hover:bg-secondary'
                  }`}
                >
                  <span>
                    <b className="text-sm">{d.name}</b>
                    <span className="text-muted-foreground mt-1 block text-xs">
                      {d.specialty} &middot; {d.availability}
                    </span>
                  </span>
                  <span className="text-primary text-sm font-black">{d.fee}</span>
                </button>
              ))}
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <SectionTitle
              icon={<CalendarDays />}
              title="Select date and available slot"
              description="Choose a time that works for the patient."
            />
            <div className="mt-6 flex flex-wrap gap-2">
              {['Tue, Sep 22', 'Wed, Sep 23', 'Thu, Sep 24'].map((d) => (
                <button
                  key={d}
                  onClick={() => setDate(d)}
                  className={`rounded-xl border px-4 py-3 text-xs font-bold ${
                    date === d ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:bg-secondary'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {slots.map((s) => (
                <button
                  key={s}
                  onClick={() => setSlot(s)}
                  className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-xs font-bold ${
                    slot === s ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:bg-secondary'
                  }`}
                >
                  <Clock3 className="size-4" />
                  {s}
                </button>
              ))}
            </div>
          </>
        )}
        {step === 4 && (
          <>
            <SectionTitle
              icon={<Users />}
              title="Enter symptoms"
              description="Add the reason for the visit to help the doctor prepare."
            />
            <textarea
              aria-label="Symptoms"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Describe symptoms or reason for visit..."
              className="border-border bg-background focus:border-primary focus:ring-primary/15 mt-6 min-h-40 w-full resize-y rounded-xl border p-4 text-sm outline-none focus:ring-2"
            />
          </>
        )}
        {step === 5 && (
          <>
            <SectionTitle
              icon={<Check />}
              title="Review appointment"
              description="Confirm the details before creating the appointment."
            />
            <div className="bg-secondary mt-6 grid gap-3 rounded-2xl p-5 text-sm">
              <p>
                <span className="text-muted-foreground">Patient</span>
                <br />
                <b>{patient?.name}</b> &middot; {patient?.id}
              </p>
              <p>
                <span className="text-muted-foreground">Doctor</span>
                <br />
                <b>{doctor.name}</b> &middot; {doctor.specialty}
              </p>
              <p>
                <span className="text-muted-foreground">Date & time</span>
                <br />
                <b>
                  {date} at {slot}
                </b>
              </p>
              <p>
                <span className="text-muted-foreground">Consultation fee</span>
                <br />
                <b>{doctor.fee}</b> &middot; Payment status: <b>Pending</b>
              </p>
              <p>
                <span className="text-muted-foreground">Symptoms</span>
                <br />
                {symptoms}
              </p>
            </div>
          </>
        )}
      </section>
      <div className="mt-5 flex justify-end gap-3">
        {step > 1 && (
          <Button variant="outline" onClick={() => setStep(step - 1)}>
            Back
          </Button>
        )}
        <Button onClick={() => (step === 5 ? setCreated(true) : next())}>
          {step === 5 ? 'Confirm booking' : 'Continue'}
          <ChevronRight className="ml-2 size-4" />
        </Button>
      </div>
    </main>
  );
}