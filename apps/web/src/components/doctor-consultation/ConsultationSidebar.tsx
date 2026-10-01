'use client';

import { cn } from '@/lib/utils';
import type { ConsultationSidebarProps } from './types';

export function ConsultationSidebar({ patient, className }: ConsultationSidebarProps) {
  const infoItems = [
    ['Blood group', patient.bloodGroup],
    ['Emergency', patient.emergencyContact],
    ['History', patient.medicalHistory.join(', ') || 'None'],
    ['Allergies', patient.allergies.join(', ') || 'None'],
    ['Previous visits', patient.previousVisits],
  ] as const;

  return (
    <aside className={cn('border-border bg-card rounded-2xl border p-5 shadow-sm', className)}>
      <p className="text-primary text-[10px] font-bold tracking-wider uppercase">
        Patient information
      </p>
      <div className="mt-4 flex items-center gap-3">
        <div className="text-primary grid size-12 place-items-center rounded-full bg-[#d9e8ff] font-bold">
          {patient.initials}
        </div>
        <div>
          <h2 className="font-black">{patient.name}</h2>
          <p className="text-muted-foreground text-xs">
            {patient.age} years · {patient.gender}
          </p>
        </div>
      </div>
      <div className="mt-5 grid gap-3">
        {infoItems.map(([label, value]) => (
          <div key={label} className="border-border border-b pb-3">
            <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
              {label}
            </p>
            <p className="mt-1 text-xs font-semibold">{value}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}
