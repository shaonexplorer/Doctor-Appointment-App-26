'use client';

import { cn } from '@/lib/utils';
import type { Patient, PatientTableProps } from './types';

export function PatientTable({ patients, onViewPatient }: PatientTableProps) {
  return (
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
          {patients.map((p) => (
            <PatientRow key={p.id} patient={p} onView={() => onViewPatient(p)} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PatientRow({ patient: p, onView }: { patient: Patient; onView: () => void }) {
  return (
    <tr className="border-border hover:bg-secondary/30 border-b transition-colors last:border-0">
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
      <td className="px-5 py-4 text-xs font-semibold">{p.lastVisit}</td>
      <td className="text-muted-foreground px-5 py-4 text-xs">{p.diagnosis}</td>
      <td className="text-primary px-5 py-4 text-xs font-semibold">{p.nextAppointment}</td>
      <td className="px-5 py-4 text-sm">{p.totalVisits}</td>
      <td className="px-5 py-4">
        <button
          onClick={onView}
          className={cn(
            'border-border hover:bg-secondary rounded-lg border px-3 py-1.5 text-[10px] font-bold',
            'transition-colors'
          )}
        >
          View patient
        </button>
      </td>
    </tr>
  );
}
