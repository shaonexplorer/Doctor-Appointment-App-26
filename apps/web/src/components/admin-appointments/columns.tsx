'use client';

import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { type DataTableFeatures } from '@/components/admin-users/data-table-features';
import { type AdminAppointmentData } from '@/hooks/useAppointments';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

// Column helper with feature types and data type
const columnHelper = createColumnHelper<DataTableFeatures, AdminAppointmentData>();

const statusLabels: Record<string, string> = {
  SCHEDULED: 'Scheduled',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  NO_SHOW: 'No-show',
};

const statusTones: Record<string, string> = {
  SCHEDULED: 'bg-primary/30 text-primary',
  COMPLETED: 'bg-emerald/50 text-emerald-700',
  CANCELLED: 'bg-rose/50 text-rose-700',
  NO_SHOW: 'bg-rose/50 text-rose-700',
};

const paymentTones: Record<string, string> = {
  PENDING: 'bg-amber/50 text-amber-700',
  PAID: 'bg-emerald/50 text-emerald-700',
  REFUNDED: 'bg-primary/30 text-primary',
};

/**
 * Creates the column definitions for the Admin Appointments table.
 * Uses server-side sorting and filtering - the column declarations
 * declare which columns support these operations.
 */
export function createAppointmentColumns(
  onViewAppointment: (appointment: AdminAppointmentData) => void,
  onCancelAppointment: (appointment: AdminAppointmentData) => void
): ColumnDef<DataTableFeatures, AdminAppointmentData>[] {
  return columnHelper.columns([
    // Patient column with avatar and patient ID
    columnHelper.accessor('patientName', {
      header: 'Patient',
      cell: ({ row }) => {
        const appointment = row.original;
        return (
          <button
            onClick={() => onViewAppointment(appointment)}
            className="hover:text-primary flex w-full items-center gap-2 text-left font-medium transition-colors"
          >
            <span className="bg-primary/10 text-primary grid size-9 place-items-center rounded-full text-xs font-bold">
              {appointment.patientInitials}
            </span>
            <div className="min-w-0">
              <span className="block font-semibold">{appointment.patientName}</span>
              <span className="text-muted-foreground text-[10px]">#{appointment.patientId}</span>
            </div>
          </button>
        );
      },
      enableSorting: true,
      filterFn: 'includesString',
    }),

    // Doctor column
    columnHelper.accessor('doctorName', {
      header: 'Doctor',
      cell: ({ getValue }) => <span className="text-muted-foreground">{getValue() as string}</span>,
      enableSorting: true,
      filterFn: 'includesString',
    }),

    // Specialty column
    columnHelper.accessor('specialty', {
      header: 'Specialty',
      cell: ({ getValue }) => <span className="text-muted-foreground">{getValue() as string}</span>,
      enableSorting: true,
      filterFn: 'includesString',
    }),

    // Date & time column
    columnHelper.accessor('date', {
      header: 'Date',
      cell: ({ row }) => {
        const appointment = row.original;
        return (
          <div className="text-muted-foreground">
            <span className="block">{appointment.date}</span>
            <span className="text-[11px]">{appointment.time}</span>
          </div>
        );
      },
      enableSorting: true,
    }),

    // Status column with badge
    columnHelper.accessor('status', {
      header: 'Status',
      cell: ({ getValue }) => {
        const status = getValue() as string;
        return (
          <Badge
            className={cn(
              'text-xs font-medium',
              statusTones[status] || 'bg-primary/30 text-primary'
            )}
            variant="outline"
          >
            {statusLabels[status] || status}
          </Badge>
        );
      },
      enableSorting: true,
      filterFn: 'includesString',
    }),

    // Payment status column with badge
    columnHelper.accessor('paymentStatus', {
      header: 'Payment',
      cell: ({ getValue }) => {
        const paymentStatus = getValue() as string;
        return (
          <Badge
            className={cn(
              'text-xs font-medium',
              paymentTones[paymentStatus] || 'bg-primary/30 text-primary'
            )}
            variant="outline"
          >
            {paymentStatus}
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
        const appointment = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onViewAppointment(appointment)}
                className="flex items-center gap-2"
              >
                View details
              </DropdownMenuItem>
              {appointment.status === 'SCHEDULED' && (
                <DropdownMenuItem
                  onClick={() => onCancelAppointment(appointment)}
                  className="text-destructive flex items-center gap-2"
                >
                  Cancel appointment
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableSorting: false,
      enableHiding: false,
    }),
  ]);
}
