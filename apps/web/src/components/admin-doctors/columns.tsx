'use client';

import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { type DataTableFeatures } from '@/components/admin-users/data-table-features';
import { transformDoctorsToAdminFormat, type AdminDoctorData } from '@/hooks/useDoctors';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

// Column helper with feature types and data type
const columnHelper = createColumnHelper<DataTableFeatures, AdminDoctorData>();

/**
 * Creates the column definitions for the Admin Doctors table.
 * Uses server-side sorting and filtering - the column declarations
 * declare which columns support these operations.
 */
export function createDoctorColumns(
  onViewDoctor: (doctor: AdminDoctorData) => void,
  onEditDoctor: (doctor: AdminDoctorData) => void,
  onToggleStatus: (doctor: AdminDoctorData) => void
): ColumnDef<DataTableFeatures, AdminDoctorData>[] {
  return columnHelper.columns([
    // Name column with avatar
    columnHelper.accessor('name', {
      header: 'Doctor',
      cell: ({ row }) => {
        const doctor = row.original;
        return (
          <button
            onClick={() => onViewDoctor(doctor)}
            className="hover:text-primary flex w-full items-center gap-2 text-left font-medium transition-colors"
          >
            <span className="bg-primary/10 text-primary grid size-9 place-items-center rounded-full text-xs font-bold">
              {doctor.initials}
            </span>
            <span className="font-semibold">{doctor.name}</span>
          </button>
        );
      },
      enableSorting: true,
      filterFn: 'includesString',
    }),

    // Specialty column
    columnHelper.accessor('specialty', {
      header: 'Specialty',
      cell: ({ getValue }) => <span className="font-semibold">{getValue() as string}</span>,
      enableSorting: true,
      filterFn: 'includesString',
    }),

    // Designation column
    columnHelper.accessor('designation', {
      header: 'Designation',
      cell: ({ getValue }) => <span className="text-muted-foreground">{getValue() as string}</span>,
      enableSorting: true,
      filterFn: 'includesString',
    }),

    // Clinic column
    // columnHelper.accessor('clinic', {
    //   header: 'Clinic',
    //   cell: ({ getValue }) => <span className="text-muted-foreground">{getValue() as string}</span>,
    //   enableSorting: true,
    //   filterFn: 'includesString',
    // }),

    // Consultation fee column
    columnHelper.accessor('fee', {
      header: 'Consultation fee',
      cell: ({ getValue }) => <span className="font-bold">{getValue() as string}</span>,
      enableSorting: true,
    }),

    // Appointments column
    columnHelper.accessor('appointments', {
      header: 'Appointments',
      cell: ({ getValue }) => <span className="font-semibold">{getValue() as number}</span>,
      enableSorting: true,
    }),

    // Slot utilization column
    columnHelper.accessor('utilization', {
      header: 'Slot utilization',
      cell: ({ getValue }) => (
        <div className="flex items-center gap-2">
          <div className="bg-muted h-2 w-20 rounded-full">
            <div
              className="bg-primary h-2 rounded-full"
              style={{ width: `${getValue() as number}%` }}
            />
          </div>
          <span className="font-bold">{getValue() as number}%</span>
        </div>
      ),
      enableSorting: true,
    }),

    // Status column with badge
    columnHelper.accessor('status', {
      header: 'Status',
      cell: ({ getValue }) => {
        const status = getValue() as AdminDoctorData['status'];
        const statusColors: Record<AdminDoctorData['status'], string> = {
          ACTIVE: 'bg-success/20 text-success',
          PENDING: 'bg-warning/20 text-warning-foreground',
          SUSPENDED: 'bg-destructive/20 text-destructive-foreground',
        };
        return (
          <Badge className={cn('text-xs font-medium', statusColors[status])} variant="outline">
            {status}
          </Badge>
        );
      },
      enableSorting: true,
      filterFn: 'includesString',
    }),

    // Actions column
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const doctor = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onViewDoctor(doctor)}
                className="flex items-center gap-2"
              >
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onEditDoctor(doctor)}
                className="flex items-center gap-2"
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onToggleStatus(doctor)}
                className="text-destructive flex items-center gap-2"
              >
                {doctor.status === 'SUSPENDED' ? 'Activate' : 'Suspend'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableSorting: false,
      enableHiding: false,
    }),
  ]);
}

// Re-export for convenience
export type { AdminDoctorData };
export { transformDoctorsToAdminFormat };
