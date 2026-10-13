'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  CalendarDays,
  FileText,
  HeartPulse,
  X,
  Stethoscope,
  CreditCard,
  Activity,
} from 'lucide-react';
import type { PatientDrawerProps } from './types';
import { useRouter } from 'next/navigation';

const timelineIcons = {
  Appointment: CalendarDays,
  Diagnosis: HeartPulse,
  Record: FileText,
  Consultation: Stethoscope,
  Billing: CreditCard,
  Activity: Activity,
} as const;

export function PatientDrawer({
  patient,
  onClose,
  onScheduleAppointment,
  onViewFullRecord,
}: PatientDrawerProps) {
  const router = useRouter();

  if (!patient) return null;

  // Build timeline items from patient data
  const timelineItems = useMemo(() => {
    if (!patient) return [];

    const items = [];

    // Last visit
    if (patient.lastVisit && patient.lastVisit !== '—') {
      items.push({
        icon: 'Appointment' as const,
        title: 'Last Visit',
        text: `${patient.lastVisit} · ${patient.diagnosis || 'Consultation completed'}`,
      });
    }

    // Add diagnosis
    if (patient.diagnosis) {
      items.push({
        icon: 'Diagnosis' as const,
        title: 'Current Diagnosis',
        text: patient.diagnosis,
      });
    }

    // Next appointment
    if (patient.nextAppointment && patient.nextAppointment !== '—') {
      items.push({
        icon: 'Consultation' as const,
        title: 'Next Appointment',
        text: patient.nextAppointment,
      });
    }

    // Total visits
    if (patient.totalVisits > 0) {
      items.push({
        icon: 'Record' as const,
        title: 'Patient Record',
        text: `${patient.totalVisits} total visits in MediBook`,
      });
    }

    return items;
  }, [patient]);

  return (
    <div className="bg-foreground/25 fixed inset-0 z-50" onClick={onClose}>
      <aside
        className="border-border bg-card absolute top-0 right-0 h-full w-full max-w-2xl overflow-y-auto border-l p-5 shadow-2xl sm:p-7"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="patient-detail-title"
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
              <div className="text-primary grid size-12 place-items-center rounded-full bg-[#d9e8ff] font-bold">
                {patient.initials}
              </div>
              <div>
                <h2 id="patient-detail-title" className="text-2xl font-black">
                  {patient.name}
                </h2>
                <p className="text-muted-foreground text-xs">
                  {patient.id} · {patient.age} years · {patient.gender}
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
          <Info label="Phone" value={patient.phone} />
          <Info label="Last visit" value={patient.lastVisit} />
          <Info label="Diagnosis" value={patient.diagnosis} />
          <Info label="Visits" value={`${patient.totalVisits}`} />
        </div>
        <div className="border-border mt-6 flex flex-wrap gap-2 border-b pb-2 text-xs font-bold">
          {['Profile', 'Appointments', 'Medical history', 'Payments'].map((tab, index) => (
            <button
              key={tab}
              className={cn(
                'rounded-lg px-3 py-2 whitespace-nowrap',
                index === 0
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-secondary'
              )}
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
              <Info label="Next appointment" value={patient.nextAppointment} />
            </div>
          </div>
          <div>
            <h3 className="font-bold">Recent activity</h3>
            <div className="mt-3 grid gap-3">
              {timelineItems.map((item, index) => (
                <Timeline
                  key={`${item.title}-${index}`}
                  icon={item.icon}
                  title={item.title}
                  detail={item.text}
                />
              ))}
              {timelineItems.length === 0 && (
                <div className="border-border rounded-xl border p-4 text-center">
                  <p className="text-primary text-xs font-bold">No timeline data</p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    No recent activity available for this patient yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <button
            onClick={() => router.push('/staff/booking?patientId=' + patient.id)}
            className={cn(
              'bg-primary text-primary-foreground rounded-xl py-3 text-xs font-bold',
              'hover:bg-primary/90 transition-colors'
            )}
          >
            Schedule appointment
          </button>
          <button
            onClick={() => onViewFullRecord?.(patient)}
            className={cn(
              'border-border hover:bg-secondary rounded-xl border py-3 text-xs font-bold',
              'transition-colors'
            )}
          >
            View full record
          </button>
        </div>
      </aside>
    </div>
  );
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

function Timeline({
  icon,
  title,
  detail,
}: {
  icon: keyof typeof timelineIcons;
  title: string;
  detail: string;
}) {
  const IconComponent = timelineIcons[icon];
  return (
    <div className="border-border flex gap-3 rounded-xl border p-4">
      <div className="text-primary grid size-9 shrink-0 place-items-center rounded-full bg-[#edf3ff]">
        <IconComponent className="size-4" />
      </div>
      <div>
        <p className="text-sm font-bold">{title}</p>
        <p className="text-muted-foreground mt-1 text-xs">{detail}</p>
      </div>
    </div>
  );
}
