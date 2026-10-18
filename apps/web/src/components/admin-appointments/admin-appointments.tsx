'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { X } from 'lucide-react';
import {
  useAppointments,
  useCancelAppointment,
  transformAppointmentsToAdminFormat,
  type AdminAppointmentData,
} from '@/hooks/useAppointments';
import { DataTable } from '@/components/admin-users/data-table';
import { createAppointmentColumns } from './columns';
import type { ColumnFiltersState } from '@tanstack/react-table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Toaster } from '@/components/ui/toast';
import AppointmentBookingDialog from '../admin-users/AppointmentBookingDialog';

const statuses = ['All statuses', 'SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'] as const;

function Badge({ children, tone = 'blue' }: { children: ReactNode; tone?: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black tracking-wide ${
        tone === 'emerald'
          ? 'bg-emerald/50 text-emerald-700'
          : tone === 'rose'
            ? 'bg-rose/50 text-rose-700'
            : tone === 'amber'
              ? 'bg-amber/50 text-amber-700'
              : 'bg-primary/30 text-primary'
      }`}
    >
      {children}
    </span>
  );
}

function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    SCHEDULED: 'Scheduled',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
    NO_SHOW: 'No-show',
  };
  return labels[status] || status;
}

function statusTone(status: string): 'emerald' | 'rose' | 'blue' {
  switch (status) {
    case 'SCHEDULED':
      return 'blue';
    case 'COMPLETED':
      return 'emerald';
    case 'CANCELLED':
    case 'NO_SHOW':
    default:
      return 'rose';
  }
}

export function AdminAppointments() {
  const [status, setStatus] = useState<(typeof statuses)[number]>(statuses[0]); // 'All statuses'
  const [selected, setSelected] = useState<string[]>([]);
  const [drawer, setDrawer] = useState<AdminAppointmentData | null>(null);
  const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [createAppointmentDialogOpen, setCreateAppointmentDialogOpen] = useState(false);

  // Fetch appointments from API (Admin/Staff see all system-wide appointments)
  const {
    data: appointmentsResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useAppointments({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    status: status === 'All statuses' ? undefined : [status],
    sortBy: sorting[0]?.id,
    sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
  });

  const appointments = appointmentsResponse?.data || [];
  const totalAppointments = appointmentsResponse?.meta.total || 0;

  // Transform API data to admin format
  const transformedAppointments = useMemo(
    () => transformAppointmentsToAdminFormat(appointments),
    [appointments]
  );

  // Apply status filter client-side (keeps the UI in sync with the selected status)
  const filteredAppointments = useMemo(() => {
    if (status === 'All statuses') return transformedAppointments;
    return transformedAppointments.filter((appointment) => appointment.status === status);
  }, [transformedAppointments, status]);

  const cancelAppointment = useCancelAppointment();

  // Column definitions with action handlers
  const columns = createAppointmentColumns(
    (appointment) => setDrawer(appointment), // onViewAppointment
    (appointment) => {
      if (appointment.status !== 'SCHEDULED') return;
      if (
        !window.confirm(`Cancel appointment for ${appointment.patientName} on ${appointment.date}?`)
      ) {
        return;
      }
      setDrawer(appointment);
    } // onCancelAppointment
  );

  const handleCancel = async (appointment: AdminAppointmentData) => {
    try {
      await cancelAppointment.mutateAsync(appointment.id);
      setDrawer(null);
      refetch();
    } catch (error) {
      // Error handling is done by the mutation hook
      console.error('Failed to cancel appointment:', error);
    }
  };

  return (
    <div className="mt-8 space-y-5">
      {/* Bulk Actions Bar */}
      {selected.length > 0 && (
        <div className="bg-primary/10 text-primary flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold">
          {selected.length} selected
          <button
            onClick={() => alert(`Bulk action applied to ${selected.length} appointments`)}
            className="ml-auto rounded-lg bg-white px-3 py-2"
          >
            Change status
          </button>
        </div>
      )}

      {/* Appointments Table - Using TanStack Table v9 with shadcn/ui */}
      <div className="border-border bg-card overflow-hidden rounded-2xl border shadow-sm">
        <DataTable
          columns={columns}
          data={filteredAppointments}
          rowCount={totalAppointments}
          pagination={pagination}
          onPaginationChange={setPagination}
          sorting={sorting}
          onSortingChange={setSorting}
          columnFilters={columnFilters}
          onColumnFiltersChange={setColumnFilters}
          isLoading={isLoading && appointments.length === 0}
          showColumnVisibility={true}
          globalFilterPlaceholder="Search by patient or doctor..."
          toolbarLeading={
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              <Select
                aria-label="Filter by status"
                value={status}
                onValueChange={(value) => {
                  setStatus(value as (typeof statuses)[number]);
                  setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                  setSelected([]);
                }}
              >
                <SelectTrigger className="h-10 min-w-[160px] sm:w-[160px]">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          }
          onCreateAppointment={() => setCreateAppointmentDialogOpen(true)}
          className="p-4"
        />

        {/* Error state */}
        {isError && appointments.length === 0 && (
          <div className="text-destructive flex items-center justify-center p-12">
            <p>
              Failed to load appointments:{' '}
              {error instanceof Error ? error.message : 'Unknown error'}
            </p>
            <button onClick={() => refetch()} className="text-primary ml-3 text-sm hover:underline">
              Retry
            </button>
          </div>
        )}
      </div>

      {/* Appointment Detail Drawer */}
      {drawer && (
        <div className="fixed inset-0 z-50">
          <div className="bg-card/30 absolute inset-0" onClick={() => setDrawer(null)} />
          <aside className="bg-card absolute top-0 right-0 h-full w-full max-w-md overflow-y-auto p-6 shadow-2xl">
            <button
              onClick={() => setDrawer(null)}
              aria-label="Close appointment details"
              className="float-right rounded-lg p-2 text-slate-400 hover:bg-slate-100"
            >
              <X className="size-5" />
            </button>
            <div className="mt-8">
              <div className="bg-primary/10 text-primary grid size-16 place-items-center rounded-2xl text-xl font-bold">
                {drawer.patientInitials}
              </div>
              <h2 className="mt-4 text-xl font-black">{drawer.patientName}</h2>
              <p className="mt-1 text-sm text-slate-500">
                #{drawer.patientId} · {drawer.patientEmail}
              </p>
              <div className="mt-4 flex gap-2">
                <Badge>{statusLabel(drawer.status)}</Badge>
                <Badge tone={statusTone(drawer.status)}>{drawer.status}</Badge>
                <Badge
                  tone={
                    drawer.paymentStatus === 'PAID'
                      ? 'emerald'
                      : drawer.paymentStatus === 'PENDING'
                        ? 'amber'
                        : 'blue'
                  }
                >
                  {drawer.paymentStatus}
                </Badge>
              </div>
              <div className="bg-muted mt-8 space-y-4 rounded-2xl p-4 text-sm">
                <p>
                  <strong>Doctor</strong>
                  <br />
                  <span className="text-slate-500">{drawer.doctorName}</span>
                </p>
                <p>
                  <strong>Specialty</strong>
                  <br />
                  <span className="text-slate-500">{drawer.specialty}</span>
                </p>
                <p>
                  <strong>Clinic</strong>
                  <br />
                  <span className="text-slate-500">{drawer.clinic}</span>
                </p>
                <p>
                  <strong>Date &amp; time</strong>
                  <br />
                  <span className="text-slate-500">
                    {drawer.date} at {drawer.time}
                  </span>
                </p>
                <p>
                  <strong>Consultation type</strong>
                  <br />
                  <span className="text-slate-500">{drawer.consultationType}</span>
                </p>
                <p>
                  <strong>Symptoms</strong>
                  <br />
                  <span className="text-slate-500">{drawer.symptoms}</span>
                </p>
                {drawer.notes && (
                  <p>
                    <strong>Notes</strong>
                    <br />
                    <span className="text-slate-500">{drawer.notes}</span>
                  </p>
                )}
                <p>
                  <strong>Booked</strong>
                  <br />
                  <span className="text-slate-500">{drawer.created}</span>
                </p>
              </div>
              <div className="mt-6 grid gap-2">
                {drawer.status === 'SCHEDULED' && (
                  <button
                    onClick={() => handleCancel(drawer)}
                    className="border-destructive text-destructive rounded-xl border px-4 py-3 text-sm font-bold"
                  >
                    Cancel appointment
                  </button>
                )}
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Appointment Booking Dialog */}
      <AppointmentBookingDialog
        open={createAppointmentDialogOpen}
        onOpenChange={setCreateAppointmentDialogOpen}
        onSuccess={() => {
          void refetch();
        }}
      />

      {/* Toaster for notifications */}
      <Toaster />
    </div>
  );
}

export default AdminAppointments;
