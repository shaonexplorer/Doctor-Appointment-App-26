'use client'

import { createColumnHelper } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'
import { type DataTableFeatures } from './data-table-features'

// The transformed appointment shape from useStaffAppointments hook
export interface StaffAppointment {
  id: string
  patient: string // Full name like "John Doe"
  initials: string
  time: string // Formatted time like "9:00 AM"
  symptoms: string | null
  notes: string | null
  status: string
  payment: 'Pending' | 'Paid' | 'Refunded'
  date: string // Formatted date like "Sep 18, 2026"
  consultationType: 'IN_PERSON' | 'VIDEO'
  specialty: string
  slotId: string
  doctorId: string
  patientId: string
  startTime: string // ISO string
  endTime: string // ISO string
  createdAt: string
}

const columnHelper = createColumnHelper<DataTableFeatures, StaffAppointment>()

// Status badge variant mapping
const statusBadgeVariant: Record<string, 'success' | 'warning' | 'destructive' | 'default'> = {
  Cancelled: 'destructive',
  Waiting: 'warning',
  'Checked in': 'default',
  Confirmed: 'success',
  NoShow: 'destructive',
}

// Payment badge variant mapping
const paymentBadgeVariant: Record<string, 'success' | 'warning' | 'destructive'> = {
  Paid: 'success',
  Refunded: 'destructive',
  Pending: 'warning',
}

// Consultation type mapping
const consultationTypeMap: Record<string, string> = {
  IN_PERSON: 'In-person',
  VIDEO: 'Video',
}

export const staffAppointmentsColumns = (
  onViewClick: (appointment: StaffAppointment) => void
) =>
  columnHelper.columns([
    columnHelper.accessor('time', {
      header: 'Time',
      cell: ({ getValue }) => <span className="font-bold whitespace-nowrap">{getValue()}</span>,
    }),
    columnHelper.accessor('patient', {
      header: 'Patient',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <span className="bg-primary/10 text-primary rounded-xl p-2">
            <span className="text-xs font-medium">{row.original.initials}</span>
          </span>
          <div>
            <p className="font-bold">{row.original.patient}</p>
            <p className="text-muted-foreground text-xs">{row.original.id}</p>
          </div>
        </div>
      ),
    }),
    columnHelper.accessor('specialty', {
      header: 'Doctor',
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.specialty}</p>
          <p className="text-muted-foreground text-xs">Dr. {row.original.patientId}</p>
        </div>
      ),
    }),
    columnHelper.accessor('consultationType', {
      header: 'Type',
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">
          {consultationTypeMap[getValue() as string] || getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: ({ getValue }) => {
        const status = getValue() as string
        return (
          <Badge variant={statusBadgeVariant[status] || 'default'}>
            {status}
          </Badge>
        )
      },
    }),
    columnHelper.accessor('payment', {
      header: 'Payment',
      cell: ({ getValue }) => {
        const payment = getValue() as string
        return (
          <Badge variant={paymentBadgeVariant[payment] || 'warning'}>
            {payment}
          </Badge>
        )
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Action',
      cell: ({ row }) => (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewClick(row.original)}
            aria-label={`View ${row.original.patient}`}
            className="mobile-touch-target"
          >
            <Eye className="size-4" />
          </Button>
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    }),
  ])

export type { DataTableFeatures }