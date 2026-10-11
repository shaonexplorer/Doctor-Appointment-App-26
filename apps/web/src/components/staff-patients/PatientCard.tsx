'use client';

import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import type { PatientCardProps } from './types';

export function PatientCard({ patient, onViewPatient }: PatientCardProps) {
  const statusTone =
    patient.status === 'Active'
      ? 'bg-[#e9f8f3] text-[#258c70]'
      : 'bg-secondary text-muted-foreground';

  return (
    <article className={cn('border-border rounded-xl border p-4', 'hover:bg-secondary/30 transition-colors')}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid size-10 place-items-center rounded-full bg-[#d9e8ff] text-xs font-bold text-primary">
            {patient.initials}
          </div>
          <div className="min-w-0">
            <p className="truncate font-bold">{patient.name}</p>
            <p className="text-xs text-muted-foreground">{patient.id} · {patient.age} years</p>
          </div>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${statusTone}`}>{patient.status}</span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <Info label="Phone" value={patient.phone} />
        <Info label="Last visit" value={patient.lastVisit} />
        <Info label="Doctor" value={patient.doctor} />
        <Info label="Next visit" value={patient.nextAppointment} />
      </div>
      <button
        onClick={() => onViewPatient(patient)}
        className={cn(
          'bg-primary text-primary-foreground mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold',
          'hover:bg-primary/90 transition-colors'
        )}
      >
        View patient
        <ChevronRight className="size-4" aria-hidden="true" />
      </button>
    </article>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-border rounded-xl border p-3">
      <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">{label}</p>
      <p className="mt-1 truncate text-xs font-bold">{value}</p>
    </div>
  );
}