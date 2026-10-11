'use client';

import { cn } from '@/lib/utils';
import type { PatientTableProps } from './types';

export function PatientTable({ patients, onViewPatient }: PatientTableProps) {
  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="w-full min-w-[1040px] text-left text-sm">
        <thead className="border-b border-border bg-secondary/60 text-[10px] uppercase tracking-wider text-muted-foreground">
          <tr>
            {['Patient', 'Contact', 'Last visit', 'Doctor', 'Next appointment', 'Payment', 'Status', 'Actions'].map(
              (heading) => (
                <th key={heading} className="px-5 py-4 font-bold">
                  {heading}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <PatientRow key={patient.id} patient={patient} onView={() => onViewPatient(patient)} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PatientRow({
  patient,
  onView,
}: {
  patient: StaffPatient;
  onView: () => void;
}) {
  const statusTone =
    patient.status === 'Active'
      ? 'bg-[#e9f8f3] text-[#258c70]'
      : 'bg-secondary text-muted-foreground';
  const paymentTone =
    patient.payment === 'Paid'
      ? 'bg-[#e9f8f3] text-[#258c70]'
      : 'bg-[#fff3e7] text-[#d68b42]';

  return (
    <tr className="border-b border-border last:border-0 hover:bg-secondary/30">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-full bg-[#d9e8ff] text-xs font-bold text-primary">
            {patient.initials}
          </div>
          <div>
            <p className="font-bold">{patient.name}</p>
            <p className="text-[11px] text-muted-foreground">{patient.id} · {patient.age} years</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-4 text-xs text-muted-foreground">
        <p>{patient.phone}</p>
        <p className="mt-1">{patient.email}</p>
      </td>
      <td className="px-5 py-4 text-xs font-semibold">{patient.lastVisit}</td>
      <td className="px-5 py-4 text-xs text-muted-foreground">{patient.doctor}</td>
      <td className="px-5 py-4 text-xs font-semibold text-primary">{patient.nextAppointment}</td>
      <td className="px-5 py-4">
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${paymentTone}`}>{patient.payment}</span>
      </td>
      <td className="px-5 py-4">
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${statusTone}`}>{patient.status}</span>
      </td>
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

// Need to import the type
interface StaffPatient {
  id: string;
  name: string;
  initials: string;
  phone: string;
  email: string;
  age: number;
  gender: string;
  lastVisit: string;
  diagnosis: string;
  nextAppointment: string;
  doctor: string;
  totalVisits: number;
  status: 'Active' | 'Inactive';
  payment: 'Paid' | 'Pending';
}