'use client';

import * as React from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/staff-portal/data-table';
import { type DataTableFeatures } from '@/components/staff-portal/data-table-features';
import type { StaffPatient } from './types';

export function PatientTable({ patients, onViewPatient }: { patients: StaffPatient[]; onViewPatient: (patient: StaffPatient) => void }) {
  const columns = React.useMemo<ColumnDef<DataTableFeatures, StaffPatient>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Patient',
        cell: ({ row }) => {
          const patient = row.original;
          return (
            <div className="flex items-center gap-3">
              <div className="grid size-9 place-items-center rounded-full bg-[#d9e8ff] text-xs font-bold text-primary">
                {patient.initials}
              </div>
              <div>
                <p className="font-bold">{patient.name}</p>
                <p className="text-[11px] text-muted-foreground">{patient.id} · {patient.age} years · {patient.gender}</p>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'phone',
        header: 'Contact',
        cell: ({ row }) => {
          const patient = row.original;
          return (
            <div className="text-xs text-muted-foreground">
              <p>{patient.phone}</p>
              <p className="mt-1">{patient.email}</p>
            </div>
          );
        },
      },
      {
        accessorKey: 'lastVisit',
        header: 'Last visit',
        cell: ({ row }) => <span className="text-xs font-semibold">{row.original.lastVisit}</span>,
      },
      {
        accessorKey: 'doctor',
        header: 'Doctor',
        cell: ({ row }) => <span className="text-xs text-muted-foreground">{row.original.doctor}</span>,
      },
      {
        accessorKey: 'nextAppointment',
        header: 'Next appointment',
        cell: ({ row }) => <span className="text-xs font-semibold text-primary">{row.original.nextAppointment}</span>,
      },
      {
        accessorKey: 'payment',
        header: 'Payment',
        cell: ({ row }) => {
          const payment = row.original.payment;
          return (
            <Badge
              variant={payment === 'Paid' ? 'default' : 'secondary'}
              className={cn(
                'rounded-full px-2.5 py-1 text-[10px] font-bold',
                payment === 'Paid' ? 'bg-[#e9f8f3] text-[#258c70]' : 'bg-[#fff3e7] text-[#d68b42]'
              )}
            >
              {payment}
            </Badge>
          );
        },
        filterFn: 'includesString',
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = row.original.status;
          return (
            <Badge
              variant={status === 'Active' ? 'default' : 'secondary'}
              className={cn(
                'rounded-full px-2.5 py-1 text-[10px] font-bold',
                status === 'Active' ? 'bg-[#e9f8f3] text-[#258c70]' : 'bg-secondary text-muted-foreground'
              )}
            >
              {status}
            </Badge>
          );
        },
        filterFn: 'includesString',
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewPatient(row.original)}
            className="w-full"
          >
            View patient
          </Button>
        ),
      },
    ],
    []
  );

  return (
    <DataTable
      columns={columns}
      data={patients}
      searchPlaceholder="Search patients..."
      searchKey="name"
    />
  );
}