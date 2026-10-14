import { createColumnHelper } from '@tanstack/react-table';
import type { DataTableFeatures } from './data-table-features';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCheck } from 'lucide-react';
import type { Appointment } from './StaffCheckin';

const columnHelper = createColumnHelper<DataTableFeatures, Record<string, unknown>>();

// Status badge variant mapping for clinical precision palette
const getStatusVariant = (
  status: string
): 'default' | 'success' | 'warning' | 'destructive' | 'secondary' => {
  const lower = status.toLowerCase();
  if (lower.includes('waiting') || lower.includes('pending')) return 'warning';
  if (lower.includes('checked in') || lower.includes('checked-in') || lower.includes('confirmed'))
    return 'success';
  if (lower.includes('consultation') || lower.includes('in progress')) return 'default';
  if (lower.includes('completed') || lower.includes('done')) return 'success';
  if (lower.includes('no-show') || lower.includes('cancelled') || lower.includes('cancel'))
    return 'destructive';
  return 'default';
};

// Payment status badge variant mapping
const getPaymentVariant = (
  status: string
): 'default' | 'success' | 'warning' | 'destructive' | 'secondary' => {
  const lower = status.toLowerCase();
  if (lower.includes('paid') || lower.includes('completed')) return 'success';
  if (lower.includes('pending') || lower.includes('awaiting')) return 'warning';
  if (lower.includes('refunded') || lower.includes('failed') || lower.includes('declined'))
    return 'destructive';
  if (lower.includes('partial')) return 'default';
  return 'default';
};

// Helper to get initials from name
const getInitials = (name: string): string => {
  return name
    ?.split(' ')
    .map((part: string) => part[0])
    .join('')
    .toUpperCase();
};

// Column helper specifically typed for Appointment data
const appointmentColumnHelper = createColumnHelper<DataTableFeatures, Appointment>();

export const columns = columnHelper.columns([
  columnHelper.accessor('id', {
    header: 'Appointment ID',
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return (
        <span className="text-foreground font-mono text-sm font-medium tabular-nums">{value}</span>
      );
    },
  }),
  columnHelper.accessor('patientName', {
    header: 'Patient',
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return (
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 text-primary grid size-8 place-items-center rounded-full text-xs font-semibold">
            {getInitials(value)}
          </div>
          <span className="text-sm font-medium">{value}</span>
        </div>
      );
    },
  }),
  columnHelper.accessor('doctor', {
    header: 'Doctor',
    cell: ({ getValue }) => {
      const value = getValue() as string;
      const name = value.replace('Dr. ', '');
      return (
        <div className="flex items-center gap-2">
          <div className="bg-secondary/10 text-secondary grid size-8 place-items-center rounded-full text-xs font-semibold">
            {getInitials(name)}
          </div>
          <span className="text-foreground text-sm">{value}</span>
        </div>
      );
    },
  }),
  columnHelper.accessor('time', {
    header: 'Time',
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return (
        <span className="text-foreground font-mono text-sm font-medium tabular-nums">{value}</span>
      );
    },
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: ({ getValue }) => {
      const status = getValue() as string;
      const variant = getStatusVariant(status);
      return (
        <Badge variant={variant} className="px-2.5 py-1 text-xs font-medium">
          {status}
        </Badge>
      );
    },
    filterFn: 'includesString',
  }),
  columnHelper.accessor('payment', {
    header: 'Payment',
    cell: ({ getValue }) => {
      const payment = getValue() as string;
      const variant = getPaymentVariant(payment);
      return (
        <Badge variant={variant} className="px-2.5 py-1 text-xs font-medium">
          {payment}
        </Badge>
      );
    },
    filterFn: 'includesString',
  }),
]);

// Staff check-in specific columns with proper Appointment typing
export const staffCheckinColumns = appointmentColumnHelper.columns([
  appointmentColumnHelper.accessor('id', {
    header: 'Appointment ID',
    cell: ({ getValue }) => (
      <span className="text-foreground font-mono text-sm font-medium tabular-nums">
        {getValue()}
      </span>
    ),
  }),
  appointmentColumnHelper.accessor('patientName', {
    header: 'Patient',
    cell: ({ getValue }) => (
      <div className="flex items-center gap-2">
        <div className="bg-primary/10 text-primary grid size-8 place-items-center rounded-full text-xs font-semibold">
          {getInitials(getValue())}
        </div>
        <span className="text-sm font-medium">{getValue()}</span>
      </div>
    ),
  }),
  appointmentColumnHelper.accessor('doctor', {
    header: 'Doctor',
    cell: ({ getValue }) => {
      const name = getValue().replace('Dr. ', '');
      return (
        <div className="flex items-center gap-2">
          <div className="bg-secondary/10 text-secondary grid size-8 place-items-center rounded-full text-xs font-semibold">
            {getInitials(name)}
          </div>
          <span className="text-foreground text-sm">{getValue()}</span>
        </div>
      );
    },
  }),
  appointmentColumnHelper.accessor('time', {
    header: 'Time',
    cell: ({ getValue }) => (
      <span className="text-foreground font-mono text-sm font-medium tabular-nums">
        {getValue()}
      </span>
    ),
  }),
  appointmentColumnHelper.accessor('status', {
    header: 'Status',
    cell: ({ getValue }) => {
      const status = getValue();
      const variant = getStatusVariant(status);
      return (
        <Badge variant={variant} className="px-2.5 py-1 text-xs font-medium">
          {status}
        </Badge>
      );
    },
    filterFn: 'includesString',
  }),
  appointmentColumnHelper.accessor('payment', {
    header: 'Payment',
    cell: ({ getValue }) => {
      const payment = getValue();
      const variant = getPaymentVariant(payment);
      return (
        <Badge variant={variant} className="px-2.5 py-1 text-xs font-medium">
          {payment}
        </Badge>
      );
    },
    filterFn: 'includesString',
  }),
  // Action column with Check In button
  appointmentColumnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const appointment = row.original;
      // const status = appointment.status?.toLowerCase() || '';
      // Only show check-in button for waiting/pending appointments
      // const canCheckIn = status.includes('waiting') || status.includes('pending');

      // if (!canCheckIn) {
      //   return (
      //     <span className="text-muted-foreground text-xs">
      //       No action needed
      //     </span>
      //   );
      // }

      return (
        <Button
          variant="default"
          size="sm"
          className="gap-1.5"
          onClick={(e) => {
            e.stopPropagation();
            // Dispatch custom event for check-in action
            window.dispatchEvent(
              new CustomEvent('staff-checkin:check-in', {
                detail: { appointmentId: appointment.id, patientName: appointment.patientName },
              })
            );
          }}
        >
          <CheckCheck className="size-3.5" aria-hidden="true" />
          Check In
        </Button>
      );
    },
  }),
]);
