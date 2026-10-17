'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { Search, UserPlus, X } from 'lucide-react';
import {
  useUsers,
  transformUsersToAdminFormat,
  type AdminUserData,
} from '@/hooks/useUsers';
import { DataTable } from '@/components/admin-users/data-table';
import { createStaffColumns } from './columns';
import { AddStaffDialog } from './AddStaffDialog';
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

export function AdminStaff() {
  const [status, setStatus] = useState<typeof statuses[number]>(statuses[0]); // 'All statuses'
  const [selected, setSelected] = useState<string[]>([]);
  const [drawer, setDrawer] = useState<AdminUserData | null>(null);
  const [addStaffDialogOpen, setAddStaffDialogOpen] = useState(false);
  const [_modal, _setModal] = useState<'edit' | null>(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Fetch staff users from API (userType: STAFF)
  const {
    data: staffResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useUsers({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: globalFilter,
    userType: 'STAFF',
    sortBy: sorting[0]?.id,
    sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
    // Column filters are passed as individual query params
    ...Object.fromEntries(columnFilters.map((f) => [f.id, f.value])),
  });

  const staff = staffResponse?.data || [];
  const totalStaff = staffResponse?.meta.total || 0;

  // Transform API data to admin format
  const transformedStaff = useMemo(() => transformUsersToAdminFormat(staff), [staff]);

  // Apply status filter client-side
  const filteredStaff = useMemo(() => {
    if (status === 'All statuses') return transformedStaff;
    return transformedStaff.filter((member) => member.status === status);
  }, [transformedStaff, status]);

  // Column definitions with action handlers
  const columns = createStaffColumns(
    (member) => setDrawer(member), // onViewStaff
    (member) => setDrawer(member), // onEditStaff (will use drawer edit button)
    (member) => {
      // Toggle status
      const newStatus = member.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';
      setDrawer({ ...member, status: newStatus });
      // In a real app, you'd call an API here to update the status
      // For now, we'll just update the local state and refetch
      _setModal(null);
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
            onClick={() => alert(`Bulk action applied to ${selected.length} staff members`)}
            className="ml-auto rounded-lg bg-white px-3 py-2"
          >
            Change status
          </button>
        </div>
      )}

      {/* Staff Table - Using TanStack Table v9 with shadcn/ui */}
      <div className="border-border bg-card overflow-hidden rounded-2xl border shadow-sm">
        <DataTable
          columns={columns}
          data={filteredStaff}
          rowCount={totalStaff}
          pagination={pagination}
          onPaginationChange={setPagination}
          sorting={sorting}
          onSortingChange={setSorting}
          columnFilters={columnFilters}
          onColumnFiltersChange={setColumnFilters}
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          isLoading={isLoading && staff.length === 0}
          showColumnVisibility={true}
          showGlobalFilter={true}
          globalFilterPlaceholder="Search by name, email, or phone..."
          toolbarLeading={
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              <label className="relative min-w-[200px] flex-1">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  aria-label="Search staff"
                  value={globalFilter}
                  onChange={(e) => {
                    setGlobalFilter(e.target.value);
                    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                    setSelected([]);
                  }}
                  placeholder="Search by name, email, or phone..."
                  className="bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring h-10 w-full rounded-lg border px-4 py-2 pl-9 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
              </label>
              <Select
                aria-label="Filter by status"
                value={status}
                onValueChange={(value) => {
                  setStatus(value as (typeof statuses)[number]);
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
              onClick={() => setAddStaffDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <UserPlus className="size-4" />
              Add staff
            </Button>
          }
          className="p-4"
        />

        {/* Error state */}
        {isError && staff.length === 0 && (
          <div className="text-destructive flex items-center justify-center p-12">
            <p>
              Failed to load staff: {error instanceof Error ? error.message : 'Unknown error'}
            </p>
            <button onClick={() => refetch()} className="text-primary ml-3 text-sm hover:underline">
              Retry
            </button>
          </div>
        )}
      </div>

      {/* Staff Detail Drawer */}
      {drawer && (
        <div className="fixed inset-0 z-50">
          <div className="bg-card/30 absolute inset-0" onClick={() => setDrawer(null)} />
          <aside className="bg-card absolute top-0 right-0 h-full w-full max-w-md overflow-y-auto p-6 shadow-2xl">
            <button
              onClick={() => setDrawer(null)}
              aria-label="Close staff details"
              className="float-right rounded-lg p-2 text-slate-400 hover:bg-slate-100"
            >
              <X className="size-5" />
            </button>
            <div className="mt-8">
              <div className="bg-primary/10 text-primary grid size-16 place-items-center rounded-2xl text-xl font-black">
                {drawer.initials}
              </div>
              <h2 className="mt-4 text-xl font-black">{drawer.name}</h2>
              <p className="mt-1 text-sm text-slate-500">{drawer.email}</p>
              <div className="mt-4 flex gap-2">
                <Badge>{drawer.role}</Badge>
                <Badge
                  tone={
                    drawer.status === 'ACTIVE'
                      ? 'emerald'
                      : drawer.status === 'PENDING'
                        ? 'amber'
                        : 'rose'
                  }
                >
                  {drawer.status}
                </Badge>
              </div>
              <div className="bg-muted mt-8 space-y-4 rounded-2xl p-4 text-sm">
                <p>
                  <strong>Phone</strong>
                  <br />
                  <span className="text-slate-500">{drawer.phone}</span>
                </p>
                <p>
                  <strong>Joined</strong>
                  <br />
                  <span className="text-slate-500">{drawer.created}</span>
                </p>
                <p>
                  <strong>Last activity</strong>
                  <br />
                  <span className="text-slate-500">{drawer.activity}</span>
                </p>
                <p>
                  <strong>Email verified</strong>
                  <br />
                  <span className="text-slate-500">
                    {drawer.raw.emailVerified ? 'Yes' : 'No'}
                  </span>
                </p>
              </div>
              <div className="mt-6 grid gap-2">
                <button
                  onClick={() => _setModal('edit')}
                  className="rounded-xl border px-4 py-3 text-sm font-bold"
                >
                  Edit staff
                </button>
                <button
                  onClick={() => {
                    const newStatus = drawer.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';
                    setDrawer({ ...drawer, status: newStatus });
                    _setModal(null);
                    refetch();
                  }}
                  className={`rounded-xl border px-4 py-3 text-sm font-bold ${
                    drawer.status === 'SUSPENDED'
                      ? 'border-[#c7eadb] text-[2e9675]'
                      : 'border-[#f1caca] text-[be6467]'
                  }`}
                >
                  {drawer.status === 'SUSPENDED' ? 'Activate staff' : 'Suspend staff'}
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Add Staff Dialog */}
      <AddStaffDialog
        open={addStaffDialogOpen}
        onOpenChange={setAddStaffDialogOpen}
        onSuccess={() => {
          // The useCreateUser hook invalidates queries on success, so just close the dialog
          refetch();
        }}
      />

      {/* Toaster for notifications */}
      <Toaster />
    </div>
  );
}

export default AdminStaff;
