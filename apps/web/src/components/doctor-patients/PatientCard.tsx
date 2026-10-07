'use client';

import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import type { PatientCardProps } from './types';

export function PatientCard({ patient, onViewPatient }: PatientCardProps) {
  return (
    <article
      className={cn(
        'border-border rounded-xl border p-4',
        'hover:bg-secondary/30 transition-colors'
      )}
    >
      <div className="flex items-start gap-3">
        <div className="text-primary grid size-10 place-items-center rounded-full bg-[#d9e8ff] text-xs font-bold">
          {patient.initials}
        </div>
        <div className="min-w-0">
          <p className="truncate font-bold">{patient.name}</p>
          <p className="text-muted-foreground text-xs">
            {patient.id} · {patient.age} years
          </p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <Info label="Last diagnosis" value={patient.diagnosis} />
        <Info label="Next visit" value={patient.nextAppointment} />
        <Info label="Total visits" value={`${patient.totalVisits}`} />
        <Info label="Status" value={patient.status} />
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
      <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
        {label}
      </p>
      <p className="mt-1 text-xs font-bold">{value}</p>
    </div>
  );
}
