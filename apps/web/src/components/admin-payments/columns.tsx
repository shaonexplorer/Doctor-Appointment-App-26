'use client';

import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { type DataTableFeatures } from '@/components/admin-users/data-table-features';
import { type AdminPaymentData } from '@/hooks/usePayments';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

// Column helper with feature types and data type
const columnHelper = createColumnHelper<DataTableFeatures, AdminPaymentData>();

const statusTones: Record<string, string> = {
  SCHEDULED: 'bg-primary/30 text-primary',
  COMPLETED: 'bg-emerald/50 text-emerald-700',
  CANCELLED: 'bg-rose/50 text-rose-700',
  NO_SHOW: 'bg-rose/50 text-rose-700',
};

const statusLabels: Record<string, string> = {
  SCHEDULED: 'Scheduled',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  NO_SHOW: 'No-show',
};

const paymentTones: Record<string, string> = {
  PENDING: 'bg-amber/50 text-amber-700',
  PAID: 'bg-emerald/50 text-emerald-700',
  REFUNDED: 'bg-primary/30 text-primary',
};

/**
 * Creates the column definitions for the Admin Payments table.
 * Uses server-side sorting and filtering - the column declarations
 * declare which columns support these operations.
 */
export function createPaymentColumns({
  onViewPayment,
  onUpdatePaymentStatus,
  onInitiateRefund,
}: {
  onViewPayment: (payment: AdminPaymentData) => void;
  onUpdatePaymentStatus: (payment: AdminPaymentData) => void;
  onInitiateRefund: (payment: AdminPaymentData) => void;
}): ColumnDef<DataTableFeatures, AdminPaymentData>[] {
  return columnHelper.columns([
    // Patient column with avatar and patient ID
    columnHelper.accessor('patientName', {
      header: 'Patient',
      cell: ({ row }) => {
        const payment = row.original;
        return (
          <button
            onClick={() => onViewPayment(payment)}
            className="hover:text-primary flex w-full items-center gap-2 text-left font-medium transition-colors"
          >
            <span className="bg-primary/10 text-primary grid size-9 place-items-center rounded-full text-xs font-bold">
              {payment.patientInitials}
            </span>
            <div className="min-w-0">
              <span className="block font-semibold">{payment.patientName}</span>
              <span className="text-muted-foreground text-[10px]">#{payment.patientId}</span>
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

    // Amount column
    columnHelper.accessor('amount', {
      header: 'Amount',
      cell: ({ getValue }) => {
        const amount = getValue() as number;
        return (
          <span className="text-muted-foreground tabular-nums">
            $
            {amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        );
      },
      enableSorting: true,
    }),

    // Date & time column
    columnHelper.accessor('date', {
      header: 'Date',
      cell: ({ row }) => {
        const payment = row.original;
        return (
          <div className="text-muted-foreground">
            <span className="block">{payment.date}</span>
            <span className="text-[11px]">{payment.time}</span>
          </div>
        );
      },
      enableSorting: true,
    }),

    // Appointment status column with badge
    columnHelper.accessor('status', {
      header: 'Appt. status',
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
        const payment = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onViewPayment(payment)}
                className="flex items-center gap-2"
              >
                View billing details
              </DropdownMenuItem>
              {payment.paymentStatus !== 'PAID' && (
                <DropdownMenuItem
                  onClick={() => onUpdatePaymentStatus(payment)}
                  className="flex items-center gap-2"
                >
                  Update payment status
                </DropdownMenuItem>
              )}
              {payment.paymentStatus === 'PAID' && (
                <DropdownMenuItem
                  onClick={() => onInitiateRefund(payment)}
                  className="text-destructive flex items-center gap-2"
                >
                  Initiate refund
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
