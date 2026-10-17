'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { Search, UserPlus, X } from 'lucide-react';
import {
  useDoctors,
  transformDoctorsToAdminFormat,
  type AdminDoctorData,
} from '@/hooks/useDoctors';
import { DataTable } from '@/components/admin-users/data-table';
import { createDoctorColumns } from './columns';
import { AddDoctorDialog } from './AddDoctorDialog';
import type { ColumnFiltersState } from '@tanstack/react-table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toast';

const statuses = ['All statuses', 'ACTIVE', 'PENDING', 'SUSPENDED'] as const;

function Badge({ children, tone = 'blue' }: { children: ReactNode; tone?: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black tracking-wide ${
        tone === 'green'
          ? 'bg-primary/30 text-primary'
          : tone === 'red'
            ? 'bg-destructive/50 text-destructive-foreground'
            : tone === 'amber'
              ? 'bg-warning/50 text-warning-foreground'
              : 'bg-primary/30 text-primary'
      }`}
    >
      {children}
    </span>
  );
}

export function AdminDoctors() {
  const [status, setStatus] = useState<typeof statuses[number]>(statuses[0]); // 'All statuses'
  const [selected, setSelected] = useState<string[]>([]);
  const [drawer, setDrawer] = useState<AdminDoctorData | null>(null);
  const [addDoctorDialogOpen, setAddDoctorDialogOpen] = useState(false);
  const [_modal, _setModal] = useState<'edit' | 'confirm' | null>(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Fetch doctors from API
  const {
    data: doctorsResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useDoctors({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: globalFilter,
    // Status filter would be handled via column filters or additional params
    // For now, we'll handle status via client-side filtering of the transformed data
    // In a production app, you'd want to handle this server-side too
    sortBy: sorting[0]?.id,
    sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
    // Column filters are passed as individual query params
    ...Object.fromEntries(columnFilters.map((f) => [f.id, f.value])),
  });

  const doctors = doctorsResponse?.data || [];
  const totalDoctors = doctorsResponse?.meta.total || 0;

  // Transform API data to admin format
  const transformedDoctors = useMemo(() => transformDoctorsToAdminFormat(doctors), [doctors]);

  // Apply status filter client-side (in a production app, this would be server-side)
  const filteredDoctors = useMemo(() => {
    if (status === 'All statuses') return transformedDoctors;
    return transformedDoctors.filter((doctor) => doctor.status === status);
  }, [transformedDoctors, status]);

  // Column definitions with action handlers
  const columns = createDoctorColumns(
    (doctor) => setDrawer(doctor), // onViewDoctor
    (doctor) => setDrawer(doctor), // onEditDoctor (will use drawer edit button)
    (doctor) => {
      // Toggle status
      const newStatus = doctor.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';
      setDrawer({
        ...doctor,
        status: newStatus,
      });
      // In a real app, you'd call an API here to update the status
      // For now, we'll just update the local state and refetch
      setDrawer(null);
      refetch();
    } // onToggleStatus
  );

  return (
    <div className="mt-8 space-y-5">
      {/* Bulk Actions Bar */}
      {selected.length > 0 && (
        <div className="bg-primary/10 text-primary flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold">
          {selected.length} selected
          <button
            onClick={() => alert(`Bulk action applied to ${selected.length} doctors`)}
            className="ml-auto rounded-lg bg-white px-3 py-2"
          >
            Change status
          </button>
        </div>
      )}

      {/* Doctors Table - Using TanStack Table v9 with shadcn/ui */}
      <div className="border-border bg-card overflow-hidden rounded-2xl border shadow-sm">
        <DataTable
          columns={columns}
          data={filteredDoctors}
          rowCount={totalDoctors}
          pagination={pagination}
          onPaginationChange={setPagination}
          sorting={sorting}
          onSortingChange={setSorting}
          columnFilters={columnFilters}
          onColumnFiltersChange={setColumnFilters}
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          isLoading={isLoading && doctors.length === 0}
          showColumnVisibility={true}
          showGlobalFilter={true}
          globalFilterPlaceholder="Search by name, specialty, or clinic..."
          toolbarLeading={
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              <label className="relative min-w-[200px] flex-1">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  aria-label="Search doctors"
                  value={globalFilter}
                  onChange={(e) => {
                    setGlobalFilter(e.target.value);
                    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                    setSelected([]);
                  }}
                  placeholder="Search by name, specialty, or clinic..."
                  className="bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring h-10 w-full rounded-lg border px-4 py-2 pl-9 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
              </label>
              <Select
                aria-label="Filter by status"
                value={status}
                onValueChange={(value) => {
                  setStatus(value);
                  setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                  setSelected([]);
                }}
              >
                <SelectTrigger className="h-10 w-[160px] min-w-[160px]">
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
          toolbarTrailing={
            <Button
              onClick={() => setAddDoctorDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <UserPlus className="size-4" />
              Add doctor
            </Button>
          }
          className="p-4"
        />

        {/* Error state */}
        {isError && doctors.length === 0 && (
          <div className="text-destructive flex items-center justify-center p-12">
            <p>Failed to load doctors: {error instanceof Error ? error.message : 'Unknown error'}</p>
            <button onClick={() => refetch()} className="text-primary ml-3 text-sm hover:underline">
              Retry
            </button>
          </div>
        )}
      </div>

      {/* Doctor Detail Drawer */}
      {drawer && (
        <div className="fixed inset-0 z-50">
          <div className="bg-card/30 absolute inset-0" onClick={() => setDrawer(null)} />
          <aside className="bg-card absolute top-0 right-0 h-full w-full max-w-md overflow-y-auto p-6 shadow-2xl">
            <button
              onClick={() => setDrawer(null)}
              aria-label="Close doctor details"
              className="float-right rounded-lg p-2 text-slate-400 hover:bg-slate-100"
            >
              <X className="size-5" />
            </button>
            <div className="mt-8">
              <div className="bg-primary/10 text-primary grid size-16 place-items-center rounded-2xl text-xl font-black">
                {drawer.initials}
              </div>
              <h2 className="mt-4 text-xl font-black">{drawer.name}</h2>
              <p className="mt-1 text-sm text-slate-500">{drawer.specialty}</p>
              <div className="mt-4 flex gap-2">
                <Badge>{drawer.status}</Badge>
                <Badge tone={drawer.status === 'ACTIVE' ? 'green' : drawer.status === 'PENDING' ? 'amber' : 'red'}>
                  {drawer.status === 'ACTIVE' ? 'Active' : drawer.status === 'PENDING' ? 'Pending review' : 'Suspended'}
                </Badge>
              </div>
              <div className="bg-muted mt-8 space-y-4 rounded-2xl p-4 text-sm">
                <p>
                  <strong>Qualifications</strong>
                  <br />
                  <span className="text-slate-500">{drawer.qualifications}</span>
                </p>
                <p>
                  <strong>Clinic</strong>
                  <br />
                  <span className="text-slate-500">{drawer.clinic}</span>
                </p>
                <p>
                  <strong>Consultation fee</strong>
                  <br />
                  <span className="text-slate-500">{drawer.fee}</span>
                </p>
                <p>
                  <strong>Availability</strong>
                  <br />
                  <span className="text-slate-500">{drawer.availability}</span>
                </p>
                <p>
                  <strong>Appointments</strong>
                  <br />
                  <span className="text-slate-500">{drawer.appointments} this month</span>
                </p>
                <p>
                  <strong>Revenue</strong>
                  <br />
                  <span className="text-slate-500">${drawer.appointments * Number(drawer.fee.replace('$', ''))}</span>
                </p>
              </div>
              <div className="mt-6 grid gap-2">
                <button
                  onClick={() => _setModal('edit')}
                  className="rounded-xl border px-4 py-3 text-sm font-bold"
                >
                  Edit doctor
                </button>
                <button
                  onClick={() => {
                    // Toggle status
                    const newStatus = drawer.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';
                    setDrawer({
                      ...drawer,
                      status: newStatus,
                    });
                    // In a real app, you'd call an API here to update the status
                    // For now, we'll just update the local state and refetch
                    _setModal(null);
                    refetch();
                  }}
                  className={`rounded-xl border px-4 py-3 text-sm font-bold ${
                    drawer.status === 'SUSPENDED' ? 'border-[#c7eadb] text-[2e9675]' : 'border-[#f1caca] text-[be6467]'
                  }`}
                >
                  {drawer.status === 'SUSPENDED' ? 'Activate doctor' : 'Suspend doctor'}
                </button>
                {drawer.status !== 'ACTIVE' && (
                  <button
                    onClick={() => {
                      setDrawer(null);
                      // In a real app, you'd call an API here to approve the doctor
                      // For now, we'll just update the local state and refetch
                      refetch();
                    }}
                    className="rounded-xl border border-[#c7eadb] px-4 py-3 text-sm font-bold text-[2e9675]"
                  >
                    Approve doctor
                  </button>
                )}
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Add Doctor Dialog */}
      <AddDoctorDialog
        open={addDoctorDialogOpen}
        onOpenChange={setAddDoctorDialogOpen}
        onSuccess={() => {
          // The useCreateDoctor hook would invalidate queries, so just close the dialog
          // We could add a toast here if needed
        }}
      />

      {/* Toaster for notifications */}
      <Toaster />
    </div>
  );
}

export default AdminDoctors;