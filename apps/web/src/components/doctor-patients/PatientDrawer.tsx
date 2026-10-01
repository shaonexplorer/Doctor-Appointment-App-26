'use client';

import { cn } from '@/lib/utils';
import { ArrowLeft, CalendarDays, FileText, HeartPulse, X, Clock } from 'lucide-react';
import type { PatientDrawerProps } from './types';

const timelineIcons = {
  Appointment: CalendarDays,
  Symptoms: HeartPulse,
  Diagnosis: FileText,
  Prescription: HeartPulse,
  FollowUp: Clock,
} as const;

export function PatientDrawer({
  patient,
  onClose,
  onScheduleAppointment,
  onViewFullRecord,
}: PatientDrawerProps) {
  if (!patient) return null;

  const timelineItems = [
    {
      icon: 'Appointment',
      title: 'Appointment',
      text: `${patient.lastVisit} · Follow-up consultation`,
    },
    { icon: 'Symptoms', title: 'Symptoms', text: 'Chest discomfort and shortness of breath' },
    { icon: 'Diagnosis', title: 'Diagnosis', text: `${patient.diagnosis} — stable with treatment` },
    { icon: 'Prescription', title: 'Prescription', text: 'Amlodipine 5mg · once daily' },
    { icon: 'FollowUp', title: 'Follow-up', text: 'Review blood pressure in 2 weeks' },
  ] as const;

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
                  {patient.id} · {patient.age} years
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
          <Info label="Last visit" value={patient.lastVisit} />
          <Info label="Diagnosis" value={patient.diagnosis} />
          <Info label="Total visits" value={`${patient.totalVisits}`} />
          <Info label="Next appointment" value={patient.nextAppointment} />
        </div>
        <div className="border-border mt-6 flex flex-wrap gap-2 border-b pb-2 text-xs font-bold">
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
              className={cn(
                'rounded-lg px-3 py-2 whitespace-nowrap',
                i === 0
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-secondary'
              )}
            >
              {tab}
            </button>
          ))}
        </div>
        <section className="mt-6">
          <h3 className="font-bold">Patient timeline</h3>
          <div className="border-primary/20 mt-4 grid gap-4 border-l-2 pl-5">
            {timelineItems.map((item, index) => {
              const Icon = timelineIcons[item.icon as keyof typeof timelineIcons];
              return (
                <div key={`${item.title}-${index}`} className="relative">
                  <span className="bg-primary text-primary-foreground absolute -left-[31px] grid size-5 place-items-center rounded-full">
                    <Icon className="size-3" />
                  </span>
                  <p className="text-primary text-xs font-bold">{item.title}</p>
                  <p className="text-muted-foreground mt-1 text-sm">{item.text}</p>
                </div>
              );
            })}
          </div>
        </section>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <button
            onClick={() => onScheduleAppointment?.(patient)}
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
